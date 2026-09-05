import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { ConvexError } from 'convex/values';
import { ErrorCode } from '../constants';

// Add a new feature request
export const add = mutation({
  args: {
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const { title, description } = args;

    // Get the user's identity
    const userId = await getAuthUserId(ctx);
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || !userId) {
      throw new ConvexError(ErrorCode.AUTH_REQUIRED);
    }

    // Extract user information from identity
    // Change null to undefined to match the expected type
    const userEmail = identity.email || undefined;

    console.log("Server received feature request:", {
      title,
      description,
      userId,
      userEmail,
    });

    // Validate inputs
    if (title.trim().length < 3) {
      console.error("Title too short");
      throw new ConvexError(ErrorCode.FEATURE_TITLE_TOO_SHORT);
    }

    try {
      // Log the database object we're trying to create
      const featureRequestData = {
        title,
        description,
        votes: 1,
        status: "requested",
        userId,
        userEmail, // This will now be string | undefined instead of string | null
        // Track who already voted (starting with the creator)
        voterIds: [userId],
      };
      console.log("Attempting to insert:", featureRequestData);

      // Create new feature request
      const id = await ctx.db.insert("featureRequests", featureRequestData);

      console.log("Feature request created with ID:", id);

      return { id, success: true };
    } catch (error) {
      console.error("Error creating feature request:", error);
      throw error;
    }
  },
});

// Vote/Unvote on a feature request (toggle)
export const vote = mutation({
  args: { id: v.id("featureRequests") },
  handler: async (ctx, args) => {
    const { id } = args;

    // Get the user's identity
    const identity = await ctx.auth.getUserIdentity();
    const userId = await getAuthUserId(ctx);

    if (!identity || !userId) {
      throw new ConvexError(ErrorCode.AUTH_REQUIRED);
    }

    // Get the current feature request
    const request = await ctx.db.get(id);
    if (!request) {
      throw new Error("Feature request not found");
    }

    const voterIds = request.voterIds || [];
    const hasVoted = voterIds.includes(userId);
    const isAuthor = request.userId === userId;

    if (hasVoted) {
      // Author cannot unvote their own feature request
      if (isAuthor) {
        return { success: false, voted: true };
      }
      // Unvote: Remove user from voters and decrement count
      await ctx.db.patch(id, {
        votes: Math.max(0, request.votes - 1),
        voterIds: voterIds.filter((vid) => vid !== userId),
      });
      return { success: true, voted: false };
    } else {
      // Vote: Add user to voters and increment count
      await ctx.db.patch(id, {
        votes: request.votes + 1,
        voterIds: [...voterIds, userId],
      });
      return { success: true, voted: true };
    }
  },
});

// Add a function to soft delete a feature request
export const deleteFeatureRequest = mutation({
  args: { id: v.id("featureRequests") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const { id } = args;

    // Get the user's identity
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError(ErrorCode.AUTH_REQUIRED);
    }

    // Get the current feature request
    const request = await ctx.db.get(id);
    if (!request) {
      throw new Error("Feature request not found");
    }

    // Check if user is the creator of the feature request
    if (request.userId !== userId) {
      throw new Error("You can only delete your own feature requests");
    }

    // Soft delete by setting deletedAt timestamp
    await ctx.db.patch(id, {
      deletedAt: Date.now(),
    });

    return true;
  },
});

// Add a comment to a feature request
export const addComment = mutation({
  args: {
    featureRequestId: v.id("featureRequests"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError(ErrorCode.AUTH_REQUIRED);
    }

    // Check if feature request exists
    const featureRequest = await ctx.db.get(args.featureRequestId);
    if (!featureRequest || featureRequest.deletedAt) {
      throw new Error("Feature request not found");
    }

    // Validate content
    if (args.content.trim().length < 1) {
      throw new ConvexError(ErrorCode.COMMENT_EMPTY);
    }

    // Create comment
    const commentId = await ctx.db.insert("featureRequestComments", {
      featureRequestId: args.featureRequestId,
      authorId: userId,
      content: args.content.trim(),
      updatedAt: new Date().toISOString(),
    });

    // Update comment count
    await ctx.db.patch(args.featureRequestId, {
      commentCount: (featureRequest.commentCount || 0) + 1,
    });

    // 기능 요청 작성자에게 댓글 알림 생성 (자신의 기능 요청이 아닌 경우에만)
    const featureRequestAuthorId = featureRequest.userId as Id<"users">;
    if (featureRequestAuthorId && featureRequestAuthorId !== userId) {
      // 댓글 작성자 정보 가져오기
      const commenterProfile = await ctx.db
        .query("userProfiles")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .unique();

      const commenterName = commenterProfile?.displayName || "Someone";

      // 기능 요청 작성자의 언어 설정 가져오기
      const authorProfile = await ctx.db
        .query("userProfiles")
        .withIndex("by_user", (q) => q.eq("userId", featureRequestAuthorId))
        .unique();

      const authorLocale = authorProfile?.locale || "en";

      // COMMENT_ON_FEATURE_REQUEST 알림 생성
      await ctx.runMutation(internal.notifications.mutation.createNotification, {
        userId: featureRequestAuthorId,
        type: "COMMENT_ON_FEATURE_REQUEST",
        featureRequestId: args.featureRequestId,
        triggeredById: userId,
        commenterName: commenterName,
        featureRequestTitle: featureRequest.title,
        locale: authorLocale,
      });
    }

    return { id: commentId, success: true };
  },
});

// Delete a comment
export const deleteComment = mutation({
  args: { commentId: v.id("featureRequestComments") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError(ErrorCode.AUTH_REQUIRED);
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check if user is the author
    if (comment.authorId !== userId) {
      throw new Error("You can only delete your own comments");
    }

    // Delete comment
    await ctx.db.delete(args.commentId);

    // Update comment count
    const featureRequest = await ctx.db.get(comment.featureRequestId);
    if (featureRequest) {
      await ctx.db.patch(comment.featureRequestId, {
        commentCount: Math.max(0, (featureRequest.commentCount || 1) - 1),
      });
    }

    return true;
  },
});

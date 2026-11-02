import { query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc, Id } from "../_generated/dataModel";

// The roadmap is public, so return only what it renders. The stored row also
// holds the author's email and every voter's user ID, which must not leave
// the server; the viewer-specific bits are computed here instead.
function toPublicRequest(request: Doc<"featureRequests">, viewerId: Id<"users"> | null) {
  return {
    _id: request._id,
    _creationTime: request._creationTime,
    title: request.title,
    description: request.description,
    votes: request.votes,
    status: request.status,
    commentCount: request.commentCount,
    hasVoted: viewerId !== null && request.voterIds.includes(viewerId),
    isOwner: viewerId !== null && request.userId === viewerId,
  };
}

// Get feature requests with pagination
export const getAll = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const viewerId = await getAuthUserId(ctx);
    // Use a simple query with filter to exclude soft-deleted items
    const results = await ctx.db
      .query("featureRequests")
      .filter((q) => q.eq(q.field("deletedAt"), undefined)) // Filter out soft-deleted requests
      .paginate(args.paginationOpts);

    // Sort the results after fetching (for now)
    // Note: this isn't ideal for large datasets but will work for development
    return {
      ...results,
      page: results.page
        .sort((a, b) => b.votes - a.votes)
        .map((request) => toPublicRequest(request, viewerId)),
    };
  },
});

// Get a single feature request by ID
export const getById = query({
  args: { id: v.id("featureRequests") },
  handler: async (ctx, args) => {
    const featureRequest = await ctx.db.get(args.id);

    // Return null if not found or soft-deleted
    if (!featureRequest || featureRequest.deletedAt) {
      return null;
    }

    return toPublicRequest(featureRequest, await getAuthUserId(ctx));
  },
});

// Get comments for a feature request
export const getComments = query({
  args: { featureRequestId: v.id("featureRequests") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("featureRequestComments")
      .withIndex("by_featureRequest", (q) => q.eq("featureRequestId", args.featureRequestId))
      .order("asc")
      .collect();

    // Get author profiles for all comments
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const authorProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", comment.authorId))
          .first();

        return {
          ...comment,
          author: authorProfile
            ? {
                displayName: authorProfile.displayName,
                avatarUrl: authorProfile.avatarUrl,
              }
            : null,
        };
      })
    );

    return commentsWithAuthors;
  },
});

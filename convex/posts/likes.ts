import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "../_generated/dataModel";

// 포스트 좋아요 추가
export const likePost = mutation({
  args: { postId: v.id("posts") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // 포스트 확인
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // 좋아요 목록
    const likedBy = post.likedBy || [];
    const likeCount = post.likeCount || 0;

    // 이미 좋아요를 눌렀는지 확인
    if (likedBy.some(id => id === userId)) {
      return false; // 이미 좋아요를 누른 상태
    }

    // 좋아요 추가
    await ctx.db.patch(args.postId, {
      likedBy: [...likedBy, userId as Id<"users">],
      likeCount: likeCount + 1,
    });

    return true;
  },
});

// 포스트 좋아요 취소
export const unlikePost = mutation({
  args: { postId: v.id("posts") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // 포스트 확인
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // 좋아요 목록
    const likedBy = post.likedBy || [];
    const likeCount = Math.max(0, (post.likeCount || 0) - 1);

    // 좋아요를 누른 적이 있는지 확인
    if (!likedBy.some(id => id === userId)) {
      return false; // 좋아요를 누른 적이 없음
    }

    // 좋아요 취소
    await ctx.db.patch(args.postId, {
      likedBy: likedBy.filter(id => id !== userId),
      likeCount: likeCount,
    });

    return true;
  },
});

// 사용자가 포스트에 좋아요를 눌렀는지 확인
export const hasLiked = query({
  args: { postId: v.id("posts") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }

    const post = await ctx.db.get(args.postId);
    if (!post || !post.likedBy) {
      return false;
    }

    return post.likedBy.some(id => id === userId);
  },
});

// 포스트의 좋아요 수 조회
export const getLikeCount = query({
  args: { postId: v.id("posts") },
  returns: v.number(),
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      return 0;
    }
    return post.likeCount || 0;
  },
});

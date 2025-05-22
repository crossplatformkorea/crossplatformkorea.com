import { query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// 사용자 통계 조회
export const getUserStats = query({
  args: { userId: v.optional(v.id("users")) },
  returns: v.object({
    postCount: v.number(),
    likeCount: v.number(),
    commentCount: v.number(),
  }),
  handler: async (ctx, args) => {
    // 사용자 ID 가져오기 (인자로 전달되지 않은 경우 현재 인증된 사용자)
    const userId = args.userId || await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User ID not provided");
    }

    // 작성한 포스트 수 조회
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_author", q => q.eq("authorId", userId))
      .collect();
    
    // 받은 좋아요 총합 계산
    const totalLikes = posts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
    
    // 받은 댓글 수 계산
    let commentCount = 0;
    for (const post of posts) {
      const comments = await ctx.db
        .query("comments")
        .withIndex("by_post", q => q.eq("postId", post._id))
        .collect();
      commentCount += comments.length;
    }

    return {
      postCount: posts.length,
      likeCount: totalLikes,
      commentCount: commentCount
    };
  }
});

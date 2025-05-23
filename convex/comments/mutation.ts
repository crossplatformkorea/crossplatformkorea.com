import { v } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation } from '../_generated/server';
import { Id } from '../_generated/dataModel';

// 댓글 추가
export const addComment = mutation({
  args: {
    postId: v.id('posts'),
    content: v.string(),
  },
  returns: v.id('comments'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // 게시물이 존재하는지 확인
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // 댓글 추가
    const commentId = await ctx.db.insert('comments', {
      postId: args.postId,
      authorId: userId as Id<'users'>,
      content: args.content,
      updatedAt: new Date().toISOString(),
    });

    // 게시물의 댓글 수 증가
    await ctx.db.patch(args.postId, {
      commentCount: (post.commentCount || 0) + 1,
    });

    return commentId;
  },
});

// 댓글 삭제
export const deleteComment = mutation({
  args: {
    commentId: v.id('comments'),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // 댓글 확인
    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    // 작성자 본인인지 확인
    if (comment.authorId !== userId) {
      throw new Error('Not authorized to delete this comment');
    }

    // 게시물의 댓글 수 감소
    const post = await ctx.db.get(comment.postId);
    if (post && post.commentCount) {
      await ctx.db.patch(post._id, {
        commentCount: Math.max(0, post.commentCount - 1),
      });
    }

    // 댓글 삭제
    await ctx.db.delete(args.commentId);
    return true;
  },
});

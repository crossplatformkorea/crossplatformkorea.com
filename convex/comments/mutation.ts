import { v } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation } from '../_generated/server';
import { internal } from '../_generated/api';
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

    // 댓글 작성 알림 생성 (포스트 작성자에게)
    if (post.authorId && post.authorId !== userId) {
      // 댓글 작성자 정보 조회
      const commenterProfile = await ctx.db
        .query('userProfiles')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .unique();

      // 포스트 작성자의 언어 설정 조회
      const postAuthorProfile = await ctx.db
        .query('userProfiles')
        .withIndex('by_user', (q) => q.eq('userId', post.authorId!))
        .unique();

      const commenterName = commenterProfile?.displayName || 'Someone';
      // locale이 없는 경우 기본값 'ko' 사용 (한국 서비스이므로)
      const userLocale = postAuthorProfile?.locale || 'ko';

      // 알림 생성 및 푸시 알림 전송 (사용자의 locale 사용)
      await ctx.scheduler.runAfter(0, internal.notifications.action.sendNotificationWithPush, {
        userId: post.authorId,
        type: 'COMMENT_ON_POST',
        postId: args.postId,
        commentId: commentId,
        triggeredById: userId,
        commenterName: commenterName,
        postTitle: post.title,
        locale: userLocale,
      });
    }

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

// 댓글 좋아요 토글
export const toggleLike = mutation({
  args: {
    commentId: v.id('comments'),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // 댓글 가져오기
    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    // 사용자가 이미 댓글에 좋아요를 눌렀는지 확인
    const likedBy = comment.likedBy || [];
    const hasLiked = likedBy.some((id) => id === userId);

    if (hasLiked) {
      // 이미 좋아요를 눌렀다면, 좋아요 취소
      const likeCount = Math.max(0, (comment.likeCount || 0) - 1);
      await ctx.db.patch(args.commentId, {
        likedBy: likedBy.filter((id) => id !== userId),
        likeCount: likeCount,
      });
      return false; // 댓글의 좋아요가 취소되었음을 나타내기 위해 false 반환
    } else {
      // 아직 좋아요를 누르지 않았다면, 좋아요 추가
      const likeCount = (comment.likeCount || 0) + 1;
      await ctx.db.patch(args.commentId, {
        likedBy: [...likedBy, userId as Id<'users'>],
        likeCount: likeCount,
      });
      return true; // 댓글에 좋아요가 추가되었음을 나타내기 위해 true 반환
    }
  },
});

import { v } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation } from '../_generated/server';
import { Id } from '../_generated/dataModel';

// 댓글 추가
export const addComment = mutation({
  args: {
    postId: v.id('posts'),
    content: v.string(),
    mentionedUsers: v.optional(v.array(v.id('users'))),
  },
  returns: v.id('comments'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // 직접 전달받은 mentionedUsers 사용하거나 콘텐츠에서 추출
    const finalMentionedUsers: Id<'users'>[] = [];

    if (args.mentionedUsers && args.mentionedUsers.length > 0) {
      // react-mentions에서 전달받은 mentionedUsers 사용
      finalMentionedUsers.push(...args.mentionedUsers);
    } else {
      // mentionedUsers가 전달되지 않은 경우, 기존 방식으로 추출
      const mentionRegex = /@(\w+)/g;
      let match;

      while ((match = mentionRegex.exec(args.content)) !== null) {
        const displayName = match[1];
        // displayName으로 사용자 찾기 - 타입 주석 추가
        const userProfile = await ctx.db
          .query('userProfiles')
          .filter((q: any) => q.eq(q.field('displayName'), displayName))
          .first();

        if (userProfile && !finalMentionedUsers.includes(userProfile.userId)) {
          finalMentionedUsers.push(userProfile.userId);
        }
      }
    }

    const commentId = await ctx.db.insert('comments', {
      postId: args.postId,
      authorId: userId,
      content: args.content,
      likeCount: 0,
      likedBy: [],
      mentionedUsers: finalMentionedUsers.length > 0 ? finalMentionedUsers : undefined,
      updatedAt: new Date().toISOString(),
    });

    // 멘션된 사용자들에게 알림 생성
    if (finalMentionedUsers.length > 0) {
      for (const mentionedUserId of finalMentionedUsers) {
        // 자기 자신에게는 알림을 보내지 않음
        if (mentionedUserId !== userId) {
          await ctx.db.insert('notifications', {
            userId: mentionedUserId,
            type: 'MENTIONED' as const,
            title: 'You were mentioned in a comment',
            message: `You were mentioned in a comment by ${await getUserDisplayName(ctx, userId)}`,
            postId: args.postId,
            commentId,
            triggeredById: userId,
            isRead: false,
          });
        }
      }
    }

    // 게시물의 댓글 수 증가
    const post = await ctx.db.get(args.postId);
    if (post) {
      await ctx.db.patch(args.postId, {
        commentCount: (post.commentCount || 0) + 1,
      });
    }

    return commentId;
  },
});

// 헬퍼 함수: 사용자 표시 이름 가져오기
async function getUserDisplayName(ctx: any, userId: Id<'users'>): Promise<string> {
  const userProfile = await ctx.db
    .query('userProfiles')
    .filter((q: any) => q.eq(q.field('userId'), userId))
    .first();

  return userProfile?.displayName || 'Unknown User';
}

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

    // 댓글 삭제
    await ctx.db.delete(args.commentId);

    // 게시물의 댓글 수 감소
    const post = await ctx.db.get(comment.postId);
    if (post) {
      await ctx.db.patch(comment.postId, {
        commentCount: Math.max((post.commentCount || 1) - 1, 0),
      });
    }

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

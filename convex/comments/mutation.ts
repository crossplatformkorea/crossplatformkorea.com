import { v } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation } from '../_generated/server';
import { Id } from '../_generated/dataModel';
import { internal } from '../_generated/api';

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

    const post = await ctx.db.get(args.postId);

    if (post) {
      // 게시물의 댓글 수 증가
      await ctx.db.patch(args.postId, {
        commentCount: (post.commentCount || 0) + 1,
      });

      // 게시물 작성자에게 댓글 알림 생성 (자신의 게시물이 아닌 경우에만)
      if (post.authorId && post.authorId !== userId) {
        // 댓글 작성자 정보 가져오기
        const commenterProfile = await ctx.db
          .query('userProfiles')
          .withIndex('by_user', (q) => q.eq('userId', userId))
          .unique();

        const commenterName = commenterProfile?.displayName || 'Someone';

        // 게시물 작성자의 언어 설정 가져오기
        const authorProfile = await ctx.db
          .query('userProfiles')
          .withIndex('by_user', (q) => q.eq('userId', post.authorId!))
          .unique();

        const authorLocale = authorProfile?.locale || 'en';

        // COMMENT_ON_POST 알림 생성
        await ctx.runMutation(internal.notifications.mutation.createNotification, {
          userId: post.authorId,
          type: 'COMMENT_ON_POST',
          postId: args.postId,
          commentId: commentId,
          triggeredById: userId,
          commenterName: commenterName,
          postTitle: post.title,
          locale: authorLocale,
        });
      }
    }

    // 멘션된 사용자들에게 알림 생성
    if (finalMentionedUsers.length > 0) {
      // 댓글 작성자 정보 가져오기
      const mentionerProfile = await ctx.db
        .query('userProfiles')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .unique();

      const mentionerName = mentionerProfile?.displayName || 'Someone';

      for (const mentionedUserId of finalMentionedUsers) {
        // 자기 자신에게는 알림을 보내지 않음
        if (mentionedUserId !== userId) {
          // 멘션된 사용자의 언어 설정 가져오기
          const mentionedUserProfile = await ctx.db
            .query('userProfiles')
            .withIndex('by_user', (q) => q.eq('userId', mentionedUserId))
            .unique();

          const userLocale = mentionedUserProfile?.locale || 'en';

          // MENTIONED 알림 생성
          await ctx.runMutation(internal.notifications.mutation.createNotification, {
            userId: mentionedUserId,
            type: 'MENTIONED',
            postId: args.postId,
            commentId: commentId,
            triggeredById: userId,
            mentionerName: mentionerName,
            locale: userLocale,
          });
        }
      }
    }

    return commentId;
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
        // 수정: 타입 단언 사용
        likedBy: [...likedBy, userId as Id<'users'>],
        likeCount: likeCount,
      });

      // 댓글 작성자에게 좋아요 알림 생성 (자신의 댓글이 아닌 경우에만)
      if (comment.authorId && comment.authorId !== userId) {
        // 좋아요 누른 사용자 정보 가져오기
        const likerProfile = await ctx.db
          .query('userProfiles')
          .withIndex('by_user', (q) => q.eq('userId', userId))
          .unique();

        const likerName = likerProfile?.displayName || 'Someone';

        // 댓글 작성자의 언어 설정 가져오기
        const commentAuthorProfile = await ctx.db
          .query('userProfiles')
          .withIndex('by_user', (q) => q.eq('userId', comment.authorId))
          .unique();

        const authorLocale = commentAuthorProfile?.locale || 'en';

        // 댓글 내용 자르기 (알림에 표시할 용도)
        const truncatedContent =
          comment.content?.length > 100
            ? comment.content.substring(0, 100) + '...'
            : comment.content;

        // LIKE_ON_COMMENT 알림 생성
        await ctx.runMutation(internal.notifications.mutation.createNotification, {
          userId: comment.authorId,
          type: 'LIKE_ON_COMMENT',
          postId: comment.postId,
          commentId: args.commentId,
          triggeredById: userId,
          likerName: likerName,
          commentContent: truncatedContent,
          locale: authorLocale,
        });
      }

      return true; // 댓글에 좋아요가 추가되었음을 나타내기 위해 true 반환
    }
  },
});

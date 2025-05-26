import { v } from 'convex/values';
import { mutation, internalMutation } from '../_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';
import { getNotificationMessages, type NotificationType, type NotificationMessageParams } from '../utils';

// 알림 생성 (내부 함수) - 다국어 지원
export const createNotification = internalMutation({
  args: {
    userId: v.id('users'),
    type: v.union(
      v.literal('COMMENT_ON_POST'),
      v.literal('LIKE_ON_SHOWCASE'),
      v.literal('LIKE_ON_POST'),
    ),
    postId: v.optional(v.id('posts')),
    showcaseId: v.optional(v.id('showcases')),
    commentId: v.optional(v.id('comments')),
    triggeredById: v.id('users'),
    // 메시지 파라미터들
    commenterName: v.optional(v.string()),
    likerName: v.optional(v.string()),
    postTitle: v.optional(v.string()),
    showcaseTitle: v.optional(v.string()),
    locale: v.optional(v.string()), // 사용자 로케일
  },
  returns: v.id('notifications'),
  handler: async (ctx, args) => {
    // 자신에게는 알림을 보내지 않음
    if (args.userId === args.triggeredById) {
      throw new Error('Cannot create notification for self');
    }

    // 다국어 메시지 생성
    const params: NotificationMessageParams = {
      commenterName: args.commenterName,
      likerName: args.likerName,
      postTitle: args.postTitle,
      showcaseTitle: args.showcaseTitle,
    };

    const { title, message } = getNotificationMessages(
      args.type as NotificationType,
      args.locale || 'en',
      params
    );

    return await ctx.db.insert('notifications', {
      userId: args.userId,
      type: args.type,
      title: title,
      message: message,
      postId: args.postId,
      showcaseId: args.showcaseId,
      commentId: args.commentId,
      triggeredById: args.triggeredById,
      isRead: false,
    });
  },
});

// 알림 읽음 처리
export const markAsRead = mutation({
  args: {
    notificationId: v.id('notifications'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }

    // 본인의 알림만 읽음 처리 가능
    if (notification.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await ctx.db.patch(args.notificationId, {
      isRead: true,
      readAt: new Date().toISOString(),
    });

    return null;
  },
});

// 모든 알림 읽음 처리
export const markAllAsRead = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx, _args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    const unreadNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_userId_isRead', (q) => 
        q.eq('userId', userId).eq('isRead', false)
      )
      .collect();

    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, {
        isRead: true,
        readAt: new Date().toISOString(),
      });
    }

    return null;
  },
});

// 알림 삭제
export const deleteNotification = mutation({
  args: {
    notificationId: v.id('notifications'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }

    // 본인의 알림만 삭제 가능
    if (notification.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await ctx.db.delete(args.notificationId);
    return null;
  },
});

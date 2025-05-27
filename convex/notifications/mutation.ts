import { v } from 'convex/values';
import { mutation, internalMutation } from '../_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';
import {
  getNotificationMessages,
  type NotificationType,
  type NotificationMessageParams,
  getNotificationTypeValidator,
} from '../utils';

// 알림 생성 (내부 함수) - 다국어 지원
export const createNotification = internalMutation({
  args: {
    userId: v.id('users'),
    type: getNotificationTypeValidator(),
    postId: v.optional(v.id('posts')),
    showcaseId: v.optional(v.id('showcases')),
    commentId: v.optional(v.id('comments')),
    triggeredById: v.id('users'),
    // 메시지 파라미터들
    commenterName: v.optional(v.string()),
    likerName: v.optional(v.string()),
    mentionerName: v.optional(v.string()),
    postTitle: v.optional(v.string()),
    showcaseTitle: v.optional(v.string()),
    commentContent: v.optional(v.string()), // 댓글 내용 추가
    locale: v.optional(v.string()),
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
      mentionerName: args.mentionerName,
      postTitle: args.postTitle,
      showcaseTitle: args.showcaseTitle,
      commentContent: args.commentContent,
    };

    const { title, message } = getNotificationMessages(
      args.type as NotificationType,
      args.locale || 'en',
      params,
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
      .withIndex('by_userId_isRead', (q) => q.eq('userId', userId).eq('isRead', false))
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

// 푸시 구독 저장
export const subscribeToPush = mutation({
  args: {
    endpoint: v.string(),
    p256dh: v.string(),
    auth: v.string(),
    userAgent: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // 기존 구독이 있는지 확인
    const existingSubscription = await ctx.db
      .query('pushSubscriptions')
      .withIndex('by_userId_endpoint', (q) => q.eq('userId', userId).eq('endpoint', args.endpoint))
      .unique();

    if (existingSubscription) {
      // 기존 구독 업데이트
      await ctx.db.patch(existingSubscription._id, {
        p256dh: args.p256dh,
        auth: args.auth,
        userAgent: args.userAgent,
        isActive: true,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // 새 구독 생성
      await ctx.db.insert('pushSubscriptions', {
        userId,
        endpoint: args.endpoint,
        p256dh: args.p256dh,
        auth: args.auth,
        userAgent: args.userAgent,
        isActive: true,
        updatedAt: new Date().toISOString(),
      });
    }

    return null;
  },
});

// 푸시 구독 해제
export const unsubscribeFromPush = mutation({
  args: {
    endpoint: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // 해당 구독 찾기
    const subscription = await ctx.db
      .query('pushSubscriptions')
      .withIndex('by_userId_endpoint', (q) => q.eq('userId', userId).eq('endpoint', args.endpoint))
      .unique();

    if (subscription) {
      // 구독 비활성화 (완전 삭제 대신)
      await ctx.db.patch(subscription._id, {
        isActive: false,
        updatedAt: new Date().toISOString(),
      });
    }

    return null;
  },
});

// 구독 비활성화 (내부용 - 만료된 구독 처리)
export const deactivateSubscription = internalMutation({
  args: {
    endpoint: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query('pushSubscriptions')
      .withIndex('by_endpoint', (q) => q.eq('endpoint', args.endpoint))
      .unique();

    if (subscription) {
      await ctx.db.patch(subscription._id, {
        isActive: false,
        updatedAt: new Date().toISOString(),
      });
    }

    return null;
  },
});

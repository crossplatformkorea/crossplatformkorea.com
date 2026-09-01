import { v } from 'convex/values';
import { mutation, internalMutation } from '../_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';
import {
  getNotificationMessages,
  type NotificationType,
  type NotificationMessageParams,
  getNotificationTypeValidator,
} from '../utils';
import { Id } from '../_generated/dataModel';
import { GenericMutationCtx } from 'convex/server';

// 이미 존재하는 알림인지 확인하는 내부 헬퍼 함수
async function checkIfNotificationExists(
  ctx: GenericMutationCtx<any>,
  args: {
    userId: string | Id<'users'>;
    type: NotificationType;
    triggeredById: string | Id<'users'>;
    postId?: string | Id<'posts'>;
    commentId?: string | Id<'comments'>;
    showcaseId?: string | Id<'showcases'>;
  },
) {
  // 좋아요 관련 알림인지 확인
  const isLikeNotification = ['LIKE_ON_POST', 'LIKE_ON_COMMENT', 'LIKE_ON_SHOWCASE'].includes(
    args.type,
  );

  // 좋아요 관련 알림이 아니면 항상 새로 생성 (중복 체크 안함)
  if (!isLikeNotification) {
    return false;
  }

  // 기존 알림 찾기 - 수정된 필터 방식
  const existingNotifications = await ctx.db
    .query('notifications')
    .filter((q) => {
      // 기본 조건: userId, type, triggeredById는 항상 확인
      const conditions = [
        q.eq(q.field('userId'), args.userId),
        q.eq(q.field('type'), args.type),
        q.eq(q.field('triggeredById'), args.triggeredById),
      ];

      // 추가 필터 조건: 관련 항목 ID
      if (args.postId) {
        conditions.push(q.eq(q.field('postId'), args.postId));
      }
      if (args.commentId) {
        conditions.push(q.eq(q.field('commentId'), args.commentId));
      }
      if (args.showcaseId) {
        conditions.push(q.eq(q.field('showcaseId'), args.showcaseId));
      }

      // 모든 조건을 AND로 결합
      if (conditions.length === 1) {
        return conditions[0];
      }

      // 여러 조건을 q.and()로 결합
      return q.and(...conditions);
    })
    .collect();

  return existingNotifications.length > 0;
}

// 알림 생성 (내부 함수) - 다국어 지원
export const createNotification = internalMutation({
  args: {
    userId: v.id('users'),
    type: getNotificationTypeValidator(),
    postId: v.optional(v.id('posts')),
    showcaseId: v.optional(v.id('showcases')),
    commentId: v.optional(v.id('comments')),
    featureRequestId: v.optional(v.id('featureRequests')),
    triggeredById: v.id('users'),
    commenterName: v.optional(v.string()),
    likerName: v.optional(v.string()),
    mentionerName: v.optional(v.string()),
    postTitle: v.optional(v.string()),
    showcaseTitle: v.optional(v.string()),
    featureRequestTitle: v.optional(v.string()),
    commentContent: v.optional(v.string()),
    locale: v.optional(v.string()),
  },
  returns: v.id('notifications'),
  handler: async (ctx, args) => {
    // 자신에게는 알림을 보내지 않음
    if (args.userId === args.triggeredById) {
      throw new Error('Cannot create notification for self');
    }

    // 동일한 알림이 이미 존재하는지 확인 (좋아요 알림 중복 방지)
    const exists = await checkIfNotificationExists(ctx, {
      userId: args.userId,
      type: args.type as NotificationType,
      triggeredById: args.triggeredById,
      postId: args.postId,
      commentId: args.commentId,
      showcaseId: args.showcaseId,
    });

    // 이미 동일한 알림이 있으면 가장 최근 알림 ID 반환
    if (exists) {
      const existingNotification = await ctx.db
        .query('notifications')
        .filter((q) => {
          // 기본 조건들
          const conditions = [
            q.eq(q.field('userId'), args.userId),
            q.eq(q.field('type'), args.type),
            q.eq(q.field('triggeredById'), args.triggeredById),
          ];

          // 추가 조건들
          if (args.postId) conditions.push(q.eq(q.field('postId'), args.postId));
          if (args.commentId) conditions.push(q.eq(q.field('commentId'), args.commentId));
          if (args.showcaseId) conditions.push(q.eq(q.field('showcaseId'), args.showcaseId));

          // 모든 조건을 AND로 결합
          return q.and(...conditions);
        })
        .order('desc')
        .first();

      if (existingNotification) {
        await ctx.db.patch(existingNotification._id, {
          isRead: false,
          updatedAt: Date.now(), // 현재 시간으로 업데이트 시간 갱신
        });

        return existingNotification._id;
      }
    }

    // 다국어 메시지 생성
    const params: NotificationMessageParams = {
      commenterName: args.commenterName,
      likerName: args.likerName,
      mentionerName: args.mentionerName,
      postTitle: args.postTitle,
      showcaseTitle: args.showcaseTitle,
      featureRequestTitle: args.featureRequestTitle,
      commentContent: args.commentContent,
    };

    const { title, message } = getNotificationMessages(
      args.type as NotificationType,
      args.locale || 'en',
      params,
    );

    // 새 알림 생성
    const notificationId = await ctx.db.insert('notifications', {
      userId: args.userId,
      type: args.type,
      title,
      message,
      postId: args.postId,
      commentId: args.commentId,
      showcaseId: args.showcaseId,
      featureRequestId: args.featureRequestId,
      triggeredById: args.triggeredById,
      isRead: false,
      updatedAt: Date.now(), // 생성 시점에도 updatedAt 필드 설정
    });

    return notificationId;
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

// 특정 엔티티와 관련된 모든 알림 삭제하는 내부 함수
export const deleteNotificationsByEntity = internalMutation({
  args: {
    entityType: v.union(v.literal('postId'), v.literal('commentId'), v.literal('showcaseId')),
    entityId: v.union(v.id('posts'), v.id('comments'), v.id('showcases')),
  },
  returns: v.number(),
  handler: async (ctx, args) => {
    // 해당 엔티티와 관련된 모든 알림 찾기
    const associatedNotifications = await ctx.db
      .query('notifications')
      .filter((q) => q.eq(q.field(args.entityType), args.entityId))
      .collect();

    // 모든 알림 삭제
    let deletedCount = 0;
    for (const notification of associatedNotifications) {
      await ctx.db.delete(notification._id);
      deletedCount++;
    }

    return deletedCount;
  },
});

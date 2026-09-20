import { v } from 'convex/values';
import { query, internalQuery } from '../_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';
import { paginationOptsValidator } from 'convex/server';
import { getNotificationTypeValidator } from '../utils';
import { localizeNotification } from './localize';

// 사용자의 알림 목록 조회 (페이지네이션)
export const getUserNotifications = query({
  args: {
    paginationOpts: paginationOptsValidator,
    // Reader's locale. Copy is re-rendered per request so one list never mixes
    // languages; omitted falls back to `en` inside the catalog.
    locale: v.optional(v.string()),
  },
  returns: v.object({
    page: v.array(
      v.object({
        _id: v.id('notifications'),
        _creationTime: v.number(),
        userId: v.id('users'),
        type: getNotificationTypeValidator(),
        title: v.string(),
        message: v.string(),
        postId: v.optional(v.id('posts')),
        showcaseId: v.optional(v.id('showcases')),
        commentId: v.optional(v.id('comments')),
        // This handler returns the document itself, so the validator has to
        // enumerate every field the row can carry or Convex rejects the value.
        // `updatedAt` is written on every insert and `featureRequestId` on
        // feature-request comment notifications; both were missing, so this
        // query threw `ReturnsValidationError` for anyone holding a
        // notification. Same class of break as 82ea64c.
        featureRequestId: v.optional(v.id('featureRequests')),
        updatedAt: v.optional(v.number()),
        triggeredById: v.id('users'),
        isRead: v.boolean(),
        readAt: v.optional(v.string()),
        // 알림 발생자 정보
        triggeredBy: v.object({
          _id: v.id('users'),
          displayName: v.string(),
          avatarUrl: v.optional(v.string()),
        }),
        // 관련 포스트/showcase 정보 (있는 경우)
        relatedPost: v.optional(
          v.object({
            _id: v.id('posts'),
            title: v.string(),
          }),
        ),
        relatedShowcase: v.optional(
          v.object({
            _id: v.id('showcases'),
            title: v.string(),
          }),
        ),
      }),
    ),
    isDone: v.boolean(),
    continueCursor: v.string(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    const result = await ctx.db
      .query('notifications')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .order('desc')
      .paginate(args.paginationOpts);

    const enrichedNotifications = await Promise.all(
      result.page.map(async (notification) => {
        // 알림 발생자 정보 조회
        const triggeredByUser = await ctx.db.get(notification.triggeredById);
        const triggeredByProfile = await ctx.db
          .query('userProfiles')
          .withIndex('by_user', (q) => q.eq('userId', notification.triggeredById))
          .unique(); // 관련 포스트 정보 조회
        let relatedPost = undefined;
        if (notification.postId) {
          const post = await ctx.db.get(notification.postId);
          if (post) {
            relatedPost = {
              _id: post._id,
              title: post.title,
            };
          }
        }

        // 관련 showcase 정보 조회
        let relatedShowcase = undefined;
        if (notification.showcaseId) {
          const showcase = await ctx.db.get(notification.showcaseId);
          if (showcase) {
            relatedShowcase = {
              _id: showcase._id,
              title: showcase.title,
            };
          }
        }

        const displayName =
          triggeredByProfile?.displayName || triggeredByUser!.name || 'Unknown User';

        const localized = await localizeNotification(
          ctx,
          notification,
          displayName,
          args.locale ?? 'en',
          // Both were already resolved above; `null` tells the helper the
          // document is gone so it does not read the same miss again.
          {
            post: notification.postId
              ? relatedPost
                ? { title: relatedPost.title }
                : null
              : undefined,
            showcase: notification.showcaseId
              ? relatedShowcase
                ? { title: relatedShowcase.title }
                : null
              : undefined,
          },
        );

        return {
          ...notification,
          title: localized.title,
          message: localized.message,
          triggeredBy: {
            _id: triggeredByUser!._id,
            displayName,
            avatarUrl: triggeredByProfile?.avatarUrl,
          },
          relatedPost,
          relatedShowcase,
        };
      }),
    );

    return {
      page: enrichedNotifications,
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  },
});

// 읽지 않은 알림 개수 조회
export const getUnreadCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx, _args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return 0;
    }

    const unreadNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_userId_isRead', (q) => q.eq('userId', userId).eq('isRead', false))
      .collect();

    return unreadNotifications.length;
  },
});

// 최근 알림 조회 (읽음/읽지 않음 포함, 최대 limit개)
export const getRecentNotifications = query({
  args: {
    limit: v.optional(v.number()),
    // See `getUserNotifications` — copy is rendered for the reader, not frozen.
    locale: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      _id: v.id('notifications'),
      _creationTime: v.number(),
      type: getNotificationTypeValidator(),
      title: v.string(),
      message: v.string(),
      postId: v.optional(v.id('posts')),
      showcaseId: v.optional(v.id('showcases')),
      // Lets the bell deep-link to the comment itself rather than the post top.
      commentId: v.optional(v.id('comments')),
      isRead: v.boolean(),
      triggeredByUser: v.object({
        _id: v.id('users'),
        name: v.string(),
        avatarUrl: v.optional(v.string()),
      }),
    }),
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const limit = args.limit || 5;
    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .order('desc')
      .take(limit);

    const enrichedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        const triggeredByUser = await ctx.db.get(notification.triggeredById);
        const triggeredByProfile = await ctx.db
          .query('userProfiles')
          .withIndex('by_user', (q) => q.eq('userId', notification.triggeredById))
          .unique();

        const name = triggeredByProfile?.displayName || triggeredByUser!.name || 'Unknown User';
        const localized = await localizeNotification(ctx, notification, name, args.locale ?? 'en');

        return {
          _id: notification._id,
          _creationTime: notification._creationTime,
          type: notification.type,
          title: localized.title,
          message: localized.message,
          postId: notification.postId,
          showcaseId: notification.showcaseId,
          commentId: notification.commentId,
          isRead: notification.isRead,
          triggeredByUser: {
            _id: triggeredByUser!._id,
            name,
            avatarUrl: triggeredByProfile?.avatarUrl,
          },
        };
      }),
    );

    return enrichedNotifications;
  },
});

// 활성 푸시 구독 조회 (내부용)
export const getActivePushSubscriptions = internalQuery({
  args: {
    userId: v.id('users'),
  },
  returns: v.array(
    v.object({
      _id: v.id('pushSubscriptions'),
      endpoint: v.string(),
      p256dh: v.string(),
      auth: v.string(),
      userAgent: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    const subscriptions = await ctx.db
      .query('pushSubscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();

    return subscriptions.map((sub) => ({
      _id: sub._id,
      endpoint: sub.endpoint,
      p256dh: sub.p256dh,
      auth: sub.auth,
      userAgent: sub.userAgent,
    }));
  },
});

// 사용자의 푸시 구독 상태 조회 (공개용)
export const getUserPushSubscriptionStatus = query({
  args: {},
  returns: v.object({
    hasSubscriptions: v.boolean(),
    subscriptionCount: v.number(),
  }),
  handler: async (ctx, _args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { hasSubscriptions: false, subscriptionCount: 0 };
    }

    const subscriptions = await ctx.db
      .query('pushSubscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();

    return {
      hasSubscriptions: subscriptions.length > 0,
      subscriptionCount: subscriptions.length,
    };
  },
});

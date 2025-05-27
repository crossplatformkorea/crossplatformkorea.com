'use node';

import { action, internalAction, ActionCtx } from '../_generated/server';
import { internal } from '../_generated/api';
import { v } from 'convex/values';
import webpush from 'web-push';
import { getAuthUserId } from '@convex-dev/auth/server';
import { getNotificationTypeValidator } from '../utils';

// VAPID 키 설정 (환경 변수에서 가져오기)
const vapidDetails = {
  subject: process.env.VAPID_SUBJECT || 'mailto:your-email@example.com',
  publicKey: process.env.VITE_VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || '',
};

// 웹 푸시 설정
if (vapidDetails.publicKey && vapidDetails.privateKey) {
  webpush.setVapidDetails(vapidDetails.subject, vapidDetails.publicKey, vapidDetails.privateKey);
}

// 특정 사용자에게 푸시 알림 전송
export const sendPushNotification = internalAction({
  args: {
    userId: v.id('users'),
    title: v.string(),
    message: v.string(),
    data: v.optional(v.any()),
    url: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    sentCount: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      // 해당 사용자의 활성 푸시 구독들 조회
      const subscriptions = await ctx.runQuery(
        internal.notifications.query.getActivePushSubscriptions,
        {
          userId: args.userId,
        },
      );

      if (subscriptions.length === 0) {
        return {
          success: false,
          sentCount: 0,
          errors: ['No active push subscriptions found'],
        };
      }

      const payload = JSON.stringify({
        title: args.title,
        body: args.message,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'notification',
        requireInteraction: false,
        data: {
          url: args.url || '/',
          ...args.data,
        },
      });
      const results = await Promise.allSettled(
        subscriptions.map(async (subscription: any) => {
          const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          };

          return webpush.sendNotification(pushSubscription, payload);
        }),
      );

      const errors: string[] = [];
      let sentCount = 0;

      results.forEach((result: any, index: number) => {
        if (result.status === 'fulfilled') {
          sentCount++;
        } else {
          errors.push(`Subscription ${index}: ${result.reason?.message || 'Unknown error'}`);

          // 410 Gone 에러인 경우 구독을 비활성화
          if (result.reason?.statusCode === 410) {
            void ctx.runMutation(internal.notifications.mutation.deactivateSubscription, {
              endpoint: subscriptions[index].endpoint,
            });
          }
        }
      });

      return {
        success: sentCount > 0,
        sentCount,
        errors,
      };
    } catch (error) {
      console.error('Push notification error:', error);
      return {
        success: false,
        sentCount: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  },
});

// 알림과 함께 푸시 알림 전송
export const sendNotificationWithPush = internalAction({
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
    postTitle: v.optional(v.string()),
    showcaseTitle: v.optional(v.string()),
    commentContent: v.optional(v.string()),
    locale: v.optional(v.string()),
  },
  returns: v.object({
    notificationId: v.id('notifications'),
    pushResult: v.object({
      success: v.boolean(),
      sentCount: v.number(),
      errors: v.array(v.string()),
    }),
  }),
  handler: async (
    ctx,
    args,
  ): Promise<{
    notificationId: any;
    pushResult: {
      success: boolean;
      sentCount: number;
      errors: string[];
    };
  }> => {
    // 1. 데이터베이스에 알림 생성
    const notificationId: any = await ctx.runMutation(
      internal.notifications.mutation.createNotification,
      args,
    );

    // 2. 메시지 생성 (getNotificationMessages를 사용하여 적절한 제목과 메시지 생성)
    const { getNotificationMessages } = await import('../utils');
    const { title, message } = getNotificationMessages(args.type as any, args.locale || 'en', {
      commenterName: args.commenterName,
      likerName: args.likerName,
      postTitle: args.postTitle,
      showcaseTitle: args.showcaseTitle,
      commentContent: args.commentContent, // 댓글 내용 파라미터 추가
    });

    // 3. 푸시 알림 전송
    const pushResult: any = await ctx.runAction(
      internal.notifications.action.sendPushNotification,
      {
        userId: args.userId,
        title: title,
        message: message,
        data: {
          notificationId,
          type: args.type,
          postId: args.postId,
          showcaseId: args.showcaseId,
          commentId: args.commentId,
        },
        url: args.postId
          ? `/post/${args.postId}`
          : args.showcaseId
            ? `/showcase/${args.showcaseId}`
            : '/',
      },
    );

    return {
      notificationId,
      pushResult,
    };
  },
});

// 테스트용 푸시 알림
export const sendTestPush = action({
  args: {
    title: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    sentCount: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (
    ctx: ActionCtx,
    args: { title?: string; message?: string },
  ): Promise<{
    success: boolean;
    sentCount: number;
    errors: string[];
  }> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) {
        return {
          success: false,
          sentCount: 0,
          errors: ['Authentication required'],
        };
      }

      return await ctx.runAction(internal.notifications.action.sendPushNotification, {
        userId,
        title: args.title || 'Test Notification',
        message: args.message || 'This is a test push notification.',
        data: { test: true },
      });
    } catch (error) {
      return {
        success: false,
        sentCount: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  },
});

// Notification message utilities
import { v } from 'convex/values';

export type NotificationType =
  | 'COMMENT_ON_POST'
  | 'LIKE_ON_SHOWCASE'
  | 'LIKE_ON_POST'
  | 'MENTIONED'
  | 'LIKE_ON_COMMENT';

// 알림 타입 유니온을 v.literal 배열로 반환하는 헬퍼 함수
export const getNotificationTypeValidator = () => {
  return v.union(
    v.literal('COMMENT_ON_POST'),
    v.literal('LIKE_ON_SHOWCASE'),
    v.literal('LIKE_ON_POST'),
    v.literal('MENTIONED'),
    v.literal('LIKE_ON_COMMENT'),
  );
};

export interface NotificationMessageParams {
  commenterName?: string;
  likerName?: string;
  postTitle?: string;
  showcaseTitle?: string;
  mentionerName?: string; // 멘션한 사람 이름
  commentContent?: string; // 댓글 내용 (LIKE_ON_COMMENT에 사용)
}

/**
 * Generate notification title and message for different locales
 * Since Convex runs in V8 isolate, we use hardcoded messages for each locale
 */
export function getNotificationMessages(
  type: NotificationType,
  locale: string = 'en',
  params: NotificationMessageParams,
): { title: string; message: string } {
  const messages = {
    en: {
      COMMENT_ON_POST: {
        title: 'New Comment',
        message: `${params.commenterName} commented on your post "${params.postTitle}"`,
      },
      LIKE_ON_SHOWCASE: {
        title: 'New Like',
        message: `${params.likerName} liked your showcase "${params.showcaseTitle}"`,
      },
      LIKE_ON_POST: {
        title: 'New Like',
        message: `${params.likerName} liked your post "${params.postTitle}"`,
      },
      MENTIONED: {
        title: 'You were mentioned',
        message: `${params.mentionerName} mentioned you in a ${params.postTitle ? 'post' : 'comment'}`,
      },
      LIKE_ON_COMMENT: {
        title: 'New Like on Comment',
        message: `${params.likerName} liked your comment "${params.commentContent?.substring(0, 30)}${
          params.commentContent && params.commentContent.length > 30 ? '...' : ''
        }"`,
      },
    },
    ko: {
      COMMENT_ON_POST: {
        title: '새 댓글',
        message: `${params.commenterName}님이 회원님의 게시글 "${params.postTitle}"에 댓글을 달았습니다`,
      },
      LIKE_ON_SHOWCASE: {
        title: '새 좋아요',
        message: `${params.likerName}님이 회원님의 쇼케이스 "${params.showcaseTitle}"를 좋아합니다`,
      },
      LIKE_ON_POST: {
        title: '새 좋아요',
        message: `${params.likerName}님이 회원님의 게시글 "${params.postTitle}"를 좋아합니다`,
      },
      MENTIONED: {
        title: '멘션 알림',
        message: `${params.mentionerName}님이 회원님을 ${params.postTitle ? '게시글' : '댓글'}에서 언급했습니다`,
      },
      LIKE_ON_COMMENT: {
        title: '댓글 좋아요',
        message: `${params.likerName}님이 회원님의 댓글 "${params.commentContent?.substring(0, 30)}${
          params.commentContent && params.commentContent.length > 30 ? '...' : ''
        }"에 좋아요를 눌렀습니다`,
      },
    },
    ja: {
      COMMENT_ON_POST: {
        title: '新しいコメント',
        message: `${params.commenterName}さんがあなたの投稿「${params.postTitle}」にコメントしました`,
      },
      LIKE_ON_SHOWCASE: {
        title: '新しいいいね',
        message: `${params.likerName}さんがあなたのショーケース「${params.showcaseTitle}」にいいねしました`,
      },
      LIKE_ON_POST: {
        title: '新しいいいね',
        message: `${params.likerName}さんがあなたの投稿「${params.postTitle}」にいいねしました`,
      },
      MENTIONED: {
        title: 'メンション通知',
        message: `${params.mentionerName}さんが${params.postTitle ? '投稿' : 'コメント'}であなたをメンションしました`,
      },
      LIKE_ON_COMMENT: {
        title: 'コメントへのいいね',
        message: `${params.likerName}さんがあなたのコメント「${params.commentContent?.substring(0, 30)}${
          params.commentContent && params.commentContent.length > 30 ? '...' : ''
        }」にいいねしました`,
      },
    },
  };

  const localeMessages = messages[locale as keyof typeof messages] || messages.en;
  return localeMessages[type];
}

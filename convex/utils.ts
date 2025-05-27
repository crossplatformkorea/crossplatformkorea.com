// Notification message utilities

export type NotificationType =
  | 'COMMENT_ON_POST'
  | 'LIKE_ON_SHOWCASE'
  | 'LIKE_ON_POST'
  | 'MENTIONED';

export interface NotificationMessageParams {
  commenterName?: string;
  likerName?: string;
  postTitle?: string;
  showcaseTitle?: string;
  mentionerName?: string; // 멘션한 사람 이름
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
    },
  };

  const localeMessages = messages[locale as keyof typeof messages] || messages.en;
  return localeMessages[type];
}

// Notification message utilities

export type NotificationType = 'COMMENT_ON_POST' | 'LIKE_ON_SHOWCASE' | 'LIKE_ON_POST';

export interface NotificationMessageParams {
  commenterName?: string;
  likerName?: string;
  postTitle?: string;
  showcaseTitle?: string;
}

/**
 * Generate notification title and message for different locales
 * Since Convex runs in V8 isolate, we use hardcoded messages for each locale
 */
export function getNotificationMessages(
  type: NotificationType,
  locale: string = 'en',
  params: NotificationMessageParams
): { title: string; message: string } {
  switch (type) {
    case 'COMMENT_ON_POST':
      switch (locale) {
        case 'ko':
          return {
            title: '새로운 댓글',
            message: `${params.commenterName}님이 "${params.postTitle}" 포스트에 댓글을 달았습니다.`
          };
        case 'ja':
          return {
            title: '新しいコメント',
            message: `${params.commenterName}さんがあなたの投稿「${params.postTitle}」にコメントしました。`
          };
        default: // 'en'
          return {
            title: 'New comment',
            message: `${params.commenterName} commented on your post "${params.postTitle}".`
          };
      }

    case 'LIKE_ON_SHOWCASE':
      switch (locale) {
        case 'ko':
          return {
            title: '쇼케이스에 좋아요',
            message: `${params.likerName}님이 "${params.showcaseTitle}" 쇼케이스에 좋아요를 눌렀습니다.`
          };
        case 'ja':
          return {
            title: 'ショーケースにいいね',
            message: `${params.likerName}さんがあなたのショーケース「${params.showcaseTitle}」にいいねしました。`
          };
        default: // 'en'
          return {
            title: 'Showcase liked',
            message: `${params.likerName} liked your showcase "${params.showcaseTitle}".`
          };
      }

    case 'LIKE_ON_POST':
      switch (locale) {
        case 'ko':
          return {
            title: '포스트에 좋아요',
            message: `${params.likerName}님이 "${params.postTitle}" 포스트에 좋아요를 눌렀습니다.`
          };
        case 'ja':
          return {
            title: '投稿にいいね',
            message: `${params.likerName}さんがあなたの投稿「${params.postTitle}」にいいねしました。`
          };
        default: // 'en'
          return {
            title: 'Post liked',
            message: `${params.likerName} liked your post "${params.postTitle}".`
          };
      }

    default:
      return {
        title: 'Notification',
        message: 'You have a new notification.'
      };
  }
}

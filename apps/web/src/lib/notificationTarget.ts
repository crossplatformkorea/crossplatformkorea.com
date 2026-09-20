/**
 * Where a notification should take the reader.
 *
 * Comment notifications carry the comment they are about, so they deep-link to
 * that comment instead of dropping the reader at the top of the post and making
 * them hunt for it.
 */

/** Prefix for the per-comment DOM anchor the post page scrolls to. */
export const COMMENT_ANCHOR_PREFIX = 'comment-';

export function commentAnchorId(commentId: string): string {
  return `${COMMENT_ANCHOR_PREFIX}${commentId}`;
}

/** Read a comment id back out of a location hash, if it names one. */
export function commentIdFromHash(hash: string): string | null {
  const bare = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!bare.startsWith(COMMENT_ANCHOR_PREFIX)) return null;
  const id = bare.slice(COMMENT_ANCHOR_PREFIX.length);
  return id || null;
}

type NotificationTarget = {
  postId?: string | null;
  showcaseId?: string | null;
  commentId?: string | null;
};

/** `null` when the notification has nothing to open. */
export function notificationHref(notification: NotificationTarget): string | null {
  if (notification.postId) {
    return notification.commentId
      ? `/post/${notification.postId}#${commentAnchorId(notification.commentId)}`
      : `/post/${notification.postId}`;
  }

  if (notification.showcaseId) {
    return `/showcase/${notification.showcaseId}`;
  }

  return null;
}

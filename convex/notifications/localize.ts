/**
 * Render notification copy at read time instead of trusting the strings frozen
 * into the row when it was created.
 *
 * `createNotification` stores `title`/`message` already rendered in whichever
 * locale the triggering request happened to carry, so a single reader's list
 * mixes languages. Re-rendering here from `type` plus freshly resolved params
 * keeps one source of truth (`getNotificationMessages`) and makes every row —
 * including ones written long before this change — follow the reader's locale.
 */
import { GenericQueryCtx } from 'convex/server';
import { Doc } from '../_generated/dataModel';
import {
  getNotificationMessages,
  type NotificationMessageParams,
  type NotificationType,
} from '../utils';

/**
 * The single param each type's copy interpolates. Only this one is read, so a
 * page of notifications does not fetch documents whose text it never prints.
 *
 * MENTIONED is `null` because its copy quotes nothing — it only needs to know
 * whether the mention was on a post or on a comment.
 */
const REQUIRED_PARAM: Record<NotificationType, keyof NotificationMessageParams | null> = {
  COMMENT_ON_POST: 'postTitle',
  COMMENT_ON_FEATURE_REQUEST: 'featureRequestTitle',
  LIKE_ON_SHOWCASE: 'showcaseTitle',
  LIKE_ON_POST: 'postTitle',
  LIKE_ON_COMMENT: 'commentContent',
  MENTIONED: null,
};

/**
 * Documents a caller already read, so this helper does not read them twice.
 * `null` means the caller looked and the document is gone — distinct from
 * `undefined`, which means it did not look.
 */
export type PrefetchedTargets = {
  post?: { title: string } | null;
  showcase?: { title: string } | null;
};

export async function localizeNotification(
  ctx: GenericQueryCtx<any>,
  notification: Doc<'notifications'>,
  actorName: string,
  locale: string,
  prefetched: PrefetchedTargets = {},
): Promise<{ title: string; message: string }> {
  // The catalog names the actor slot per type; fill them all and let the copy
  // pick the one it needs.
  const params: NotificationMessageParams = {
    commenterName: actorName,
    likerName: actorName,
    mentionerName: actorName,
  };

  const stored = { title: notification.title, message: notification.message };

  const readPostTitle = async (): Promise<string | undefined> => {
    if (prefetched.post !== undefined) return prefetched.post?.title;
    if (!notification.postId) return undefined;
    const post = await ctx.db.get(notification.postId);
    return post?.title;
  };

  const type = notification.type as NotificationType;

  switch (REQUIRED_PARAM[type]) {
    case 'postTitle':
      params.postTitle = await readPostTitle();
      break;

    case 'showcaseTitle':
      if (prefetched.showcase !== undefined) {
        params.showcaseTitle = prefetched.showcase?.title;
      } else if (notification.showcaseId) {
        const showcase = await ctx.db.get(notification.showcaseId);
        if (showcase) params.showcaseTitle = showcase.title;
      }
      break;

    case 'featureRequestTitle':
      if (notification.featureRequestId) {
        const featureRequest = await ctx.db.get(notification.featureRequestId);
        if (featureRequest) params.featureRequestTitle = featureRequest.title;
      }
      break;

    case 'commentContent':
      if (notification.commentId) {
        const comment = await ctx.db.get(notification.commentId);
        if (comment) params.commentContent = comment.content;
      }
      break;

    case null: {
      // MENTIONED reads `postTitle` purely as a post-or-comment flag. The write
      // path draws that distinction with `commentId`: a comment mention carries
      // one and passes no title, a post mention carries none and passes the
      // title. Resolving a title from `postId` would relabel every comment
      // mention as a post, so mirror the write path instead.
      if (notification.commentId) break;

      const postTitle = await readPostTitle();
      // A post mention whose post is gone would otherwise render as "comment".
      if (!postTitle) return stored;
      params.postTitle = postTitle;
      break;
    }
  }

  // Re-rendering without the param the copy quotes would print "undefined";
  // the string stored at write time is the better answer.
  const required = REQUIRED_PARAM[type];
  if (required && !params[required]) return stored;

  return getNotificationMessages(type, locale, params);
}

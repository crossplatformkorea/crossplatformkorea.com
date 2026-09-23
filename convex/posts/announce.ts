import { v } from 'convex/values';

import { internal } from '../_generated/api';
import { Id } from '../_generated/dataModel';
import { internalMutation, MutationCtx } from '../_generated/server';
import { mentionRecipients, shouldAnnounce } from './visibility';

/**
 * How long a newly public post waits before it is announced: to Slack and
 * Discord, and in-app to the users it mentions.
 *
 * The announcement used to go out the moment a post was published, so posting
 * something by mistake and deleting it straight away still put it in the
 * community channels — and a Slack incoming webhook gives no way to take a
 * message back. A post `createPost` published straight away also notified its
 * mentions at once; those were deleted with the post, but a mentioned user with
 * the site open could see one first.
 *
 * The check runs once, when the window ends, and announces only if the post is
 * public then. So a post deleted, or drafted and left that way, is never
 * announced. A rescheduled post is announced by the check the cron schedules
 * when it publishes the post — and by this one too, if the cron has published
 * it by the time this window ends.
 *
 * It is not a debounce: publishing again inside the window schedules a second
 * check, and both find the post public. That sends two Slack and Discord
 * announcements, as the immediate sends did before this; a mention
 * notification goes only to users who do not already hold one for the post.
 */
export const ANNOUNCE_DELAY_MS = 5 * 60 * 1000;

/** Announce a post once the grace window passes, if it is still public then. */
export async function scheduleAnnouncement(ctx: MutationCtx, postId: Id<'posts'>) {
  await ctx.scheduler.runAfter(ANNOUNCE_DELAY_MS, internal.posts.announce.announceIfStillPublic, {
    postId,
  });
}

/**
 * A job scheduled for this stores its path and `{ postId }`, and fails for good
 * if, when it comes due, the function is gone or rejects those arguments. So
 * removing it, renaming it or changing its arguments takes two deploys: stop
 * scheduling it, then change it once `ANNOUNCE_DELAY_MS` has passed. See
 * docs/deployment.md for rollbacks.
 */
export const announceIfStillPublic = internalMutation({
  args: { postId: v.id('posts') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (post === null || !shouldAnnounce(post)) {
      return null;
    }

    // Read here rather than at publish time, so an edit made inside the
    // window is what gets announced.
    const announcement = {
      postId: args.postId,
      title: post.title,
      content: post.content,
      category: post.category,
    };
    await ctx.scheduler.runAfter(0, internal.posts.action.sendSlackNotification, announcement);
    await ctx.scheduler.runAfter(0, internal.posts.action.sendDiscordNotification, announcement);
    // A job of its own, so nothing that goes wrong with the notifications can
    // roll back the two sends above.
    await ctx.scheduler.runAfter(0, internal.posts.announce.notifyMentionedUsers, {
      postId: args.postId,
    });
    return null;
  },
});

/**
 * In-app notifications for the users a post mentions, scheduled by
 * `announceIfStillPublic` once the post has passed its check. It reads the
 * post's current `mentions`, so a mention that an edit removed inside the
 * window is not sent.
 *
 * Every publication schedules a check, so a post published, drafted and
 * published again comes through here more than once. A user who still holds
 * this post's mention notification is skipped rather than told twice. Comment
 * mentions share the type but carry a `commentId`, so they do not count.
 */
export const notifyMentionedUsers = internalMutation({
  args: { postId: v.id('posts') },
  returns: v.null(),
  handler: async (ctx, args): Promise<null> => {
    const post = await ctx.db.get(args.postId);
    if (post === null || !shouldAnnounce(post)) {
      return null;
    }
    const authorId = post.authorId;
    if (authorId === undefined || post.mentions === undefined) {
      return null;
    }

    const notified = new Set<Id<'users'>>();
    for (const userId of post.mentions) {
      const existing = await ctx.db
        .query('notifications')
        .withIndex('by_userId_postId_type_commentId', (q) =>
          q
            .eq('userId', userId)
            .eq('postId', post._id)
            .eq('type', 'MENTIONED')
            .eq('commentId', undefined),
        )
        .first();
      if (existing !== null) {
        notified.add(userId);
      }
    }

    const recipients = mentionRecipients(authorId, post.mentions, notified);
    if (recipients.length === 0) {
      return null;
    }

    // first(), not unique(): a duplicate profile row must not cost every
    // mentioned user their notification.
    const author = await ctx.db
      .query('userProfiles')
      .withIndex('by_user', (q) => q.eq('userId', authorId))
      .first();
    for (const userId of recipients) {
      const profile = await ctx.db
        .query('userProfiles')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .first();
      await ctx.runMutation(internal.notifications.mutation.createNotification, {
        userId,
        type: 'MENTIONED',
        postId: post._id,
        triggeredById: authorId,
        mentionerName: author?.displayName || 'Someone',
        postTitle: post.title,
        locale: profile?.locale || 'ko',
      });
    }
    return null;
  },
});

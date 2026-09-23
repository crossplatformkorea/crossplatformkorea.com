import { v } from 'convex/values';

import { internal } from '../_generated/api';
import { Id } from '../_generated/dataModel';
import { internalMutation, MutationCtx } from '../_generated/server';
import { shouldAnnounce } from './visibility';

/**
 * How long a newly public post waits before it is announced.
 *
 * The announcement used to go out the moment a post was published, so posting
 * something by mistake and deleting it straight away still put it in the
 * community channels — and a Slack incoming webhook gives no way to take a
 * message back.
 *
 * The check runs once, when the window ends, and announces only if the post is
 * public then. So a post deleted, or drafted and left that way, is never
 * announced. A rescheduled post is announced by the check the cron schedules
 * when it publishes the post — and by this one too, if the cron has published
 * it by the time this window ends.
 *
 * It is not a debounce: publishing again inside the window schedules a second
 * check, and both find the post public. That sends two announcements, as the
 * immediate sends did before this.
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
    return null;
  },
});

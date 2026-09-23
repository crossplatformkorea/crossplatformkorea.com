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
 * message back. A post deleted, drafted or rescheduled inside this window is
 * never announced.
 */
export const ANNOUNCE_DELAY_MS = 5 * 60 * 1000;

/** Announce a post once the grace window passes, if it is still public then. */
export async function scheduleAnnouncement(ctx: MutationCtx, postId: Id<'posts'>) {
  await ctx.scheduler.runAfter(ANNOUNCE_DELAY_MS, internal.posts.announce.announceIfStillPublic, {
    postId,
  });
}

export const announceIfStillPublic = internalMutation({
  args: { postId: v.id('posts') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!shouldAnnounce(post)) {
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

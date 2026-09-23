import { v } from 'convex/values';

import { internal } from '../_generated/api';
import { internalMutation } from '../_generated/server';
import { publishedAtBackfill } from './visibility';

/** Documents per batch. */
const BACKFILL_BATCH_SIZE = 100;

/**
 * Fill `publishedAt`, which the feeds now sort on. Run once after deploying:
 * each batch schedules the next, so one `convex run` finishes the table.
 *
 * Until it runs every row is unset and ties, so the index falls back to its
 * implicit `_creationTime` tiebreaker and reproduces the old creation order.
 * Batches go newest-first so that, part-way through, the rows that have a key
 * are the ones that belong at the top of the feed anyway — oldest-first would
 * lift the oldest posts above every newer one until the last batch landed.
 *
 * Safe to re-run: `publishedAtBackfill` fills gaps and clears strays but never
 * overwrites a published row's existing value, which an edit may have set to
 * a real publication time.
 */
export const backfillPublishedAt = internalMutation({
  args: { cursor: v.optional(v.string()) },
  returns: v.object({
    isDone: v.boolean(),
    updated: v.number(),
  }),
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query('posts')
      .order('desc')
      .paginate({ cursor: args.cursor ?? null, numItems: BACKFILL_BATCH_SIZE });

    let updated = 0;

    for (const post of page.page) {
      const change = publishedAtBackfill(post);
      if (change) {
        await ctx.db.patch(post._id, change);
        updated += 1;
      }
    }

    if (!page.isDone) {
      await ctx.scheduler.runAfter(0, internal.posts.migrations.backfillPublishedAt, {
        cursor: page.continueCursor,
      });
    }

    return { isDone: page.isDone, updated };
  },
});

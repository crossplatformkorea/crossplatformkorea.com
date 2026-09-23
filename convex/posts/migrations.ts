import { v } from 'convex/values';

import { internalMutation } from '../_generated/server';
import { isPublicPost, publishedAtFor } from './visibility';

/** Documents per batch. */
const BACKFILL_BATCH_SIZE = 100;

/**
 * Fill `publishedAt`, which the feeds now sort on. Run once after deploying,
 * re-calling with the returned cursor until `isDone`.
 *
 * Until it runs, every row is unset and ties, so the index falls back to its
 * implicit `_creationTime` tiebreaker — the same creation order as before. The
 * feed only switches to publication order once this has run, so there is no
 * window where it is worse than it was.
 *
 * Idempotent: rows already correct are skipped, and a non-public row carrying
 * a stale value is cleared.
 */
export const backfillPublishedAt = internalMutation({
  args: { cursor: v.optional(v.string()) },
  returns: v.object({
    isDone: v.boolean(),
    cursor: v.union(v.string(), v.null()),
    updated: v.number(),
  }),
  handler: async (ctx, args) => {
    const page = await ctx.db.query('posts').paginate({
      cursor: args.cursor ?? null,
      numItems: BACKFILL_BATCH_SIZE,
    });

    let updated = 0;

    for (const post of page.page) {
      const expected = isPublicPost(post)
        ? publishedAtFor('published', post.publishAt, post._creationTime)
        : undefined;

      if (post.publishedAt === expected) {
        continue;
      }

      await ctx.db.patch(post._id, { publishedAt: expected });
      updated += 1;
    }

    return {
      isDone: page.isDone,
      cursor: page.isDone ? null : page.continueCursor,
      updated,
    };
  },
});

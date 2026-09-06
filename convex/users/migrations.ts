import { v } from 'convex/values';

import { internalMutation } from '../_generated/server';

/** 한 번에 백필할 문서 수. */
const BACKFILL_BATCH_SIZE = 100;

/**
 * displayNameLower를 채운다. 이 키가 없는 문서는 프로필 조회 인덱스에 잡히지
 * 않으므로, 배포 직후 한 번 실행해야 한다. 남은 문서가 없을 때까지
 * 반환된 cursor로 다시 호출한다.
 */
export const backfillDisplayNameLower = internalMutation({
  args: { cursor: v.optional(v.string()) },
  returns: v.object({
    isDone: v.boolean(),
    cursor: v.union(v.string(), v.null()),
    updated: v.number(),
  }),
  handler: async (ctx, args) => {
    const page = await ctx.db.query('userProfiles').paginate({
      cursor: args.cursor ?? null,
      numItems: BACKFILL_BATCH_SIZE,
    });

    let updated = 0;

    for (const profile of page.page) {
      const expected = profile.displayName.toLowerCase();

      if (profile.displayNameLower === expected) {
        continue;
      }

      await ctx.db.patch(profile._id, { displayNameLower: expected });
      updated += 1;
    }

    return {
      isDone: page.isDone,
      cursor: page.isDone ? null : page.continueCursor,
      updated,
    };
  },
});

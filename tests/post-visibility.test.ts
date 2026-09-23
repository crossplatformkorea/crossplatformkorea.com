import { describe, expect, test } from 'bun:test';
import {
  defaultCompanionPublishAt,
  isDueScheduledPost,
  isPublicPost,
  takePublicPosts,
  normalizePublishAt,
  nextPublishedAt,
  publishedAtBackfill,
  publishedAtFor,
  readPublishAt,
  resolvePostStatus,
  shouldAnnounce,
  seoulLocalToUtcIso,
  utcIsoToSeoulLocal,
} from '../convex/posts/visibility.ts';

describe('isPublicPost', () => {
  const now = Date.parse('2026-09-02T07:00:00.000Z');

  test('treats missing status as published', () => {
    expect(isPublicPost({ _creationTime: now }, now)).toBe(true);
  });

  test('hides drafts and scheduled posts', () => {
    expect(isPublicPost({ status: 'draft' }, now)).toBe(false);
    expect(isPublicPost({ status: 'scheduled', publishAt: '2026-09-02T07:00:00.000Z' }, now)).toBe(
      false,
    );
  });

  test('hides published posts whose publishAt is still in the future', () => {
    expect(isPublicPost({ status: 'published', publishAt: '2026-09-02T08:00:00.000Z' }, now)).toBe(
      false,
    );
  });

  test('shows published posts once publishAt has passed', () => {
    expect(isPublicPost({ status: 'published', publishAt: '2026-09-02T06:00:00.000Z' }, now)).toBe(
      true,
    );
  });
});

describe('resolvePostStatus', () => {
  const now = Date.parse('2026-09-02T07:00:00.000Z');

  test('keeps explicit drafts', () => {
    expect(resolvePostStatus({ status: 'draft', publishAt: '2026-09-03T00:00:00.000Z' }, now)).toBe(
      'draft',
    );
  });

  test('schedules future publishAt', () => {
    expect(resolvePostStatus({ publishAt: '2026-09-02T08:00:00.000Z' }, now)).toBe('scheduled');
  });

  test('publishes past or missing publishAt', () => {
    expect(resolvePostStatus({ publishAt: '2026-09-02T06:00:00.000Z' }, now)).toBe('published');
    expect(resolvePostStatus({}, now)).toBe('published');
  });
});

describe('Asia/Seoul datetime helpers', () => {
  test('converts naive Seoul local time to UTC ISO', () => {
    expect(seoulLocalToUtcIso('2026-09-02T16:00')).toBe('2026-09-02T07:00:00.000Z');
  });

  test('converts UTC ISO back to Seoul datetime-local', () => {
    expect(utcIsoToSeoulLocal('2026-09-02T07:00:00.000Z')).toBe('2026-09-02T16:00');
  });

  test('treats naive worker values as Seoul and keeps explicit offsets', () => {
    expect(normalizePublishAt('2026-09-02 16:00')).toBe('2026-09-02T07:00:00.000Z');
    expect(normalizePublishAt('2026-09-02T07:00:00.000Z')).toBe('2026-09-02T07:00:00.000Z');
    expect(normalizePublishAt('2026-09-02T16:00:00+09:00')).toBe('2026-09-02T07:00:00.000Z');
  });

  test('defaults companion posts to 16:00 KST today or tomorrow', () => {
    const morningKst = Date.parse('2026-09-01T20:00:00.000Z'); // 05:00 KST Sep 2
    expect(defaultCompanionPublishAt(morningKst)).toBe('2026-09-02T07:00:00.000Z');
    const eveningKst = Date.parse('2026-09-02T08:00:00.000Z'); // 17:00 KST Sep 2
    expect(defaultCompanionPublishAt(eveningKst)).toBe('2026-09-03T07:00:00.000Z');
  });
});

describe('isDueScheduledPost', () => {
  const now = Date.parse('2026-09-02T07:00:00.000Z');

  test('publishes due scheduled rows and ignores the rest', () => {
    expect(
      isDueScheduledPost({ status: 'scheduled', publishAt: '2026-09-02T07:00:00.000Z' }, now),
    ).toBe(true);
    expect(
      isDueScheduledPost({ status: 'scheduled', publishAt: '2026-09-02T08:00:00.000Z' }, now),
    ).toBe(false);
    expect(isDueScheduledPost({ status: 'draft' }, now)).toBe(false);
  });
});

describe('takePublicPosts', () => {
  const now = Date.parse('2026-09-06T00:00:00Z');
  async function* stream(posts: { id: number; status?: string; publishAt?: string }[]) {
    yield* posts;
  }

  test('fills six slots past more than eighteen hidden posts, preserving order', async () => {
    const posts = [
      { id: 0, status: 'published' },
      ...Array.from({ length: 24 }, (_, id) => ({
        id: id + 1,
        status: id % 2 ? 'scheduled' : 'draft',
      })),
      { id: 25, status: 'published', publishAt: '2099-01-01T00:00:00Z' },
      { id: 26, status: 'published', publishAt: 'invalid' },
      ...Array.from({ length: 8 }, (_, id) => ({ id: id + 27 })),
    ];
    expect((await takePublicPosts(stream(posts), 6, now)).map((p) => p.id)).toEqual([
      0, 27, 28, 29, 30, 31,
    ]);
  });

  test('returns available public posts when fewer than six exist', async () => {
    expect(await takePublicPosts(stream([{ id: 1 }, { id: 2, status: 'draft' }]), 6, now)).toEqual([
      { id: 1 },
    ]);
    expect(await takePublicPosts(stream([]), 6, now)).toEqual([]);
  });

  test('stops reading as soon as the feed is full', async () => {
    async function* posts() {
      yield { id: 1 };
      throw new Error('should not read another post');
    }
    expect(await takePublicPosts(posts(), 1, now)).toEqual([{ id: 1 }]);
  });

  test('rejects invalid limits', async () => {
    for (const limit of [0, -1, 1.5, 101, Infinity, NaN]) {
      await expect(takePublicPosts(stream([]), limit, now)).rejects.toThrow('Post limit');
    }
  });
});

describe('publishedAtFor', () => {
  const created = Date.parse('2026-09-02T01:49:00.000Z');

  test('is unset while a post is not public', () => {
    expect(publishedAtFor('draft', undefined, created)).toBeUndefined();
    expect(publishedAtFor('scheduled', '2026-09-22T07:00:00.000Z', created)).toBeUndefined();
  });

  test('is the creation time for a post published immediately', () => {
    expect(publishedAtFor('published', undefined, created)).toBe(created);
  });

  test('is the scheduled time once a scheduled post goes public', () => {
    expect(publishedAtFor('published', '2026-09-22T07:00:00.000Z', created)).toBe(
      Date.parse('2026-09-22T07:00:00.000Z'),
    );
  });

  test('falls back to creation time when publishAt is unreadable', () => {
    expect(publishedAtFor('published', 'not-a-date', created)).toBe(created);
  });

  // The production feed on 2026-09-24, reproduced. The Wasm post was created
  // on 9/2 and scheduled for 9/22 16:00 KST, making it the most recently
  // published post — yet ordering by creation time put it below two posts
  // that went public before it.
  test('orders a feed by publication, surfacing posts scheduled far ahead', () => {
    const posts = [
      {
        title: 'wasm',
        _creationTime: Date.parse('2026-09-02T01:49:00.000Z'),
        publishAt: '2026-09-22T07:00:00.000Z',
      },
      {
        title: 'xcode',
        _creationTime: Date.parse('2026-09-20T21:17:00.000Z'),
        publishAt: '2026-09-22T00:00:00.000Z',
      },
      {
        title: 'iphone',
        _creationTime: Date.parse('2026-09-20T21:13:00.000Z'),
        publishAt: undefined,
      },
    ];

    const byCreation = [...posts]
      .sort((a, b) => b._creationTime - a._creationTime)
      .map((p) => p.title);
    expect(byCreation).toEqual(['xcode', 'iphone', 'wasm']);

    const byPublication = [...posts]
      .sort(
        (a, b) =>
          publishedAtFor('published', b.publishAt, b._creationTime)! -
          publishedAtFor('published', a.publishAt, a._creationTime)!,
      )
      .map((p) => p.title);
    expect(byPublication).toEqual(['wasm', 'xcode', 'iphone']);
  });
});

describe('nextPublishedAt', () => {
  const created = Date.parse('2026-09-01T00:00:00.000Z');
  const now = Date.parse('2026-09-20T00:00:00.000Z');

  // The draft path back into the bug this branch fixes: without it, a draft
  // written on 9/1 and published on 9/20 is dated 9/1 and buried 19 days down.
  test('dates a draft published later at the moment it went public', () => {
    const draft = { status: 'draft', _creationTime: created };
    expect(nextPublishedAt(draft, { status: 'published', publishAt: undefined }, now)).toBe(now);
  });

  test('keeps the value when an edit leaves a public post public', () => {
    const published = { status: 'published', publishedAt: created + 5, _creationTime: created };
    expect(nextPublishedAt(published, { status: 'published', publishAt: undefined }, now)).toBe(
      created + 5,
    );
  });

  test('clears it when a public post is drafted or rescheduled', () => {
    const published = { status: 'published', publishedAt: created, _creationTime: created };
    expect(
      nextPublishedAt(published, { status: 'draft', publishAt: undefined }, now),
    ).toBeUndefined();
    expect(
      nextPublishedAt(
        published,
        { status: 'scheduled', publishAt: '2026-10-01T00:00:00.000Z' },
        now,
      ),
    ).toBeUndefined();
  });

  // Publishing a scheduled post early means picking a time that has passed;
  // dating it at that time would put it hours down the feed while Slack and
  // Discord announce it as new. A stale date left on a draft is the same case.
  test('dates a post made public by an edit at now, whatever date it carries', () => {
    const scheduled = {
      status: 'scheduled',
      publishAt: '2026-09-21T00:00:00.000Z',
      _creationTime: created,
    };
    expect(
      nextPublishedAt(
        scheduled,
        { status: 'published', publishAt: '2026-09-19T09:00:00.000Z' },
        now,
      ),
    ).toBe(now);
    const staleDraft = {
      status: 'draft',
      publishAt: '2026-09-05T00:00:00.000Z',
      _creationTime: created,
    };
    expect(
      nextPublishedAt(
        staleDraft,
        { status: 'published', publishAt: '2026-09-05T00:00:00.000Z' },
        now,
      ),
    ).toBe(now);
  });

  test('keeps the value when the date is cleared on a public post', () => {
    const published = {
      status: 'published',
      publishAt: '2026-09-15T00:00:00.000Z',
      publishedAt: Date.parse('2026-09-15T00:00:00.000Z'),
      _creationTime: created,
    };
    expect(nextPublishedAt(published, { status: 'published', publishAt: undefined }, now)).toBe(
      Date.parse('2026-09-15T00:00:00.000Z'),
    );
  });

  test('follows an explicit new date set on a post that was already public', () => {
    const published = { status: 'published', publishedAt: created, _creationTime: created };
    expect(
      nextPublishedAt(
        published,
        { status: 'published', publishAt: '2026-09-10T00:00:00.000Z' },
        now,
      ),
    ).toBe(Date.parse('2026-09-10T00:00:00.000Z'));
  });

  // Scripts store dates as given; the editor re-sends them in canonical ISO at
  // minute precision. Compared as strings, a typo fix read that re-send as a
  // new date and moved a post the script had published back to its stored
  // date, days down the feed.
  test('treats an unchanged date re-sent in another format as unchanged', () => {
    const publishedByScript = {
      status: 'published',
      publishAt: '2026-09-20T16:00:30+09:00',
      publishedAt: Date.parse('2026-09-24T00:00:00.000Z'),
      _creationTime: created,
    };
    expect(
      nextPublishedAt(
        publishedByScript,
        { status: 'published', publishAt: '2026-09-20T07:00:00.000Z' },
        Date.parse('2026-09-25T00:00:00.000Z'),
      ),
    ).toBe(Date.parse('2026-09-24T00:00:00.000Z'));
  });

  // The Wasm post's shape before the backfill: published by the cron, keyed by
  // nothing yet. An edit in that window must date it as the backfill would.
  test('keeps the scheduled time for a cron-published row edited before the backfill', () => {
    const afterPublish = Date.parse('2026-09-24T00:00:00.000Z');
    const legacy = {
      status: 'published',
      publishAt: '2026-09-22T07:00:00.000Z',
      _creationTime: created,
    };
    expect(
      nextPublishedAt(
        legacy,
        { status: 'published', publishAt: '2026-09-22T07:00:00.000Z' },
        afterPublish,
      ),
    ).toBe(Date.parse('2026-09-22T07:00:00.000Z'));
  });

  test('matches the backfill for a public row edited before the backfill ran', () => {
    const legacy = { _creationTime: created };
    expect(nextPublishedAt(legacy, { status: 'published', publishAt: undefined }, now)).toBe(
      created,
    );
  });
});

describe('publishedAtBackfill', () => {
  const created = Date.parse('2026-09-01T00:00:00.000Z');

  test('fills a published row that has no key', () => {
    expect(publishedAtBackfill({ status: 'published', _creationTime: created })).toEqual({
      publishedAt: created,
    });
    expect(
      publishedAtBackfill({
        status: 'published',
        publishAt: '2026-09-22T07:00:00.000Z',
        _creationTime: created,
      }),
    ).toEqual({ publishedAt: Date.parse('2026-09-22T07:00:00.000Z') });
  });

  test('treats a legacy row with no status as published', () => {
    expect(publishedAtBackfill({ _creationTime: created })).toEqual({ publishedAt: created });
  });

  // Re-running must not undo a real publication time recorded by an edit —
  // here a draft published on 9/20, which no formula over the row reproduces.
  test('never overwrites an existing value on a published row', () => {
    const recorded = Date.parse('2026-09-20T00:00:00.000Z');
    expect(
      publishedAtBackfill({ status: 'published', publishedAt: recorded, _creationTime: created }),
    ).toBeNull();
  });

  test('clears a stray value on a row that is not published', () => {
    expect(
      publishedAtBackfill({ status: 'draft', publishedAt: created, _creationTime: created }),
    ).toEqual({ publishedAt: undefined });
  });

  test('leaves unpublished rows without a key alone', () => {
    expect(publishedAtBackfill({ status: 'draft', _creationTime: created })).toBeNull();
    expect(
      publishedAtBackfill({
        status: 'scheduled',
        publishAt: '2026-10-01T00:00:00.000Z',
        _creationTime: created,
      }),
    ).toBeNull();
  });
});

// Posting by mistake and deleting straight away used to announce the post
// anyway, because the announcement left the moment it was published. It now
// waits out a grace window and is sent only if this still holds at the end.
describe('shouldAnnounce', () => {
  const now = Date.parse('2026-09-24T00:00:00.000Z');

  test('stays quiet for a post deleted during the grace window', () => {
    expect(shouldAnnounce(null, now)).toBe(false);
  });

  test('stays quiet for a post drafted or rescheduled during the window', () => {
    expect(shouldAnnounce({ status: 'draft' }, now)).toBe(false);
    expect(
      shouldAnnounce({ status: 'scheduled', publishAt: '2026-10-01T00:00:00.000Z' }, now),
    ).toBe(false);
  });

  test('announces a post that is still public', () => {
    expect(shouldAnnounce({ status: 'published' }, now)).toBe(true);
    expect(shouldAnnounce({ _creationTime: now }, now)).toBe(true);
  });
});

describe('readPublishAt', () => {
  test('keeps a readable date as given, only trimmed', () => {
    expect(readPublishAt(' 2026-09-24T16:00:00+09:00 ')).toBe('2026-09-24T16:00:00+09:00');
    expect(readPublishAt('2026-09-24T07:00:00.000Z')).toBe('2026-09-24T07:00:00.000Z');
  });

  test('treats a blank date as none', () => {
    expect(readPublishAt(undefined)).toBeUndefined();
    expect(readPublishAt('')).toBeUndefined();
    expect(readPublishAt('   ')).toBeUndefined();
  });

  // Stored, such a date made the post published but hidden: its announcement
  // check skipped it, and fixing the date later scheduled no new one.
  test('rejects a date that cannot be read', () => {
    expect(resolvePostStatus({ status: 'published', publishAt: 'TBD' })).toBe('published');
    expect(isPublicPost({ status: 'published', publishAt: 'TBD' })).toBe(false);
    expect(() => readPublishAt('TBD')).toThrow('Invalid publishAt');
    expect(() => readPublishAt('not a date')).toThrow('Invalid publishAt');
  });
});

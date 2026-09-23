/**
 * Pure helpers for post publishing visibility.
 * Safe to import from Convex functions and from bun tests.
 *
 * Scheduling is stored as UTC ISO (`publishAt`) and interpreted in Asia/Seoul
 * (KST, UTC+9, no DST).
 */

export type PostStatus = 'draft' | 'scheduled' | 'published';

export type PostVisibilityFields = {
  status?: string;
  publishAt?: string;
  _creationTime?: number;
};

const SEOUL_OFFSET_MS = 9 * 60 * 60 * 1000;
const COMPANION_HOUR_KST = 16;

export function isPublicPost(post: PostVisibilityFields, nowMs: number = Date.now()): boolean {
  const status = post.status ?? 'published';
  if (status !== 'published') {
    return false;
  }
  if (!post.publishAt) {
    return true;
  }
  const publishAtMs = Date.parse(post.publishAt);
  if (Number.isNaN(publishAtMs)) {
    return false;
  }
  return publishAtMs <= nowMs;
}

export function isDueScheduledPost(
  post: PostVisibilityFields,
  nowMs: number = Date.now(),
): boolean {
  if ((post.status ?? 'published') !== 'scheduled') {
    return false;
  }
  if (!post.publishAt) {
    return true;
  }
  const publishAtMs = Date.parse(post.publishAt);
  if (Number.isNaN(publishAtMs)) {
    return true;
  }
  return publishAtMs <= nowMs;
}

export function effectivePublishTime(post: PostVisibilityFields, fallbackMs: number = 0): number {
  if (post.publishAt) {
    const publishAtMs = Date.parse(post.publishAt);
    if (!Number.isNaN(publishAtMs)) {
      return publishAtMs;
    }
  }
  return post._creationTime ?? fallbackMs;
}

/**
 * `publishedAt` for a row: when it became public, or `undefined` while it is
 * not. Stored so feeds can paginate in publication order — Convex cursors only
 * follow an index, so ordering by a computed value is not possible at read
 * time. Without it, a post scheduled weeks ahead surfaces where its creation
 * time puts it, already buried under everything published in between.
 *
 * Leaving drafts and scheduled rows unset sorts them after every published
 * post in a descending index (Convex orders `undefined` lowest), so they never
 * take a slot at the head of a feed page.
 */
export function publishedAtFor(
  status: PostStatus,
  publishAt: string | undefined,
  creationMs: number,
): number | undefined {
  if (status !== 'published') {
    return undefined;
  }
  return effectivePublishTime({ publishAt, _creationTime: creationMs }, creationMs);
}

type PublishedAtFields = {
  status?: string;
  publishAt?: string;
  publishedAt?: number;
  _creationTime: number;
};

/**
 * `publishedAt` after an edit that may change publication.
 *
 * A post *becoming* public through an edit appeared to readers now, whatever
 * date it carries: a stale date left on a draft from an earlier plan, or a past
 * time picked to publish a scheduled post early, would otherwise date it hours
 * or weeks back and bury it — exactly as the creation-time sort did. Only
 * creating a post with a past date backdates it (see `publishedAtFor`).
 *
 * For a post that was already public, an edit keeps its value unless it sets a
 * new explicit date. Clearing the date keeps it too, rather than falling back
 * to the creation time.
 */
export function nextPublishedAt(
  before: PublishedAtFields,
  after: { status: PostStatus; publishAt: string | undefined },
  nowMs: number = Date.now(),
): number | undefined {
  if (after.status !== 'published') {
    return undefined;
  }
  if (!isPublicPost(before, nowMs)) {
    return nowMs;
  }
  // A row not yet backfilled has no value; derive it the way the backfill
  // would, so an edit in that window cannot date a scheduled post at creation.
  const current = before.publishedAt ?? effectivePublishTime(before, before._creationTime);
  if (after.publishAt === undefined || after.publishAt === before.publishAt) {
    return current;
  }
  return publishedAtFor('published', after.publishAt, current);
}

/**
 * The backfill's decision for one row: the value to write, or `null` to leave
 * it alone.
 *
 * It fills gaps and clears strays but never overwrites a published row's
 * existing value, which may be a real publication time recorded by an edit
 * that no formula over the row can reproduce. It decides by status, as the
 * write paths do, rather than by the current time.
 */
export function publishedAtBackfill(
  post: PublishedAtFields,
): { publishedAt: number | undefined } | null {
  if ((post.status ?? 'published') === 'published') {
    return post.publishedAt === undefined
      ? { publishedAt: publishedAtFor('published', post.publishAt, post._creationTime) }
      : null;
  }
  return post.publishedAt === undefined ? null : { publishedAt: undefined };
}

export function resolvePostStatus(
  args: { status?: string; publishAt?: string },
  nowMs: number = Date.now(),
): PostStatus {
  if (args.status === 'draft') {
    return 'draft';
  }

  if (args.publishAt) {
    const publishAtMs = Date.parse(args.publishAt);
    if (!Number.isNaN(publishAtMs) && publishAtMs > nowMs) {
      return 'scheduled';
    }
  }

  if (args.status === 'scheduled') {
    if (!args.publishAt) {
      return 'published';
    }
    const publishAtMs = Date.parse(args.publishAt);
    if (Number.isNaN(publishAtMs) || publishAtMs <= nowMs) {
      return 'published';
    }
    return 'scheduled';
  }

  return 'published';
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** Convert a timezone-naive Seoul local datetime to UTC ISO. */
export function seoulLocalToUtcIso(local: string): string {
  const match = local.trim().match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) {
    throw new Error(`Invalid Seoul local datetime: ${local}`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6] ?? '0');
  const utcMs = Date.UTC(year, month - 1, day, hour, minute, second) - SEOUL_OFFSET_MS;
  return new Date(utcMs).toISOString();
}

/** Convert a UTC ISO timestamp to a datetime-local value in Asia/Seoul. */
export function utcIsoToSeoulLocal(iso: string): string {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) {
    throw new Error(`Invalid ISO datetime: ${iso}`);
  }
  const seoul = new Date(ms + SEOUL_OFFSET_MS);
  return `${seoul.getUTCFullYear()}-${pad(seoul.getUTCMonth() + 1)}-${pad(seoul.getUTCDate())}T${pad(seoul.getUTCHours())}:${pad(seoul.getUTCMinutes())}`;
}

/**
 * Normalize a worker/admin publishAt value to UTC ISO.
 * Offsets and trailing Z are respected; naive values are Asia/Seoul.
 */
export function normalizePublishAt(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('publishAt is empty');
  }
  if (/Z$/i.test(trimmed) || /[+-]\d{2}:\d{2}$/.test(trimmed)) {
    const ms = Date.parse(trimmed);
    if (Number.isNaN(ms)) {
      throw new Error(`Invalid publishAt: ${input}`);
    }
    return new Date(ms).toISOString();
  }
  return seoulLocalToUtcIso(trimmed);
}

/**
 * Default companion-post time: 16:00 Asia/Seoul the same calendar day.
 * If that instant is already past, use 16:00 KST tomorrow.
 */
export function defaultCompanionPublishAt(nowMs: number = Date.now()): string {
  const seoul = new Date(nowMs + SEOUL_OFFSET_MS);
  const year = seoul.getUTCFullYear();
  const month = seoul.getUTCMonth();
  const day = seoul.getUTCDate();
  let publishUtcMs = Date.UTC(year, month, day, COMPANION_HOUR_KST, 0, 0) - SEOUL_OFFSET_MS;
  if (publishUtcMs <= nowMs) {
    publishUtcMs += 24 * 60 * 60 * 1000;
  }
  return new Date(publishUtcMs).toISOString();
}

/** Fill a public feed without letting drafts or scheduled posts consume slots. */
export async function takePublicPosts<T extends PostVisibilityFields>(
  posts: AsyncIterable<T>,
  limit: number,
  nowMs: number = Date.now(),
): Promise<T[]> {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
    throw new Error('Post limit must be an integer between 1 and 100');
  }
  const results: T[] = [];
  for await (const post of posts) {
    if (!isPublicPost(post, nowMs)) continue;
    results.push(post);
    if (results.length === limit) break;
  }
  return results;
}

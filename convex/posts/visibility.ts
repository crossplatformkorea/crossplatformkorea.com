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

import { describe, expect, test } from 'bun:test';
import {
  defaultCompanionPublishAt,
  isDueScheduledPost,
  isPublicPost,
  normalizePublishAt,
  resolvePostStatus,
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

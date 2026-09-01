import { describe, expect, test } from 'bun:test';
import { createSignInHref, sanitizeReturnTo } from '../apps/web/src/lib/authRedirect.ts';

describe('sanitizeReturnTo', () => {
  test.each([
    null,
    '',
    'https://evil.example/path',
    '//evil.example/path',
    '/\\evil.example/path',
    '/%5C%5Cevil.example/path',
    '/%5c%5cevil.example/path',
    '/%2e%2e//evil.example/path',
    '/posts/%2e%2e/%2e%2e//evil.example/path',
    '/sign-in',
    '/sign-in?returnTo=%2Fposts',
    '/sign-in/callback',
  ])('rejects unsafe destination %p', (value) => {
    expect(sanitizeReturnTo(value)).toBe('/');
  });

  test('preserves a safe path, query, and fragment', () => {
    expect(sanitizeReturnTo('/posts?category=news#latest')).toBe('/posts?category=news#latest');
  });

  test('normalizes dot segments without changing origin', () => {
    expect(sanitizeReturnTo('/posts/../showcase')).toBe('/showcase');
  });
});

describe('createSignInHref', () => {
  test('encodes the validated destination', () => {
    expect(createSignInHref('/posts?category=news#latest')).toBe(
      '/sign-in?returnTo=%2Fposts%3Fcategory%3Dnews%23latest',
    );
  });
});

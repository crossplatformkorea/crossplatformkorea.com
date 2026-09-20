import { describe, expect, test } from 'bun:test';
import {
  commentAnchorId,
  commentIdFromHash,
  notificationHref,
} from '../apps/web/src/lib/notificationTarget.ts';

describe('notificationHref', () => {
  test('deep-links a comment notification to the comment itself', () => {
    expect(notificationHref({ postId: 'post123', commentId: 'comment456' })).toBe(
      '/post/post123#comment-comment456',
    );
  });

  test('opens the post when the notification names no comment', () => {
    expect(notificationHref({ postId: 'post123' })).toBe('/post/post123');
  });

  test('prefers the post route over the showcase route', () => {
    expect(notificationHref({ postId: 'post123', showcaseId: 'show789' })).toBe('/post/post123');
  });

  test('falls back to the showcase route', () => {
    expect(notificationHref({ showcaseId: 'show789' })).toBe('/showcase/show789');
  });

  test('ignores a stray comment id with nothing to open', () => {
    expect(notificationHref({ commentId: 'comment456' })).toBeNull();
  });

  test.each([{}, { postId: null }, { postId: undefined, showcaseId: null }])(
    'returns null when there is no target %p',
    (notification) => {
      expect(notificationHref(notification)).toBeNull();
    },
  );
});

describe('commentIdFromHash', () => {
  test('reads the id back out of an anchor', () => {
    expect(commentIdFromHash('#comment-abc123')).toBe('abc123');
  });

  test('accepts a hash without the leading marker', () => {
    expect(commentIdFromHash('comment-abc123')).toBe('abc123');
  });

  test.each(['', '#', '#comments', '#comment-', '#other-abc123', '#section'])(
    'ignores hash %p',
    (hash) => {
      expect(commentIdFromHash(hash)).toBeNull();
    },
  );

  test('round-trips with commentAnchorId', () => {
    expect(commentIdFromHash(`#${commentAnchorId('xyz')}`)).toBe('xyz');
  });
});

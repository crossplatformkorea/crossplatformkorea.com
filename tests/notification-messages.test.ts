import { describe, expect, test } from 'bun:test';
import { getNotificationMessages, type NotificationType } from '../convex/utils.ts';

const TYPES: NotificationType[] = [
  'COMMENT_ON_POST',
  'COMMENT_ON_FEATURE_REQUEST',
  'LIKE_ON_SHOWCASE',
  'LIKE_ON_POST',
  'MENTIONED',
  'LIKE_ON_COMMENT',
];

const LOCALES = ['en', 'ko', 'ja'];

/** Every slot the catalog may interpolate, so no type renders "undefined". */
const FULL_PARAMS = {
  commenterName: 'Actor',
  likerName: 'Actor',
  mentionerName: 'Actor',
  postTitle: 'Post Title',
  showcaseTitle: 'Showcase Title',
  featureRequestTitle: 'Feature Request Title',
  commentContent: 'Comment body',
};

describe('getNotificationMessages', () => {
  // Notification copy is rendered per reader, so a gap in any locale would put
  // an English row in the middle of a Korean list — the exact inconsistency
  // read-time localization exists to remove.
  const cases = LOCALES.flatMap((locale) => TYPES.map((type) => ({ locale, type })));

  test.each(cases)('renders $type in $locale', ({ locale, type }) => {
    const { title, message } = getNotificationMessages(type, locale, FULL_PARAMS);

    expect(title.trim()).not.toBe('');
    expect(message.trim()).not.toBe('');
    expect(title).not.toContain('undefined');
    expect(message).not.toContain('undefined');
    expect(message).toContain('Actor');
  });

  test.each(TYPES)('every locale renders %s differently from the others', (type) => {
    const titles = LOCALES.map((locale) => getNotificationMessages(type, locale, FULL_PARAMS).title);
    // en/ko/ja must each be translated, not silently sharing the English copy.
    expect(new Set(titles).size).toBe(LOCALES.length);
  });

  test('falls back to English for a locale the catalog does not ship', () => {
    for (const type of TYPES) {
      expect(getNotificationMessages(type, 'fr', FULL_PARAMS)).toEqual(
        getNotificationMessages(type, 'en', FULL_PARAMS),
      );
    }
  });

  // MENTIONED is the one type whose copy reads `postTitle` as a flag rather
  // than printing it: with a title it says "post", without one it says
  // "comment". The write path encodes that by passing a title for post
  // mentions and none for comment mentions, so anything re-rendering these
  // rows has to preserve the distinction or every comment mention silently
  // becomes a post mention.
  describe('MENTIONED post-or-comment wording', () => {
    const WORDS = {
      en: { post: 'post', comment: 'comment' },
      ko: { post: '게시글', comment: '댓글' },
      ja: { post: '投稿', comment: 'コメント' },
    } as const;

    test.each(LOCALES)('says "post" in %s when a title is supplied', (locale) => {
      const { message } = getNotificationMessages('MENTIONED', locale, {
        mentionerName: 'Actor',
        postTitle: 'Post Title',
      });
      const words = WORDS[locale as keyof typeof WORDS];
      expect(message).toContain(words.post);
      expect(message).not.toContain(words.comment);
    });

    test.each(LOCALES)('says "comment" in %s when no title is supplied', (locale) => {
      const { message } = getNotificationMessages('MENTIONED', locale, {
        mentionerName: 'Actor',
      });
      const words = WORDS[locale as keyof typeof WORDS];
      expect(message).toContain(words.comment);
      expect(message).not.toContain('undefined');
    });
  });

  test('quotes the subject the notification is about', () => {
    expect(
      getNotificationMessages('COMMENT_ON_POST', 'en', FULL_PARAMS).message,
    ).toContain('Post Title');
    expect(
      getNotificationMessages('LIKE_ON_SHOWCASE', 'ko', FULL_PARAMS).message,
    ).toContain('Showcase Title');
    expect(
      getNotificationMessages('COMMENT_ON_FEATURE_REQUEST', 'ja', FULL_PARAMS).message,
    ).toContain('Feature Request Title');
  });
});

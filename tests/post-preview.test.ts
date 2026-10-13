import { describe, expect, test } from 'bun:test';
import { postPreview } from '../apps/web/src/lib/postPreview';

describe('post previews', () => {
  test('keeps prose and link labels without media or raw URLs', () => {
    expect(
      postPreview(
        '# Hello\n**Build together** with [docs](https://example.com/a_(b)).\n![image](https://example.com/image.png)\nhttps://youtu.be/example',
      ),
    ).toBe('Hello Build together with docs.');
  });
  test('omits executable markup, embeds, and fenced code', () => {
    expect(
      postPreview(
        '<p>Read this</p><script>hidden()</script><iframe src="x">hidden</iframe>\n```ts\nconst hidden = true;\n```\nThen this.',
      ),
    ).toBe('Read this Then this.');
  });
  test('preserves multilingual text, inline code, and word underscores', () => {
    expect(postPreview('플랫폼을 넘어. 日本語も。 `expo_router` &amp; React Native')).toBe(
      '플랫폼을 넘어. 日本語も。 expo_router & React Native',
    );
  });
  test('truncates without splitting an emoji surrogate pair', () => {
    expect(postPreview('Hi 👋 world', 4)).toBe('Hi 👋…');
  });
  test('returns an empty excerpt for a media-only post', () => {
    expect(postPreview('<img src="image.png"/>\n![demo](demo.png)')).toBe('');
  });
  test('handles repeated malformed openers and unclosed embedded content', () => {
    for (const opener of ['<', '[', '![']) {
      expect(postPreview(opener.repeat(40_000), 8)).toBe(`${opener.repeat(8).slice(0, 8)}…`);
    }
    expect(postPreview('Visible<script>'.repeat(10_000))).toBe('Visible');
  });
});

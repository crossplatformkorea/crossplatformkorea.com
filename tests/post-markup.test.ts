import { describe, expect, test } from 'bun:test';
import { preprocessPostMarkdown } from '../apps/web/src/lib/postMarkup';

describe('post Markdown with legacy HTML', () => {
  test('keeps emphasis working inside existing HTML paragraphs', () => {
    expect(preprocessPostMarkdown('<p>**함께** 만들고 *배워요*</p>')).toBe(
      '<p><strong>함께</strong> 만들고 <em>배워요</em></p>',
    );
  });
  test('never rewrites operators or example markup in fenced code', () => {
    const code = '```ts\nconst value = 2 ** 3;\nconst markdown = "**bold** *italic*";\n```';
    expect(preprocessPostMarkdown(code)).toBe(code);
  });
  test('preserves inline code and code blocks without a language label', () => {
    const code = '`**literal**`\n```\n*literal*\n```\n~~~\n**literal**\n~~~';
    expect(preprocessPostMarkdown(code)).toBe(code);
  });
  test('preserves raw HTML code examples', () => {
    const code = '<PRE><code>**literal** *literal*</code></PRE> and <code>*literal*</code>';
    expect(preprocessPostMarkdown(code)).toBe(code);
  });
  test('supports emphasis spanning inline code without changing its literals', () => {
    expect(preprocessPostMarkdown('**Use `2 ** 3` with `StyleSheet.create`**')).toBe(
      '<strong>Use `2 ** 3` with `StyleSheet.create`</strong>',
    );
  });
  test('handles long existing marker runs without colliding with literal content', () => {
    const prefix = '\u0000'.repeat(65_536);
    expect(preprocessPostMarkdown(`${prefix}**safe** \`**literal**\``)).toBe(
      `${prefix}<strong>safe</strong> \`**literal**\``,
    );
  });
  test('handles marker collisions and many code spans without amplifying placeholders', () => {
    const prefix = '\u0000'.repeat(4096) + 'CPK-CODE-0:CPK-CODE-1:';
    const code = '`**literal**` '.repeat(1000);
    expect(preprocessPostMarkdown(`${prefix}${code}**bold**`)).toBe(
      `${prefix}${code}<strong>bold</strong>`,
    );
  });
  test('protects unclosed code fences and repeated raw code openers', () => {
    const raw = '<pre>'.repeat(10_000) + '**literal**';
    expect(preprocessPostMarkdown(raw)).toBe(raw);
    expect(preprocessPostMarkdown('```ts\n**literal**')).toBe('```ts\n**literal**');
  });
  test('preserves original Unicode offsets when matching HTML code tags', () => {
    expect(preprocessPostMarkdown('İ<PRE>**literal**</PRE>**bold**')).toBe(
      'İ<PRE>**literal**</PRE><strong>bold</strong>',
    );
  });
  test('closes long fences only on matching fence lines', () => {
    const fenced = '````md\ninline ``` **literal**\n```\n```` trailing text\n**literal**\n`````';
    expect(preprocessPostMarkdown(`${fenced}\n\n**bold**`)).toBe(
      `${fenced}\n\n<strong>bold</strong>`,
    );
  });
  test('preserves tilde, nested, indented, and multi-backtick code', () => {
    for (const code of [
      '~~~md\n``` **literal**\n~~~',
      '> ```md\n> **literal**\n> ```',
      '    **literal**\n    *literal*',
      '``before ` **literal** after``',
    ])
      expect(preprocessPostMarkdown(code)).toBe(code);
  });
  test('treats HTML code tags inside a fence as literals without hiding later prose', () => {
    const fence = '```html\n<pre>**literal**\n```';
    expect(preprocessPostMarkdown(`${fence}\n\n**bold**`)).toBe(
      `${fence}\n\n<strong>bold</strong>`,
    );
  });
});

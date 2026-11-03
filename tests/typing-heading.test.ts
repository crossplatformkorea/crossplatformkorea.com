import { describe, expect, test } from 'bun:test';
import { createRequire } from 'node:module';
import type { ReactNode } from 'react';
import TypingHeading from '../apps/web/src/components/uis/TypingHeading';

// The docs workspace uses React 18; render web components with the web workspace's React 19.
const webRequire = createRequire(new URL('../apps/web/package.json', import.meta.url));
const { createElement } = webRequire('react') as typeof import('react');
const { renderToStaticMarkup } = webRequire('react-dom/server') as typeof import('react-dom/server');

function renderHeading(children: ReactNode) {
  return renderToStaticMarkup(createElement(TypingHeading, { children }));
}

describe('typing heading text and accessible name', () => {
  test('renders one text copy and provides the complete heading name', () => {
    const html = renderHeading('우리들의 이야기');
    expect(html).toContain('<h1 aria-label="우리들의 이야기">');
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('sr-only');
    expect(html.replace(/<[^>]*>/g, '')).toBe('우리들의 이야기');
  });

  test('preserves two-line formatting and names both lines without duplicate text', () => {
    const html = renderHeading([
      '플랫폼을 넘어.',
      createElement('br', { key: 'break' }),
      createElement(
        'span',
        { key: 'second', className: 'text-muted-foreground' },
        '함께, 더 멀리.',
      ),
    ]);
    expect(html).toContain('aria-label="플랫폼을 넘어. 함께, 더 멀리."');
    expect(html).toContain('<br/>');
    expect(html).toContain('class="text-muted-foreground"');
    expect(html.replace(/<[^>]*>/g, '')).toBe('플랫폼을 넘어.함께, 더 멀리.');
  });

  test('renders each joined emoji as one span and counts graphemes for timing', () => {
    const emoji = ['🇰🇷', '👍🏻', '👨‍👩‍👧'];
    const title = emoji.join('').repeat(8);
    const html = renderHeading(title);
    const characters = [...html.matchAll(/class="typing-character"[^>]*>([^<]*)<\/span>/g)];
    expect(characters.map((match) => match[1])).toEqual(Array(8).fill(emoji).flat());
    expect(html.replace(/<[^>]*>/g, '')).toBe(title);
    expect(html).toContain(`aria-label="${title}"`);
    const delays = [...html.matchAll(/animation-delay:([\d.]+)ms/g)].map((match) =>
      Number(match[1]),
    );
    expect(delays).toHaveLength(24);
    expect(delays[23]).toBeCloseTo(100 + (23 * 900) / 24);
  });
});

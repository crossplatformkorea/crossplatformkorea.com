import { describe, expect, test } from 'bun:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import { postHtmlPlugins } from '../apps/web/src/lib/postHtml';

const render = (content: string) =>
  renderToStaticMarkup(
    createElement(ReactMarkdown, {
      children: content,
      rehypePlugins: postHtmlPlugins,
    }),
  );

describe('post HTML safety and compatibility', () => {
  test('removes scripts, event handlers, dangerous URLs, styles, and srcdoc', () => {
    const html = render(
      '<script>unsafe()</script><style>hidden-css</style><p onclick="unsafe()" style="position:fixed">Hello <strong>world</strong></p><a href="javascript:unsafe()">link</a><iframe srcdoc="<script>unsafe()</script>"></iframe>',
    );
    expect(html).toContain('<p>Hello <strong>world</strong></p>');
    for (const unsafe of [
      'unsafe()',
      'hidden-css',
      'onclick',
      'style=',
      'javascript:',
      'srcdoc',
      '<iframe',
    ])
      expect(html).not.toContain(unsafe);
  });
  test('preserves trusted YouTube embeds and their responsive dimensions', () => {
    for (const host of ['www.youtube.com', 'www.youtube-nocookie.com']) {
      const html = render(
        `<iframe src="https://${host}/embed/98fP-hLipWI?start=10" title="Demo" width="560" height="315" allowfullscreen></iframe>`,
      );
      expect(html).toContain(`src="https://${host}/embed/98fP-hLipWI?start=10"`);
      expect(html).toContain('loading="lazy"');
      expect(html).toContain('width="560"');
    }
  });
  test('rejects untrusted iframe hosts, protocols, paths, and ports', () => {
    for (const src of [
      'https://youtube.com.evil.test/embed/98fP-hLipWI',
      'http://www.youtube.com/embed/98fP-hLipWI',
      'https://www.youtube.com/watch?v=98fP-hLipWI',
      'https://www.youtube.com:8443/embed/98fP-hLipWI',
      'https://evil.test/embed/98fP-hLipWI',
    ])
      expect(render(`<iframe src="${src}"></iframe>`)).not.toContain('<iframe');
  });
  test('keeps semantic legacy content and code literals', () => {
    const html = render(
      '<blockquote><p>Quote</p></blockquote><pre><code>2 ** 3</code></pre><table><tbody><tr><td>Cell</td></tr></tbody></table>',
    );
    for (const content of ['<blockquote>', '2 ** 3', '<table>', '<td>Cell</td>'])
      expect(html).toContain(content);
  });
  test('preserves local anchor targets while preventing DOM clobbering', () => {
    const html = render(
      '<h2 id="location">Title</h2><a href="#location">Jump</a><a href="#comments">Discussion</a>',
    );
    expect(html).toContain('id="user-content-location"');
    expect(html).toContain('href="#user-content-location"');
    expect(html).toContain('href="#comments"');
  });
  test('preserves legacy named anchor destinations', () => {
    const html = render('<a name="legacy-section"></a><p><a href="#legacy-section">Jump</a></p>');
    expect(html).toContain('name="user-content-legacy-section"');
    expect(html).toContain('href="#user-content-legacy-section"');
  });
});

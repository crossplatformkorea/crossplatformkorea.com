import { Plugin, ResolvedConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

interface RssOptions {
  hostname: string;
  title: string;
  description: string;
  language?: string;
  feedPath?: string; // default "/rss.xml"
  limit?: number; // default 30
}

/**
 * Escape XML-unsafe characters. Don't run this on content you intend to wrap
 * in CDATA — CDATA already handles everything except the literal `]]>` token.
 */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Make a string safe to embed inside `<![CDATA[…]]>`. RSS readers that see
 * `]]>` in the middle of a CDATA block will truncate the field.
 */
function cdata(s: string): string {
  return `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

/**
 * Convert a millisecond epoch timestamp to an RFC 822 date string (required
 * by RSS 2.0 `pubDate`/`lastBuildDate`).
 */
function rfc822(epochMs: number): string {
  return new Date(epochMs).toUTCString();
}

/**
 * Build a plain-text excerpt from post markdown: strip code fences, images,
 * HTML tags, link syntax, list markers, and other markdown punctuation, then
 * collapse whitespace and cap at 500 chars.
 */
function buildExcerpt(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/[#*_>`~]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500);
}

export function rssPlugin(options: RssOptions): Plugin {
  const {
    hostname,
    title,
    description,
    language = 'ko',
    feedPath = '/rss.xml',
    limit = 30,
  } = options;
  let resolvedConfig: ResolvedConfig | undefined;

  return {
    name: 'vite-plugin-rss',
    apply: 'build',
    configResolved(config) {
      resolvedConfig = config;
    },
    async writeBundle() {
      const feedUrl = `${hostname}${feedPath}`;
      const nowIso = new Date().toUTCString();

      const convexUrl = process.env.VITE_CONVEX_URL;
      if (!convexUrl) {
        console.warn('⚠️  RSS: VITE_CONVEX_URL not set, writing empty feed');
      }

      let items: string[] = [];
      let itemCount = 0;

      if (convexUrl) {
        try {
          const client = new ConvexHttpClient(convexUrl);
          const posts = await client.query(api.posts.query.getRecentPostsForRss, { limit });

          if (posts) {
            items = posts.map((post) => {
              const path = post.slug || post._id;
              const link = `${hostname}/post/${path}`;
              const excerpt = buildExcerpt(post.content || '');
              const pubDate = rfc822(post._creationTime);
              const categories = [post.category, ...(post.tags ?? [])]
                .filter(Boolean)
                .map((c) => `    <category>${escapeXml(c)}</category>`)
                .join('\n');
              const creator = post.authorName
                ? `    <dc:creator>${cdata(post.authorName)}</dc:creator>`
                : '';
              const enclosure = post.thumbnail
                ? `    <enclosure url="${escapeXml(post.thumbnail)}" type="image/jpeg" length="0" />`
                : '';

              return `  <item>
    <title>${cdata(post.title)}</title>
    <link>${escapeXml(link)}</link>
    <guid isPermaLink="true">${escapeXml(link)}</guid>
    <pubDate>${pubDate}</pubDate>
${categories}
${creator}
${enclosure}
    <description>${cdata(excerpt)}</description>
  </item>`;
            });
            itemCount = items.length;
            console.log(`✅ RSS: fetched ${itemCount} posts from Convex`);
          }
        } catch (err) {
          console.warn('⚠️  RSS: failed to fetch posts from Convex:', err);
        }
      }

      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${cdata(title)}</title>
    <link>${escapeXml(hostname)}</link>
    <description>${cdata(description)}</description>
    <language>${escapeXml(language)}</language>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${nowIso}</lastBuildDate>
    <generator>vite-plugin-rss</generator>
${items.join('\n')}
  </channel>
</rss>`;

      const resolvedOutDir = resolvedConfig?.build.outDir ?? 'dist';
      const outDir = path.isAbsolute(resolvedOutDir)
        ? resolvedOutDir
        : path.resolve(process.cwd(), resolvedOutDir);
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      fs.writeFileSync(path.join(outDir, feedPath.replace(/^\//, '')), rss);

      console.log(`✅ RSS: written to ${outDir}${feedPath} with ${itemCount} items`);
    },
  };
}

import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

interface SitemapOptions {
  hostname: string;
  exclude?: string[];
}

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

const STATIC_ROUTES: SitemapEntry[] = [
  { loc: '/', lastmod: '', changefreq: 'daily', priority: '1.0' },
  { loc: '/posts', lastmod: '', changefreq: 'hourly', priority: '0.9' },
  { loc: '/showcase', lastmod: '', changefreq: 'daily', priority: '0.8' },
  { loc: '/feature-request', lastmod: '', changefreq: 'weekly', priority: '0.6' },
];

function formatEntry(hostname: string, entry: SitemapEntry): string {
  return `  <url>
    <loc>${hostname}${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
}

export function sitemapPlugin(options: SitemapOptions): Plugin {
  const { hostname, exclude = [] } = options;
  let resolvedOutDir = 'dist';

  return {
    name: 'vite-plugin-sitemap',
    apply: 'build',
    configResolved(config) {
      // Respect a custom `build.outDir` so the sitemap lands wherever Vite
      // is actually emitting the bundle.
      resolvedOutDir = config.build.outDir;
    },
    async writeBundle() {
      const nowIso = new Date().toISOString();

      const staticEntries = STATIC_ROUTES.filter((r) => !exclude.includes(r.loc)).map((r) => ({
        ...r,
        lastmod: nowIso,
      }));

      const dynamicEntries: SitemapEntry[] = [];

      // Pull posts from Convex so every published post (by slug) shows up in
      // the sitemap served at /sitemap.xml. Falls back to just the static
      // routes if the Convex URL isn't configured at build time (e.g. when
      // someone runs `bun run build:web` locally without env vars).
      const convexUrl = process.env.VITE_CONVEX_URL;
      if (convexUrl) {
        try {
          const client = new ConvexHttpClient(convexUrl);
          const posts = await client.query(api.posts.query.getAllPostsForSitemap, {});
          if (posts) {
            for (const post of posts) {
              const pathSegment = post.slug || post._id;
              dynamicEntries.push({
                loc: `/post/${pathSegment}`,
                lastmod: new Date(post.updatedAt || post._creationTime).toISOString(),
                changefreq: 'weekly',
                priority: '0.7',
              });
            }
          }
          console.log(`✅ Sitemap: fetched ${dynamicEntries.length} posts from Convex`);
        } catch (err) {
          console.warn(
            '⚠️  Sitemap: failed to fetch posts from Convex, writing static-only sitemap:',
            err,
          );
        }
      } else {
        console.warn('⚠️  Sitemap: VITE_CONVEX_URL not set, writing static-only sitemap');
      }

      const allEntries = [...staticEntries, ...dynamicEntries];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries.map((e) => formatEntry(hostname, e)).join('\n')}
</urlset>`;

      // Write only to the resolved build output directory. We deliberately
      // avoid writing back into the source tree (`public/`) so builds don't
      // produce a tracked file diff on every run.
      const outDir = path.isAbsolute(resolvedOutDir)
        ? resolvedOutDir
        : path.resolve(process.cwd(), resolvedOutDir);
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap);

      console.log(`✅ Sitemap written to ${outDir} with ${allEntries.length} URLs`);
    },
  };
}

import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

interface SitemapOptions {
  hostname: string;
  dynamicRoutes?: string[];
  exclude?: string[];
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  lastmod?: string | Date;
}

export function sitemapPlugin(options: SitemapOptions): Plugin {
  const {
    hostname,
    dynamicRoutes = [],
    exclude = [],
    changefreq = 'weekly',
    priority = 0.7,
    lastmod = new Date().toISOString()
  } = options;

  return {
    name: 'vite-plugin-sitemap',
    writeBundle() {
      // Static routes - these are your main pages
      const staticRoutes = [
        '/',
        '/posts',
        '/showcase',
        '/profile',
        '/notifications',
        '/feature-requests',
        '/chatgpt',
      ];

      // Combine static and dynamic routes
      const allRoutes = [...staticRoutes, ...dynamicRoutes];

      // Filter out excluded routes
      const routes = allRoutes.filter(route => !exclude.includes(route));

      // Generate sitemap XML
      const lastmodString = typeof lastmod === 'string' ? lastmod : lastmod.toISOString();
      
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${hostname}${route}</loc>
    <lastmod>${lastmodString}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      // Write sitemap to public directory
      const publicDir = path.resolve(process.cwd(), 'public');
      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);

      console.log('✅ Sitemap generated successfully');
    }
  };
}
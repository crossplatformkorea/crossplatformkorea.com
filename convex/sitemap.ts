import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { HttpRouter } from "convex/server";

// Dynamic sitemap generation endpoint
export const registerSitemapRoutes = (http: HttpRouter) => {
  http.route({
  path: "/sitemap-dynamic.xml",
  method: "GET",
  handler: httpAction(async (ctx) => {
    try {
      // Fetch all posts with pagination
      const posts = await ctx.runQuery(api.posts.query.getAllPostsForSitemap);
      
      // Fetch all user profiles
      const users = await ctx.runQuery(api.users.query.getAllUsersForSitemap);
      
      // Generate sitemap XML
      const hostname = 'https://crossplatformkorea.com';
      
      let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      // Add static pages
      const staticPages = [
        { url: '/', changefreq: 'daily', priority: '1.0' },
        { url: '/posts', changefreq: 'hourly', priority: '0.9' },
        { url: '/showcase', changefreq: 'daily', priority: '0.8' },
        { url: '/profile', changefreq: 'weekly', priority: '0.5' },
        { url: '/notifications', changefreq: 'weekly', priority: '0.5' },
        { url: '/feature-requests', changefreq: 'weekly', priority: '0.6' },
        { url: '/chatgpt', changefreq: 'monthly', priority: '0.4' },
      ];
      
      for (const page of staticPages) {
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${hostname}${page.url}</loc>\n`;
        sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
        sitemap += `    <priority>${page.priority}</priority>\n`;
        sitemap += `  </url>\n`;
      }
      
      // Add all posts — prefer SEO-friendly slug over Convex ID when available
      if (posts) {
        for (const post of posts) {
          const pathSegment = post.slug || post._id;
          sitemap += `  <url>\n`;
          sitemap += `    <loc>${hostname}/post/${pathSegment}</loc>\n`;
          sitemap += `    <lastmod>${new Date(post.updatedAt || post._creationTime).toISOString()}</lastmod>\n`;
          sitemap += `    <changefreq>weekly</changefreq>\n`;
          sitemap += `    <priority>0.7</priority>\n`;
          sitemap += `  </url>\n`;
        }
      }
      
      // Add all user profiles
      if (users) {
        for (const user of users) {
          if (user.displayName) {
            sitemap += `  <url>\n`;
            sitemap += `    <loc>${hostname}/@${encodeURIComponent(user.displayName)}</loc>\n`;
            sitemap += `    <lastmod>${new Date(user._creationTime).toISOString()}</lastmod>\n`;
            sitemap += `    <changefreq>monthly</changefreq>\n`;
            sitemap += `    <priority>0.6</priority>\n`;
            sitemap += `  </url>\n`;
          }
        }
      }
      
      sitemap += '</urlset>';
      
      return new Response(sitemap, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      });
    } catch (error) {
      console.error('Error generating sitemap:', error);
      return new Response('Error generating sitemap', { status: 500 });
    }
  }),
});

  // Sitemap index that references both static and dynamic sitemaps
  http.route({
    path: "/sitemap.xml",
    method: "GET",
    handler: httpAction(async () => {
      const hostname = 'https://crossplatformkorea.com';
      
      let sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemapIndex += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      // Reference to dynamic sitemap
      sitemapIndex += '  <sitemap>\n';
      sitemapIndex += `    <loc>${hostname}/sitemap-dynamic.xml</loc>\n`;
      sitemapIndex += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      sitemapIndex += '  </sitemap>\n';
      
      sitemapIndex += '</sitemapindex>';
      
      return new Response(sitemapIndex, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }),
  });
};
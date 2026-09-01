import { httpRouter } from 'convex/server';
import { auth } from './auth';
import { chatStream } from './chats/action';
import { registerSitemapRoutes } from './sitemap';
import {
  createScheduledPost,
  getCategories as getAdminCategories,
  listPosts as listAdminPosts,
  optionsAdmin,
} from './posts/http';

const http = httpRouter();

// Chat streaming endpoint
http.route({
  path: '/chat-stream',
  method: 'POST',
  handler: chatStream,
});

// Handle CORS preflight for chat streaming
http.route({
  path: '/chat-stream',
  method: 'OPTIONS',
  handler: chatStream,
});

// Add auth routes
auth.addHttpRoutes(http);

// Add sitemap routes
registerSitemapRoutes(http);

// Authenticated admin/worker HTTP API (Bearer CPK_WORKER_TOKEN or Convex admin JWT)
http.route({ path: '/admin/categories', method: 'GET', handler: getAdminCategories });
http.route({ path: '/admin/categories', method: 'OPTIONS', handler: optionsAdmin });
http.route({ path: '/admin/posts', method: 'GET', handler: listAdminPosts });
http.route({ path: '/admin/posts', method: 'POST', handler: createScheduledPost });
http.route({ path: '/admin/posts', method: 'OPTIONS', handler: optionsAdmin });

export default http;

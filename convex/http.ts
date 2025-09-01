import { httpRouter } from 'convex/server';
import { auth } from './auth';
import { chatStream } from './chats/action';
import { registerSitemapRoutes } from './sitemap';

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

export default http;

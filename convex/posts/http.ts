import { getAuthUserId } from '@convex-dev/auth/server';
import { httpAction, ActionCtx } from '../_generated/server';
import { internal } from '../_generated/api';
import { Id } from '../_generated/dataModel';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  });
}

function corsNoContent(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

function extractBearer(request: Request): string {
  const header = request.headers.get('Authorization') ?? '';
  if (header.toLowerCase().startsWith('bearer ')) {
    return header.slice(7).trim();
  }
  return '';
}

async function sha256Equal(left: string, right: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [leftDigest, rightDigest] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(left)),
    crypto.subtle.digest('SHA-256', encoder.encode(right)),
  ]);
  const leftBytes = new Uint8Array(leftDigest);
  const rightBytes = new Uint8Array(rightDigest);
  let mismatch = 0;
  for (let i = 0; i < leftBytes.length; i++) {
    mismatch |= leftBytes[i] ^ rightBytes[i];
  }
  return mismatch === 0;
}

type AdminAuth =
  | { ok: true; mode: 'worker' }
  | { ok: true; mode: 'admin'; userId: Id<'users'> }
  | { ok: false; response: Response };

async function authorizeAdminRequest(ctx: ActionCtx, request: Request): Promise<AdminAuth> {
  const bearer = extractBearer(request);
  const workerToken = process.env.CPK_WORKER_TOKEN;

  if (workerToken && bearer && (await sha256Equal(bearer, workerToken))) {
    return { ok: true, mode: 'worker' };
  }

  const userId = await getAuthUserId(ctx);
  if (userId) {
    const admin = await ctx.runQuery(internal.posts.admin.getAdminByUserId, { userId });
    if (admin) {
      return { ok: true, mode: 'admin', userId };
    }
    return { ok: false, response: json({ error: 'Admin access required' }, 403) };
  }

  return { ok: false, response: json({ error: 'Unauthorized' }, 401) };
}

export const optionsAdmin = httpAction(async () => corsNoContent());

export const getCategories = httpAction(async (ctx, request) => {
  const auth = await authorizeAdminRequest(ctx, request);
  if (!auth.ok) return auth.response;
  const categories = await ctx.runQuery(internal.posts.admin.listCategories, {});
  return json({ categories });
});

export const listPosts = httpAction(async (ctx, request) => {
  const auth = await authorizeAdminRequest(ctx, request);
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const statusParam = url.searchParams.get('status');
  const status =
    statusParam === 'draft' || statusParam === 'scheduled' || statusParam === 'published'
      ? statusParam
      : undefined;
  const limitRaw = url.searchParams.get('limit');
  const parsedLimit = limitRaw ? Number(limitRaw) : undefined;

  const posts = await ctx.runQuery(internal.posts.admin.listAdminPosts, {
    status,
    limit: parsedLimit !== undefined && Number.isFinite(parsedLimit) ? parsedLimit : undefined,
  });
  return json({ posts });
});

export const createScheduledPost = httpAction(async (ctx, request) => {
  const auth = await authorizeAdminRequest(ctx, request);
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const content = typeof body.content === 'string' ? body.content : '';
  if (!title || !content.trim()) {
    return json({ error: 'title and content are required' }, 400);
  }

  let authorEmail = typeof body.authorEmail === 'string' ? body.authorEmail.trim() : '';
  if (!authorEmail && auth.mode === 'admin') {
    const email = await ctx.runQuery(internal.posts.admin.getAuthorEmailByUserId, {
      userId: auth.userId,
    });
    authorEmail = email ?? '';
  }
  if (!authorEmail) {
    return json({ error: 'authorEmail is required' }, 400);
  }

  const tags = Array.isArray(body.tags)
    ? body.tags.filter((tag): tag is string => typeof tag === 'string')
    : [];

  try {
    const created = await ctx.runMutation(internal.posts.admin.createCompanionPost, {
      authorEmail,
      title,
      content,
      category: typeof body.category === 'string' ? body.category : undefined,
      tags,
      thumbnail: typeof body.thumbnail === 'string' ? body.thumbnail : undefined,
      youtubeUrl: typeof body.youtubeUrl === 'string' ? body.youtubeUrl : undefined,
      publishAt: typeof body.publishAt === 'string' ? body.publishAt : undefined,
      status: typeof body.status === 'string' ? body.status : undefined,
    });
    return json(created, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create post';
    const status = message.startsWith('No user profile') ? 404 : 400;
    return json({ error: message }, status);
  }
});

import { v } from 'convex/values';
import { internalMutation, internalQuery } from '../_generated/server';
import { CATEGORIES } from '../constants';
import { internal } from '../_generated/api';
import { generateSlug } from '../utils/slug';
import {
  defaultCompanionPublishAt,
  isDueScheduledPost,
  normalizePublishAt,
  resolvePostStatus,
} from './visibility';

const postStatusValidator = v.union(
  v.literal('draft'),
  v.literal('scheduled'),
  v.literal('published'),
);

export const getAdminByUserId = internalQuery({
  args: { userId: v.id('users') },
  returns: v.union(
    v.object({
      _id: v.id('admins'),
      userId: v.id('users'),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query('admins')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();
    return admin;
  },
});

export const listCategories = internalQuery({
  args: {},
  handler: async () => {
    return CATEGORIES.map((category) => ({
      key: category.key,
      slug: category.slug,
      order: category.order,
    }));
  },
});

export const listAdminPosts = internalQuery({
  args: {
    status: v.optional(postStatusValidator),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 200);
    const posts = args.status
      ? await ctx.db
          .query('posts')
          .withIndex('by_status', (q) => q.eq('status', args.status))
          .order('desc')
          .take(limit)
      : await ctx.db.query('posts').order('desc').take(limit);

    return posts.map((post) => ({
      _id: post._id,
      _creationTime: post._creationTime,
      title: post.title,
      category: post.category,
      slug: post.slug,
      status: post.status ?? 'published',
      publishAt: post.publishAt,
      youtubeUrl: post.youtubeUrl,
      authorId: post.authorId,
      updatedAt: post.updatedAt,
      tags: post.tags,
    }));
  },
});

function thumbnailFromYoutube(url?: string): string | undefined {
  if (!url) return undefined;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
  }
  return undefined;
}

function withYoutubeLink(content: string, youtubeUrl?: string): string {
  if (!youtubeUrl) return content;
  if (content.includes(youtubeUrl)) return content;
  const trimmed = content.trim();
  return trimmed ? `${trimmed}\n\n${youtubeUrl}\n` : `${youtubeUrl}\n`;
}

export const createCompanionPost = internalMutation({
  args: {
    authorEmail: v.string(),
    category: v.optional(v.string()),
    title: v.string(),
    content: v.string(),
    tags: v.optional(v.array(v.string())),
    thumbnail: v.optional(v.string()),
    youtubeUrl: v.optional(v.string()),
    publishAt: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  returns: v.object({
    postId: v.id('posts'),
    status: postStatusValidator,
    publishAt: v.optional(v.string()),
    slug: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('by_email', (q) => q.eq('email', args.authorEmail))
      .unique();

    if (!profile) {
      throw new Error(`No user profile found for email: ${args.authorEmail}`);
    }

    const youtubeUrl = args.youtubeUrl?.trim() || undefined;
    const content = withYoutubeLink(args.content, youtubeUrl);
    const publishAt = args.publishAt
      ? normalizePublishAt(args.publishAt)
      : args.status === 'draft'
        ? undefined
        : defaultCompanionPublishAt();
    const status = resolvePostStatus({ status: args.status, publishAt });
    const category = args.category || 'INFO_SHARE';
    const thumbnail =
      args.thumbnail || thumbnailFromYoutube(youtubeUrl) || thumbnailFromYoutube(content);
    const slug = generateSlug(args.title);
    const now = new Date().toISOString();

    const postId = await ctx.db.insert('posts', {
      category,
      title: args.title,
      content,
      tags: args.tags ?? [],
      updatedAt: now,
      authorId: profile.userId,
      thumbnail,
      slug,
      status,
      publishAt,
      youtubeUrl,
    });

    if (status === 'published') {
      await ctx.scheduler.runAfter(0, internal.posts.action.sendSlackNotification, {
        postId,
        title: args.title,
        content,
        category,
      });
      await ctx.scheduler.runAfter(0, internal.posts.action.sendDiscordNotification, {
        postId,
        title: args.title,
        content,
        category,
      });
    }

    return { postId, status, publishAt, slug };
  },
});

export const publishDuePosts = internalMutation({
  args: {},
  returns: v.object({
    published: v.number(),
    scanned: v.number(),
  }),
  handler: async (ctx) => {
    const nowMs = Date.now();
    const scheduled = await ctx.db
      .query('posts')
      .withIndex('by_status', (q) => q.eq('status', 'scheduled'))
      .take(100);

    let published = 0;
    for (const post of scheduled) {
      if (!isDueScheduledPost(post, nowMs)) {
        continue;
      }
      await ctx.db.patch(post._id, {
        status: 'published',
        updatedAt: new Date(nowMs).toISOString(),
      });
      await ctx.scheduler.runAfter(0, internal.posts.action.sendSlackNotification, {
        postId: post._id,
        title: post.title,
        content: post.content,
        category: post.category,
      });
      await ctx.scheduler.runAfter(0, internal.posts.action.sendDiscordNotification, {
        postId: post._id,
        title: post.title,
        content: post.content,
        category: post.category,
      });
      published += 1;
    }

    return { published, scanned: scheduled.length };
  },
});

export const getAuthorEmailByUserId = internalQuery({
  args: { userId: v.id('users') },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .unique();
    return profile?.email ?? null;
  },
});

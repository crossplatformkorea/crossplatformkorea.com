import { v } from 'convex/values';
import { query } from '../_generated/server';
import { CATEGORIES } from '../constants';
import { paginationOptsValidator } from 'convex/server';
import { getAuthUserId } from '@convex-dev/auth/server';

// Define a common post object validator for consistent return types
const postObjectValidator = v.object({
  _id: v.id('posts'),
  _creationTime: v.number(),
  category: v.string(),
  title: v.string(),
  content: v.string(),
  tags: v.array(v.string()),
  updatedAt: v.string(),
  startDate: v.optional(v.string()),
  endDate: v.optional(v.string()),
  authorId: v.optional(v.id('users')),
  thumbnail: v.optional(v.string()), // 썸네일 URL
  slug: v.optional(v.string()), // SEO-friendly URL slug
  likeCount: v.optional(v.number()),
  likedBy: v.optional(v.array(v.id('users'))),
  viewCount: v.optional(v.number()),
  commentCount: v.optional(v.number()), // 댓글 수 validator 추가
  mentions: v.optional(v.array(v.id('users'))), // 멘션된 사용자들
});

// Get all posts for sitemap generation
export const getAllPostsForSitemap = query({
  args: {},
  handler: async (ctx) => {
    // Fetch all posts, but only return necessary fields for sitemap
    const posts = await ctx.db
      .query('posts')
      .order('desc')
      .collect();
    
    return posts.map(post => ({
      _id: post._id,
      _creationTime: post._creationTime,
      updatedAt: post.updatedAt,
      slug: post.slug,
    }));
  },
});

// Check if user has liked a post
export const hasLiked = query({
  args: { postId: v.id('posts') },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }

    const post = await ctx.db.get(args.postId);
    if (!post || !post.likedBy) {
      return false;
    }

    return post.likedBy.some((id) => id === userId);
  },
});

// Get all categories from the shared constants file - moved from posts.ts
export const getCategories = query({
  args: {},
  returns: v.array(
    v.object({
      key: v.string(),
      icon: v.string(),
      slug: v.string(),
      order: v.number(),
    }),
  ),
  handler: async () => {
    return CATEGORIES;
  },
});

// Get posts by category key (changed from ID to key) - moved from posts.ts
export const getPostsByCategory = query({
  args: {
    paginationOpts: paginationOptsValidator,
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const query = ctx.db.query('posts');

    if (args.category !== 'all') {
      return await query
        .withIndex('by_category', (q) => q.eq('category', args.category))
        .order('desc')
        .paginate(args.paginationOpts);
    }

    return await query.order('desc').paginate(args.paginationOpts);
  },
});

// Get category by slug - use shared categories constant - moved from posts.ts
export const getCategoryBySlug = query({
  args: { slug: v.string() },
  returns: v.union(
    v.object({
      key: v.string(),
      icon: v.string(),
      slug: v.string(),
      order: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    // Find the category in the shared array
    const category = CATEGORIES.find((cat) => cat.slug === args.slug);
    return category || null;
  },
});

// Get a single post by ID
export const getById = query({
  args: { id: v.id('posts') },
  returns: v.union(postObjectValidator, v.null()),
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) return null;

    return post;
  },
});

// Get a single post by slug, falling back to Convex ID for legacy URLs.
// The route accepts `/post/:slugOrId` so this one query covers both.
export const getBySlugOrId = query({
  args: { slugOrId: v.string() },
  returns: v.union(postObjectValidator, v.null()),
  handler: async (ctx, args) => {
    // Try slug lookup first (the common, SEO-friendly path).
    const bySlug = await ctx.db
      .query('posts')
      .withIndex('by_slug', (q) => q.eq('slug', args.slugOrId))
      .unique();

    if (bySlug) return bySlug;

    // Fall back to treating the param as a Convex document ID. Validate the
    // format before calling `db.get` to avoid the runtime error Convex raises
    // on malformed IDs.
    const normalizedId = ctx.db.normalizeId('posts', args.slugOrId);
    if (!normalizedId) return null;

    const byId = await ctx.db.get(normalizedId);
    return byId ?? null;
  },
});

// Get most recent posts
export const getRecentPosts = query({
  args: { limit: v.number() },
  returns: v.array(postObjectValidator),
  handler: async (ctx, args) => {
    // Use the by_title index to get posts sorted by _creationTime
    const posts = await ctx.db
      .query('posts')
      .withIndex('by_creation_time')
      .order('desc')
      .take(args.limit);

    return posts;
  },
});

// Get all tags (for filtering)
export const getTags = query({
  returns: v.array(v.string()),
  handler: async (ctx) => {
    const posts = await ctx.db.query('posts').collect();
    // Extract unique tags from all posts
    const tagsSet = new Set<string>();

    for (const post of posts) {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag) => tagsSet.add(tag));
      }
    }

    return Array.from(tagsSet).sort();
  },
});

// Get posts by author
export const getPostsByAuthor = query({
  args: {
    authorId: v.id('users'), // Changed back to v.id('users') to match posts table schema
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id('posts'),
      _creationTime: v.number(),
      title: v.string(),
      content: v.string(),
      category: v.string(),
      tags: v.array(v.string()),
      authorId: v.optional(v.id('users')),
      thumbnail: v.optional(v.string()),
      commentCount: v.optional(v.number()),
      likeCount: v.optional(v.number()),
      viewCount: v.optional(v.number()),
      updatedAt: v.optional(v.string()),
      likedBy: v.optional(v.array(v.id('users'))),
      startDate: v.optional(v.string()),
      endDate: v.optional(v.string()),
      mentions: v.optional(v.array(v.id('users'))),
    }),
  ),
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query('posts')
      .withIndex('by_author', (q) => q.eq('authorId', args.authorId))
      .order('desc')
      .take(args.limit || 10);

    return posts;
  },
});

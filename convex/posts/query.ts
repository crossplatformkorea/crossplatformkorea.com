import { v } from 'convex/values';
import { query } from '../_generated/server';
import { CATEGORIES } from '../constants';
import { paginationOptsValidator } from 'convex/server';
import { Doc } from '../_generated/dataModel';

// Define a utility function to transform post documents with proper typing
function transformPostDoc(post: Doc<'posts'>) {
  return {
    ...post,
    createdAt: new Date(post._creationTime).toISOString(), // Add createdAt based on _creationTime
  };
}

// Define a common post object validator for consistent return types
const postObjectValidator = v.object({
  _id: v.id('posts'),
  _creationTime: v.number(),
  category: v.string(),
  title: v.string(),
  content: v.string(),
  tags: v.array(v.string()),
  updatedAt: v.string(),
  createdAt: v.string(),
  startDate: v.optional(v.string()),
  endDate: v.optional(v.string()),
  authorId: v.optional(v.id('users')),
});

// Define the pagination result validator
const paginationResultValidator = v.object({
  page: v.array(postObjectValidator),
  isDone: v.boolean(),
  continueCursor: v.string(),
  pageStatus: v.optional(v.union(v.null(), v.string())),
  splitCursor: v.optional(v.union(v.null(), v.string())),
});

// Get all categories from the shared constants file
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

// Get posts by category with pagination support
export const getPostsByCategory = query({
  args: {
    category: v.string(),
    paginationOpts: v.optional(paginationOptsValidator),
  },
  returns: paginationResultValidator,
  handler: async (ctx, args) => {
    const { category, paginationOpts = { numItems: 20, cursor: null } } = args;

    let postsQuery;

    if (category.toLowerCase() === 'all') {
      // Use the by_title index for queries that need to be ordered by creation time
      // _creationTime is automatically added as an ordering field
      postsQuery = ctx.db.query('posts').withIndex('by_creation_time').order('desc');
    } else {
      // Use the category index for filtered queries
      postsQuery = ctx.db
        .query('posts')
        .withIndex('by_category')
        .filter((q) => q.eq(q.field('category'), category))
        .order('desc');
    }

    const paginationResult = await postsQuery.paginate(paginationOpts);

    return {
      ...paginationResult,
      page: paginationResult.page.map(transformPostDoc),
    };
  },
});

// Get category by slug - use shared categories constant
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
export const getPostById = query({
  args: { postId: v.id('posts') },
  returns: v.union(postObjectValidator, v.null()),
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return null;

    return transformPostDoc(post);
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

    return posts.map(transformPostDoc);
  },
});

// Get all tags (for filtering)
export const getTags = query({
  args: {},
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

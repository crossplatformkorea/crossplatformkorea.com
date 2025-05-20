import { query } from './_generated/server';
import { v } from 'convex/values';
import { CATEGORIES } from './constants';
import { paginationOptsValidator } from 'convex/server';

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

// Get posts by category key (changed from ID to key)
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

// Get all tags
export const getTags = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('tags'),
      name: v.string(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query('tags').collect();
  },
});

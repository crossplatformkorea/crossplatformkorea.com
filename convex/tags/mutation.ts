import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "../_generated/server";

// Create a new tag
export const createTag = mutation({
  args: {
    name: v.string(),
  },
  returns: v.id("tags"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Check if tag already exists
    const existingTag = await ctx.db
      .query("tags")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existingTag) {
      return existingTag._id;
    }

    return await ctx.db.insert("tags", {
      name: args.name,
    });
  },
});

// Get all available tags
export const getAllTags = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("tags"),
      name: v.string(),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query("tags").collect();
  },
});

// Add tags to a post
export const addTagsToPost = mutation({
  args: {
    postId: v.id("posts"),
    tagNames: v.array(v.string()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Verify post exists
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Get existing tags from the post
    const existingTags = post.tags || [];

    // Combine existing tags with new ones and remove duplicates
    const updatedTags = [...new Set([...existingTags, ...args.tagNames])];

    // Update the post with the new tags
    await ctx.db.patch(args.postId, {
      tags: updatedTags,
      updatedAt: new Date().toISOString(),
    });

    // Ensure all tags exist in the tags table
    for (const tagName of args.tagNames) {
      const existingTag = await ctx.db
        .query("tags")
        .withIndex("by_name", (q) => q.eq("name", tagName))
        .first();

      if (!existingTag) {
        await ctx.db.insert("tags", { name: tagName });
      }
    }

    return true;
  },
});

// Add tags to a user profile
export const addTagsToUserProfile = mutation({
  args: {
    tagNames: v.array(v.string()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user profile
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!userProfile) {
      throw new Error("User profile not found");
    }

    // If the userProfile schema doesn't have tags yet, we need to add it
    // For now, we'll track it separately

    // Ensure all tags exist in the tags table
    for (const tagName of args.tagNames) {
      const existingTag = await ctx.db
        .query("tags")
        .withIndex("by_name", (q) => q.eq("name", tagName))
        .first();

      if (!existingTag) {
        await ctx.db.insert("tags", { name: tagName });
      }
    }

    return true;
  },
});

// Remove a tag from a post
export const removeTagFromPost = mutation({
  args: {
    postId: v.id("posts"),
    tagName: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Verify post exists
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Filter out the tag to remove
    const updatedTags = post.tags.filter(tag => tag !== args.tagName);

    // Update the post with the filtered tags
    await ctx.db.patch(args.postId, {
      tags: updatedTags,
      updatedAt: new Date().toISOString(),
    });

    return true;
  },
});

// Search tags
export const searchTags = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id("tags"),
      name: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const query = args.query.toLowerCase();

    // Simple prefix search on tags
    const tags = await ctx.db.query("tags").collect();

    return tags
      .filter(tag => tag.name.toLowerCase().includes(query))
      .slice(0, limit);
  },
});

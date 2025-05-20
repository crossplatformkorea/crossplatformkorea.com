import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";

// Create a new post
export const createPost = mutation({
  args: {
    category: v.string(), // Category key instead of ID
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  returns: v.id("posts"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const now = new Date().toISOString();

    return await ctx.db.insert("posts", {
      category: args.category,
      title: args.title,
      content: args.content,
      tags: args.tags,
      updatedAt: now,
      startDate: args.startDate,
      endDate: args.endDate,
    });
  },
});

// Update an existing post
export const updatePost = mutation({
  args: {
    postId: v.id("posts"),
    category: v.optional(v.string()),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
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

    // Optional: Check if user has permission to update this post

    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (args.category !== undefined) updateData.category = args.category;
    if (args.title !== undefined) updateData.title = args.title;
    if (args.content !== undefined) updateData.content = args.content;
    if (args.tags !== undefined) updateData.tags = args.tags;
    if (args.startDate !== undefined) updateData.startDate = args.startDate;
    if (args.endDate !== undefined) updateData.endDate = args.endDate;

    await ctx.db.patch(args.postId, updateData);
    return true;
  },
});

// Delete a post
export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
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

    // Optional: Check if user has permission to delete this post

    await ctx.db.delete(args.postId);
    return true;
  },
});

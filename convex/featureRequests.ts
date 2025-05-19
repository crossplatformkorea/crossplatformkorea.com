import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get feature requests with pagination
export const getAll = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    // Use a simple query with filter to exclude soft-deleted items
    const results = await ctx.db
      .query("featureRequests")
      .filter((q) => q.eq(q.field("deletedAt"), undefined)) // Filter out soft-deleted requests
      .paginate(args.paginationOpts);

    // Sort the results after fetching (for now)
    // Note: this isn't ideal for large datasets but will work for development
    return {
      ...results,
      page: results.page.sort((a, b) => b.votes - a.votes),
    };
  },
});

// Add a new feature request
export const add = mutation({
  args: {
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const { title, description } = args;

    // Get the user's identity
    const userId = await getAuthUserId(ctx);
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || !userId) {
      throw new Error("You must be logged in to request a feature");
    }

    // Extract user information from identity
    // Change null to undefined to match the expected type
    const userEmail = identity.email || undefined;

    console.log("Server received feature request:", {
      title,
      description,
      userId,
      userEmail,
    });

    // Validate inputs
    if (title.trim().length < 3) {
      console.error("Title too short");
      throw new Error("Title must be at least 3 characters long");
    }

    try {
      // Log the database object we're trying to create
      const featureRequestData = {
        title,
        description,
        votes: 1,
        status: "requested",
        userId,
        userEmail, // This will now be string | undefined instead of string | null
        // Track who already voted (starting with the creator)
        voterIds: [userId],
      };
      console.log("Attempting to insert:", featureRequestData);

      // Create new feature request
      const id = await ctx.db.insert("featureRequests", featureRequestData);

      console.log("Feature request created with ID:", id);

      return { id, success: true };
    } catch (error) {
      console.error("Error creating feature request:", error);
      throw error;
    }
  },
});

// Vote on a feature request
export const vote = mutation({
  args: { id: v.id("featureRequests") },
  handler: async (ctx, args) => {
    const { id } = args;

    // Get the user's identity
    const identity = await ctx.auth.getUserIdentity();
    const userId = await getAuthUserId(ctx);

    if (!identity || !userId) {
      throw new Error("You must be logged in to vote");
    }

    // Get the current feature request
    const request = await ctx.db.get(id);
    if (!request) {
      throw new Error("Feature request not found");
    }

    // Check if user has already voted
    const voterIds = request.voterIds || [];
    if (voterIds.includes(userId)) {
      throw new Error("You have already voted for this feature");
    }

    // Increment vote count and add user to voters
    await ctx.db.patch(id, {
      votes: request.votes + 1,
      voterIds: [...voterIds, userId],
    });

    return { success: true };
  },
});

// Add a function to soft delete a feature request
export const deleteFeatureRequest = mutation({
  args: { id: v.id("featureRequests") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const { id } = args;

    // Get the user's identity
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("You must be logged in to delete a feature request");
    }

    // Get the current feature request
    const request = await ctx.db.get(id);
    if (!request) {
      throw new Error("Feature request not found");
    }

    // Check if user is the creator of the feature request
    if (request.userId !== userId) {
      throw new Error("You can only delete your own feature requests");
    }

    // Soft delete by setting deletedAt timestamp
    await ctx.db.patch(id, {
      deletedAt: Date.now(),
    });

    return true;
  },
});

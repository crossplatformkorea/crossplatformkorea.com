import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Service status constants.
 * These values must match the schema definition in schema.ts
 */
export const SERVICE_STATUS = {
  PREPARING: "preparing",
  ONLINE: "online",
  UNDER_CONSTRUCTION: "underConstruction",
} as const;

// Create validator for service status to ensure type safety
export const serviceStatusUnion = v.union(
  v.literal(SERVICE_STATUS.PREPARING),
  v.literal(SERVICE_STATUS.ONLINE),
  v.literal(SERVICE_STATUS.UNDER_CONSTRUCTION)
);

/**
 * Get the current service status
 * This is a public query that anyone can access
 */
export const getServiceStatus = query({
  args: {},
  returns: v.object({
    status: serviceStatusUnion,
    updatedAt: v.number(),
  }),
  handler: async (ctx) => {
    // Check if the current user is an admin
    const userId = await getAuthUserId(ctx);
    
    // If user is authenticated, check if they're an admin
    if (userId) {
      const adminRecord = await ctx.db
        .query("admins")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .unique()
        .catch(() => null);
      
      // If user is an admin, always return online status
      if (adminRecord) {
        return {
          status: SERVICE_STATUS.ONLINE,
          updatedAt: Date.now(),
        };
      }
    }
    
    // Get the most recent status
    const statusRecords = await ctx.db
      .query("app")
      .order("desc")
      .take(1);

    // If no status exists yet, return online as default
    if (statusRecords.length === 0) {
      return {
        status: SERVICE_STATUS.ONLINE,
        updatedAt: Date.now(),
      };
    }

    // Return the status
    return {
      status: statusRecords[0].status,
      updatedAt: statusRecords[0].updatedAt,
    };
  },
});

/**
 * Update the service status
 * Only admins should be able to call this function
 */
export const updateServiceStatus = mutation({
  args: {
    status: serviceStatusUnion,
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    // Get the user's identity
    const userId = await getAuthUserId(ctx);
    
    if (!userId) {
      throw new Error("Authentication required");
    }
    
    // TODO: Add proper admin check here
    // For now, we're just requiring authentication
    // In a real application, you would check if the user is an admin
    
    // Insert the new status
    await ctx.db.insert("app", {
      status: args.status,
      updatedAt: Date.now(),
    });
    
    return true;
  },
});

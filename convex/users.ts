import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { v4 as uuidv4 } from "uuid";

// Replace getUser with currentUser
export const currentUser = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      profile: v.optional(
        v.object({
          _id: v.id("userProfiles"),
          _creationTime: v.number(),
          userId: v.id("users"),
          email: v.string(),
          displayName: v.string(),
          description: v.optional(v.string()),
          avatarUrlId: v.optional(v.id("_storage")),
          deletedAt: v.optional(v.string()),
        })
      ),
      // Add these fields directly to the user object for easier access
      displayName: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    try {
      const userId = await getAuthUserId(ctx);
      // Return null if not authenticated
      if (!userId) return null;

      const user = await ctx.db.get(userId as Id<"users">);
      // Return null if user not found
      if (!user) return null;

      // Get the user profile
      const profile = await ctx.db
        .query("userProfiles")
        .withIndex("by_user", (q) => q.eq("userId", userId as Id<"users">))
        .first();

      // Get avatar URL if available
      let avatarUrl: string | null = null;
      if (profile?.avatarUrlId) {
        try {
          avatarUrl = await ctx.storage.getUrl(profile.avatarUrlId);
        } catch (error) {
          console.error("Failed to fetch avatar URL:", error);
        }
      }

      // Return user with profile and convenient access fields
      return {
        ...user,
        profile: profile || undefined,
        displayName: profile?.displayName,
        avatarUrl: avatarUrl || undefined,
      };
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      return null;
    }
  },
});

// Create or update a user profile after authentication
export const createOrUpdateUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.string(),
  },
  returns: v.id("userProfiles"),
  handler: async (ctx, args) => {
    // Get authenticated user ID using getAuthUserId
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user profile already exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId as Id<"users">))
      .first();

    if (existingProfile) {
      // Update existing profile if name is provided
      if (args.name) {
        await ctx.db.patch(existingProfile._id, {
          displayName: args.name,
        });
      }
      return existingProfile._id;
    }

    // Generate a unique display name if not provided
    async function generateUniqueNickname(): Promise<string> {
      let nickname = "";
      let isUnique = false;

      while (!isUnique) {
        nickname = "User_" + uuidv4().split("-")[0];

        const existingWithName = await ctx.db
          .query("userProfiles")
          .filter((q) => q.eq(q.field("displayName"), nickname))
          .first();

        if (!existingWithName) {
          isUnique = true;
        }
      }

      return nickname;
    }

    // Generate unique display name if not provided
    const displayName = args.name || (await generateUniqueNickname());

    // Create a new user profile
    const profileId = await ctx.db.insert("userProfiles", {
      userId: userId as Id<"users">,
      email: args.email,
      displayName,
      description: "",
    });

    return profileId;
  },
});

// Get user profile by user ID
export const getProfile = query({
  args: { userId: v.id("users") },
  returns: v.union(
    v.object({
      _id: v.id("userProfiles"),
      _creationTime: v.number(),
      userId: v.id("users"),
      email: v.string(),
      displayName: v.string(),
      description: v.optional(v.string()),
      avatarUrlId: v.optional(v.id("_storage")),
      deletedAt: v.optional(v.string()), // Added to match schema
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    return profile;
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    displayName: v.optional(v.string()),
    description: v.optional(v.string()),
    avatarUrlId: v.optional(v.id("_storage")),
  },
  returns: v.id("userProfiles"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId as Id<"users">))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Build update object with only provided fields
    const updateFields: Partial<Doc<"userProfiles">> = {};
    if (args.displayName !== undefined)
      updateFields.displayName = args.displayName;
    if (args.description !== undefined)
      updateFields.description = args.description;
    if (args.avatarUrlId !== undefined)
      updateFields.avatarUrlId = args.avatarUrlId;

    await ctx.db.patch(profile._id, updateFields);

    return profile._id;
  },
});

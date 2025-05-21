import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { serviceStatusUnion } from "./serviceStatus";

export default defineSchema({
  ...authTables,
  admins: defineTable({
    userId: v.id("users"),
  }).index("by_userId", ["userId"]),
  posts: defineTable({
    category: v.string(), // Instead of categoryId reference, use category key as string
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    updatedAt: v.string(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    authorId: v.optional(v.id("users")), // Add author reference
  })
    .index("by_category", ["category"])
    .index("by_title", ["title"]), // Create a proper index for sorting by title (or any other field) that can be used for getting recent posts
  userProfiles: defineTable({
    userId: v.id("users"),
    email: v.string(),
    displayName: v.string(),
    name: v.optional(v.string()), // 실명
    organization: v.optional(v.string()), // 소속
    description: v.optional(v.string()),
    avatarUrlId: v.optional(v.id("_storage")),
    deletedAt: v.optional(v.string()),
    // New fields
    githubId: v.optional(v.string()),
    socialLinks: v.optional(v.array(v.string())), // Array of URLs
    tags: v.optional(v.array(v.string())), // Skills, interests, or status tags
    lookingFor: v.optional(v.string()), // Who they want to connect with
    expectations: v.optional(v.string()), // What they're expecting from the community
  })
    .index("by_email", ["email"])
    .index("by_user", ["userId"])
    .index("by_display_name", ["displayName"])
    .index("by_githubId", ["githubId"]),
  featureRequests: defineTable({
    title: v.string(),
    description: v.string(),
    votes: v.number(),
    status: v.string(), // "requested", "planned", "in-progress", "completed"
    userId: v.string(),
    userEmail: v.optional(v.string()), // Optional user identification
    voterIds: v.array(v.string()),
    deletedAt: v.optional(v.number()), // Add deletedAt field for soft deletion
  }).index("by_votes", ["votes"]),
  app: defineTable({
    status: serviceStatusUnion,
    updatedAt: v.number(),
  }).index("by_updatedAt", ["updatedAt"]),
  tags: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),
});

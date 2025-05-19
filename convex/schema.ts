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
    title: v.string(),
    content: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_createdAt", ["createdAt"]),
  userProfiles: defineTable({
    userId: v.id("users"),
    email: v.string(),
    displayName: v.string(),
    description: v.optional(v.string()),
    avatarUrlId: v.optional(v.id("_storage")),
    deletedAt: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_user", ["userId"])
    .index("by_display_name", ["displayName"]),
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
});

import { defineSchema, defineTable } from 'convex/server';
import { authTables } from '@convex-dev/auth/server';
import { v } from 'convex/values';

export default defineSchema({
  ...authTables,
  admins: defineTable({
    userId: v.id('users'),
  }).index('by_userId', ['userId']),
  posts: defineTable({
    category: v.string(), // Instead of categoryId reference, use category key as string
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    updatedAt: v.string(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    authorId: v.optional(v.id('users')), // Add author reference
    // 통계 필드 모음
    likeCount: v.optional(v.number()),
    likedBy: v.optional(v.array(v.id('users'))),
    viewCount: v.optional(v.number()),
    commentCount: v.optional(v.number()), // 댓글 수 필드 추가
  })
    .index('by_category', ['category'])
    .index('by_title', ['title']) // Create a proper index for sorting by title (or any other field) that can be used for getting recent posts
    .index('by_author', ['authorId']),
  userProfiles: defineTable({
    userId: v.id('users'),
    email: v.string(),
    displayName: v.string(),
    name: v.optional(v.string()), // 실명
    organization: v.optional(v.string()), // 소속
    description: v.optional(v.string()),
    avatarUrl: v.optional(v.string()), // Direct URL instead of storage ID
    deletedAt: v.optional(v.string()),
    githubId: v.optional(v.string()),
    socialLinks: v.optional(v.array(v.string())), // Array of URLs
    tags: v.optional(v.array(v.string())), // Skills, interests, or status tags
    lookingFor: v.optional(v.string()), // Who they want to connect with
    expectations: v.optional(v.string()), // What they're expecting from the community
  })
    .index('by_email', ['email'])
    .index('by_user', ['userId'])
    .index('by_display_name', ['displayName'])
    .index('by_githubId', ['githubId']),
  featureRequests: defineTable({
    title: v.string(),
    description: v.string(),
    votes: v.number(),
    status: v.string(), // "requested", "planned", "in-progress", "completed"
    userId: v.string(),
    userEmail: v.optional(v.string()), // Optional user identification
    voterIds: v.array(v.string()),
    deletedAt: v.optional(v.number()), // Add deletedAt field for soft deletion
  }).index('by_votes', ['votes']),
  files: defineTable({
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: v.string(),
    userId: v.id('users'),
    postId: v.optional(v.id('posts')), // Optional reference to a post
    url: v.optional(v.string()), // Add URL field to store the direct access URL
  })
    .index('by_user', ['userId'])
    .index('by_storage_id', ['storageId']),
  // 댓글 테이블 추가
  comments: defineTable({
    postId: v.id('posts'),
    authorId: v.id('users'),
    content: v.string(),
    updatedAt: v.optional(v.string()),
  })
    .index('by_post', ['postId'])
    .index('by_author', ['authorId']),
});

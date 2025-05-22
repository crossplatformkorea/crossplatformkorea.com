import { getAuthUserId } from '@convex-dev/auth/server';
import { query } from '../_generated/server';
import { v } from 'convex/values'; // Add missing import for validators
import { Id } from '../_generated/dataModel';

// Replace getUser with currentUser
export const currentUser = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id('users'),
      _creationTime: v.number(),
      // Fields from various OAuth providers
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      // GitHub specific fields
      image: v.optional(v.string()),
      // User profile from our database
      profile: v.optional(
        v.object({
          _id: v.id('userProfiles'),
          _creationTime: v.number(),
          userId: v.id('users'),
          email: v.string(),
          displayName: v.string(),
          name: v.optional(v.string()), // Fixed extra parenthesis
          organization: v.optional(v.string()),
          description: v.optional(v.string()),
          avatarUrl: v.optional(v.string()),
          deletedAt: v.optional(v.string()),
          githubId: v.optional(v.string()),
          socialLinks: v.optional(v.array(v.string())),
          tags: v.optional(v.array(v.string())),
          lookingFor: v.optional(v.string()),
          expectations: v.optional(v.string()),
        }),
      ),
      // Convenience fields
      displayName: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    try {
      const userId = await getAuthUserId(ctx);
      // Return null if not authenticated
      if (!userId) return null;

      const user = await ctx.db.get(userId as Id<'users'>);
      // Return null if user not found
      if (!user) return null;

      // Get the user profile
      const profile = await ctx.db
        .query('userProfiles')
        .withIndex('by_user', (q) => q.eq('userId', userId as Id<'users'>))
        .first();

      // No need to fetch storage URL - just use the stored URL directly
      return {
        ...user,
        profile: profile || undefined,
        displayName: profile?.displayName,
        avatarUrl: profile?.avatarUrl || undefined,
      };
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      return null;
    }
  },
});

// Get user profile by user ID
export const getProfile = query({
  args: { userId: v.id('users') },
  returns: v.union(
    v.object({
      _id: v.id('userProfiles'),
      _creationTime: v.number(),
      userId: v.id('users'),
      email: v.string(),
      displayName: v.string(),
      description: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
      deletedAt: v.optional(v.string()),
      githubId: v.optional(v.string()),
      socialLinks: v.optional(v.array(v.string())),
      tags: v.optional(v.array(v.string())),
      lookingFor: v.optional(v.string()),
      expectations: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();

    return profile;
  },
});

// 사용자 통계 조회 - moved from stats.ts
export const getUserStats = query({
  args: { userId: v.optional(v.id('users')) },
  returns: v.object({
    postCount: v.number(),
    likeCount: v.number(),
    commentCount: v.number(),
  }),
  handler: async (ctx, args) => {
    // 사용자 ID 가져오기 (인자로 전달되지 않은 경우 현재 인증된 사용자)
    const userId = args.userId || (await getAuthUserId(ctx));
    if (!userId) {
      throw new Error('User ID not provided');
    }

    // 작성한 포스트 수 조회
    const posts = await ctx.db
      .query('posts')
      .withIndex('by_author', (q) => q.eq('authorId', userId))
      .collect();

    // 받은 좋아요 총합 계산
    const totalLikes = posts.reduce(
      (sum, post) => sum + (post.likeCount || 0),
      0,
    );

    // 받은 댓글 수 계산
    let commentCount = 0;
    for (const post of posts) {
      const comments = await ctx.db
        .query('comments')
        .withIndex('by_post', (q) => q.eq('postId', post._id))
        .collect();
      commentCount += comments.length;
    }

    return {
      postCount: posts.length,
      likeCount: totalLikes,
      commentCount: commentCount,
    };
  },
});

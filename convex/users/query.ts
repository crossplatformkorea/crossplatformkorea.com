import { getAuthUserId } from '@convex-dev/auth/server';
import { query } from '../_generated/server';
import { v } from 'convex/values';
import { Id } from '../_generated/dataModel';

// Replace getUser with currentUser
export const currentUser = query({
  args: {},
  returns: v.union(
    v.object({
      _creationTime: v.number(),
      _id: v.id('users'),
      avatarUrl: v.optional(v.string()),
      displayName: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      image: v.optional(v.string()),
      name: v.optional(v.string()),
      profile: v.optional(
        v.object({
          _creationTime: v.number(),
          _id: v.id('userProfiles'),
          avatarUrl: v.optional(v.string()),
          deletedAt: v.optional(v.string()),
          description: v.optional(v.string()),
          displayName: v.string(),
          email: v.string(),
          expectations: v.optional(v.string()),
          githubId: v.optional(v.string()),
          lookingFor: v.optional(v.string()),
          name: v.optional(v.string()),
          organization: v.optional(v.string()),
          socialLinks: v.optional(v.array(v.string())),
          tags: v.optional(v.array(v.string())),
          userId: v.id('users'),
          locale: v.optional(v.string()), // locale 필드 추가
        }),
      ),
      tokenIdentifier: v.optional(v.string()),
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

      // 인증 정보에서 tokenIdentifier 가져오기
      let tokenIdentifier: string | undefined;
      try {
        const authInfo = await ctx.auth.getUserIdentity();
        tokenIdentifier = authInfo?.tokenIdentifier;
      } catch (error) {
        console.error('Failed to get auth identity:', error);
      }

      return {
        ...user,
        tokenIdentifier,
        profile: profile || undefined,
        displayName: profile?.displayName,
        avatarUrl: profile?.avatarUrl || user.image || undefined,
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
      name: v.optional(v.string()),
      organization: v.optional(v.string()),
      description: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
      deletedAt: v.optional(v.string()),
      githubId: v.optional(v.string()),
      socialLinks: v.optional(v.array(v.string())),
      tags: v.optional(v.array(v.string())),
      lookingFor: v.optional(v.string()),
      expectations: v.optional(v.string()),
      locale: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    // Query userProfiles by userId
    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();

    return profile;
  },
});

// 여러 사용자 프로필을 한번에 조회
export const getProfilesByUserIds = query({
  args: { userIds: v.array(v.id('users')) },
  returns: v.record(
    v.string(),
    v.object({
      _id: v.id('userProfiles'),
      _creationTime: v.number(),
      userId: v.id('users'),
      displayName: v.string(),
      email: v.string(),
      name: v.optional(v.string()),
      organization: v.optional(v.string()),
      description: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
      deletedAt: v.optional(v.string()),
      githubId: v.optional(v.string()),
      socialLinks: v.optional(v.array(v.string())),
      tags: v.optional(v.array(v.string())),
      lookingFor: v.optional(v.string()),
      expectations: v.optional(v.string()),
      locale: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    const result: Record<string, any> = {};

    for (const userId of args.userIds) {
      const profile = await ctx.db
        .query('userProfiles')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .first();

      if (profile) {
        result[userId.toString()] = profile;
      }
    }

    return result;
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
    const totalLikes = posts.reduce((sum, post) => sum + (post.likeCount || 0), 0);

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

// 사용자 목록을 가져오는 쿼리 - userProfiles에서 가져오도록 수정
export const getAllUsersForMention = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('users'),
      displayName: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
    }),
  ),
  handler: async (ctx) => {
    const userProfiles = await ctx.db.query('userProfiles').collect();

    return userProfiles.map((profile) => ({
      _id: profile.userId,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
    }));
  },
});

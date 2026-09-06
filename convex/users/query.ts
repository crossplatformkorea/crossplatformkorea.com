import { getAuthUserId } from '@convex-dev/auth/server';
import { query } from '../_generated/server';
import { v } from 'convex/values';
import { Id } from '../_generated/dataModel';
import { isPublicPost } from '../posts/visibility';

/** 멘션 자동완성이 한 번에 훑는 프로필 수 상한. */
const MENTION_SCAN_LIMIT = 500;

// Get all users for sitemap generation
export const getAllUsersForSitemap = query({
  args: {},
  handler: async (ctx) => {
    // Fetch all user profiles that have displayName
    const profiles = await ctx.db
      .query('userProfiles')
      .filter((q) => q.neq(q.field('displayName'), undefined))
      .collect();

    return profiles.map((profile) => ({
      _id: profile._id,
      _creationTime: profile._creationTime,
      displayName: profile.displayName,
    }));
  },
});

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

    const viewerId = await getAuthUserId(ctx);
    const visiblePosts = viewerId === userId ? posts : posts.filter((post) => isPublicPost(post));

    // 받은 좋아요 총합 계산
    const totalLikes = visiblePosts.reduce((sum, post) => sum + (post.likeCount || 0), 0);

    // 받은 댓글 수 계산
    let commentCount = 0;
    for (const post of visiblePosts) {
      const comments = await ctx.db
        .query('comments')
        .withIndex('by_post', (q) => q.eq('postId', post._id))
        .collect();
      commentCount += comments.length;
    }

    return {
      postCount: visiblePosts.length,
      likeCount: totalLikes,
      commentCount: commentCount,
    };
  },
});

// 사용자 맨션용 목록 쿼리: 검색어와 최대 개수 지원
export const getAllUsersForMention = query({
  args: {
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id('users'),
      displayName: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    const { search, limit } = args;
    // 인자는 클라이언트가 보내므로, .take()에 음수나 과도한 값이 가지 않게 죈다.
    const max = Math.min(
      Math.max(typeof limit === 'number' ? Math.floor(limit) : 4, 0),
      MENTION_SCAN_LIMIT,
    );
    const trimmedSearch = search?.trim() ?? '';

    // 멘션 자동완성은 입력할 때마다 호출된다. 검색어가 없으면 보여줄 개수만
    // 읽고, 있을 때도 상한을 둬서 전체 테이블 조회가 되지 않게 한다.
    let userProfiles = await ctx.db
      .query('userProfiles')
      .take(trimmedSearch === '' ? max : MENTION_SCAN_LIMIT);

    if (search && search.trim() !== '') {
      const lower = search.trim().toLowerCase();
      userProfiles = userProfiles.filter((profile) =>
        (profile.displayName || '').toLowerCase().includes(lower),
      );
    }

    userProfiles = userProfiles.slice(0, max);

    return userProfiles.map((profile) => ({
      _id: profile.userId,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
    }));
  },
});

// Add a new query to find users by display name
export const getProfileByDisplayName = query({
  args: { displayName: v.string() },
  returns: v.union(
    v.object({
      _id: v.id('userProfiles'),
      _creationTime: v.number(),
      displayName: v.string(),
      avatarUrl: v.optional(v.string()),
      organization: v.optional(v.string()),
      description: v.optional(v.string()),
      lookingFor: v.optional(v.string()),
      expectations: v.optional(v.string()),
      socialLinks: v.optional(v.array(v.string())),
      tags: v.optional(v.array(v.string())),
      userId: v.id('users'),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    // 프로필 URL은 저장된 displayName 그대로 만들어지므로, 인덱스 조회 하나로
    // 거의 모든 요청이 끝난다. 이 쿼리는 프로필 페이지마다 구독되기 때문에
    // 전체 테이블 조회로 두면 사용자 수에 비례해 읽기 비용이 늘어난다.
    const exactMatch = await ctx.db
      .query('userProfiles')
      .withIndex('by_display_name', (q) => q.eq('displayName', args.displayName))
      .first();

    // 대소문자만 다른 URL은 예외적인 경우라, 그때만 전체 조회로 되돌아간다.
    const searchDisplayName = args.displayName.toLowerCase();
    const profile =
      exactMatch ??
      (await ctx.db.query('userProfiles').collect()).find(
        (p) => p.displayName?.toLowerCase() === searchDisplayName,
      );

    if (!profile) {
      return null;
    }

    return {
      _id: profile._id,
      _creationTime: profile._creationTime,
      displayName: profile.displayName || '',
      avatarUrl: profile.avatarUrl,
      organization: profile.organization,
      description: profile.description,
      lookingFor: profile.lookingFor,
      expectations: profile.expectations,
      socialLinks: profile.socialLinks || [],
      tags: profile.tags || [],
      userId: profile.userId,
    };
  },
});

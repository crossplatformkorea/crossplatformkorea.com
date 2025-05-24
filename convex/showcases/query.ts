import { query } from '../_generated/server';
import { v } from 'convex/values';
import { SHOWCASE_CATEGORIES } from '../constants';
import { paginationOptsValidator } from 'convex/server';
import { getAuthUserId } from '@convex-dev/auth/server';

// Define a common showcase object validator for consistent return types
// Update the validator to match the database schema (otherLinks as string)
const showcaseObjectValidator = v.object({
  _id: v.id('showcases'),
  _creationTime: v.number(),
  title: v.string(),
  description: v.string(),
  category: v.string(),
  appStoreUrl: v.optional(v.string()),
  playStoreUrl: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  otherLinks: v.optional(v.array(v.string())),
  tags: v.optional(v.array(v.string())),
  imageUrl: v.optional(v.string()),
  userId: v.id('users'),
  featured: v.optional(v.boolean()),
  likeCount: v.optional(v.number()),
  likedBy: v.optional(v.array(v.id('users'))),
  viewCount: v.optional(v.number()),
});

// 모든 쇼케이스 카테고리 가져오기
export const getCategories = query({
  args: {},
  handler: async () => {
    return SHOWCASE_CATEGORIES.sort((a, b) => a.order - b.order);
  },
});

// 카테고리별 쇼케이스 목록 가져오기
export const getShowcasesByCategory = query({
  args: {
    paginationOpts: paginationOptsValidator,
    category: v.string(),
    searchText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 검색어 및 카테고리에 따른 쿼리 빌더 구성
    let showcasesQuery;
    
    if (args.searchText && args.searchText.trim()) {
      // 검색어가 있는 경우 검색 인덱스 사용
      showcasesQuery = ctx.db
        .query('showcases')
        .withSearchIndex('search', (q) => q.search('title', args.searchText!.trim()));

      // 카테고리 필터링 필요한 경우 추가
      if (args.category !== 'all') {
        showcasesQuery = showcasesQuery.filter((q) => q.eq(q.field('category'), args.category));
      }
    } else {
      // 검색어가 없는 경우
      if (args.category !== 'all') {
        // 특정 카테고리만 필터링
        showcasesQuery = ctx.db
          .query('showcases')
          .withIndex('by_category', (q) => q.eq('category', args.category))
          .order('desc');
      } else {
        // 모든 쇼케이스 반환 (카테고리 필터링 없음)
        showcasesQuery = ctx.db.query('showcases').order('desc');
      }
    }

    // 페이지네이션 적용
    const paginatedResults = await showcasesQuery.paginate(args.paginationOpts);
    
    // Enhance the showcases with author information
    const showcasesWithAuthors = await Promise.all(
      paginatedResults.page.map(async (showcase) => {
        // Fetch the user profile information
        const user = await ctx.db.get(showcase.userId);
        if (!user) return showcase;
        
        // Fetch additional user profile data if needed
        const userProfile = await ctx.db
          .query('userProfiles')
          .withIndex('by_user', (q) => q.eq('userId', showcase.userId))
          .first();
        
        return {
          ...showcase,
          author: {
            _id: showcase.userId,
            name: userProfile?.displayName || user.name || 'User',
            avatarUrl: userProfile?.avatarUrl,
          },
        };
      })
    );
    
    return {
      ...paginatedResults,
      page: showcasesWithAuthors,
    };
  },
});

// 특정 ID의 쇼케이스 상세 정보 가져오기
export const getShowcase = query({
  args: { showcaseId: v.id('showcases') },
  returns: v.union(showcaseObjectValidator, v.null()),
  handler: async (ctx, args) => {
    const showcase = await ctx.db.get(args.showcaseId);
    if (!showcase) {
      return null;
    }

    // 조회수 증가 로직은 쿼리 내에서 직접 수행할 수 없으므로 제거
    // 클라이언트에서 별도로 incrementViewCount 뮤테이션을 호출해야 함

    return showcase;
  },
});

// 현재 사용자가 작성한 쇼케이스 목록 가져오기
export const getMyShowcases = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { page: [], continueCursor: null, isDone: true };
    }

    return await ctx.db
      .query('showcases')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .order('desc')
      .paginate(args.paginationOpts);
  },
});

// 특정 사용자가 작성한 쇼케이스 목록 가져오기
export const getUserShowcases = query({
  args: {
    userId: v.id('users'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('showcases')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .order('desc')
      .paginate(args.paginationOpts);
  },
});

// 추천 쇼케이스 목록 가져오기
export const getFeaturedShowcases = query({
  args: { limit: v.number() },
  returns: v.array(showcaseObjectValidator),
  handler: async (ctx, args) => {
    const showcases = await ctx.db
      .query('showcases')
      .filter((q) => q.eq(q.field('featured'), true))
      .order('desc')
      .take(args.limit);

    return showcases;
  },
});

// 최근 추가된 쇼케이스 목록 가져오기
export const getRecentShowcases = query({
  args: { limit: v.number() },
  returns: v.array(showcaseObjectValidator),
  handler: async (ctx, args) => {
    const showcases = await ctx.db.query('showcases').order('desc').take(args.limit);

    return showcases;
  },
});

// 인기 쇼케이스 목록 가져오기 (좋아요 순)
export const getPopularShowcases = query({
  args: { limit: v.number() },
  returns: v.array(showcaseObjectValidator),
  handler: async (ctx, args) => {
    // 좋아요 수 기준으로 쿼리
    // Convex에서는 직접 필드로 정렬하기 위해 적절한 인덱스를 사용하거나
    // 결과를 메모리에서 정렬해야 합니다
    const showcases = await ctx.db
      .query('showcases')
      .filter((q) => q.gte(q.field('likeCount'), 1)) // field() 메서드에 기본값을 전달하지 않도록 수정
      .order('desc') // 기본적으로 _creationTime으로 정렬됩니다
      .collect();

    // 메모리에서 좋아요 수에 따라 정렬
    // null 또는 undefined likeCount는 0으로 처리
    showcases.sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0));

    // 요청된 제한 수만큼만 반환
    return showcases.slice(0, args.limit);
  },
});

// 쇼케이스 태그 목록 가져오기
export const getShowcaseTags = query({
  returns: v.array(v.string()),
  handler: async (ctx) => {
    const showcases = await ctx.db.query('showcases').collect();
    // 모든 쇼케이스에서 고유한 태그 추출
    const tagsSet = new Set<string>();

    for (const showcase of showcases) {
      if (showcase.tags && Array.isArray(showcase.tags)) {
        showcase.tags.forEach((tag) => tagsSet.add(tag));
      }
    }

    return Array.from(tagsSet).sort();
  },
});

// 사용자가 쇼케이스에 좋아요를 눌렀는지 확인
export const hasLikedShowcase = query({
  args: { showcaseId: v.id('showcases') },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }

    const showcase = await ctx.db.get(args.showcaseId);
    if (!showcase || !showcase.likedBy) {
      return false;
    }

    return showcase.likedBy.some((id) => id === userId);
  },
});

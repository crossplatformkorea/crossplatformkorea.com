import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';
import { ErrorCode, SHOWCASE_CATEGORIES } from '../constants';
import { Id } from '../_generated/dataModel';
import { showcaseValidator, hasAtLeastOneUrl, ensureHttpsPrefix } from '../validators';

// 새 쇼케이스 생성
export const createShowcase = mutation({
  args: showcaseValidator,
  returns: v.id('showcases'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error(ErrorCode.AUTH_REQUIRED);
    }

    // Validate title (required, non-empty)
    if (!args.title.trim()) {
      throw new Error('제목은 필수입니다');
    }

    // Validate category (must be valid)
    const validCategory = SHOWCASE_CATEGORIES.some((cat) => cat.key === args.category);
    if (!validCategory) {
      throw new Error('유효한 카테고리를 선택해주세요');
    }

    // Validate image URL (required)
    if (!args.imageUrl.trim()) {
      throw new Error('이미지 URL은 필수입니다');
    }

    // Ensure at least one URL is provided
    if (!hasAtLeastOneUrl(args.websiteUrl, args.appStoreUrl, args.playStoreUrl)) {
      throw new Error('최소 하나의 URL(웹사이트, 앱스토어, 플레이스토어)이 필요합니다');
    }

    // Format URLs with https:// prefix
    const websiteUrl = args.websiteUrl ? ensureHttpsPrefix(args.websiteUrl) : undefined;
    const appStoreUrl = args.appStoreUrl ? ensureHttpsPrefix(args.appStoreUrl) : undefined;
    const playStoreUrl = args.playStoreUrl ? ensureHttpsPrefix(args.playStoreUrl) : undefined;
    const imageUrl = ensureHttpsPrefix(args.imageUrl);

    // Convert otherLinks string to array before inserting
    const otherLinksArray = args.otherLinks
      ? args.otherLinks
          .split(',')
          .filter((link) => link.trim())
          .map((link) => ensureHttpsPrefix(link.trim()))
      : undefined;

    // 새 쇼케이스 생성
    const showcaseId = await ctx.db.insert('showcases', {
      title: args.title.trim(),
      description: args.description,
      category: args.category,
      appStoreUrl,
      playStoreUrl,
      websiteUrl,
      otherLinks: otherLinksArray,
      tags: args.tags?.map((tag) => tag.trim()),
      imageUrl,
      userId,
      featured: false,
      likeCount: 0,
      likedBy: [],
      viewCount: 0,
    });

    return showcaseId;
  },
});

// 쇼케이스 업데이트
export const updateShowcase = mutation({
  args: {
    showcaseId: v.id('showcases'),
    ...showcaseValidator,
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error(ErrorCode.AUTH_REQUIRED);
    }

    const { showcaseId, ...inputData } = args;

    // 기존 쇼케이스 조회
    const showcase = await ctx.db.get(showcaseId);
    if (!showcase) {
      throw new Error('존재하지 않는 쇼케이스입니다');
    }

    // 권한 확인 (작성자만 수정 가능)
    if (showcase.userId !== userId) {
      throw new Error('쇼케이스 수정 권한이 없습니다');
    }

    // Validate title (required, non-empty)
    if (!inputData.title.trim()) {
      throw new Error('제목은 필수입니다');
    }

    // Validate category (must be valid)
    const validCategory = SHOWCASE_CATEGORIES.some((cat) => cat.key === inputData.category);
    if (!validCategory) {
      throw new Error('유효한 카테고리를 선택해주세요');
    }

    // Validate image URL (required)
    if (!inputData.imageUrl.trim()) {
      throw new Error('이미지 URL은 필수입니다');
    }

    // Ensure at least one URL is provided
    if (!hasAtLeastOneUrl(inputData.websiteUrl, inputData.appStoreUrl, inputData.playStoreUrl)) {
      throw new Error('최소 하나의 URL(웹사이트, 앱스토어, 플레이스토어)이 필요합니다');
    }

    // Format URLs with https:// prefix
    const websiteUrl = inputData.websiteUrl ? ensureHttpsPrefix(inputData.websiteUrl) : undefined;
    const appStoreUrl = inputData.appStoreUrl
      ? ensureHttpsPrefix(inputData.appStoreUrl)
      : undefined;
    const playStoreUrl = inputData.playStoreUrl
      ? ensureHttpsPrefix(inputData.playStoreUrl)
      : undefined;
    const imageUrl = ensureHttpsPrefix(inputData.imageUrl);

    // Convert otherLinks string to array before updating
    const otherLinksArray = inputData.otherLinks
      ? inputData.otherLinks
          .split(',')
          .filter((link) => link.trim())
          .map((link) => ensureHttpsPrefix(link.trim()))
      : undefined;

    // Prepare update data with correct types and formatting
    const updateData = {
      title: inputData.title.trim(),
      description: inputData.description,
      category: inputData.category,
      appStoreUrl,
      playStoreUrl,
      websiteUrl,
      otherLinks: otherLinksArray,
      tags: inputData.tags?.map((tag) => tag.trim()),
      imageUrl,
    };

    // 쇼케이스 업데이트
    await ctx.db.patch(showcaseId, updateData);

    return true;
  },
});

// 쇼케이스 삭제
export const deleteShowcase = mutation({
  args: {
    showcaseId: v.id('showcases'),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error(ErrorCode.AUTH_REQUIRED);
    }

    // 기존 쇼케이스 조회
    const showcase = await ctx.db.get(args.showcaseId);
    if (!showcase) {
      throw new Error('존재하지 않는 쇼케이스입니다');
    }

    // 권한 확인 (작성자만 삭제 가능)
    if (showcase.userId !== userId) {
      throw new Error('쇼케이스 삭제 권한이 없습니다');
    }

    // 쇼케이스 삭제
    await ctx.db.delete(args.showcaseId);

    return true;
  },
});

// 쇼케이스 좋아요 토글
export const toggleLike = mutation({
  args: {
    showcaseId: v.id('showcases'),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error(ErrorCode.AUTH_REQUIRED);
    }

    // 기존 쇼케이스 조회
    const showcase = await ctx.db.get(args.showcaseId);
    if (!showcase) {
      throw new Error('존재하지 않는 쇼케이스입니다');
    }

    // 좋아요 상태 확인
    const likedBy = showcase.likedBy || [];
    const likeCount = showcase.likeCount || 0;
    const hasLiked = likedBy.some((id: Id<'users'>) => id === userId);

    if (hasLiked) {
      // 이미 좋아요를 누른 경우 제거
      await ctx.db.patch(args.showcaseId, {
        likedBy: likedBy.filter((id: Id<'users'>) => id !== userId),
        likeCount: Math.max(0, likeCount - 1),
      });
      return false; // 좋아요 취소됨
    } else {
      // 좋아요 추가
      await ctx.db.patch(args.showcaseId, {
        likedBy: [...likedBy, userId],
        likeCount: likeCount + 1,
      });
      return true; // 좋아요 추가됨
    }
  },
});

// 관리자용: 쇼케이스 추천 상태 토글 (featured)
export const toggleFeatured = mutation({
  args: {
    showcaseId: v.id('showcases'),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error(ErrorCode.AUTH_REQUIRED);
    }

    // 관리자 권한 확인 (실제 구현에서는 관리자 테이블 확인 필요)
    const isAdmin = await ctx.db
      .query('admins')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .unique();

    if (!isAdmin) {
      throw new Error('관리자 권한이 필요합니다');
    }

    // 쇼케이스 조회
    const showcase = await ctx.db.get(args.showcaseId);
    if (!showcase) {
      throw new Error('존재하지 않는 쇼케이스입니다');
    }

    // featured 상태 토글
    const isFeatured = showcase.featured || false;
    await ctx.db.patch(args.showcaseId, {
      featured: !isFeatured,
    });

    return !isFeatured; // 변경된 featured 상태 반환
  },
});

// 이미지 URL 업데이트
export const updateImageUrl = mutation({
  args: {
    showcaseId: v.id('showcases'),
    imageUrl: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error(ErrorCode.AUTH_REQUIRED);
    }

    // 쇼케이스 조회
    const showcase = await ctx.db.get(args.showcaseId);
    if (!showcase) {
      throw new Error('존재하지 않는 쇼케이스입니다');
    }

    // 권한 확인 (작성자만 수정 가능)
    if (showcase.userId !== userId) {
      throw new Error('쇼케이스 수정 권한이 없습니다');
    }

    // 이미지 URL 업데이트
    await ctx.db.patch(args.showcaseId, {
      imageUrl: args.imageUrl,
    });

    return true;
  },
});

// 조회수 증가 뮤테이션
export const incrementViewCount = mutation({
  args: {
    showcaseId: v.id('showcases'),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const { showcaseId } = args;

    // 쇼케이스 존재 여부 확인
    const showcase = await ctx.db.get(showcaseId);
    if (!showcase) {
      return false;
    }

    // 현재 조회수 가져오기 (없으면 0으로 시작)
    const currentViewCount = showcase.viewCount ?? 0;

    // 조회수 1 증가
    await ctx.db.patch(showcaseId, {
      viewCount: currentViewCount + 1,
    });

    return true;
  },
});

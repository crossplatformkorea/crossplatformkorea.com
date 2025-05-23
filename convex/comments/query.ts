import { v } from 'convex/values';
import { query } from '../_generated/server';

// 특정 게시물의 댓글 목록 조회
export const getCommentsByPostId = query({
  args: { postId: v.id('posts') },
  returns: v.array(
    v.object({
      _id: v.id('comments'),
      _creationTime: v.number(),
      postId: v.id('posts'),
      authorId: v.id('users'),
      content: v.string(),
      updatedAt: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('comments')
      .withIndex('by_post', (q) => q.eq('postId', args.postId))
      .order('asc')
      .collect();
  },
});

// 댓글 작성자 프로필 한번에 조회 - 수정: validator에 누락된 필드 추가
export const getCommentAuthorProfiles = query({
  args: { postId: v.id('posts') },
  returns: v.array(
    v.object({
      _id: v.id('userProfiles'),
      _creationTime: v.number(), // 누락됐던 필드 추가
      userId: v.id('users'),
      displayName: v.string(),
      avatarUrl: v.optional(v.string()),
      email: v.string(),
      // 추가 필드들
      name: v.optional(v.string()),
      organization: v.optional(v.string()),
      description: v.optional(v.string()),
      deletedAt: v.optional(v.string()),
      githubId: v.optional(v.string()),
      socialLinks: v.optional(v.array(v.string())),
      tags: v.optional(v.array(v.string())),
      lookingFor: v.optional(v.string()),
      expectations: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    // 1. 먼저 게시물의 모든 댓글을 가져옴
    const comments = await ctx.db
      .query('comments')
      .withIndex('by_post', (q) => q.eq('postId', args.postId))
      .collect();

    // 2. 댓글 작성자 ID들을 모음
    const authorIds = comments
      .map((comment) => comment.authorId)
      .filter((id): id is NonNullable<typeof id> => id != null);

    // 3. 중복 제거
    const uniqueAuthorIds = [...new Set(authorIds)];

    // 4. 각 작성자의 프로필 정보를 조회
    const authorProfiles = [];
    for (const authorId of uniqueAuthorIds) {
      const profile = await ctx.db
        .query('userProfiles')
        .withIndex('by_user', (q) => q.eq('userId', authorId))
        .first();

      if (profile) {
        authorProfiles.push(profile);
      }
    }

    return authorProfiles;
  },
});

// 게시물의 댓글 수 조회
export const getCommentCount = query({
  args: { postId: v.id('posts') },
  returns: v.number(),
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query('comments')
      .withIndex('by_post', (q) => q.eq('postId', args.postId))
      .collect();

    return comments.length;
  },
});

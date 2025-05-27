import { v } from 'convex/values';
import { query } from '../_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

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
      likeCount: v.optional(v.number()),
      likedBy: v.optional(v.array(v.id('users'))),
      mentions: v.optional(v.array(v.id('users'))),
      mentionedUsers: v.optional(v.array(v.id('users'))), // 누락된 필드 추가
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

// 댓글 작성자 프로필 한번에 조회 - 수정: postId를 받아서 댓글 작성자들의 프로필 조회
export const getCommentAuthorProfiles = query({
  args: { postId: v.id('posts') },
  returns: v.array(
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
      locale: v.optional(v.string()),
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

// Check if user has liked a comment
export const hasLiked = query({
  args: { commentId: v.id('comments') },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      return false;
    }

    const likedBy = comment.likedBy || [];
    return likedBy.some((id) => id === userId);
  },
});

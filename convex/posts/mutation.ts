import { v } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation } from '../_generated/server';
import { Id } from '../_generated/dataModel';
import { DEFAULT_CATEGORY } from '../constants';

// Create a new post with improved file handling
export const createPost = mutation({
  args: {
    category: v.string(),
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    storageIds: v.optional(v.array(v.id('_storage'))), // 업로드된 이미지 ID 목록 추가
  },
  returns: v.id('posts'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    const now = new Date().toISOString();

    // Ensure a valid category is used
    const category = args.category || DEFAULT_CATEGORY;

    // Create the post
    const postId = await ctx.db.insert('posts', {
      category, // Use validated category
      title: args.title,
      content: args.content,
      tags: args.tags,
      updatedAt: now,
      startDate: args.startDate,
      endDate: args.endDate,
      authorId: userId as Id<'users'>,
    });

    console.log('args.storageIds', args.storageIds);

    // Handle uploaded files if they exist
    if (args.storageIds && args.storageIds.length > 0) {
      // 컨텐츠에서 사용중인 이미지 URL 찾기
      const usedUrls = extractImageUrlsFromContent(args.content);
      console.log('Used URLs in content:', usedUrls);

      for (const storageId of args.storageIds) {
        try {
          // 파일 레코드 찾기
          const file = await ctx.db
            .query('files')
            .withIndex('by_storage_id', (q) => q.eq('storageId', storageId))
            .unique();

          if (file && file.userId === userId) {
            // URL 비교 로직 수정: file.url이 usedUrls 배열에 있는지 확인
            const isUrlUsed =
              file.url &&
              usedUrls.some((url) => {
                // URL에서 쿼리 파라미터 제거하고 비교
                const cleanFileUrl = file.url?.split('?')[0];
                const cleanContentUrl = url.split('?')[0];
                return cleanContentUrl === cleanFileUrl;
              });

            if (isUrlUsed) {
              // 컨텐츠에 파일이 사용되고 있으면 postId 연결
              await ctx.db.patch(file._id, { postId });
              console.log(`File ${file._id} connected to post ${postId}`);
            } else {
              // 컨텐츠에 파일이 사용되지 않으면 삭제
              try {
                await ctx.storage.delete(storageId);
                await ctx.db.delete(file._id);
                console.log(`Unused file ${file._id} deleted`);
              } catch (err) {
                console.error(`Error deleting unused file ${file._id}:`, err);
              }
            }
          }
        } catch (err) {
          console.error(`Error processing file ${storageId}:`, err);
        }
      }
    }

    return postId;
  },
});

// 컨텐츠에서 이미지 URL 추출하는 헬퍼 함수
function extractImageUrlsFromContent(content: string): string[] {
  const urls: string[] = [];
  const urlRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
  let match;

  while ((match = urlRegex.exec(content)) !== null) {
    if (match[1]) {
      urls.push(match[1]);
    }
  }

  return urls;
}

// Update an existing post
export const updatePost = mutation({
  args: {
    postId: v.id('posts'),
    category: v.optional(v.string()),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // Verify post exists
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Optional: Check if user has permission to update this post

    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (args.category !== undefined) updateData.category = args.category;
    if (args.title !== undefined) updateData.title = args.title;
    if (args.content !== undefined) updateData.content = args.content;
    if (args.tags !== undefined) updateData.tags = args.tags;
    if (args.startDate !== undefined) updateData.startDate = args.startDate;
    if (args.endDate !== undefined) updateData.endDate = args.endDate;

    await ctx.db.patch(args.postId, updateData);
    return true;
  },
});

// Delete a post
export const deletePost = mutation({
  args: {
    postId: v.id('posts'),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('Authentication required');
    }

    // Verify post exists
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Optional: Check if user has permission to delete this post

    await ctx.db.delete(args.postId);
    return true;
  },
});

// Add like to a post - From likes.ts
export const likePost = mutation({
  args: { postId: v.id('posts') },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // 포스트 확인
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // 좋아요 목록
    const likedBy = post.likedBy || [];
    const likeCount = post.likeCount || 0;

    // 이미 좋아요를 눌렀는지 확인
    if (likedBy.some((id) => id === userId)) {
      return false; // 이미 좋아요를 누른 상태
    }

    // 좋아요 추가
    await ctx.db.patch(args.postId, {
      likedBy: [...likedBy, userId as Id<'users'>],
      likeCount: likeCount + 1,
    });

    return true;
  },
});

// Remove like from a post - From likes.ts
export const unlikePost = mutation({
  args: { postId: v.id('posts') },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // 포스트 확인
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // 좋아요 목록
    const likedBy = post.likedBy || [];
    const likeCount = Math.max(0, (post.likeCount || 0) - 1);

    // 좋아요를 누른 적이 있는지 확인
    if (!likedBy.some((id) => id === userId)) {
      return false; // 좋아요를 누른 적이 없음
    }

    // 좋아요 취소
    await ctx.db.patch(args.postId, {
      likedBy: likedBy.filter((id) => id !== userId),
      likeCount: likeCount,
    });

    return true;
  },
});

// Toggle like on a post (combines likePost and unlikePost)
export const toggleLike = mutation({
  args: { postId: v.id('posts') },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // Get the post
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user has already liked the post
    const likedBy = post.likedBy || [];
    const hasLiked = likedBy.some((id) => id === userId);

    if (hasLiked) {
      // User already liked the post, so unlike it
      const likeCount = Math.max(0, (post.likeCount || 0) - 1);
      await ctx.db.patch(args.postId, {
        likedBy: likedBy.filter((id) => id !== userId),
        likeCount: likeCount,
      });
      return false; // Returning false to indicate the post is now unliked
    } else {
      // User hasn't liked the post, so like it
      const likeCount = (post.likeCount || 0) + 1;
      await ctx.db.patch(args.postId, {
        likedBy: [...likedBy, userId as Id<'users'>],
        likeCount: likeCount,
      });
      return true; // Returning true to indicate the post is now liked
    }
  },
});

// Add comment to a post
export const addComment = mutation({
  args: {
    postId: v.id('posts'),
    content: v.string(),
  },
  returns: v.id('comments'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // Verify post exists
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Create comment
    const commentId = await ctx.db.insert('comments', {
      postId: args.postId,
      authorId: userId as Id<'users'>,
      content: args.content,
    });

    // Increment comment count on the post
    const currentCommentCount = post.commentCount || 0;
    await ctx.db.patch(args.postId, {
      commentCount: currentCommentCount + 1,
    });

    return commentId;
  },
});

// Increment post view count
export const incrementViewCount = mutation({
  args: {
    postId: v.id('posts'),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    // Check if post exists
    const post = await ctx.db.get(args.postId);
    if (!post) {
      return false;
    }

    // Update the view count (initialize to 1 if it doesn't exist)
    const currentViewCount = post.viewCount || 0;
    await ctx.db.patch(args.postId, {
      viewCount: currentViewCount + 1,
    });

    return true;
  },
});

// Delete a comment - new mutation to also decrement the comment count
export const deleteComment = mutation({
  args: {
    commentId: v.id('comments'),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // Get the comment
    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    // Check if user is the author of the comment
    if (comment.authorId !== userId) {
      throw new Error('Not authorized to delete this comment');
    }

    // Get the associated post
    const post = await ctx.db.get(comment.postId);
    if (post) {
      // Decrement comment count on the post (ensure it doesn't go below 0)
      const currentCommentCount = Math.max(0, (post.commentCount || 1) - 1);
      await ctx.db.patch(post._id, {
        commentCount: currentCommentCount,
      });
    }

    // Delete the comment
    await ctx.db.delete(args.commentId);
    return true;
  },
});

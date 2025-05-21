import { v } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation } from '../_generated/server';
import { Id } from '../_generated/dataModel';

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

    // Create the post
    const postId = await ctx.db.insert('posts', {
      category: args.category,
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

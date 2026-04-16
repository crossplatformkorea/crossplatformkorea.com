import { v } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation, internalMutation } from '../_generated/server';
import { Id } from '../_generated/dataModel';
import { DEFAULT_CATEGORY } from '../constants';
import { internal } from '../_generated/api';
import { extractMentions, resolveMentions } from '../utils/mentions';
import { generateSlug } from '../utils/slug';

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
    thumbnail: v.optional(v.string()), // 대표 썸네일 URL (선택 안하면 첫 이미지로 자동 설정)
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

    // 멘션 추출 및 해결
    const mentionedDisplayNames = extractMentions(args.content);
    const mentionedUserIds = await resolveMentions(ctx, mentionedDisplayNames);

    // 썸네일 결정: 사용자가 선택한 것 또는 자동 추출 (유튜브 > 첫 번째 이미지)
    const thumbnail = args.thumbnail || extractThumbnailFromContent(args.content);

    const slug = generateSlug(args.title);

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
      mentions: mentionedUserIds.length > 0 ? mentionedUserIds : undefined,
      thumbnail,
      slug,
    });

    // 멘션 알림 생성
    if (mentionedUserIds.length > 0) {
      const authorProfile = await ctx.db
        .query('userProfiles')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .unique();

      const mentionerName = authorProfile?.displayName || 'Someone';

      for (const mentionedUserId of mentionedUserIds) {
        // 자신을 멘션한 경우는 알림 생성하지 않음
        if (mentionedUserId !== userId) {
          // 멘션된 사용자의 언어 설정 조회
          const mentionedUserProfile = await ctx.db
            .query('userProfiles')
            .withIndex('by_user', (q) => q.eq('userId', mentionedUserId))
            .unique();

          const userLocale = mentionedUserProfile?.locale || 'ko';

          // scheduler와 action 사용 대신 직접 createNotification 호출
          await ctx.runMutation(internal.notifications.mutation.createNotification, {
            userId: mentionedUserId,
            type: 'MENTIONED',
            postId: postId,
            triggeredById: userId,
            mentionerName: mentionerName,
            postTitle: args.title,
            locale: userLocale,
          });
        }
      }
    }

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

    // Slack 알림 전송 (비동기로 실행)
    await ctx.scheduler.runAfter(0, internal.posts.action.sendSlackNotification, {
      postId,
      title: args.title,
      content: args.content,
      category,
    });

    // Discord 알림 전송 (비동기로 실행)
    await ctx.scheduler.runAfter(0, internal.posts.action.sendDiscordNotification, {
      postId,
      title: args.title,
      content: args.content,
      category,
    });

    return postId;
  },
});

// 컨텐츠에서 이미지 URL 추출하는 헬퍼 함수
function extractImageUrlsFromContent(content: string): string[] {
  const urls: string[] = [];

  // HTML <img> 태그에서 추출
  const htmlImgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
  let match;

  while ((match = htmlImgRegex.exec(content)) !== null) {
    if (match[1]) {
      urls.push(match[1]);
    }
  }

  // 마크다운 이미지 문법 ![alt](url)에서 추출
  const markdownImgRegex = /!\[[^\]]*\]\(([^)]+)\)/g;

  while ((match = markdownImgRegex.exec(content)) !== null) {
    if (match[1]) {
      urls.push(match[1]);
    }
  }

  return urls;
}

// 유튜브 비디오 ID 추출 헬퍼 함수
function extractYoutubeVideoId(content: string): string | null {
  // YouTube URL 패턴들
  const patterns = [
    // youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // youtu.be/VIDEO_ID
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // youtube-nocookie.com/embed/VIDEO_ID
    /(?:youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// 컨텐츠에서 썸네일 추출 (유튜브 또는 첫 번째 이미지)
function extractThumbnailFromContent(content: string): string | undefined {
  // 1. 유튜브 비디오 ID가 있으면 유튜브 썸네일 사용
  const youtubeVideoId = extractYoutubeVideoId(content);
  if (youtubeVideoId) {
    return `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
  }

  // 2. 첫 번째 이미지 URL 추출
  const imageUrls = extractImageUrlsFromContent(content);
  if (imageUrls.length > 0) {
    return imageUrls[0];
  }

  // 3. 마크다운 이미지 문법에서 추출 ![alt](url)
  const markdownImageMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
  if (markdownImageMatch && markdownImageMatch[1]) {
    return markdownImageMatch[1];
  }

  return undefined;
}

// Script-only: create a post on behalf of a user identified by email.
// Used by the /post-blog Claude skill to automate YouTube → blog publishing.
export const createPostFromScript = internalMutation({
  args: {
    authorEmail: v.string(),
    category: v.string(),
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    thumbnail: v.optional(v.string()),
  },
  returns: v.id('posts'),
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('by_email', (q) => q.eq('email', args.authorEmail))
      .unique();

    if (!profile) {
      throw new Error(`No user profile found for email: ${args.authorEmail}`);
    }

    const authorId = profile.userId;
    const now = new Date().toISOString();
    const category = args.category || DEFAULT_CATEGORY;
    const thumbnail = args.thumbnail || extractThumbnailFromContent(args.content);
    const slug = generateSlug(args.title);

    const postId = await ctx.db.insert('posts', {
      category,
      title: args.title,
      content: args.content,
      tags: args.tags,
      updatedAt: now,
      authorId,
      thumbnail,
      slug,
    });

    await ctx.scheduler.runAfter(0, internal.posts.action.sendSlackNotification, {
      postId,
      title: args.title,
      content: args.content,
      category,
    });

    await ctx.scheduler.runAfter(0, internal.posts.action.sendDiscordNotification, {
      postId,
      title: args.title,
      content: args.content,
      category,
    });

    return postId;
  },
});

// Script-only: update a post's content/title/tags/thumbnail without auth.
// Used by the /post-blog Claude skill to fix up automated posts.
export const updatePostFromScript = internalMutation({
  args: {
    postId: v.id('posts'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    thumbnail: v.optional(v.string()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error(`Post not found: ${args.postId}`);
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (args.title !== undefined) updateData.title = args.title;
    if (args.content !== undefined) updateData.content = args.content;
    if (args.tags !== undefined) updateData.tags = args.tags;
    if (args.category !== undefined) updateData.category = args.category;
    if (args.thumbnail !== undefined) updateData.thumbnail = args.thumbnail;

    // Backfill slug if the post doesn't have one yet. Never overwrite an
    // existing slug on update — keeping URLs stable matters more than having
    // the slug match a renamed title.
    if (!post.slug) {
      updateData.slug = generateSlug(args.title ?? post.title);
    }

    await ctx.db.patch(args.postId, updateData);
    return true;
  },
});

// Backfill slugs for all posts that don't have one. Run once after deploying
// the slug field. Idempotent — safe to re-run.
//
// Processes a single page per invocation so we stay within Convex's mutation
// limits on large tables. Returns the next cursor so the caller can loop:
//   let cursor = null;
//   while (!done) {
//     const r = await convex.mutation(api.posts.mutation.backfillSlugs, { cursor });
//     cursor = r.nextCursor;
//     done = r.isDone;
//   }
export const backfillSlugs = internalMutation({
  args: {
    cursor: v.optional(v.union(v.string(), v.null())),
    batchSize: v.optional(v.number()),
  },
  returns: v.object({
    scanned: v.number(),
    updated: v.number(),
    nextCursor: v.union(v.string(), v.null()),
    isDone: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query('posts')
      .paginate({
        cursor: args.cursor ?? null,
        numItems: args.batchSize ?? 100,
      });

    let updated = 0;
    for (const post of page.page) {
      if (!post.slug) {
        await ctx.db.patch(post._id, { slug: generateSlug(post.title) });
        updated++;
      }
    }

    return {
      scanned: page.page.length,
      updated,
      nextCursor: page.continueCursor,
      isDone: page.isDone,
    };
  },
});

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
    storageIds: v.optional(v.array(v.id('_storage'))), // 업로드된 이미지 ID 목록 추가
    thumbnail: v.optional(v.string()), // 대표 썸네일 URL
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

    // Check if user has permission to update this post
    if (post.authorId !== userId) {
      throw new Error('Permission denied');
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (args.category !== undefined) updateData.category = args.category;
    if (args.title !== undefined) updateData.title = args.title;

    // Backfill slug for legacy posts that were created before the slug field
    // existed. Never overwrite an existing slug — URL stability matters more
    // than matching a renamed title.
    if (!post.slug) {
      updateData.slug = generateSlug(args.title ?? post.title);
    }

    // 썸네일 삭제 여부를 추적
    let shouldClearThumbnail = false;

    if (args.content !== undefined) {
      updateData.content = args.content;

      // 멘션 업데이트
      const mentionedDisplayNames = extractMentions(args.content);
      const mentionedUserIds = await resolveMentions(ctx, mentionedDisplayNames);
      updateData.mentions = mentionedUserIds.length > 0 ? mentionedUserIds : undefined;

      // 썸네일 자동 추출
      const extractedThumbnail = extractThumbnailFromContent(args.content);
      if (extractedThumbnail) {
        updateData.thumbnail = extractedThumbnail;
      } else {
        // 썸네일이 추출되지 않으면 기존 썸네일 삭제 필요
        shouldClearThumbnail = true;
      }
    } else if (!post.thumbnail && post.content) {
      // 콘텐츠 변경 없어도 썸네일이 없으면 기존 콘텐츠에서 추출 시도
      const extractedThumbnail = extractThumbnailFromContent(post.content);
      if (extractedThumbnail) {
        updateData.thumbnail = extractedThumbnail;
      }
    }
    if (args.tags !== undefined) updateData.tags = args.tags;
    if (args.startDate !== undefined) updateData.startDate = args.startDate;
    if (args.endDate !== undefined) updateData.endDate = args.endDate;

    // 썸네일 업데이트: 명시적으로 전달된 경우에만 덮어쓰기 (위에서 이미 자동 추출됨)
    if (args.thumbnail !== undefined) {
      updateData.thumbnail = args.thumbnail;
      shouldClearThumbnail = false; // 명시적으로 전달된 경우 삭제하지 않음
    }

    // Update the post first
    await ctx.db.patch(args.postId, updateData);

    // 썸네일 삭제가 필요한 경우 빈 문자열로 설정 (undefined는 JSON 직렬화에서 제거됨)
    console.log('shouldClearThumbnail:', shouldClearThumbnail, 'post.thumbnail:', post.thumbnail);
    if (shouldClearThumbnail) {
      console.log('Clearing thumbnail for post:', args.postId);
      await ctx.db.patch(args.postId, { thumbnail: '' });
    }

    // Handle file synchronization when content is updated
    if (args.content !== undefined) {
      console.log('Updating post files for post:', args.postId);

      // Get all files currently associated with this post
      const currentFiles = await ctx.db
        .query('files')
        .filter((q) => q.eq(q.field('postId'), args.postId))
        .collect();

      // Extract URLs from the updated content
      const usedUrls = extractImageUrlsFromContent(args.content);
      console.log('Used URLs in updated content:', usedUrls);

      // Check existing files and remove unused ones
      for (const file of currentFiles) {
        const isUrlUsed =
          file.url &&
          usedUrls.some((url) => {
            const cleanFileUrl = file.url?.split('?')[0];
            const cleanContentUrl = url.split('?')[0];
            return cleanContentUrl === cleanFileUrl;
          });

        if (!isUrlUsed) {
          // File is no longer used in content, delete it
          try {
            if (file.storageId) {
              await ctx.storage.delete(file.storageId);
            }
            await ctx.db.delete(file._id);
            console.log(`Removed unused file ${file._id} from post ${args.postId}`);
          } catch (err) {
            console.error(`Error deleting unused file ${file._id}:`, err);
          }
        }
      }

      // Handle newly uploaded files if they exist
      if (args.storageIds && args.storageIds.length > 0) {
        for (const storageId of args.storageIds) {
          try {
            // Find file record
            const file = await ctx.db
              .query('files')
              .withIndex('by_storage_id', (q) => q.eq('storageId', storageId))
              .unique();

            if (file && file.userId === userId) {
              // Check if this file is used in the content
              const isUrlUsed =
                file.url &&
                usedUrls.some((url) => {
                  const cleanFileUrl = file.url?.split('?')[0];
                  const cleanContentUrl = url.split('?')[0];
                  return cleanContentUrl === cleanFileUrl;
                });

              if (isUrlUsed) {
                // Connect file to post if not already connected
                if (file.postId !== args.postId) {
                  await ctx.db.patch(file._id, { postId: args.postId });
                  console.log(`File ${file._id} connected to post ${args.postId}`);
                }
              } else {
                // File not used in content, delete it
                try {
                  await ctx.storage.delete(storageId);
                  await ctx.db.delete(file._id);
                  console.log(`Unused new file ${file._id} deleted`);
                } catch (err) {
                  console.error(`Error deleting unused new file ${file._id}:`, err);
                }
              }
            }
          } catch (err) {
            console.error(`Error processing file ${storageId}:`, err);
          }
        }
      }
    }

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

    // Check if user has permission to delete this post
    if (post.authorId !== userId) {
      throw new Error('Permission denied');
    }

    // Delete all files associated with this post
    console.log('Deleting files associated with post:', args.postId);
    const associatedFiles = await ctx.db
      .query('files')
      .filter((q) => q.eq(q.field('postId'), args.postId))
      .collect();

    console.log(`Found ${associatedFiles.length} files to delete`);

    for (const file of associatedFiles) {
      try {
        // Delete from storage if storageId exists
        if (file.storageId) {
          await ctx.storage.delete(file.storageId);
          console.log(`Deleted file from storage: ${file.storageId}`);
        }

        // Delete file record from database
        await ctx.db.delete(file._id);
        console.log(`Deleted file record: ${file._id}`);
      } catch (err) {
        console.error(`Error deleting file ${file._id}:`, err);
        // Continue with other files even if one fails
      }
    }

    // Delete all comments associated with this post
    const associatedComments = await ctx.db
      .query('comments')
      .withIndex('by_post', (q) => q.eq('postId', args.postId))
      .collect();

    console.log(`Found ${associatedComments.length} comments to delete`);

    for (const comment of associatedComments) {
      try {
        // 각 댓글과 관련된 알림 삭제
        await ctx.runMutation(internal.notifications.mutation.deleteNotificationsByEntity, {
          entityType: 'commentId',
          entityId: comment._id,
        });

        await ctx.db.delete(comment._id);
        console.log(`Deleted comment: ${comment._id}`);
      } catch (err) {
        console.error(`Error deleting comment ${comment._id}:`, err);
        // Continue with other comments even if one fails
      }
    }

    // 게시글과 관련된 모든 알림 삭제 - 공통 함수 사용
    await ctx.runMutation(internal.notifications.mutation.deleteNotificationsByEntity, {
      entityType: 'postId',
      entityId: args.postId,
    });

    // Finally, delete the post itself
    await ctx.db.delete(args.postId);
    console.log(`Deleted post: ${args.postId}`);

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
        // 수정: 타입 단언 사용
        likedBy: [...likedBy, userId as Id<'users'>],
        likeCount: likeCount,
      });

      // 포스트 작성자에게 알림 생성 (자신의 포스트가 아닌 경우)
      if (post.authorId && post.authorId !== userId) {
        // 좋아요를 누른 사용자의 프로필 조회
        const likerProfile = await ctx.db
          .query('userProfiles')
          .withIndex('by_user', (q) => q.eq('userId', userId))
          .unique();

        const likerName = likerProfile?.displayName || 'Someone';

        // 포스트 작성자의 언어 설정 조회
        const authorProfile = await ctx.db
          .query('userProfiles')
          .withIndex('by_user', (q) => q.eq('userId', post.authorId!))
          .unique();

        const authorLocale = authorProfile?.locale || 'en';

        // LIKE_ON_POST 알림 생성
        await ctx.runMutation(internal.notifications.mutation.createNotification, {
          userId: post.authorId,
          type: 'LIKE_ON_POST',
          postId: args.postId,
          triggeredById: userId,
          likerName: likerName,
          postTitle: post.title,
          locale: authorLocale,
        });
      }

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

    // 포스트 작성자에게 댓글 알림 생성 (자신의 포스트가 아닌 경우)
    if (post.authorId && post.authorId !== userId) {
      // 댓글 작성자 정보 가져오기
      const commenterProfile = await ctx.db
        .query('userProfiles')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .unique();

      const commenterName = commenterProfile?.displayName || 'Someone';

      // 포스트 작성자의 언어 설정 가져오기
      const authorProfile = await ctx.db
        .query('userProfiles')
        .withIndex('by_user', (q) => q.eq('userId', post.authorId!))
        .unique();

      const authorLocale = authorProfile?.locale || 'en';

      // COMMENT_ON_POST 알림 생성
      await ctx.runMutation(internal.notifications.mutation.createNotification, {
        userId: post.authorId,
        type: 'COMMENT_ON_POST',
        postId: args.postId,
        commentId: commentId,
        triggeredById: userId,
        commenterName: commenterName,
        postTitle: post.title,
        locale: authorLocale,
      });
    }

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

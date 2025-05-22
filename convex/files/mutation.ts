import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation, internalMutation } from '../_generated/server';
import { v } from 'convex/values';
import { Id } from '../_generated/dataModel';

// Generate upload URL - Step 1 of the upload process
export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // Generate a short-lived upload URL (valid for 1 hour)
    return await ctx.storage.generateUploadUrl();
  },
});

// Save file metadata after upload - Step 3 of the upload process
export const saveFileMetadata = mutation({
  args: {
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    fileId: v.id('files'),
    storageId: v.id('_storage'),
    url: v.string(),
  }),
  handler: async (
    ctx,
    args,
  ): Promise<{ success: boolean; fileId: Id<'files'>; storageId: Id<'_storage'>; url: string }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // Get the URL for the file
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error('Failed to generate URL for uploaded file');
    }

    // Insert file metadata into database with the URL
    const fileId = await ctx.db.insert('files', {
      storageId: args.storageId,
      fileName: args.fileName,
      contentType: args.contentType,
      userId: userId as Id<'users'>,
      url: url, // Store the URL in the database
    });

    return { success: true, fileId, storageId: args.storageId, url };
  },
});

// Store file metadata in database (internal version) - include URL
export const storeFileMetadata = internalMutation({
  args: {
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: v.string(),
    ownerId: v.id('users'),
    url: v.optional(v.string()),
  },
  returns: v.id('files'),
  handler: async (ctx, args): Promise<Id<'files'>> => {
    // Get URL if not provided
    let url = args.url;
    if (!url) {
      url = (await ctx.storage.getUrl(args.storageId)) || undefined;
    }

    return await ctx.db.insert('files', {
      storageId: args.storageId,
      fileName: args.fileName,
      contentType: args.contentType,
      userId: args.ownerId,
      url: url,
    });
  },
});

// Helper to delete a file record
export const deleteFileRecord = internalMutation({
  args: {
    fileId: v.id('files'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.fileId);
    return null;
  },
});

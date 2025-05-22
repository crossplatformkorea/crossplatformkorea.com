import { getAuthUserId } from '@convex-dev/auth/server';
import { action } from '../_generated/server';
import { v } from 'convex/values';
import { internal } from '../_generated/api';

// Delete a file
export const deleteFile = action({
  args: {
    fileId: v.id('files'),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // Get the file record using internal function
    const file = await ctx.runQuery(internal.files.query.getFileById, { fileId: args.fileId });
    if (!file) {
      throw new Error('File not found');
    }

    // Check ownership
    if (file.ownerId !== userId) {
      throw new Error('Not authorized to delete this file');
    }

    // Delete from storage
    await ctx.storage.delete(file.storageId);

    // Delete from database
    await ctx.runMutation(internal.files.mutation.deleteFileRecord, { fileId: args.fileId });

    return { success: true };
  },
});

// Delete a file directly by storage ID
export const deleteFileByStorageId = action({
  args: {
    storageId: v.id('_storage'),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // Find the file record
    const file = await ctx.runQuery(internal.files.query.getFileByStorageId, {
      storageId: args.storageId,
    });

    // If a record exists, check ownership
    if (file && file.ownerId !== userId) {
      throw new Error('Not authorized to delete this file');
    }

    try {
      // Delete from storage
      await ctx.storage.delete(args.storageId);

      // If we found a file record, delete it too
      if (file) {
        await ctx.runMutation(internal.files.mutation.deleteFileRecord, { fileId: file._id });
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },
});

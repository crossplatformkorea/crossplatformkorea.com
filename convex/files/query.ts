import { internalQuery } from '../_generated/server';
import { v } from 'convex/values';

// Internal helper to get a file by ID
export const getFileById = internalQuery({
  args: {
    fileId: v.id('files'),
  },
  returns: v.union(
    v.object({
      _id: v.id('files'),
      _creationTime: v.number(),
      storageId: v.id('_storage'),
      fileName: v.string(),
      contentType: v.string(),
      ownerId: v.id('users'),
      uploadedAt: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) return null;
    return {
      _id: file._id,
      _creationTime: file._creationTime,
      storageId: file.storageId,
      fileName: file.fileName,
      contentType: file.contentType,
      ownerId: file.userId, // Map userId to ownerId
      uploadedAt: file._creationTime, // Use _creationTime as uploadedAt if no explicit field
    };
  },
});

// Internal helper to get a file by storage ID
export const getFileByStorageId = internalQuery({
  args: {
    storageId: v.id('_storage'),
  },
  returns: v.union(
    v.object({
      _id: v.id('files'),
      _creationTime: v.number(),
      storageId: v.id('_storage'),
      fileName: v.string(),
      contentType: v.string(),
      ownerId: v.id('users'),
      uploadedAt: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const file = await ctx.db
      .query('files')
      .withIndex('by_storage_id', (q) => q.eq('storageId', args.storageId))
      .unique();

    if (!file) return null;

    return {
      _id: file._id,
      _creationTime: file._creationTime,
      storageId: file.storageId,
      fileName: file.fileName,
      contentType: file.contentType,
      ownerId: file.userId, // Map userId to ownerId
      uploadedAt: file._creationTime, // Use _creationTime as uploadedAt
    };
  },
});

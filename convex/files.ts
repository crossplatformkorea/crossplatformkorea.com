import { getAuthUserId } from '@convex-dev/auth/server';
import { action, mutation, query, internalMutation, internalQuery } from './_generated/server';
import { v } from 'convex/values';
import { Id } from './_generated/dataModel';
import { internal } from './_generated/api';

// Generate upload URL - Step 1 of the upload process
export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }
    
    // Generate a short-lived upload URL (valid for 1 hour)
    return await ctx.storage.generateUploadUrl();
  },
});

// Save file metadata after upload - Step 3 of the upload process
export const saveFileMetadata = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    contentType: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    fileId: v.id("files"),
    storageId: v.id("_storage"),
    url: v.string()
  }),
  handler: async (ctx, args): Promise<{ success: boolean, fileId: Id<"files">, storageId: Id<"_storage">, url: string }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Insert file metadata into database
    const fileId = await ctx.db.insert("files", {
      storageId: args.storageId,
      fileName: args.fileName,
      contentType: args.contentType,
      ownerId: userId as Id<"users">,
      uploadedAt: Date.now(),
    });
    
    // Get the URL for the file
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error("Failed to generate URL for uploaded file");
    }
    
    return { success: true, fileId, storageId: args.storageId, url };
  },
});

// Get a file URL by ID - Make public for direct access
export const getFileUrl = query({
  args: {
    fileId: v.id("files"),
  },
  returns: v.union(
    v.object({
      url: v.string(),
      fileName: v.string(),
      contentType: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) {
      return null;
    }
    
    try {
      // Get secure URL from storage with the content type
      const url = await ctx.storage.getUrl(file.storageId);
      if (!url) {
        return null;
      }
      
      return {
        url,
        fileName: file.fileName,
        contentType: file.contentType,
      };
    } catch (error) {
      console.error("Error getting file URL:", error);
      return null;
    }
  },
});

// Store file metadata in database (internal version)
export const storeFileMetadata = internalMutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    contentType: v.string(),
    ownerId: v.id("users"),
  },
  returns: v.id("files"),
  handler: async (ctx, args): Promise<Id<"files">> => {
    return await ctx.db.insert("files", {
      storageId: args.storageId,
      fileName: args.fileName,
      contentType: args.contentType,
      ownerId: args.ownerId,
      uploadedAt: Date.now(),
    });
  },
});

// List files for the current user
export const listUserFiles = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("files"),
      _creationTime: v.number(),
      storageId: v.id("_storage"),
      fileName: v.string(),
      contentType: v.string(),
      ownerId: v.id("users"),
      uploadedAt: v.number(),
    })
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    
    const files = await ctx.db
      .query("files")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId as Id<"users">))
      .collect();
      
    return files;
  },
});

// Internal helper to get a file by ID
export const getFileById = internalQuery({
  args: {
    fileId: v.id("files"),
  },
  returns: v.union(
    v.object({
      _id: v.id("files"),
      _creationTime: v.number(),
      storageId: v.id("_storage"),
      fileName: v.string(),
      contentType: v.string(),
      ownerId: v.id("users"),
      uploadedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.fileId);
  },
});

// Internal helper to get a file by storage ID
export const getFileByStorageId = internalQuery({
  args: {
    storageId: v.id("_storage"),
  },
  returns: v.union(
    v.object({
      _id: v.id("files"),
      _creationTime: v.number(),
      storageId: v.id("_storage"),
      fileName: v.string(),
      contentType: v.string(),
      ownerId: v.id("users"),
      uploadedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("files")
      .withIndex("by_storage_id", (q) => q.eq("storageId", args.storageId))
      .unique();
  },
});

// Helper to delete a file record
export const deleteFileRecord = internalMutation({
  args: {
    fileId: v.id("files"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.fileId);
    return null;
  },
});

// Delete a file
export const deleteFile = action({
  args: {
    fileId: v.id("files"),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }
    
    // Get the file record using internal function
    const file = await ctx.runQuery(internal.files.getFileById, { fileId: args.fileId });
    if (!file) {
      throw new Error("File not found");
    }
    
    // Check ownership
    if (file.ownerId !== userId) {
      throw new Error("Not authorized to delete this file");
    }
    
    // Delete from storage 
    await ctx.storage.delete(file.storageId);
    
    // Delete from database
    await ctx.runMutation(internal.files.deleteFileRecord, { fileId: args.fileId });
    
    return { success: true };
  },
});

// Delete a file directly by storage ID
export const deleteFileByStorageId = action({
  args: {
    storageId: v.id("_storage"),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }
    
    // Find the file record
    const file = await ctx.runQuery(internal.files.getFileByStorageId, { storageId: args.storageId });
    
    // If a record exists, check ownership
    if (file && file.ownerId !== userId) {
      throw new Error("Not authorized to delete this file");
    }
    
    try {
      // Delete from storage
      await ctx.storage.delete(args.storageId);
      
      // If we found a file record, delete it too
      if (file) {
        await ctx.runMutation(internal.files.deleteFileRecord, { fileId: file._id });
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  },
});
import { v } from 'convex/values';
import { query, internalQuery } from '../_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';
import { PersistentTextStreaming, StreamId } from "@convex-dev/persistent-text-streaming";
import { components } from "../_generated/api";

const persistentTextStreaming = new PersistentTextStreaming(
  components.persistentTextStreaming
);

export const getConversations = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('conversations'),
      _creationTime: v.number(),
      title: v.string(),
      userId: v.id('users'),
      createdAt: v.string(),
      updatedAt: v.string(),
    })
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    return await ctx.db
      .query('conversations')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .collect();
  },
});

export const getMessages = query({
  args: { conversationId: v.id('conversations') },
  returns: v.array(
    v.object({
      _id: v.id('messages'),
      _creationTime: v.number(),
      conversationId: v.id('conversations'),
      role: v.union(v.literal('user'), v.literal('assistant')),
      content: v.string(),
      streamId: v.optional(v.string()),
      isStreaming: v.optional(v.boolean()),
      createdAt: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Verify conversation belongs to user
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== userId) {
      throw new Error('Conversation not found or access denied');
    }

    return await ctx.db
      .query('messages')
      .withIndex('by_conversation', (q) => q.eq('conversationId', args.conversationId))
      .order('asc')
      .collect();
  },
});

// Internal version for HTTP actions (bypasses auth)
export const getMessagesInternal = internalQuery({
  args: { conversationId: v.id('conversations') },
  returns: v.array(
    v.object({
      _id: v.id('messages'),
      _creationTime: v.number(),
      conversationId: v.id('conversations'),
      role: v.union(v.literal('user'), v.literal('assistant')),
      content: v.string(),
      streamId: v.optional(v.string()),
      isStreaming: v.optional(v.boolean()),
      createdAt: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_conversation', (q) => q.eq('conversationId', args.conversationId))
      .order('asc')
      .collect();
  },
});

export const getChatBody = query({
  args: {
    streamId: v.string(),
  },
  returns: v.object({
    text: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("streaming"),
      v.literal("done"),
      v.literal("error"),
      v.literal("timeout")
    ),
  }),
  handler: async (ctx, args) => {
    try {
      const result = await persistentTextStreaming.getStreamBody(ctx, args.streamId as StreamId);
      return result;
    } catch (error) {
      console.error('Error getting stream body:', error);
      return { text: "", status: "error" as const };
    }
  },
});

export const getApiKey = query({
  args: {},
  returns: v.union(v.string(), v.null()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const apiKeyDoc = await ctx.db
      .query('apiKeys')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();

    if (!apiKeyDoc) return null;

    // Simple decoding using atob (browser-compatible base64 decoding)
    return atob(apiKeyDoc.encryptedKey);
  },
});

export const hasApiKey = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const apiKeyDoc = await ctx.db
      .query('apiKeys')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();

    return !!apiKeyDoc;
  },
});

export const getConversationById = internalQuery({
  args: { conversationId: v.id('conversations') },
  returns: v.union(
    v.object({
      _id: v.id('conversations'),
      _creationTime: v.number(),
      title: v.string(),
      userId: v.id('users'),
      createdAt: v.string(),
      updatedAt: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId);
  },
});

export const getApiKeyByUserId = internalQuery({
  args: { userId: v.id('users') },
  returns: v.union(
    v.object({
      _id: v.id('apiKeys'),
      _creationTime: v.number(),
      userId: v.id('users'),
      encryptedKey: v.string(),
      createdAt: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('apiKeys')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();
  },
});

export const getMessageByStreamId = internalQuery({
  args: { streamId: v.string() },
  returns: v.union(
    v.object({
      _id: v.id('messages'),
      _creationTime: v.number(),
      conversationId: v.id('conversations'),
      role: v.union(v.literal('user'), v.literal('assistant')),
      content: v.string(),
      streamId: v.optional(v.string()),
      isStreaming: v.optional(v.boolean()),
      createdAt: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('messages')
      .filter((q) => q.eq(q.field('streamId'), args.streamId))
      .first();
  },
});

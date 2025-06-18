import { v } from 'convex/values';
import { mutation, internalMutation } from '../_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';
import { PersistentTextStreaming } from "@convex-dev/persistent-text-streaming";
import { components } from "../_generated/api";

const persistentTextStreaming = new PersistentTextStreaming(
  components.persistentTextStreaming
);

export const createConversation = mutation({
  args: { title: v.string() },
  returns: v.id('conversations'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const now = new Date().toISOString();
    
    return await ctx.db.insert('conversations', {
      title: args.title,
      userId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Create a chat following the example pattern
export const createChat = mutation({
  args: {
    conversationId: v.id('conversations'),
    prompt: v.string(),
  },
  returns: v.object({
    messageId: v.id('messages'),
    streamId: v.string(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Verify conversation belongs to user
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== userId) {
      throw new Error('Conversation not found or access denied');
    }

    const now = new Date().toISOString();

    // Insert user message
    await ctx.db.insert('messages', {
      conversationId: args.conversationId,
      role: 'user',
      content: args.prompt,
      createdAt: now,
    });

    // Create a stream using the component and store the id in the database with our chat message
    const streamId = await persistentTextStreaming.createStream(ctx);
    
    // Create the AI message with the streamId
    const messageId = await ctx.db.insert('messages', {
      conversationId: args.conversationId,
      role: 'assistant',
      content: '', // Will be populated by the stream
      streamId: streamId,
      isStreaming: true,
      createdAt: now,
    });

    // Update conversation timestamp
    await ctx.db.patch(args.conversationId, {
      updatedAt: now,
    });

    return { messageId, streamId: streamId as string };
  },
});

export const createStreamingMessageInternal = internalMutation({
  args: {
    conversationId: v.id('conversations'),
    streamId: v.string(),
  },
  returns: v.id('messages'),
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    return await ctx.db.insert('messages', {
      conversationId: args.conversationId,
      role: 'assistant',
      content: '',
      streamId: args.streamId,
      isStreaming: true,
      createdAt: now,
    });
  },
});

export const markStreamComplete = internalMutation({
  args: {
    messageId: v.id('messages'),
    finalContent: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Check if the message is still streaming before updating
    const message = await ctx.db.get(args.messageId);
    if (!message || !message.isStreaming) {
      console.log('Message is already completed or not found, skipping update');
      return null;
    }

    await ctx.db.patch(args.messageId, {
      isStreaming: false,
      content: args.finalContent,
    });
    return null;
  },
});

export const storeApiKey = mutation({
  args: { apiKey: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Validate API key format
    if (!args.apiKey.trim().startsWith('sk-')) {
      throw new Error('Invalid API key format. API key should start with "sk-"');
    }

    // Simple encoding using btoa (browser-compatible base64 encoding)
    const encoded = btoa(args.apiKey.trim());
    const now = new Date().toISOString();

    const existing = await ctx.db
      .query('apiKeys')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { encryptedKey: encoded });
    } else {
      await ctx.db.insert('apiKeys', {
        userId,
        encryptedKey: encoded,
        createdAt: now,
      });
    }

    return null;
  },
});

export const deleteConversation = mutation({
  args: { conversationId: v.id('conversations') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Verify conversation belongs to user
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== userId) {
      throw new Error('Conversation not found or access denied');
    }

    // Delete all messages in the conversation
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_conversation', (q) => q.eq('conversationId', args.conversationId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the conversation
    await ctx.db.delete(args.conversationId);

    return null;
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id('conversations'),
    content: v.string(),
    model: v.optional(v.string()),
  },
  returns: v.object({
    userMessageId: v.id('messages'),
    streamingMessageId: v.id('messages'),
    streamId: v.string(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Verify conversation belongs to user
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== userId) {
      throw new Error('Conversation not found or access denied');
    }

    const now = new Date().toISOString();

    // Insert user message
    const userMessageId = await ctx.db.insert('messages', {
      conversationId: args.conversationId,
      role: 'user',
      content: args.content,
      createdAt: now,
    });

    // Create a stream using the component and store the id in the database with our chat message
    const streamId = await persistentTextStreaming.createStream(ctx);
    
    // Create the AI message with the streamId (remove model field for now)
    const streamingMessageId = await ctx.db.insert('messages', {
      conversationId: args.conversationId,
      role: 'assistant',
      content: '', // Will be populated by the stream
      streamId: streamId,
      isStreaming: true,
      createdAt: now,
    });

    // Update conversation title with the user's message (truncate if too long)
    const title = args.content.length > 50 
      ? args.content.substring(0, 50) + '...' 
      : args.content;

    // Update conversation timestamp and title
    await ctx.db.patch(args.conversationId, {
      title,
      updatedAt: now,
    });

    return { 
      userMessageId, 
      streamingMessageId, 
      streamId: streamId as string 
    };
  },
});

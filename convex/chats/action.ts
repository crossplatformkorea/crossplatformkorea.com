import { httpAction } from '../_generated/server';
import { internal } from '../_generated/api';
import { PersistentTextStreaming, StreamId } from "@convex-dev/persistent-text-streaming";
import { components } from "../_generated/api";

const persistentTextStreaming = new PersistentTextStreaming(
  components.persistentTextStreaming
);

// Main HTTP action for streaming chat responses
export const chatStream = httpAction(async (ctx, request) => {
  // Handle CORS preflight request
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const body = await request.json() as {
    streamId: string;
  };

  const generateChat = async (ctx: any, request: any, streamId: string, chunkAppender: (chunk: string) => Promise<void>) => {
    let streamCompleted = false;
    
    const safeChunkAppender = async (chunk: string) => {
      if (streamCompleted) {
        console.log("Stream already completed, skipping chunk:", chunk.slice(0, 50));
        return;
      }
      try {
        await chunkAppender(chunk);
      } catch (error) {
        console.error("Error appending chunk:", error);
        streamCompleted = true;
        throw error;
      }
    };

    const markStreamCompleted = async (messageId: string, content: string) => {
      if (streamCompleted) {
        console.log("Stream already marked as completed, skipping");
        return;
      }
      
      streamCompleted = true;
      try {
        await ctx.runMutation(internal.chats.mutation.markStreamComplete, {
          messageId,
          finalContent: content,
        });
        console.log("Stream marked as complete with content length:", content.length);
      } catch (error) {
        console.error("Error marking stream complete:", error);
      }
    };

    try {
      console.log("Generate chat called with streamId:", streamId);
      
      // Get the message that we're streaming to
      const message = await ctx.runQuery(internal.chats.query.getMessageByStreamId, { streamId });
      if (!message) {
        console.error("No message found for streamId:", streamId);
        await safeChunkAppender("Error: Message not found");
        await markStreamCompleted("", "Error: Message not found");
        return;
      }

      // Check if already processed
      if (!message.isStreaming) {
        console.log("Message already completed, skipping");
        streamCompleted = true;
        return;
      }

      // Get conversation to get userId
      const conversation = await ctx.runQuery(internal.chats.query.getConversationById, { 
        conversationId: message.conversationId 
      });

      if (!conversation) {
        await safeChunkAppender("Error: Conversation not found");
        await markStreamCompleted(message._id, "Error: Conversation not found");
        return;
      }

      // Get conversation history
      const allMessages = await ctx.runQuery(internal.chats.query.getMessagesInternal, { 
        conversationId: message.conversationId 
      });

      // Get the user's latest message
      const userMessages = allMessages.filter((m: any) => m.role === "user");
      const latestUserMessage = userMessages[userMessages.length - 1];
      
      if (!latestUserMessage) {
        const defaultResponse = "안녕하세요! 무엇을 도와드릴까요?";
        for (let i = 0; i < defaultResponse.length; i++) {
          await safeChunkAppender(defaultResponse[i]);
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        await markStreamCompleted(message._id, defaultResponse);
        return;
      }

      // Get the user's API key
      const apiKeyDoc = await ctx.runQuery(internal.chats.query.getApiKeyByUserId, { 
        userId: conversation.userId 
      });
      if (!apiKeyDoc) {
        const errorMsg = "OpenAI API key not found. Please configure your API key.";
        await safeChunkAppender(errorMsg);
        await markStreamCompleted(message._id, errorMsg);
        return;
      }

      // Decode the API key
      const openaiApiKey = atob(apiKeyDoc.encryptedKey);
      if (!openaiApiKey.startsWith('sk-')) {
        const errorMsg = "Invalid OpenAI API key format";
        await safeChunkAppender(errorMsg);
        await markStreamCompleted(message._id, errorMsg);
        return;
      }

      // Build OpenAI messages format
      const openaiMessages = allMessages
        .filter((msg: any) => !msg.isStreaming)
        .map((msg: any) => ({
          role: msg.role,
          content: msg.content
        }));

      openaiMessages.push({
        role: 'user',
        content: latestUserMessage.content
      });

      console.log('Calling OpenAI with', openaiMessages.length, 'messages');

      // Call OpenAI API directly
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: openaiMessages,
            stream: true,
            max_tokens: 2000,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let fullContent = '';
        let hasContent = false;
        let streamFinished = false;

        console.log('Starting to read OpenAI stream...');

        while (true) {
          const { done, value } = await reader.read();
          if (done || streamFinished) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                console.log('Stream finished with [DONE]');
                streamFinished = true;
                break;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';
                if (content) {
                  fullContent += content;
                  hasContent = true;
                  await safeChunkAppender(content);
                }
              } catch {
                continue;
              }
            }
          }
        }

        console.log('Stream completed. Total content length:', fullContent.length);

        if (hasContent && fullContent) {
          await markStreamCompleted(message._id, fullContent);
        } else if (!hasContent) {
          const fallbackMsg = "죄송합니다. 응답을 생성할 수 없었습니다.";
          await safeChunkAppender(fallbackMsg);
          await markStreamCompleted(message._id, fallbackMsg);
        }

      } catch (openaiError) {
        console.error('OpenAI streaming error:', openaiError);
        const errorMessage = "OpenAI API 호출 중 오류가 발생했습니다.";
        await safeChunkAppender(errorMessage);
        await markStreamCompleted(message._id, errorMessage);
      }

    } catch (error) {
      console.error("Chat generation error:", error);
      const errorMessage = "죄송합니다. 응답 중 오류가 발생했습니다.";
      
      try {
        await safeChunkAppender(errorMessage);
      } catch (chunkError) {
        console.error("Failed to append error chunk:", chunkError);
      }
      
      try {
        const message = await ctx.runQuery(internal.chats.query.getMessageByStreamId, { streamId });
        if (message && message.isStreaming) {
          await markStreamCompleted(message._id, errorMessage);
        }
      } catch (e) {
        console.error("Failed to mark message as complete on error:", e);
      }
    }
  };

  const response = await persistentTextStreaming.stream(
    ctx,
    request,
    body.streamId as StreamId,
    generateChat
  );

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Vary", "Origin");
  return response;
});

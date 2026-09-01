import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { MessageSquare, Settings, Plus, Trash2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/uis/Button';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { Id } from '@convex/_generated/dataModel';
import { t } from '@/lib/i18n';
import { MessageList } from './MessageList';
import { ApiKeyDialog } from './ApiKeyDialog';
import { ChatInput } from './ChatInput';
import { GptModel, GPT_MODELS } from './types';

export default function ChatGptPage() {
  const { isAuthenticated, isLoading, requireAuth } = useAuthStore();
  const [selectedConversationId, setSelectedConversationId] = useState<Id<'conversations'> | null>(
    null,
  );
  const [message, setMessage] = useState('');
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<GptModel>('gpt-4.1');
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  // Queries - only fetch when authenticated
  const conversations = useQuery(api.chats.query.getConversations, isAuthenticated ? {} : 'skip');

  const hasApiKey = useQuery(api.chats.query.hasApiKey, isAuthenticated ? {} : 'skip');

  const existingApiKey = useQuery(api.chats.query.getApiKey, isAuthenticated ? {} : 'skip');

  const messages = useQuery(
    api.chats.query.getMessages,
    selectedConversationId && isAuthenticated ? { conversationId: selectedConversationId } : 'skip',
  );

  // Check if user has API key configured
  useEffect(() => {
    if (isAuthenticated && hasApiKey === false) {
      setIsApiKeyDialogOpen(true);
    }
  }, [isAuthenticated, hasApiKey]);

  // Mutations
  const createConversation = useMutation(api.chats.mutation.createConversation);
  const sendMessage = useMutation(api.chats.mutation.sendMessage);
  const deleteConversation = useMutation(api.chats.mutation.deleteConversation);
  const storeApiKey = useMutation(api.chats.mutation.storeApiKey);

  // Auto-select first conversation
  useEffect(() => {
    if (conversations && conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0]._id);
    }
  }, [conversations, selectedConversationId]);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      requireAuth();
    }
  }, [isAuthenticated, isLoading, requireAuth]);

  const handleNewConversation = async () => {
    try {
      const conversationId = await createConversation({
        title: `New Chat ${new Date().toLocaleString()}`,
      });
      setSelectedConversationId(conversationId);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const handleSendMessage = async (model?: GptModel) => {
    if (!message.trim() || !selectedConversationId || !hasApiKey || isSending) return;

    const userMessage = message.trim();
    setMessage('');
    setIsSending(true);
    setError(null); // Clear any previous errors

    try {
      // Send user message and create streaming AI response
      // The backend will automatically update the conversation title with the user message
      const result = await sendMessage({
        conversationId: selectedConversationId,
        content: userMessage,
        model,
      });

      console.log('Created streaming message with streamId:', result.streamId);

      // The streaming will now be handled by the persistent-text-streaming component
      // No need to call HTTP endpoint manually - the useStream hook will handle it
    } catch (error) {
      console.error('Failed to send message:', error);
      // Set user-friendly error message based on error type
      if (error instanceof Error) {
        const errorMessage = error.message;

        // Map specific error messages to translation keys
        if (
          errorMessage.includes('Invalid OpenAI API key') ||
          errorMessage.includes('Incorrect API key')
        ) {
          setError(t('chat.errors.invalidApiKey'));
        } else if (errorMessage.includes('rate limit')) {
          setError(t('chat.errors.rateLimitExceeded'));
        } else if (errorMessage.includes('insufficient') || errorMessage.includes('credits')) {
          setError(t('chat.errors.insufficientCredits'));
        } else if (errorMessage.includes('API key should start with')) {
          setError(t('chat.errors.invalidApiKeyFormat'));
        } else {
          setError(errorMessage);
        }
      } else {
        setError(t('chat.errors.failedToSend'));
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteConversation = async (conversationId: Id<'conversations'>) => {
    try {
      await deleteConversation({ conversationId });
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null);
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        {t('common.loading')}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <MessageSquare size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">{t('common.loginToAccess')}</p>
          <Button onClick={requireAuth}>{t('common.signIn')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50 dark:bg-zinc-900 w-full max-w-full overflow-hidden">
      {/* Main content on the left */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        {selectedConversationId ? (
          <>
            {/* Model Selection Header */}
            <div className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 p-3 flex justify-center">
              <div className="relative">
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <span className="font-medium">
                    {GPT_MODELS.find((m) => m.value === selectedModel)?.label}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${showModelDropdown ? 'rotate-180' : ''}`}
                  />
                </button>

                {showModelDropdown && (
                  <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-lg z-10 min-w-80 max-h-96 overflow-y-auto">
                    {/* Group models by category */}
                    {['Flagship', 'Reasoning', 'Cost-optimized'].map((category) => (
                      <div key={category}>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-800">
                          {category}
                        </div>
                        {GPT_MODELS.filter((model) => model.category === category).map((model) => (
                          <button
                            key={model.value}
                            onClick={() => {
                              setSelectedModel(model.value);
                              setShowModelDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors border-b border-gray-100 dark:border-zinc-800 last:border-b-0 ${
                              selectedModel === model.value ? 'bg-gray-100 dark:bg-zinc-800' : ''
                            }`}
                          >
                            <div className="font-medium text-gray-900 dark:text-white">
                              {model.label}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-zinc-400">
                              {model.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-zinc-900 min-h-0">
              <MessageList messages={messages || []} />
            </div>

            {/* Input - at bottom of chat area */}
            <ChatInput
              message={message}
              setMessage={setMessage}
              hasApiKey={hasApiKey || false}
              isSending={isSending}
              handleSendMessage={handleSendMessage}
              setIsApiKeyDialogOpen={setIsApiKeyDialogOpen}
              error={error}
              setError={setError}
              selectedModel={selectedModel}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
            <div className="text-center max-w-md mx-auto">
              <MessageSquare size={48} className="mx-auto mb-4 text-gray-400 dark:text-zinc-500" />
              <p className="text-gray-600 dark:text-zinc-400 mb-4">{t('chat.noConversations')}</p>
              {!hasApiKey ? (
                <Button
                  onClick={() => setIsApiKeyDialogOpen(true)}
                  className="bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 text-white"
                >
                  <Settings size={16} className="mr-2" />
                  {t('chat.apiKey.title')}
                </Button>
              ) : (
                <Button
                  onClick={() => void handleNewConversation()}
                  className="bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 text-white"
                >
                  <Plus size={16} className="mr-2" />
                  {t('chat.newChat')}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat Sidebar on the right - only show if there are conversations */}
      {conversations && conversations.length > 0 && (
        <div className="w-72 border-l border-gray-200 dark:border-zinc-800 flex flex-col bg-gray-50 dark:bg-zinc-900 flex-shrink-0 h-full">
          <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                <MessageSquare size={20} />
                ChatGPT
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsApiKeyDialogOpen(true)}
                title={t('chat.apiKey.title')}
                className="text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <Settings size={16} />
              </Button>
            </div>
            <Button
              onClick={() => void handleNewConversation()}
              className="w-full bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 text-white"
              size="sm"
            >
              <Plus size={16} className="mr-2" />
              {t('chat.newChat')}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {conversations?.map((conversation) => (
              <div
                key={conversation._id}
                className={cn(
                  'p-3 border-b border-gray-100 dark:border-zinc-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 group flex items-center justify-between',
                  selectedConversationId === conversation._id && 'bg-gray-100 dark:bg-zinc-800',
                )}
                onClick={() => setSelectedConversationId(conversation._id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-gray-900 dark:text-white">
                    {conversation.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 p-1 h-auto text-gray-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleDeleteConversation(conversation._id);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <ApiKeyDialog
        open={isApiKeyDialogOpen}
        onOpenChange={setIsApiKeyDialogOpen}
        onApiKeySaved={() => {
          setIsApiKeyDialogOpen(false);
        }}
        onStoreApiKey={storeApiKey}
        existingApiKey={existingApiKey}
      />
    </div>
  );
}

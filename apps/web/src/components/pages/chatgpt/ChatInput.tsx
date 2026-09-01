import React, { useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/uis/Button';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { GptModel } from './types';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  hasApiKey: boolean;
  isSending: boolean;
  handleSendMessage: (model?: GptModel) => Promise<void>;
  setIsApiKeyDialogOpen: (open: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  selectedModel: GptModel;
}

export function ChatInput({
  message,
  setMessage,
  hasApiKey,
  isSending,
  handleSendMessage,
  setIsApiKeyDialogOpen,
  error,
  setError,
  selectedModel,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (hasApiKey && message.trim() && !isSending) {
        void handleSendMessage(selectedModel);
      }
    }
  };

  // Auto-resize textarea with better height control
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get proper scrollHeight
      textarea.style.height = '48px'; // Reset to minHeight

      // Calculate new height based on content, with max limit
      const newHeight = Math.min(textarea.scrollHeight, 120);
      textarea.style.height = `${newHeight}px`;

      // Ensure no scrolling
      textarea.scrollTop = 0;
    }
  }, [message]);

  return (
    <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex-shrink-0">
      {/* Error message */}
      {error && (
        <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-1 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
          >
            {t('common.dismiss')}
          </button>
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasApiKey ? t('chat.typeMessage') : t('chat.configureApiKey')}
            disabled={!hasApiKey || isSending}
            className={cn(
              'w-full p-3 pr-12 rounded-xl resize-none overflow-hidden',
              'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700',
              'text-gray-900 dark:text-zinc-200 placeholder-gray-500 dark:placeholder-zinc-400',
              'focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-zinc-600 focus:border-gray-400 dark:focus:border-zinc-600',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-colors duration-200'
            )}
            rows={1}
            style={{
              minHeight: '48px',
              maxHeight: '120px',
              height: '48px', // Initial height
            }}
          />

          {/* Send button */}
          <Button
            onClick={() => void handleSendMessage(selectedModel)}
            disabled={!hasApiKey || !message.trim() || isSending}
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 h-8 w-8 rounded-lg"
          >
            <Send size={14} />
          </Button>
        </div>

        {/* API Key button (when no key configured) */}
        {!hasApiKey && (
          <Button
            onClick={() => setIsApiKeyDialogOpen(true)}
            variant="outline"
            size="sm"
            className="px-3 flex-shrink-0 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
          >
            {t('chat.apiKey.configure')}
          </Button>
        )}
      </div>
    </div>
  );
}

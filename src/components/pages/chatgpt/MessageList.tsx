import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { StreamingMessage } from './StreamingMessage';
import { Message } from './types';
import { Button } from '@/components/uis/Button';

export function MessageList({ messages }: { messages: Message[] }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-gray-50 dark:bg-zinc-900">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mx-auto mb-3 opacity-50">
            <span className="text-white font-bold">AI</span>
          </div>
          <p className="text-gray-600 dark:text-zinc-400">{t('chat.noConversations')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-zinc-900">
      <div className="p-6 space-y-6 max-w-full">
        {messages.map((message) => (
          <div
            key={message._id}
            className={cn(
              'flex w-full',
              message.role === "user" ? "justify-end" : "justify-start",
              'animate-fade-in'
            )}
          >
            <div className={cn(
              'flex gap-3 max-w-[calc(100%-2rem)] min-w-0',
              message.role === "user" ? "flex-row-reverse" : ""
            )}>
              {/* Avatar */}
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                message.role === "user"
                  ? "bg-gray-300 dark:bg-zinc-600"
                  : "bg-gray-600 dark:bg-zinc-700"
              )}>
                {message.role === "user" ? (
                  <svg className="w-4 h-4 text-gray-700 dark:text-zinc-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                ) : (
                  <span className="text-white font-bold text-xs">AI</span>
                )}
              </div>

              {/* Message content */}
              <div className={cn(
                'relative group',
                'p-4 rounded-2xl min-w-0 flex-1 max-w-full',
                message.role === "user"
                  ? "bg-gray-700 dark:bg-zinc-700 text-white"
                  : "bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 border border-gray-200 dark:border-zinc-700"
              )}>
                {/* Copy button for assistant messages */}
                {message.role === "assistant" && message.content && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void handleCopyMessage(message.content, message._id)}
                      className="p-1 h-auto w-auto hover:bg-gray-200 dark:hover:bg-zinc-700 rounded"
                      title="Copy message"
                    >
                      {copiedMessageId === message._id ? (
                        <Check size={14} className="text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy size={14} className="text-gray-500 dark:text-zinc-400" />
                      )}
                    </Button>
                  </div>
                )}

                {message.role === "assistant" && message.streamId ? (
                  <StreamingMessage message={message} />
                ) : message.role === "assistant" ? (
                  <div className="max-w-none text-sm overflow-hidden" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    <ReactMarkdown 
                      components={{
                        // Links
                        a: ({ href, children, ...props }) => (
                          <a
                            href={href}
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 underline break-all"
                          >
                            {children}
                          </a>
                        ),
                        // Code blocks
                        code: ({ children, className, ...props }) => {
                          const isInline = !className?.includes('language-');
                          if (isInline) {
                            return (
                              <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 break-all" {...props}>
                                {children}
                              </code>
                            );
                          }
                          return (
                            <code className="text-sm font-mono text-gray-100 dark:text-gray-300" {...props}>
                              {children}
                            </code>
                          );
                        },
                        pre: ({ children, ...props }) => (
                          <pre className="bg-gray-900 dark:bg-black text-gray-100 dark:text-gray-300 p-4 rounded-lg my-4 overflow-x-auto border border-gray-300 dark:border-gray-700 max-w-full" {...props}>
                            {children}
                          </pre>
                        ),
                        // Custom list styling
                        ol: ({ children, ...props }) => (
                          <div className="my-3">
                            <ol
                              style={{
                                listStyleType: 'decimal',
                                paddingLeft: '1.25rem',
                                lineHeight: '1.6',
                              }}
                              {...props}
                            >
                              {children}
                            </ol>
                          </div>
                        ),
                        ul: ({ children, ...props }) => (
                          <div className="my-3">
                            <ul
                              style={{
                                listStyleType: 'disc',
                                paddingLeft: '1.25rem',
                                lineHeight: '1.6',
                              }}
                              {...props}
                            >
                              {children}
                            </ul>
                          </div>
                        ),
                        li: ({ children, ...props }) => (
                          <li
                            style={{
                              display: 'list-item',
                              marginBottom: '0.25rem',
                            }}
                            {...props}
                          >
                            {children}
                          </li>
                        ),
                        p: ({ children, ...props }) => (
                          <p className="mb-3 leading-relaxed" {...props}>
                            {children}
                          </p>
                        ),
                        // Headers
                        h1: ({ children, ...props }) => (
                          <h1 className="text-lg font-bold mb-2 mt-4" {...props}>
                            {children}
                          </h1>
                        ),
                        h2: ({ children, ...props }) => (
                          <h2 className="text-base font-bold mb-2 mt-3" {...props}>
                            {children}
                          </h2>
                        ),
                        h3: ({ children, ...props }) => (
                          <h3 className="text-sm font-bold mb-1 mt-2" {...props}>
                            {children}
                          </h3>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap break-words overflow-hidden">
                    {message.content}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

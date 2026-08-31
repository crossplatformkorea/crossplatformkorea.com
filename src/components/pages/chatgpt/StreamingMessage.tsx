import { useEffect, useMemo, useState } from 'react';
import { useStream } from '@convex-dev/persistent-text-streaming/react';
import { StreamId } from '@convex-dev/persistent-text-streaming';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

// 마크다운 bold/italic을 HTML로 전처리 (HTML과 마크다운이 섞여있을 때 파싱 문제 해결)
function preprocessMarkdown(content: string): string {
  let processed = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  processed = processed.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  return processed;
}
import { Message } from './types';
import { api } from '../../../../convex/_generated/api';
import { Button } from '@/components/uis/Button';

export function StreamingMessage({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const [canDriveStream, setCanDriveStream] = useState(!import.meta.env.DEV);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    // The package's same-stream guard cannot restart a fetch aborted by the
    // development-only StrictMode effect replay. Wait until that replay ends.
    const timer = window.setTimeout(() => setCanDriveStream(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Convex site URL for HTTP actions - convert .cloud to .site
  const convexApiUrl = import.meta.env.VITE_CONVEX_URL;
  const convexSiteUrl =
    convexApiUrl?.replace('.convex.cloud', '.convex.site') || window.location.origin;
  const streamUrl = useMemo(() => new URL(`${convexSiteUrl}/chat-stream`), [convexSiteUrl]);

  // For newly created streaming messages, this component should drive the stream
  const isDriven = message.isStreaming === true;

  const { text, status } = useStream(
    api.chats.query.getChatBody,
    streamUrl,
    isDriven && canDriveStream, // Drive after the StrictMode replay is complete
    message.streamId as StreamId,
  );

  // Use streamed text if available and streaming, otherwise use message content
  const displayText = status === 'streaming' && text ? text : message.content;
  const isActive = status === 'streaming' || message.isStreaming;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  return (
    <div className="relative group">
      {/* Copy button - only show when not actively streaming and has content */}
      {!isActive && displayText && (
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void handleCopy()}
            className="p-1 h-auto w-auto hover:bg-gray-200 dark:hover:bg-zinc-700 rounded"
            title="Copy message"
          >
            {copied ? (
              <Check size={14} className="text-green-600 dark:text-green-400" />
            ) : (
              <Copy size={14} className="text-gray-500 dark:text-zinc-400" />
            )}
          </Button>
        </div>
      )}

      <div
        className="max-w-none text-sm overflow-hidden"
        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
      >
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
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
                  <code
                    className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-600 break-all"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              return (
                <code className="text-sm font-mono text-gray-100 dark:text-gray-200" {...props}>
                  {children}
                </code>
              );
            },
            pre: ({ children, ...props }) => (
              <pre
                className="bg-gray-900 dark:bg-gray-800 text-gray-100 dark:text-gray-200 p-4 rounded-lg my-4 overflow-x-auto border border-gray-300 dark:border-gray-600 max-w-full"
                {...props}
              >
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
            // Blockquote
            blockquote: ({ children, ...props }) => (
              <blockquote
                className="border-l-4 border-primary/50 pl-4 my-4 italic text-gray-700 dark:text-gray-200"
                {...props}
              >
                {children}
              </blockquote>
            ),
          }}
        >
          {preprocessMarkdown(displayText)}
        </ReactMarkdown>
        {isActive && (
          <span className="inline-block w-2 h-5 bg-current opacity-75 animate-pulse ml-1" />
        )}
      </div>
    </div>
  );
}

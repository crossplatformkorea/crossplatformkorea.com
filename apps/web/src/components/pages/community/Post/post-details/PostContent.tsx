import { Children, isValidElement, useSyncExternalStore, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { YouTubeEmbed } from '@/components/uis/YouTubeEmbed';
import { extractYouTubeVideoId } from '@/utils/youtube';
import { preprocessPostMarkdown } from '@/lib/postMarkup';

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

function codeText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) =>
      isValidElement<{ children?: ReactNode }>(child)
        ? codeText(child.props.children)
        : typeof child === 'string' || typeof child === 'number'
          ? String(child)
          : '',
    )
    .join('');
}

export default function PostContent({
  content,
  youtubeUrl,
}: {
  content: string;
  youtubeUrl?: string;
}) {
  const { t } = useTranslation();
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.classList.contains('dark'),
    () => false,
  );
  const primaryVideo = youtubeUrl ? extractYouTubeVideoId(youtubeUrl) : null;

  return (
    <div className="article-prose prose">
      {primaryVideo && (
        <div className="article-video">
          <YouTubeEmbed videoId={primaryVideo} />
        </div>
      )}
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node: _node, children, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          p: ({ node: _node, children, ...props }) => {
            const parts = Children.toArray(children).filter(
              (child) => typeof child !== 'string' || child.trim(),
            );
            const link =
              parts.length === 1 && isValidElement<{ href?: string }>(parts[0]) ? parts[0] : null;
            const href = link?.props.href;
            const videoId = href ? extractYouTubeVideoId(href) : null;
            // Only standalone video links become block embeds, avoiding divs inside paragraphs.
            if (videoId && videoId !== primaryVideo)
              return (
                <div className="article-video">
                  <YouTubeEmbed videoId={videoId} />
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-xs"
                  >
                    {t('posts.watchOnYoutube')}
                  </a>
                </div>
              );
            return <p {...props}>{children}</p>;
          },
          // Block classification belongs to pre, so unlabelled code stays a block too.
          pre: ({ children }) => {
            const child = Children.toArray(children)[0];
            const code = isValidElement<{ className?: string; children?: ReactNode }>(child)
              ? child
              : null;
            const language = /language-([\w+-]+)/.exec(code?.props.className || '')?.[1] || 'text';
            return (
              <div className="article-code">
                <div className="article-code-label">{language}</div>
                <SyntaxHighlighter
                  language={language}
                  style={isDark ? vscDarkPlus : vs}
                  customStyle={{
                    margin: 0,
                    padding: '1.25rem',
                    fontSize: '0.8125rem',
                    lineHeight: '1.7',
                    borderRadius: 0,
                  }}
                  wrapLongLines={false}
                >
                  {codeText(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            );
          },
          code: ({ node: _node, children, ...props }) => <code {...props}>{children}</code>,
          table: ({ node: _node, children, ...props }) => (
            <div
              className="article-table"
              tabIndex={0}
              role="region"
              aria-label={t('posts.tableLabel')}
            >
              <table {...props}>{children}</table>
            </div>
          ),
          img: ({ node: _node, ...props }) => <img {...props} loading="lazy" />,
          h1: ({ node: _node, children, ...props }) => <h2 {...props}>{children}</h2>,
        }}
      >
        {preprocessPostMarkdown(content)}
      </ReactMarkdown>
    </div>
  );
}

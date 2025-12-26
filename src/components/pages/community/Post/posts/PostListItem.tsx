import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MessageSquare, Heart, Eye, User } from 'lucide-react';
import { Doc } from '../../../../../../convex/_generated/dataModel';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { useAuthStore } from '@/stores/authStore';
import CategoryBadge from '../../../../uis/CategoryBadge';
import { Button } from '../../../../uis/Button';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { createUserProfileLink } from '@/lib/utils';

// Import Post type from Convex data model
type Post = Doc<'posts'>;

interface PostListItemProps {
  post: Post;
  isEventsCategory?: boolean;
}

export default function PostListItem({ post, isEventsCategory = false }: PostListItemProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, requireAuth } = useAuthStore();

  // 개별 통계 쿼리 제거하고 hasLiked만 유지
  const hasLiked = useQuery(api.posts.query.hasLiked, { postId: post._id });

  // Use getProfile instead of getUser to fetch author information
  const authorQuery = useQuery(
    api.users.query.getProfile,
    post.authorId ? { userId: post.authorId } : 'skip',
  );

  // Add mutation for toggling likes
  const toggleLike = useMutation(api.posts.mutation.toggleLike);

  // Handle like button click
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to post detail
    e.stopPropagation(); // Stop event propagation

    // 로그인 상태 확인
    if (!isAuthenticated) {
      // zustand 스토어를 사용한 로그인 필요 토스트 표시
      requireAuth();
      return;
    }

    void toggleLike({ postId: post._id });
  };

  // Handle author profile click
  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to post detail
    e.stopPropagation(); // Stop event propagation
    if (author?.displayName) {
      void navigate(createUserProfileLink(author.displayName));
    }
  };

  // 포스트 통계 데이터 - post 객체에서 직접 가져옴
  const commentCount = post.commentCount || 0;
  const viewCount = post.viewCount || 0;
  const likeCount = post.likeCount || 0;
  const author = authorQuery || null;

  // Process content for preview - strip images, iframes, and limit length
  const contentForPreview = (() => {
    if (!post.content) return '';
    const stripped = post.content
      // Remove img tags
      .replace(/<img[^>]*>/gi, '')
      // Remove iframe tags
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      // Remove markdown images ![alt](url)
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    return stripped.length > 300 ? stripped.substring(0, 300) + '...' : stripped;
  })();

  return (
    <Link
      to={`/post/${post._id}`}
      className={cn(
        'block transition-all duration-300 overflow-hidden rounded-xl shadow-sm border group',
        'bg-background/80 hover:bg-background',
        'border-border/20 dark:border-border/25',
        'dark:bg-gray-800/50 dark:hover:bg-gray-800/70 dark:shadow-md dark:shadow-black/5',
        'hover:shadow-lg hover:border-border/40 hover:scale-[1.01]',
        'transform-gpu w-full', // 세로 리스트에 적합한 스타일
      )}
    >
      {/* Thumbnail + Main content area */}
      <div className={cn('flex', post.thumbnail ? 'flex-row items-center' : 'flex-col')}>
        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="flex-shrink-0 w-32 h-24 sm:w-44 sm:h-28 m-4 mr-0 rounded-lg overflow-hidden bg-muted/30">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        )}

        {/* Main content area */}
        <div className={cn('flex-1 p-5 pb-4', post.thumbnail && 'min-w-0 py-4')}>
        {/* Title area with category badge */}
        <div className={cn('flex items-start justify-between', post.thumbnail ? 'mb-2' : 'mb-3')}>
          <h3 className={cn(
            'font-semibold flex-1 mr-3 group-hover:text-primary transition-colors',
            post.thumbnail ? 'text-base sm:text-lg line-clamp-2' : 'text-xl line-clamp-2'
          )}>
            {post.title}
          </h3>
          <CategoryBadge category={post.category} />
        </div>

        {/* Tags - hide when thumbnail exists for cleaner look */}
        {post.tags.length > 0 && !post.thumbnail && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className={cn(
                  'px-3 py-1 text-xs rounded-full border transition-all duration-200',
                  'bg-primary/10 text-primary border-primary/20',
                  'dark:bg-primary/20 dark:text-white dark:border-primary/30',
                  'hover:bg-primary/20 hover:scale-105 transform-gpu',
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 4 && (
              <span className="text-xs text-muted-foreground dark:text-gray-300 px-2 py-1">
                +{post.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Content preview - shorter when thumbnail exists */}
        {post.content && (
          <div className={cn(
            'text-sm text-muted-foreground dark:text-gray-300/80 overflow-hidden',
            post.thumbnail ? 'mb-0' : 'mb-4'
          )}>
            <div className={cn(
              'prose prose-sm dark:prose-invert max-w-none transition-all duration-300',
              post.thumbnail ? 'line-clamp-2' : 'line-clamp-3 group-hover:line-clamp-none'
            )}>
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  // Convert links to plain text to avoid nested <a> tags
                  a: ({ children, href }) => (
                    <span className="text-primary font-medium">
                      {children} {href && <span className="text-muted-foreground">({href})</span>}
                    </span>
                  ),
                  // Ensure other interactive elements don't create nested links
                  button: ({ children }) => <span>{children}</span>,
                  // Hide images in preview - thumbnail is shown separately
                  img: () => null,
                  // Hide iframes (YouTube embeds, etc.) in preview
                  iframe: () => null,
                }}
              >
                {contentForPreview}
              </ReactMarkdown>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Subtle divider between content and metadata - Improved visibility for dark mode */}
      <div className="border-t border-border/20 dark:border-gray-700 mx-4"></div>

      {/* Footer with stats and metadata */}
      <div
        className={cn(
          'px-5 py-4 flex items-center justify-between',
          'bg-muted/5 dark:bg-gray-800/70 border-t border-border/10',
          'group-hover:bg-muted/10 transition-colors duration-300',
        )}
      >
        {/* Left side - author and date */}
        <div className="flex items-center text-muted-foreground dark:text-gray-300">
          {author && (
            <Button
              onClick={handleAuthorClick}
              variant="ghost"
              size="sm"
              className={cn(
                'flex items-center transition-colors py-1 px-2 -ml-2 h-auto',
                'hover:text-foreground hover:bg-muted/50',
                'dark:hover:bg-gray-700/60',
              )}
            >
              {author.avatarUrl ? (
                <img
                  src={author.avatarUrl}
                  alt={author.displayName || 'User'}
                  className={cn(
                    'w-6 h-6 rounded-full mr-2 object-cover transition-all',
                    'group-hover:ring-1 group-hover:ring-primary/30',
                    'dark:border dark:border-gray-600',
                  )}
                />
              ) : (
                <User size={18} className="mr-2 text-muted-foreground/70" />
              )}
              <span
                className={cn(
                  'font-medium text-foreground/80 transition-colors dark:text-gray-200',
                  'group-hover:text-foreground',
                )}
              >
                {author.displayName || ''}
              </span>
            </Button>
          )}
          <span className="mx-1.5 text-muted-foreground/50 dark:text-gray-500">•</span>
          <time
            dateTime={new Date(post._creationTime).toISOString()}
            className="text-xs dark:text-gray-400"
          >
            {formatDistanceToNow(new Date(post._creationTime), {
              addSuffix: true,
              locale: i18n.language === 'ko' ? ko : undefined,
            })}
          </time>
        </div>

        {/* Right side - engagement metrics */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground dark:text-gray-300">
          <Button
            onClick={handleLikeClick}
            variant="ghost"
            size="sm"
            className={cn(
              'flex items-center py-1 px-1.5 h-auto',
              hasLiked ? 'text-rose-500' : '',
              'hover:bg-rose-500/10 dark:hover:bg-rose-500/20 hover:text-rose-500',
            )}
            title={t('posts.likes')}
            aria-pressed={hasLiked}
          >
            <Heart size={14} className={cn('mr-1.5', hasLiked ? 'fill-rose-500' : 'opacity-70')} />
            <span className="text-xs">{likeCount}</span>
          </Button>

          <div
            className="flex items-center py-1 px-1 text-primary/80 dark:text-gray-200"
            title={t('posts.comments')}
          >
            <MessageSquare size={14} className="mr-1.5 opacity-80 dark:text-gray-200" />
            <span className="text-xs dark:text-gray-200">{commentCount}</span>
          </div>

          <div className="flex items-center py-1 px-1" title={t('posts.views')}>
            <Eye size={14} className="mr-1.5 opacity-70" />
            <span className="text-xs">{viewCount}</span>
          </div>
        </div>
      </div>

      {/* Event period - only for event categories */}
      {isEventsCategory && post.startDate && post.endDate && (
        <div className="px-4 py-2 border-t border-border/20 dark:border-gray-700 text-xs text-muted-foreground dark:text-gray-400 italic">
          {t('posts.eventPeriod', {
            start: new Date(post.startDate).toLocaleDateString(),
            end: new Date(post.endDate).toLocaleDateString(),
          })}
        </div>
      )}
    </Link>
  );
}

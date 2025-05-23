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
    if (post.authorId) {
      void navigate(`/user/${post.authorId}`);
    }
  };

  // 포스트 통계 데이터 - post 객체에서 직접 가져옴
  const commentCount = post.commentCount || 0;
  const viewCount = post.viewCount || 0;
  const likeCount = post.likeCount || 0;
  const author = authorQuery || null;

  // Process content for preview (strip HTML tags, limit length)
  const isTruncated = post.content ? post.content.replace(/<[^>]*>?/gm, '').length > 150 : false;
  const contentPreview = post.content
    ? post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + (isTruncated ? '…' : '')
    : '';

  return (
    <Link
      to={`/post/${post._id}`}
      className="block bg-background/60 hover:bg-background transition-all duration-200 overflow-hidden rounded-md shadow-sm hover:shadow border border-border/10 dark:border-border/15 dark:bg-gray-800/40 dark:hover:bg-gray-800/60 dark:shadow-md dark:shadow-black/5"
    >
      {/* Main content area */}
      <div className="p-4 pb-3">
        {/* Title area with category badge */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-medium line-clamp-2 flex-1 mr-2">{post.title}</h3>
          <CategoryBadge category={post.category} />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-primary/10 dark:bg-primary/20 text-primary dark:text-white text-xs rounded-full border-[0.5px] border-primary/20 dark:border-primary/30"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-muted-foreground dark:text-gray-300 px-1">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Content preview */}
        {contentPreview && (
          <p className="text-sm text-muted-foreground dark:text-gray-300/80 line-clamp-2 mb-3">
            {contentPreview}
          </p>
        )}
      </div>

      {/* Subtle divider between content and metadata - Improved visibility for dark mode */}
      <div className="border-t border-border/20 dark:border-gray-700 mx-4"></div>

      {/* Footer with stats and metadata */}
      <div className="px-4 py-3 bg-muted/5 dark:bg-gray-800/70 flex items-center justify-between">
        {/* Left side - author and date */}
        <div className="flex items-center text-muted-foreground dark:text-gray-300">
          {post.authorId && author && (
            <button
              onClick={handleAuthorClick}
              className="flex items-center hover:text-foreground transition-colors bg-transparent border-0 py-1 px-2 -ml-2 rounded-md hover:bg-muted/50 dark:hover:bg-gray-700/60 cursor-pointer group"
            >
              {author.avatarUrl ? (
                <img
                  src={author.avatarUrl}
                  alt={author.displayName || 'User'}
                  className="w-6 h-6 rounded-full mr-2 object-cover group-hover:ring-1 group-hover:ring-primary/30 transition-all dark:border dark:border-gray-600"
                />
              ) : (
                <User size={18} className="mr-2 text-muted-foreground/70" />
              )}
              <span className="font-medium text-foreground/80 group-hover:text-foreground transition-colors dark:text-gray-200">
                {author.displayName || ''}
              </span>
            </button>
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
          <button
            onClick={handleLikeClick}
            className={`flex items-center py-1 px-1.5 rounded-md ${
              hasLiked ? 'text-rose-500' : ''
            } hover:bg-rose-500/10 dark:hover:bg-rose-500/20 hover:text-rose-500 transition-colors`}
            title={t('posts.likes')}
            aria-pressed={hasLiked}
          >
            <Heart size={14} className={`mr-1.5 ${hasLiked ? 'fill-rose-500' : 'opacity-70'}`} />
            <span className="text-xs">{likeCount}</span>
          </button>

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

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MessageSquare, Heart, Eye, User } from 'lucide-react';
import { Doc } from '../../../../../../convex/_generated/dataModel';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';

// Import Post type from Convex data model
type Post = Doc<'posts'>;

interface PostListItemProps {
  post: Post;
  isEventsCategory?: boolean;
}

export default function PostListItem({ post, isEventsCategory = false }: PostListItemProps) {
  const { t, i18n } = useTranslation();

  // Always call hooks at the top level, use "skip" for conditional queries
  const commentCountQuery = useQuery(api.posts.query.getCommentCount, { postId: post._id });
  const viewCountQuery = useQuery(api.posts.query.getViewCount, { postId: post._id });
  const likeCountQuery = useQuery(api.posts.query.getLikeCount, { postId: post._id });
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
    void toggleLike({ postId: post._id });
  };

  // Handle author profile click
  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to post detail
    e.stopPropagation(); // Stop event propagation
  };

  // Use query results or fallback values
  const commentCount = commentCountQuery || 0;
  const viewCount = viewCountQuery || 0;
  const likeCount = post.likeCount !== undefined ? post.likeCount : likeCountQuery || 0;
  const author = authorQuery || null;

  // Process content for preview (strip HTML tags, limit length)
  const contentPreview = post.content
    ? post.content.replace(/<[^>]*>?/gm, '').substring(0, 150)
    : '';

  return (
    <Link
      to={`/post/${post._id}`}
      className="block border border-border/30 rounded-lg hover:border-border/60 bg-background/60 hover:bg-background transition-all duration-200 overflow-hidden shadow-sm"
    >
      {/* Main content area */}
      <div className="p-4">
        {/* Title area with category badge */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-medium line-clamp-2 flex-1 mr-2">{post.title}</h3>
          <span className="px-2 py-0.5 text-xs bg-secondary/10 text-secondary rounded-md whitespace-nowrap">
            {t(`postCategories.${post.category}.name`, {
              defaultValue: post.category,
            })}
          </span>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-muted-foreground px-1">+{post.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Content preview */}
        {contentPreview && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{contentPreview}</p>
        )}
      </div>

      {/* Footer with stats and metadata */}
      <div className="border-t border-border/20 px-4 py-2.5 bg-muted/20 flex items-center justify-between text-sm">
        {/* Left side - author and date */}
        <div className="flex items-center text-muted-foreground">
          {post.authorId && author && (
            <Link 
              to={`/user/${post.authorId}`} 
              onClick={handleAuthorClick}
              className="flex items-center hover:text-foreground transition-colors"
            >
              {author.avatarUrl ? (
                <img
                  src={author.avatarUrl}
                  alt={author.displayName || 'User'}
                  className="w-5 h-5 rounded-full mr-2 object-cover"
                />
              ) : (
                <User size={16} className="mr-2 text-muted-foreground/70" />
              )}
              <span className="font-medium text-foreground/80">{author.displayName || ''}</span>
            </Link>
          )}
          <span className="mx-1.5">•</span>
          <time dateTime={new Date(post._creationTime).toISOString()} className="text-xs">
            {formatDistanceToNow(new Date(post._creationTime), {
              addSuffix: true,
              locale: i18n.language === 'ko' ? ko : undefined,
            })}
          </time>
        </div>

        {/* Right side - engagement metrics */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center" title={t('posts.views')}>
            <Eye size={14} className="mr-1 opacity-70" />
            <span>{viewCount}</span>
          </div>

          <button 
            onClick={handleLikeClick}
            className={`flex items-center ${hasLiked ? 'text-rose-500' : ''} hover:text-rose-500 transition-colors`} 
            title={t('posts.likes')}
          >
            <Heart 
              size={14} 
              className={`mr-1 ${hasLiked ? 'fill-rose-500' : 'opacity-70'}`} 
            />
            <span>{likeCount}</span>
          </button>

          <div className="flex items-center text-primary/80" title={t('posts.comments')}>
            <MessageSquare size={14} className="mr-1" />
            <span>{commentCount}</span>
          </div>
        </div>
      </div>

      {/* Event period - only for event categories */}
      {isEventsCategory && post.startDate && post.endDate && (
        <div className="px-4 py-2 border-t border-border/20 text-xs text-muted-foreground italic">
          {t('posts.eventPeriod', {
            start: new Date(post.startDate).toLocaleDateString(),
            end: new Date(post.endDate).toLocaleDateString(),
          })}
        </div>
      )}
    </Link>
  );
}

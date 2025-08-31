import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { Heart } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import LikedUsersList from './LikedUsersList';

interface LikeButtonProps {
  postId: Id<'posts'> | Id<'showcases'>;
  type?: 'posts' | 'showcases';
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export default function LikeButton({
  postId,
  type = 'posts',
  size = 'md',
  showCount = true,
  className,
}: LikeButtonProps) {
  const { t } = useTranslation();
  const { isAuthenticated, requireAuth } = useAuthStore();

  // Determine API endpoints based on type
  const hasLiked = useQuery(
    type === 'showcases'
      ? api.showcases.query.hasLikedShowcase
      : api.posts.query.hasLiked,
    type === 'showcases' ? { showcaseId: postId as Id<'showcases'> } : { postId: postId as Id<'posts'> }
  );
  const doc = useQuery(
    type === 'showcases'
      ? api.showcases.query.getShowcase
      : api.posts.query.getById,
    type === 'showcases' ? { showcaseId: postId as Id<'showcases'> } : { id: postId as Id<'posts'> }
  );
  const likeCount = doc?.likeCount || 0;

  const toggleLike = useMutation(
    type === 'showcases'
      ? api.showcases.mutation.toggleLike
      : api.posts.mutation.toggleLike
  );

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      requireAuth();
      return;
    }
    if (type === 'showcases') {
      await toggleLike({ showcaseId: postId as Id<'showcases'> });
    } else {
      await toggleLike({ postId: postId as Id<'posts'> });
    }
  };

  // 사이즈에 따른 스타일 설정
  const sizeStyles = {
    sm: 'p-1.5 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-2.5 text-lg',
  };

  const iconSize = {
    sm: 14,
    md: 18,
    lg: 20,
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => void handleToggleLike()}
        variant="ghost"
        size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
        className={cn(
          'flex items-center gap-1.5 rounded-full transition-colors h-auto',
          hasLiked
            ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/40'
            : 'bg-muted hover:bg-muted/80 text-muted-foreground',
          sizeStyles[size],
          className
        )}
        aria-label={hasLiked ? t('posts.unlike') : t('posts.like')}
        title={hasLiked ? t('posts.unlike') : t('posts.like')}
      >
        <Heart
          size={iconSize[size]}
          className={cn(
            'transition-transform',
            hasLiked ? 'fill-red-500 text-red-500' : 'fill-transparent',
            hasLiked && 'scale-110'
          )}
        />
        {showCount && <span className="font-medium">{likeCount ?? 0}</span>}
      </Button>
      
      {/* Show liked users list only for showcases and when there are likes */}
      {type === 'showcases' && likeCount && likeCount > 0 && (
        <LikedUsersList showcaseId={postId as Id<'showcases'>} />
      )}
    </div>
  );
}

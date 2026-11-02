import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { Heart } from 'lucide-react';
import { Button } from './Button';
import { toast } from 'sonner';
import { cn, devConsole } from '@/lib/utils';
import { userFacingErrorMessage } from '@/lib/errors';
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
    type === 'showcases' ? api.showcases.query.hasLikedShowcase : api.posts.query.hasLiked,
    type === 'showcases'
      ? { showcaseId: postId as Id<'showcases'> }
      : { postId: postId as Id<'posts'> },
  );
  const doc = useQuery(
    type === 'showcases' ? api.showcases.query.getShowcase : api.posts.query.getById,
    type === 'showcases'
      ? { showcaseId: postId as Id<'showcases'> }
      : { id: postId as Id<'posts'> },
  );
  const likeCount = doc?.likeCount || 0;

  const toggleLike = useMutation(
    type === 'showcases' ? api.showcases.mutation.toggleLike : api.posts.mutation.toggleLike,
  );

  // A double tap would otherwise like and immediately unlike.
  const [isPending, setIsPending] = useState(false);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      requireAuth();
      return;
    }
    if (isPending) return;
    setIsPending(true);
    try {
      if (type === 'showcases') {
        await toggleLike({ showcaseId: postId as Id<'showcases'> });
      } else {
        await toggleLike({ postId: postId as Id<'posts'> });
      }
    } catch (error) {
      devConsole.error('Failed to toggle like:', error);
      toast.error(userFacingErrorMessage(error, t('errors.likeFailed')));
    } finally {
      setIsPending(false);
    }
  };

  const label = !isAuthenticated
    ? t('posts.loginToLike')
    : hasLiked
      ? t('posts.unlike')
      : t('posts.like');

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
            ? 'bg-foreground/10 text-foreground hover:bg-foreground/15'
            : 'bg-muted hover:bg-muted/80 text-muted-foreground',
          sizeStyles[size],
          className,
        )}
        aria-label={showCount ? `${label} · ${likeCount}` : label}
        aria-pressed={isAuthenticated ? Boolean(hasLiked) : undefined}
        aria-busy={isPending || undefined}
        title={label}
      >
        <Heart
          aria-hidden="true"
          size={iconSize[size]}
          className={cn(hasLiked ? 'fill-current' : 'fill-transparent')}
        />
        {showCount && <span className="font-medium tabular-nums">{likeCount}</span>}
      </Button>

      {/* Show liked users list only for showcases and when there are likes */}
      {type === 'showcases' && likeCount > 0 && (
        <LikedUsersList showcaseId={postId as Id<'showcases'>} />
      )}
    </div>
  );
}

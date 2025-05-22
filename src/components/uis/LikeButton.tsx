import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConvexAuth } from 'convex/react';
import { useTranslation } from 'react-i18next';

interface LikeButtonProps {
  postId: Id<'posts'>;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export default function LikeButton({
  postId,
  size = 'md',
  showCount = true,
  className,
}: LikeButtonProps) {
  const { t } = useTranslation();
  const { isAuthenticated } = useConvexAuth();
  
  // 좋아요 상태 및 개수 조회
  const hasLiked = useQuery(api.posts.likes.hasLiked, { postId });
  const likeCount = useQuery(api.posts.likes.getLikeCount, { postId });
  
  // 좋아요 추가/취소 액션
  const likePost = useMutation(api.posts.likes.likePost);
  const unlikePost = useMutation(api.posts.likes.unlikePost);
  
  // 좋아요 토글 핸들러
  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      // 로그인 필요 안내
      alert(t('errors.authRequired'));
      return;
    }
    
    if (hasLiked) {
      await unlikePost({ postId });
    } else {
      await likePost({ postId });
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
    <button
      onClick={() => void handleToggleLike()}
      className={cn(
        'flex items-center gap-1.5 rounded-full transition-colors',
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
      {showCount && <span>{likeCount ?? 0}</span>}
    </button>
  );
}

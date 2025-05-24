import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { Heart } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';

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
  const { isAuthenticated, requireAuth } = useAuthStore();

  // 좋아요 상태 조회
  const hasLiked = useQuery(api.posts.query.hasLiked, { postId });
  // 게시물 가져오기
  const post = useQuery(api.posts.query.getById, { id: postId });
  const likeCount = post?.likeCount || 0;

  // 좋아요 토글 액션
  const toggleLike = useMutation(api.posts.mutation.toggleLike);

  // 좋아요 토글 핸들러
  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      // zustand 스토어를 사용한 로그인 필요 토스트 표시
      requireAuth();
      return;
    }

    await toggleLike({ postId });
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
  );
}

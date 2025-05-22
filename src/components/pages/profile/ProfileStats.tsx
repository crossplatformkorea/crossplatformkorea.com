import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { useTranslation } from 'react-i18next';
import { Pencil, Heart, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileStatsProps {
  userId: Id<'users'>;
  className?: string;
}

export default function ProfileStats({ userId, className }: ProfileStatsProps) {
  const { t } = useTranslation();
  const userStats = useQuery(api.users.stats.getUserStats, { userId });

  if (!userStats) {
    return <div className="h-24 animate-pulse bg-muted/50 rounded-lg"></div>;
  }

  const { postCount, likeCount, commentCount } = userStats;

  return (
    <div className={cn('grid grid-cols-3 gap-4 mb-6', className)}>
      {/* 작성한 포스트 수 */}
      <div className="bg-card border border-border/40 rounded-xl p-4 text-center hover:border-border/70 transition-colors">
        <div className="mb-2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 dark:bg-blue-900/20">
          <Pencil className="w-5 h-5" />
        </div>
        <div className="text-2xl font-bold">{postCount}</div>
        <div className="text-sm text-muted-foreground mt-1">{t('profile.stats.posts')}</div>
      </div>

      {/* 받은 좋아요 수 */}
      <div className="bg-card border border-border/40 rounded-xl p-4 text-center hover:border-border/70 transition-colors">
        <div className="mb-2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-500 dark:bg-red-900/20">
          <Heart className="w-5 h-5" />
        </div>
        <div className="text-2xl font-bold">{likeCount}</div>
        <div className="text-sm text-muted-foreground mt-1">{t('profile.stats.likes')}</div>
      </div>

      {/* 받은 댓글 수 */}
      <div className="bg-card border border-border/40 rounded-xl p-4 text-center hover:border-border/70 transition-colors">
        <div className="mb-2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-500 dark:bg-green-900/20">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div className="text-2xl font-bold">{commentCount}</div>
        <div className="text-sm text-muted-foreground mt-1">{t('profile.stats.comments')}</div>
      </div>
    </div>
  );
}

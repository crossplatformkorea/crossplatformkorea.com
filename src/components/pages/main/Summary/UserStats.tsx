import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';
import { useTranslation } from 'react-i18next';
import { Pencil, Heart, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../../lib/utils';

interface UserStatsProps {
  userId: Id<'users'>;
  className?: string;
}

export default function UserStats({ userId, className }: UserStatsProps) {
  const { t } = useTranslation();
  const userStats = useQuery(api.users.query.getUserStats, { userId });

  if (!userStats) {
    // 로딩 상태 표시 - 간소화된 로더
    return (
      <div className={cn('mb-4 flex items-center justify-center h-10', className)}>
        <div className="animate-pulse h-6 w-32 bg-card/60 rounded" />
      </div>
    );
  }

  const { postCount, likeCount, commentCount } = userStats;

  // 통계 데이터 - 더 간단한 형태로
  const stats = [
    {
      title: t('profile.stats.posts'),
      value: postCount,
      icon: <Pencil className="w-4 h-4" />,
      color: 'text-blue-500 dark:text-blue-400',
    },
    {
      title: t('profile.stats.likes'),
      value: likeCount,
      icon: <Heart className="w-4 h-4" />,
      color: 'text-red-500 dark:text-red-400',
    },
    {
      title: t('profile.stats.comments'),
      value: commentCount,
      icon: <MessageSquare className="w-4 h-4" />,
      color: 'text-green-500 dark:text-green-400',
    },
  ];

  return (
    <motion.div
      className={cn('mb-5 flex flex-wrap gap-2 justify-center items-center', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {stats.map((stat, index) => (
        <React.Fragment key={stat.title}>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-card/40 rounded-lg">
            <span className={cn('flex items-center justify-center', stat.color)}>{stat.icon}</span>
            <span className="font-semibold text-lg">{stat.value}</span>
            <span className="text-xs text-muted-foreground">{stat.title}</span>
          </div>

          {index < stats.length - 1 && (
            <span className="text-muted-foreground/40 font-light">|</span>
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
}

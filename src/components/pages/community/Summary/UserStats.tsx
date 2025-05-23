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
      <div className={cn(
        'mb-3 sm:mb-4 flex items-center justify-center h-8 sm:h-10',
        className
      )}>
        <div className="animate-pulse h-5 sm:h-6 w-24 sm:w-32 bg-card/60 rounded" />
      </div>
    );
  }

  const { postCount, likeCount, commentCount } = userStats;

  // 통계 데이터 - 더 간단한 형태로
  const stats = [
    {
      title: t('profile.stats.posts'),
      value: postCount,
      icon: <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, // Smaller on mobile
      color: 'text-blue-500 dark:text-blue-400',
    },
    {
      title: t('profile.stats.likes'),
      value: likeCount,
      icon: <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, // Smaller on mobile
      color: 'text-red-500 dark:text-red-400',
    },
    {
      title: t('profile.stats.comments'),
      value: commentCount,
      icon: <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, // Smaller on mobile
      color: 'text-green-500 dark:text-green-400',
    },
  ];

  return (
    <motion.div
      className={cn(
        // 공통 스타일
        'mb-3 sm:mb-5 flex items-center',
        // 모바일 스타일 - flex-col이 아닌 좌우 스크롤로 해결
        'overflow-x-auto scrollbar-none py-1 sm:py-2 justify-start',
        // 데스크탑 스타일
        'sm:justify-center sm:overflow-visible',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={cn(
        // 공통 스타일
        'flex',
        // 모바일 스타일 - nowrap으로 가로 스크롤 허용
        'flex-nowrap min-w-min px-1',
        // 데스크탑 스타일
        'sm:flex-wrap sm:justify-center'
      )}>
        {stats.map((stat, index) => (
          <React.Fragment key={stat.title}>
            <div className={cn(
              // 공통 스타일
              'flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-card/40 rounded-lg', // Smaller padding on mobile
              // 모바일 스타일 - 넓게 고정사이즈로 
              'flex-shrink-0 mx-1',
              // 데스크탑 스타일
              'sm:mx-0 sm:flex-shrink'
            )}>
              <span className={cn(
                'flex items-center justify-center',
                stat.color
              )}>{stat.icon}</span>
              <span className="font-semibold text-base sm:text-lg">{stat.value}</span> {/* Smaller on mobile */}
              <span className="text-[10px] sm:text-xs text-muted-foreground">{stat.title}</span> {/* Smaller on mobile */}
            </div>

            {index < stats.length - 1 && (
              <span className={cn(
                "text-muted-foreground/40 font-light mx-1 sm:mx-2 flex items-center", // Reduced margin on mobile
                // 모바일에서는 구분자를 인라인으로
                "flex-shrink-0",
                // 데스크탑에서는 구분자 유지
                "sm:flex-shrink"
              )}>|</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
}

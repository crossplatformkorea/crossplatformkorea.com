import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { useTranslation } from 'react-i18next';
import { FileText, Heart, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProfileStatsProps {
  userId: Id<'users'>;
  className?: string;
  compact?: boolean;
}

export default function ProfileStats({ userId, className, compact = false }: ProfileStatsProps) {
  const { t } = useTranslation();
  const userStats = useQuery(api.users.query.getUserStats, { userId });

  if (!userStats) {
    return (
      <div className={cn('animate-pulse bg-muted/50 rounded-lg', compact ? 'h-12' : 'h-16')}></div>
    );
  }

  const { postCount, likeCount, commentCount } = userStats;

  // Prepare stats data for rendering
  const stats = [
    {
      title: t('profile.stats.posts'),
      value: postCount,
      icon: <FileText className={compact ? 'w-4 h-4' : 'w-5 h-5'} />,
      color: 'text-blue-500 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: t('profile.stats.likes'),
      value: likeCount,
      icon: <Heart className={compact ? 'w-4 h-4' : 'w-5 h-5'} />,
      color: 'text-rose-500 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-900/20',
    },
    {
      title: t('profile.stats.comments'),
      value: commentCount,
      icon: <MessageSquare className={compact ? 'w-4 h-4' : 'w-5 h-5'} />,
      color: 'text-green-500 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
  ];

  // Compact version for user profile page - improved for mobile view
  if (compact) {
    return (
      <motion.div
        className={cn(
          'flex flex-wrap items-center justify-start gap-x-4 gap-y-2 text-sm text-muted-foreground',
          className
        )}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {stats.map((stat, index) => (
          <div 
            key={stat.title} 
            className="flex items-center"
          >
            {/* Stat item with improved mobile layout */}
            <div className="flex items-center gap-1.5" title={stat.title}>
              <span className={cn(
                'flex items-center justify-center',
                stat.color
              )}>
                {stat.icon}
              </span>
              <span className="font-medium whitespace-nowrap">{stat.value}</span>
              {/* Title with proper spacing */}
              <span className="ml-1 whitespace-nowrap">{stat.title}</span>
            </div>

            {/* Only show divider if it's not the last item and not at the end of a row */}
            {index < stats.length - 1 && (
              <span className="mx-2 text-border/40 hidden sm:inline-block">|</span>
            )}
          </div>
        ))}
      </motion.div>
    );
  }

  // Full version with more modern, minimalist UI like Summary component
  return (
    <motion.div
      className={cn(
        'mb-6 flex flex-wrap justify-center sm:justify-between gap-4',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, staggerChildren: 0.1 }}
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.title}
          className={cn(
            "flex-1 min-w-[120px] flex items-center gap-3 p-4 bg-card/40 backdrop-blur-[1px] border border-border/30 rounded-xl",
            "hover:border-border/50 transition-colors"
          )}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <div className={cn(
            'p-3 rounded-full',
            stat.bgColor
          )}>
            <span className={stat.color}>{stat.icon}</span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.title}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

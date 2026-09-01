import { useQuery } from 'convex/react';
import { useTranslation } from 'react-i18next';
import { Heart, MessageSquare, Pencil } from 'lucide-react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { cn } from '../../../../lib/utils';

interface UserStatsProps {
  userId: Id<'users'>;
  className?: string;
}

export default function UserStats({ userId, className }: UserStatsProps) {
  const { t } = useTranslation();
  const userStats = useQuery(api.users.query.getUserStats, { userId });

  if (!userStats) {
    return <div className={cn('h-16 animate-pulse rounded-xl bg-muted/60', className)} />;
  }

  const stats = [
    { title: t('profile.stats.posts'), value: userStats.postCount, icon: Pencil },
    { title: t('profile.stats.likes'), value: userStats.likeCount, icon: Heart },
    { title: t('profile.stats.comments'), value: userStats.commentCount, icon: MessageSquare },
  ];

  return (
    <div className={cn('grid grid-cols-3 border-t border-border/70 pt-5', className)}>
      {stats.map(({ title, value, icon: Icon }) => (
        <div key={title} className="stat-tile flex items-center gap-3">
          <Icon size={16} className="hidden text-primary sm:block" />
          <div>
            <strong className="block text-xl font-semibold leading-none sm:text-2xl">
              {value}
            </strong>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.08em] text-muted-foreground sm:text-xs">
              {title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

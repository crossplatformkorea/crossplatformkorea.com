import React from 'react';
import { User, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

// Update the interface to accept more flexible author types
interface AuthorCardProps {
  author: {
    displayName?: string;
    avatarUrl?: string;
    [key: string]: any; // Allow additional properties from user profile
  } | null | undefined;
  creationTime: number;
  formattedDate: string;
}

export default function AuthorCard({ author, creationTime, formattedDate }: AuthorCardProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center mr-6">
      {author?.avatarUrl ? (
        <img
          src={author.avatarUrl}
          alt={author.displayName || t('common.user')}
          className="w-10 h-10 rounded-full mr-3 object-cover border border-border/30 shadow-sm"
        />
      ) : (
        <div className={cn(
          "w-10 h-10 rounded-full mr-3 flex items-center justify-center shadow-sm",
          "bg-muted/30"
        )}>
          <User size={18} />
        </div>
      )}
      <div className='flex flex-col gap-1'>
        <div className="font-medium">{author?.displayName || ''}</div>
        <div className="flex items-center text-muted-foreground text-sm">
          <Clock size={14} className="mr-1.5" />
          <time dateTime={new Date(creationTime).toISOString()}>
            {formattedDate}
          </time>
        </div>
      </div>
    </div>
  );
}

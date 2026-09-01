import React from 'react';
import { User, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { cn, createUserProfileLink } from '@/lib/utils';

// Update the interface to accept more flexible author types
interface AuthorCardProps {
  author:
    | {
        displayName?: string;
        avatarUrl?: string;
        [key: string]: any; // Allow additional properties from user profile
      }
    | null
    | undefined;
  creationTime: number;
  formattedDate: string;
}

export default function AuthorCard({ author, creationTime, formattedDate }: AuthorCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleAuthorClick = () => {
    if (author?.displayName) {
      void navigate(createUserProfileLink(author.displayName));
    }
  };

  const isClickable = !!author?.displayName;

  return (
    <div className="flex items-center mr-6">
      <div
        onClick={isClickable ? handleAuthorClick : undefined}
        className={cn('mr-3', isClickable && 'cursor-pointer hover:opacity-80 transition-opacity')}
      >
        {author?.avatarUrl ? (
          <img
            src={author.avatarUrl}
            alt={author.displayName || t('common.user')}
            className="w-10 h-10 rounded-full object-cover border border-border/30 shadow-sm"
          />
        ) : (
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center shadow-sm',
              'bg-muted/30',
            )}
          >
            <User size={18} />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div
          onClick={isClickable ? handleAuthorClick : undefined}
          className={cn('font-medium', isClickable && 'hover:underline cursor-pointer')}
        >
          {author?.displayName || ''}
        </div>
        <div className="flex items-center text-muted-foreground text-sm">
          <Clock size={14} className="mr-1.5 flex-shrink-0" />
          <time
            dateTime={new Date(creationTime).toISOString()}
            className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]"
          >
            {formattedDate}
          </time>
        </div>
      </div>
    </div>
  );
}

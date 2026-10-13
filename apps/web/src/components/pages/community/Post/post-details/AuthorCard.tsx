import { useState } from 'react';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { createUserProfileLink } from '@/lib/utils';

interface AuthorCardProps {
  author: { displayName?: string; avatarUrl?: string } | null | undefined;
  creationTime: number;
  formattedDate: string;
}

export default function AuthorCard({ author, creationTime, formattedDate }: AuthorCardProps) {
  const { t } = useTranslation();
  const [failedAvatar, setFailedAvatar] = useState<string | null>(null);
  const avatar =
    author?.avatarUrl && failedAvatar !== author.avatarUrl ? (
      <img
        src={author.avatarUrl}
        alt=""
        className="h-10 w-10 rounded-full border border-border/70 object-cover"
        onError={() => setFailedAvatar(author.avatarUrl || null)}
      />
    ) : (
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-muted/40">
        <User size={17} strokeWidth={1.5} />
      </span>
    );
  const name = author?.displayName || t('user.anonymousUser');

  return (
    <div className="flex min-w-0 items-center gap-3">
      {author?.displayName ? (
        <Link
          to={createUserProfileLink(author.displayName)}
          aria-label={name}
          className="shrink-0 rounded-full"
        >
          {avatar}
        </Link>
      ) : (
        avatar
      )}
      <div className="min-w-0">
        {author?.displayName ? (
          <Link
            to={createUserProfileLink(author.displayName)}
            className="block truncate text-sm font-semibold hover:underline"
          >
            {name}
          </Link>
        ) : (
          <span className="block truncate text-sm font-semibold">{name}</span>
        )}
        <time
          dateTime={new Date(creationTime).toISOString()}
          className="mt-1 block text-xs text-muted-foreground"
        >
          {formattedDate}
        </time>
      </div>
    </div>
  );
}

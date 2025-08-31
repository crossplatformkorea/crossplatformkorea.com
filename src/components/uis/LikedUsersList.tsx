import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createUserProfileLink } from '@/lib/utils';

interface LikedUsersListProps {
  showcaseId: Id<'showcases'>;
  className?: string;
}

export default function LikedUsersList({ showcaseId, className }: LikedUsersListProps) {
  const likedUsers = useQuery(api.showcases.query.getShowcaseLikedUsers, { showcaseId });

  if (!likedUsers || likedUsers.length === 0) {
    return null;
  }

  const maxDisplayUsers = 3;
  const displayUsers = likedUsers.slice(0, maxDisplayUsers);
  const remainingCount = likedUsers.length - maxDisplayUsers;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex -space-x-2">
        {displayUsers.map((user) => (
          <Link
            key={user.userId}
            to={createUserProfileLink(user.displayName)}
            className="relative group"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="h-6 w-6 rounded-full border border-background bg-background hover:scale-110 transition-transform"
                title={user.displayName}
              />
            ) : (
              <div className="h-6 w-6 rounded-full border border-background bg-muted flex items-center justify-center hover:scale-110 transition-transform">
                <User size={12} className="text-muted-foreground" />
              </div>
            )}
          </Link>
        ))}
      </div>
      {remainingCount > 0 && (
        <span className="text-xs text-muted-foreground ml-1">
          +{remainingCount}
        </span>
      )}
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createUserProfileLink } from '@/lib/utils';

interface LikedUsersListProps {
  showcaseId: Id<'showcases'>;
  className?: string;
}

export default function LikedUsersList({ showcaseId, className }: LikedUsersListProps) {
  const likedUsers = useQuery(api.showcases.query.getShowcaseLikedUsers, { showcaseId });

  if (!likedUsers || likedUsers.total === 0) {
    return null;
  }

  const maxDisplayUsers = 3;
  const displayUsers = likedUsers.users.slice(0, maxDisplayUsers);
  // 서버는 아바타로 보여줄 만큼만 프로필을 읽어오므로 나머지 개수는 총합에서
  // 계산한다. 프로필이 지워진 사용자가 섞여 있으면 실제로 그린 아바타가
  // maxDisplayUsers보다 적을 수 있어, 그린 개수를 빼야 수가 맞는다.
  const remainingCount = likedUsers.total - displayUsers.length;

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
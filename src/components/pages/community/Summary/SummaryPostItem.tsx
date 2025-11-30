import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Clock, MessageCircle, Tag } from 'lucide-react';
import CategoryBadge from '@/components/uis/CategoryBadge';
import { cn } from '@/lib/utils';

interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  updatedAt: string;
  tags?: string[];
  thumbnail?: string;
}

interface PostListItemProps {
  post: Post;
}

export default function SummaryPostItem({ post }: PostListItemProps) {
  const { i18n, t } = useTranslation(); // 확인: t가 이미 추가되어 있어야 함

  // Strip all HTML tags from content for preview
  const plainContent = (() => {
    const withoutHtml = post.content.replace(/<[^>]*>/g, '').trim();
    return withoutHtml.length > 120
      ? withoutHtml.substring(0, 120) + '...'
      : withoutHtml;
  })();

  return (
    <Link to={`/post/${post._id}`} className="group relative block h-full">
      {/* 훨씬 더 연한 호버 효과 */}
      <div className={cn(
        "absolute -inset-px rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 blur-[1px] transition-all duration-300",
        "group-hover:opacity-70 group-hover:duration-200"
      )} />
      <div className={cn(
        "relative h-full flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card shadow-sm",
        "hover:shadow-md hover:border-border/60 transition-all duration-300 hover:bg-primary/[0.02]",
        "dark:hover:bg-accent/30"
      )}>
        {/* Category badge */}
        <div className="mb-3 px-5 pt-5 flex items-center justify-between">
          <CategoryBadge category={post.category} />
          <span className="flex items-center text-xs text-muted-foreground/70">
            <Clock size={12} className="mr-1 opacity-70" />
            {formatDistanceToNow(new Date(post.updatedAt), {
              addSuffix: true,
              locale: i18n.language === 'ko' ? ko : undefined,
            })}
          </span>
        </div>

        <div className="px-5 flex-grow">
          <div className="flex gap-3">
            {/* Left side: Title and Content */}
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-medium text-lg mb-2 line-clamp-2 text-foreground/90 transition-colors",
                "group-hover:text-primary/90"
              )}>
                {post.title}
              </h3>

              <p className="text-sm text-muted-foreground/80 line-clamp-3 mb-3">{plainContent}</p>
            </div>

            {/* Right side: Thumbnail */}
            {post.thumbnail && (
              <div className="flex-shrink-0">
                <img
                  src={post.thumbnail}
                  alt=""
                  className={cn(
                    'w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg',
                    'transition-transform duration-300 group-hover:scale-105',
                  )}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 pb-5 px-5 flex items-center justify-between border-t border-border/30">
          {post.tags && post.tags.length > 0 ? (
            <div className="flex items-center">
              <Tag size={14} className="text-muted-foreground/60 mr-2" />
              <span className="text-xs text-muted-foreground/70 truncate max-w-[150px]">
                {post.tags.slice(0, 2).join(', ')}
                {post.tags.length > 2 && '...'}
              </span>
            </div>
          ) : (
            <span></span>
          )}

          <span className="inline-flex items-center text-xs text-primary/70 font-medium">
            <MessageCircle size={14} className="mr-1 opacity-80" />
            {t('posts.viewMore')}
          </span>
        </div>
      </div>
    </Link>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Clock, MessageCircle, Tag } from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  updatedAt: string;
  tags?: string[];
}

interface PostListItemProps {
  post: Post;
}

export default function SummaryPostItem({ post }: PostListItemProps) {
  const { i18n, t } = useTranslation(); // 확인: t가 이미 추가되어 있어야 함

  // Strip HTML from content for preview
  const plainContent = post.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...';
  
  // Get category color - 좀 더 연한 색상으로 조정
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'GENERAL': 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300',
      'NOTICE': 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300',
      'EVENT': 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300',
      'QUESTION': 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-300',
      'DISCUSSION': 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300',
      'TUTORIAL': 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-300',
      'PROJECT': 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300',
    };
    return colors[category] || 'bg-gray-50 text-gray-600 dark:bg-gray-800/40 dark:text-gray-300';
  };

  return (
    <Link
      to={`/post/${post._id}`}
      className="group relative block h-full"
    >
      {/* 훨씬 더 연한 호버 효과 */}
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-70 blur-[1px] transition-all duration-300 group-hover:duration-200" />
      <div className="relative h-full flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card shadow-sm hover:shadow-md hover:border-border/60 transition-all duration-300 hover:bg-primary/[0.02] dark:hover:bg-accent/30">
        {/* Category badge */}
        <div className="mb-3 px-5 pt-5 flex items-center justify-between">
          <span className={cn("text-xs px-2.5 py-0.5 rounded-full font-medium", getCategoryColor(post.category))}>
            {post.category}
          </span>
          <span className="flex items-center text-xs text-muted-foreground/70">
            <Clock size={12} className="mr-1 opacity-70" />
            {formatDistanceToNow(new Date(post.updatedAt), {
              addSuffix: true,
              locale: i18n.language === 'ko' ? ko : undefined,
            })}
          </span>
        </div>
        
        <div className="px-5 flex-grow">
          <h3 className="font-medium text-lg mb-2 line-clamp-2 text-foreground/90 group-hover:text-primary/90 transition-colors">
            {post.title}
          </h3>
          
          <p className="text-sm text-muted-foreground/80 line-clamp-3 mb-3">
            {plainContent}
          </p>
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

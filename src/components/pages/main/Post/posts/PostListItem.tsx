import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../../../../lib/utils';
import { Id } from '../../../../../../convex/_generated/dataModel';

// Define the Post type
interface Post {
  _id: Id<'posts'>;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
}

interface PostListItemProps {
  post: Post;
  isEventsCategory?: boolean;
}

export default function PostListItem({ post, isEventsCategory = false }: PostListItemProps) {
  const { t } = useTranslation();

  return (
    <Link
      to={`/post/${post._id}`}
      className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <h3 className="text-lg font-medium mb-2">{post.title}</h3>

      <div className="flex flex-wrap gap-2 mb-2">
        {post.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between text-sm text-gray-500">
        <span>{formatDate(post.createdAt)}</span>

        {/* Add category display */}
        <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-md">
          {t(`postCategories.${post.category}.name`, {
            defaultValue: post.category, // 번역이 없을 때 기본값으로 카테고리 표시
          })}
        </span>

        {isEventsCategory && post.startDate && post.endDate && (
          <span>
            {t('posts.eventPeriod', {
              start: formatDate(post.startDate),
              end: formatDate(post.endDate),
            })}
          </span>
        )}
      </div>
    </Link>
  );
}

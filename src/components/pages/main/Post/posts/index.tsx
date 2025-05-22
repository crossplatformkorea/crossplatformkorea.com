import React, { memo, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { t } from '../../../../../lib/i18n';
import { PenLine } from 'lucide-react';
import { useConvexAuth } from 'convex/react';

import AppLoading from '@/components/AppLoading';
import { useTranslation } from 'react-i18next';
import { Id } from '../../../../../../convex/_generated/dataModel';
import CategoriesBreadCrumbs from './CategoriesBreadCrumbs';
import { api } from '../../../../../../convex/_generated/api';
import PostWrite from '../PostWrite';
import { cn } from '../../../../../lib/utils';
import { DEFAULT_CATEGORY } from '../../../../../../convex/constants';
import PostListItem from './PostListItem';

// Define the Post type
type Post = {
  _id: Id<'posts'>;
  _creationTime: number;
  category: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  authorId?: Id<'users'>;
};

const Posts = memo(function PostsPage() {
  const { t: translate } = useTranslation();
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const { isAuthenticated } = useConvexAuth();

  // State for the PostWrite modal
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // 개발 환경에서만 로그 출력 (프로덕션에서는 출력 안함)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Posts rendering with category:', categorySlug);
    }
  }, [categorySlug]);

  // Fetch all categories from Convex
  const categoriesData = useQuery(api.categories.getCategories);

  // Get the current category if a slug is provided
  const category = useMemo(() => {
    if (!categorySlug || !categoriesData) return null;
    return categoriesData.find((cat) => cat.slug === categorySlug);
  }, [categorySlug, categoriesData]);

  // Get the current category key for use in the PostWrite modal
  const currentCategoryKey = useMemo(() => {
    if (category) return category.key;
    return DEFAULT_CATEGORY; // Default to FREE_BOARD if no category is selected
  }, [category]);

  // Set up pagination options
  const paginationOpts = {
    numItems: 20,
    cursor,
  };

  // Query for posts with pagination
  const result = useQuery(api.posts.query.getPostsByCategory, {
    category: category ? category.key : 'ALL',
    paginationOpts,
  });

  // Update pagination state when result changes
  useEffect(() => {
    if (result) {
      setHasMore(!result.isDone);
    }
  }, [result]);

  // Function to load more posts
  const loadMore = () => {
    if (result && result.continueCursor) {
      setCursor(result.continueCursor);
    }
  };

  // Helper function to render the list of posts
  function renderPostList(posts: Post[], isEventsCategory: boolean) {
    if (!posts || posts.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          <p>{t('posts.empty')}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {posts.map((post) => (
          <PostListItem 
            key={post._id}
            post={post} 
            isEventsCategory={isEventsCategory} 
          />
        ))}
      </div>
    );
  }

  // Show loading state while fetching posts
  if (result === undefined) {
    return (
      <div className="flex flex-1 pb-12">
        <AppLoading />
      </div>
    );
  }

  // Extract posts from the paginated result
  const posts = result.page;

  // Helper function to render the write button
  const renderWriteButton = () => (
    <button
      onClick={() => setIsWriteModalOpen(true)}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-md transition-colors',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        !isAuthenticated && 'opacity-70 cursor-not-allowed',
      )}
      disabled={!isAuthenticated}
      title={!isAuthenticated ? translate('posts.loginToWrite') : undefined}
    >
      <PenLine size={18} />
      {translate('posts.write')}
    </button>
  );

  // If we have a category, display category-specific header
  if (category) {
    return (
      <div className="p-6">
        {/* Write modal - Always pass the currentCategoryKey */}
        <PostWrite
          isOpen={isWriteModalOpen}
          onClose={() => setIsWriteModalOpen(false)}
          defaultCategory={currentCategoryKey}
        />

        {/* Header with breadcrumbs and write button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex-1">
            {/* 브레드크럼 네비게이션 */}
            <CategoriesBreadCrumbs />
          </div>

          {/* Write button */}
          {renderWriteButton()}
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            {translate(`postCategories.${category.key}.name`, {
              defaultValue: category.key, // 번역이 없을 때 기본값으로 카테고리 키 사용
            })}
          </h2>
          <p className="mt-2 text-gray-500">
            {translate(`postCategories.${category.key}.description`, {
              defaultValue: '', // 설명은 없을 때 빈 문자열 표시
            })}
          </p>
        </div>

        {renderPostList(posts, category.key === 'EVENTS')}

        {/* Add load more button if there are more posts */}
        {hasMore && (
          <button
            onClick={loadMore}
            className="mt-4 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-center transition-colors"
          >
            {translate('posts.loadMore')}
          </button>
        )}
      </div>
    );
  }

  // Default view when no category is selected
  return (
    <div className="p-6">
      {/* Write modal - Always pass the currentCategoryKey */}
      <PostWrite
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        defaultCategory={currentCategoryKey}
      />

      {/* Header with breadcrumbs and write button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex-1">
          {/* 브레드크럼 네비게이션 */}
          <CategoriesBreadCrumbs />
        </div>

        {/* Write button */}
        {renderWriteButton()}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold">{translate('common.all')}</h2>
        <p className="mt-2 text-gray-500">{translate('posts.allPostsDescription')}</p>
      </div>

      {renderPostList(posts, false)}

      {/* Add load more button if there are more posts */}
      {hasMore && (
        <button
          onClick={loadMore}
          className="mt-4 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-center transition-colors"
        >
          {translate('posts.loadMore')}
        </button>
      )}
    </div>
  );
});

export default Posts;

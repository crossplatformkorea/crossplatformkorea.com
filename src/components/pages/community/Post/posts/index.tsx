import React, { memo, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { t } from '../../../../../lib/i18n';
import { PenLine } from 'lucide-react';

// AppLoading 대신 PostsSkeleton 임포트
import PostsSkeleton from './PostsSkeleton';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';
import { Id } from '../../../../../../convex/_generated/dataModel';
import CategoriesBreadCrumbs from './CategoriesBreadCrumbs';
import { api } from '../../../../../../convex/_generated/api';
import PostWriteModal from '../PostWriteModal';
import { cn } from '../../../../../lib/utils';
import { DEFAULT_CATEGORY } from '../../../../../../convex/constants';
import PostListItem from './PostListItem';
import { Button } from '@/components/uis/Button';
import { useMetaTags } from '@/hooks/useMetaTags';

// Define the Post type
type Post = {
  _id: Id<'posts'>;
  _creationTime: number;
  category: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
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
  const { isAuthenticated } = useAuthStore();

  // State for the PostWrite modal
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Fetch all categories from Convex
  const categoriesData = useQuery(api.categories.query.getCategories);

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
    category: category ? category.key : 'all',
    paginationOpts,
  });

  useMetaTags({
    title: `${t('common.sidePosts')} - ${t('meta.title')}`,
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
      <div className="space-y-5">
        {posts.map((post) => (
          <PostListItem key={post._id} post={post} isEventsCategory={isEventsCategory} />
        ))}
      </div>
    );
  }

  // Show loading state while fetching posts
  if (result === undefined) {
    return <PostsSkeleton />; // AppLoading 대신 PostsSkeleton 사용
  }

  // Extract posts from the paginated result
  const posts = result.page;

  // Helper function to render the write button
  const renderWriteButton = () => (
    <Button
      onClick={() => setIsWriteModalOpen(true)}
      className={cn(!isAuthenticated && 'opacity-70 cursor-not-allowed')}
      disabled={!isAuthenticated}
      title={!isAuthenticated ? translate('common.loginToWrite') : undefined}
    >
      <PenLine size={18} />
      {translate('posts.write')}
    </Button>
  );

  // If we have a category, display category-specific header
  if (category) {
    return (
      <div>
        {/* Write modal - Always pass the currentCategoryKey */}
        <PostWriteModal
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
          <Button variant="outline" onClick={loadMore} className="mt-4 w-full">
            {translate('common.loadMore')}
          </Button>
        )}
      </div>
    );
  }

  // Default view when no category is selected
  return (
    <div>
      {/* Write modal - Always pass the currentCategoryKey */}
      <PostWriteModal
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
        <Button variant="outline" onClick={loadMore} className="mt-4 w-full">
          {translate('common.loadMore')}
        </Button>
      )}
    </div>
  );
});

export default Posts;

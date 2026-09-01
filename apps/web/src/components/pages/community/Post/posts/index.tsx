import React, { memo, useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { t } from '../../../../../lib/i18n';
import { LogIn, PenLine } from 'lucide-react';

// AppLoading 대신 PostsSkeleton 임포트
import PostsSkeleton from './PostsSkeleton';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';
import { Id } from '@convex/_generated/dataModel';
import CategoriesBreadCrumbs from './CategoriesBreadCrumbs';
import { api } from '@convex/_generated/api';
import PostWriteModal from '../PostWriteModal';
import { DEFAULT_CATEGORY } from '@convex/constants';
import PostListItem from './PostListItem';
import { Button } from '@/components/uis/Button';
import { useMetaTags } from '@/hooks/useMetaTags';
import PageHeader from '@/components/uis/PageHeader';
import { createSignInHref } from '@/lib/authRedirect';

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
  const navigate = useNavigate();
  const location = useLocation();
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

  // SEO optimization with category-specific meta tags
  useMetaTags({
    title: category
      ? `${translate(`categories.${category.key}`)} | Cross-Platform Korea 커뮤니티`
      : `${translate('common.sidePosts')} | Cross-Platform Korea`,
    description: category
      ? `Cross-Platform Korea ${translate(`categories.${category.key}`)} 게시판 - 크로스플랫폼 개발자들의 지식 공유와 토론`
      : 'Cross-Platform Korea 커뮤니티 게시판 - React Native, Flutter, Expo 등 크로스플랫폼 개발 관련 최신 정보와 토론',
    keywords: category
      ? `${translate(`categories.${category.key}`)}, cross-platform, korea, 개발자, 커뮤니티, React Native, Flutter, Expo`
      : 'cross-platform, korea, 개발자, 커뮤니티, React Native, Flutter, Expo, 게시판',
    ogTitle: category
      ? `${translate(`categories.${category.key}`)} | Cross-Platform Korea`
      : `게시판 | Cross-Platform Korea`,
    ogDescription: category
      ? `Cross-Platform Korea ${translate(`categories.${category.key}`)} 게시판`
      : 'Cross-Platform Korea 커뮤니티 게시판',
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
          <div key={post._id}>
            <PostListItem post={post} isEventsCategory={isEventsCategory} />
          </div>
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
      onClick={() => {
        if (isAuthenticated) {
          setIsWriteModalOpen(true);
          return;
        }

        const returnTo = `${location.pathname}${location.search}${location.hash}`;
        void navigate(createSignInHref(returnTo));
      }}
      variant={isAuthenticated ? 'default' : 'outline'}
    >
      {isAuthenticated ? <PenLine size={18} /> : <LogIn size={18} />}
      {isAuthenticated ? translate('posts.write') : translate('common.loginToWrite')}
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

        <PageHeader
          eyebrow="COMMUNITY / POSTS"
          title={translate(`postCategories.${category.key}.name`, {
            defaultValue: category.key,
          })}
          description={translate(`postCategories.${category.key}.description`, {
            defaultValue: '',
          })}
          action={renderWriteButton()}
        />

        <div className="surface-card mb-6 overflow-x-auto p-3">
          <CategoriesBreadCrumbs />
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

      <PageHeader
        eyebrow="COMMUNITY / POSTS"
        title={translate('common.all')}
        description={translate('posts.allPostsDescription')}
        action={renderWriteButton()}
      />

      <div className="surface-card mb-6 overflow-x-auto p-3">
        <CategoriesBreadCrumbs />
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

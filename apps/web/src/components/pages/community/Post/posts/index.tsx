import { memo, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { ArrowDown, ArrowRight, Loader2, MessageSquare, PenLine } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '@convex/_generated/api';
import { DEFAULT_CATEGORY } from '@convex/constants';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/uis/Button';
import SignInAction from '@/components/uis/SignInAction';
import TypingHeading from '@/components/uis/TypingHeading';
import { useMetaTags } from '@/hooks/useMetaTags';
import CategoriesBreadCrumbs from './CategoriesBreadCrumbs';
import PostsSkeleton from './PostsSkeleton';
import PostListItem from './PostListItem';
import PostWriteModal from '../PostWriteModal';

const Posts = memo(function PostsPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  const { isAuthenticated } = useAuthStore();
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const categories = useQuery(api.categories.query.getCategories);
  const category = useMemo(
    () => categories?.find((item) => item.slug === categorySlug),
    [categories, categorySlug],
  );
  // Convex appends pages and resets the cursor when the category changes.
  const {
    results: posts,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.posts.query.getPostsByCategory,
    categorySlug && !categories ? 'skip' : { category: category?.key || 'all' },
    { initialNumItems: 20 },
  );
  const title = category
    ? t(`postCategories.${category.key}.name`, { defaultValue: category.key })
    : t('posts.pageTitle');
  const description = category
    ? t(`postCategories.${category.key}.description`, { defaultValue: '' })
    : t('posts.pageDescription');

  useMetaTags({
    title: `${category ? title : t('common.sidePosts')} | Cross-Platform Korea`,
    description,
    ogTitle: `${title} | Cross-Platform Korea`,
    ogDescription: description,
  });

  return (
    <div className="journal-page">
      <PostWriteModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        defaultCategory={category?.key || DEFAULT_CATEGORY}
      />
      <header className="journal-header">
        <div className="section-kicker">{t('posts.eyebrow')}</div>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 max-w-2xl">
            <TypingHeading className="journal-title">{title}</TypingHeading>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>
          <div className="shrink-0">
            {isAuthenticated ? (
              <Button
                className="min-h-11 w-full sm:w-auto"
                onClick={() => setIsWriteModalOpen(true)}
              >
                <PenLine size={16} />
                {t('posts.write')}
                <ArrowRight size={15} />
              </Button>
            ) : (
              <SignInAction
                returnTo={`${location.pathname}${location.search}${location.hash}`}
                className="w-full sm:w-auto"
              >
                {t('common.loginToWrite')}
              </SignInAction>
            )}
          </div>
        </div>
      </header>

      <div className="journal-filters">
        <CategoriesBreadCrumbs />
      </div>
      <div className="flex items-center justify-between gap-4 py-6 text-xs text-muted-foreground">
        <h2 className="font-medium text-foreground">{category ? title : t('posts.allStories')}</h2>
        <span className="inline-flex items-center gap-1.5">
          <ArrowDown size={13} />
          {t('posts.newestFirst')}
        </span>
      </div>
      {status === 'LoadingFirstPage' ? (
        <PostsSkeleton />
      ) : posts.length === 0 ? (
        <div className="journal-empty" role="status">
          <MessageSquare size={28} strokeWidth={1.4} className="text-muted-foreground" />
          <p className="mt-5 font-medium">{t('posts.empty')}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t('posts.emptyHint')}</p>
        </div>
      ) : (
        <div className="space-y-4" aria-label={t('common.sidePosts')}>
          {posts.map((post, index) => (
            <PostListItem
              key={post._id}
              post={post}
              isEventsCategory={category?.key === 'EVENTS'}
              order={index}
            />
          ))}
        </div>
      )}
      {status !== 'LoadingFirstPage' && status !== 'Exhausted' && (
        <div className="mt-8 flex justify-center border-t border-border/70 pt-8">
          <Button
            variant="outline"
            className="min-h-11 w-full gap-3 sm:w-auto sm:min-w-60"
            onClick={() => loadMore(20)}
            disabled={status === 'LoadingMore'}
            aria-busy={status === 'LoadingMore'}
          >
            {status === 'LoadingMore' ? (
              <Loader2 size={16} className="animate-spin motion-reduce:animate-none" />
            ) : (
              <ArrowDown size={16} />
            )}
            {status === 'LoadingMore' ? t('common.loading') : t('common.loadMore')}
          </Button>
        </div>
      )}
    </div>
  );
});

export default Posts;

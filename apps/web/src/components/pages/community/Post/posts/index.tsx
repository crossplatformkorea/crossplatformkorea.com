import { memo, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { ArrowDown, ArrowRight, Loader2, LogIn, MessageSquare, PenLine } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { api } from '@convex/_generated/api';
import { DEFAULT_CATEGORY } from '@convex/constants';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/uis/Button';
import { useMetaTags } from '@/hooks/useMetaTags';
import { createSignInHref } from '@/lib/authRedirect';
import { revealVariants, staggerVariants } from '@/lib/motion';
import CategoriesBreadCrumbs from './CategoriesBreadCrumbs';
import PostsSkeleton from './PostsSkeleton';
import PostListItem from './PostListItem';
import PostWriteModal from '../PostWriteModal';

const Posts = memo(function PostsPage() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
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
      <motion.header
        className="journal-header"
        variants={staggerVariants}
        initial={reduceMotion ? false : 'hidden'}
        animate={reduceMotion ? undefined : 'visible'}
      >
        <motion.div variants={revealVariants} className="section-kicker text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
          {t('posts.eyebrow')}
        </motion.div>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 max-w-2xl">
            <motion.h1 variants={revealVariants} className="journal-title">
              {title}
            </motion.h1>
            <motion.p
              variants={revealVariants}
              className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base"
            >
              {description}
            </motion.p>
          </div>
          <motion.div variants={revealVariants} className="shrink-0">
            <Button
              className="min-h-11 w-full gap-3 sm:w-auto"
              variant={isAuthenticated ? 'default' : 'outline'}
              onClick={() => {
                if (isAuthenticated) setIsWriteModalOpen(true);
                else
                  void navigate(
                    createSignInHref(`${location.pathname}${location.search}${location.hash}`),
                  );
              }}
            >
              {isAuthenticated ? <PenLine size={16} /> : <LogIn size={16} />}
              {isAuthenticated ? t('posts.write') : t('common.loginToWrite')}
              <ArrowRight size={15} />
            </Button>
          </motion.div>
        </div>
      </motion.header>

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

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { formatDistanceToNow } from 'date-fns';
import { ko, ja } from 'date-fns/locale';
import PostDetailsSkeleton from './PostDetailsSkeleton';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MessageSquare, Heart, Pencil, Trash2, Eye, Loader2 } from 'lucide-react';
import AuthorCard from './AuthorCard';
import PostStatusBadge from '@/components/uis/PostStatusBadge';
import PostContent from './PostContent';
import { motion, useReducedMotion } from 'framer-motion';
import { revealVariants, staggerVariants } from '@/lib/motion';
import { createSignInHref } from '@/lib/authRedirect';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';
import PostWriteModal from '../PostWriteModal';
import NotFound from '@/components/pages/NotFound';
import Comments from './Comments';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { cn, devConsole } from '@/lib/utils';
import { userFacingErrorMessage } from '@/lib/errors';
import { commentIdFromHash } from '@/lib/notificationTarget';
import { postPublishedTime } from '@/lib/postTime';
import { Button } from '@/components/uis/Button';
import { useMetaTags } from '@/hooks/useMetaTags';
import { buildBlogPosting, buildBreadcrumbs, buildFaqPage, buildVideoObject } from '@/lib/jsonLd';
import { getCategoryByKey } from '@convex/constants';

export default function PostDetailsPage() {
  const { isAuthenticated } = useAuthStore();
  const reduceMotion = useReducedMotion();
  const [isLiking, setIsLiking] = useState(false);
  // Route is `/post/:slugOrId` — accepts either the human-readable slug or a
  // legacy Convex ID. `getBySlugOrId` resolves both.
  const { slugOrId } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  // Set when a notification deep-linked to one comment: `#comment-<id>`.
  const highlightCommentId = commentIdFromHash(location.hash);
  const user = useQuery(api.users.query.currentUser);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [viewIncremented, setViewIncremented] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const deletePost = useMutation(api.posts.mutation.deletePost);
  const toggleLike = useMutation(api.posts.mutation.toggleLike);
  const incrementViewCount = useMutation(api.posts.mutation.incrementViewCount);

  // Add ref for the comments section
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slugOrId) {
      void navigate(-1);
    }
  }, [slugOrId, navigate]);

  const post = useQuery(api.posts.query.getBySlugOrId, slugOrId ? { slugOrId } : 'skip');

  // If the user hit a legacy /post/{convexId} URL, redirect to the canonical
  // slug URL so search engines see only one canonical form.
  useEffect(() => {
    if (post && slugOrId && post.slug && slugOrId !== post.slug) {
      // Keep the hash: notifications link by post id, and the comment anchor
      // would otherwise be dropped by this canonicalizing redirect.
      void navigate(`/post/${post.slug}${location.search}${location.hash}`, { replace: true });
    }
  }, [post, slugOrId, navigate, location.search, location.hash]);

  useEffect(() => {
    if (!post || viewIncremented) return;
    // Skip the increment when we're about to redirect from a legacy ID URL
    // to the canonical slug URL. The component will remount under the slug
    // path and fire the increment there, so incrementing now would double-count.
    if (post.slug && slugOrId !== post.slug) return;
    void incrementViewCount({ postId: post._id });
    setViewIncremented(true);
  }, [post, slugOrId, incrementViewCount, viewIncremented]);

  const author = useQuery(
    api.users.query.getProfile,
    post && post.authorId ? { userId: post.authorId } : 'skip',
  );

  const hasLiked = useQuery(api.posts.query.hasLiked, post ? { postId: post._id } : 'skip');

  const handleEdit = () => {
    if (post) {
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    try {
      await deletePost({ postId: post._id });
      void navigate('/posts');
    } catch (error) {
      // Navigating unconditionally used to imply the delete had worked.
      devConsole.error('Failed to delete post:', error);
      toast.error(userFacingErrorMessage(error, t('errors.postDeleteFailed')));
    }
  };

  const handleLikeClick = async () => {
    if (!post) return;
    if (!isAuthenticated) {
      void navigate(createSignInHref(`${location.pathname}${location.search}${location.hash}`));
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    try {
      await toggleLike({ postId: post._id });
    } catch (error) {
      devConsole.error('Failed to toggle post like:', error);
      toast.error(userFacingErrorMessage(error, t('errors.likeFailed')));
    } finally {
      setIsLiking(false);
    }
  };

  const scrollToComments = useCallback(() => {
    commentsRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [reduceMotion]);

  useEffect(() => {
    if (post?._id && location.hash === '#comments') scrollToComments();
  }, [post?._id, location.hash, location.key, scrollToComments]);

  const commentCount = post?.commentCount || 0;
  const viewCount = post?.viewCount || 0;
  const likeCount = post?.likeCount || 0;

  const isAuthor = isAuthenticated && user && post?.authorId === user._id;

  const formattedDate = post
    ? formatDistanceToNow(new Date(postPublishedTime(post)), {
        addSuffix: true,
        locale: i18n.language.startsWith('ko')
          ? ko
          : i18n.language.startsWith('ja')
            ? ja
            : undefined,
      })
    : '';

  // Plain-text excerpt stripped of markdown syntax — reused for description,
  // OG description, and JSON-LD. Cap at 160 chars, which is the common meta
  // description limit that also works well as an AI answer-engine snippet.
  const plainExcerpt = post?.content
    ? post.content
        .replace(/```[\s\S]*?```/g, '')
        .replace(/<[^>]*>/g, '')
        .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // strip list markers at line start (e.g. `- item`, `* item`, `+ item`)
        // so they don't appear as "- item" in the snippet
        .replace(/^\s*[-*+]\s+/gm, '')
        // strip remaining markdown punctuation — keep `-` so hyphenated words
        // like "cross-platform" stay readable in search/social snippets
        .replace(/[#*_>`~]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 160)
    : '';

  const publishedIso = post ? new Date(postPublishedTime(post)).toISOString() : undefined;
  const modifiedIso = post
    ? new Date(post.updatedAt || post._creationTime).toISOString()
    : undefined;

  const canonicalPath = post ? `/post/${post.slug || post._id}` : undefined;
  const canonicalUrl =
    typeof window !== 'undefined' && canonicalPath
      ? `${window.location.origin}${canonicalPath}`
      : canonicalPath;

  // Pick the best OG image: per-post thumbnail when available, otherwise the
  // site-wide fallback. YouTube posts get a YouTube thumbnail for free via
  // `extractThumbnailFromContent` during creation.
  const ogImage = post?.thumbnail || '/og-preview.jpg';

  // SEO optimization with meta tags
  useMetaTags(
    post
      ? {
          title: `${post.title} | Cross-Platform Korea`,
          description: plainExcerpt || `${post.title} - Cross-Platform Korea 커뮤니티`,
          keywords: post.tags
            ? `${post.tags.join(', ')}, ${post.category}, cross-platform, korea, 개발자, 커뮤니티`
            : `${post.category}, cross-platform, korea, 개발자, 커뮤니티`,
          ogTitle: post.title,
          ogDescription: plainExcerpt || `${post.title} - Cross-Platform Korea 커뮤니티`,
          ogImage,
          ogUrl: canonicalPath,
          ogType: 'article',
          twitterTitle: post.title,
          twitterDescription: plainExcerpt || `${post.title} - Cross-Platform Korea 커뮤니티`,
          twitterImage: ogImage,
          canonical: canonicalPath,
          author: author?.name || author?.displayName || undefined,
          publishedTime: publishedIso,
          modifiedTime: modifiedIso,
          articleSection: post.category,
          articleTags: post.tags,
        }
      : undefined,
  );

  // Inject per-type JSON-LD blocks. Each block uses a unique `data-schema` id
  // so we can cleanly replace/remove them independently across navigations.
  useEffect(() => {
    if (!post || !author || !canonicalUrl || !publishedIso || !modifiedIso) return;

    const categoryLabel = getCategoryByKey(post.category)?.key || post.category;

    const blogPosting = buildBlogPosting({
      title: post.title,
      description: plainExcerpt || post.title,
      url: canonicalUrl,
      image: post.thumbnail,
      datePublished: publishedIso,
      dateModified: modifiedIso,
      author: {
        name: author.name || author.displayName || 'Anonymous',
        url: author.displayName
          ? `https://crossplatformkorea.com/@${encodeURIComponent(author.displayName)}`
          : undefined,
      },
      category: post.category,
      tags: post.tags,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      viewCount: post.viewCount,
    });

    const breadcrumbs = buildBreadcrumbs({
      categoryLabel,
      postTitle: post.title,
      postUrl: canonicalUrl,
    });

    const faqPage = buildFaqPage(post.content || '');
    const videoObject = buildVideoObject({
      content: post.content || '',
      postTitle: post.title,
      description: plainExcerpt || post.title,
      datePublished: publishedIso,
    });

    const blocks: { id: string; data: unknown }[] = [
      { id: 'blog-posting', data: blogPosting },
      { id: 'breadcrumbs', data: breadcrumbs },
    ];
    if (faqPage) blocks.push({ id: 'faq-page', data: faqPage });
    if (videoObject) blocks.push({ id: 'video-object', data: videoObject });

    for (const block of blocks) {
      const selector = `script[data-schema="${block.id}"]`;
      let script = document.querySelector<HTMLScriptElement>(selector);
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.dataset.schema = block.id;
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(block.data);
    }

    return () => {
      document.querySelectorAll('script[data-schema]').forEach((el) => el.remove());
    };
  }, [post, author, canonicalUrl, publishedIso, modifiedIso, plainExcerpt]);

  return (
    <div className="article-page">
      <Link
        to="/posts"
        className="mb-8 inline-flex min-h-11 items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground sm:mb-10"
      >
        <ArrowLeft size={15} />
        <span>{t('posts.backToPosts')}</span>
      </Link>

      {/* Show loading state while waiting for post data */}
      {!slugOrId ? null : post === undefined ? (
        <PostDetailsSkeleton />
      ) : post === null ? (
        <NotFound />
      ) : (
        <article itemScope itemType="https://schema.org/BlogPosting">
          <motion.header
            className="article-header"
            variants={staggerVariants}
            initial={reduceMotion ? false : 'hidden'}
            animate={reduceMotion ? undefined : 'visible'}
          >
            <motion.div
              variants={revealVariants}
              className="flex flex-wrap items-center justify-between gap-3"
            >
              <Link
                to={`/posts?category=${getCategoryByKey(post.category)?.slug || ''}`}
                className="section-kicker text-muted-foreground hover:text-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                {t(`postCategories.${post.category}.name`, { defaultValue: post.category })}
              </Link>
              <PostStatusBadge post={post} />
            </motion.div>
            <motion.h1 variants={revealVariants} className="article-title" itemProp="headline">
              {post.title}
            </motion.h1>
            {post.tags.length > 0 && (
              <motion.p
                variants={revealVariants}
                className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground"
              >
                {post.tags.map((tag, index) => (
                  <span key={index}>#{tag}</span>
                ))}
              </motion.p>
            )}
            {isAuthor && (post.status === 'draft' || post.status === 'scheduled') && (
              <p className="mt-6 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                {t(post.status === 'draft' ? 'posts.draftBanner' : 'posts.scheduledBanner')}
              </p>
            )}
            <motion.div variants={revealVariants} className="article-byline">
              <div className="min-w-0 sm:max-w-[55%]">
                <AuthorCard
                  author={author}
                  creationTime={postPublishedTime(post)}
                  formattedDate={formattedDate}
                />
              </div>
              <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground sm:gap-3">
                <button
                  type="button"
                  onClick={() => void handleLikeClick()}
                  disabled={isLiking}
                  aria-busy={isLiking}
                  aria-pressed={!!hasLiked}
                  aria-label={`${isAuthenticated ? t(hasLiked ? 'common.unlike' : 'common.like') : t('posts.loginToLike')} · ${likeCount}`}
                  title={
                    isAuthenticated
                      ? t(hasLiked ? 'common.unlike' : 'common.like')
                      : t('posts.loginToLike')
                  }
                  className={cn('journal-metric', hasLiked && 'text-foreground')}
                >
                  {isLiking ? (
                    <Loader2 size={15} className="animate-spin motion-reduce:animate-none" />
                  ) : (
                    <Heart size={15} className={cn(hasLiked && 'fill-current')} />
                  )}
                  {likeCount}
                </button>
                <button
                  type="button"
                  onClick={scrollToComments}
                  className="journal-metric"
                  aria-label={t('posts.viewComments', { count: commentCount })}
                >
                  <MessageSquare size={15} />
                  {commentCount}
                </button>
                <span
                  className="inline-flex items-center gap-1.5 px-2"
                  aria-label={`${t('posts.views')} · ${viewCount}`}
                >
                  <Eye size={15} />
                  {viewCount}
                </span>
              </div>
            </motion.div>
            {isAuthor && (
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="min-h-10 gap-2 text-muted-foreground"
                >
                  <Pencil size={14} />
                  {t('posts.edit')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmDelete(true)}
                  className="min-h-10 gap-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={14} />
                  {t('posts.delete')}
                </Button>
              </div>
            )}
          </motion.header>
          <div className="article-body">
            <PostContent content={post.content || ''} youtubeUrl={post.youtubeUrl} />
          </div>

          {/* 댓글 컴포넌트 추가 - border 제거 */}
          <div className="article-comments">
            {/* Add ref to the Comments section */}
            <div ref={commentsRef} id="comments" className="scroll-mt-6">
              {post && <Comments postId={post._id} highlightCommentId={highlightCommentId} />}
            </div>
          </div>
        </article>
      )}

      {/* 수정 및 삭제 모달은 로딩 상태와 관계없이 항상 조건부 렌더링 */}
      {post && (
        <PostWriteModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          isEditMode={true}
          postId={post._id}
          defaultTitle={post.title}
          defaultContent={post.content}
          defaultCategory={post.category}
          defaultTags={post.tags}
          defaultThumbnail={post.thumbnail}
          defaultYoutubeUrl={post.youtubeUrl}
          defaultPublishAt={post.publishAt}
          defaultStatus={post.status}
        />
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmDeleteModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => void handleDelete()}
        title={t('posts.deleteConfirmTitle')}
        message={t('posts.deleteConfirmMessage')}
        targetName={post?.title}
      />
    </div>
  );
}

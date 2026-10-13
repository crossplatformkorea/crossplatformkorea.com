import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ko, ja } from 'date-fns/locale';
import { ArrowUpRight, MessageSquare, Heart, Eye, User, Loader2, CalendarDays } from 'lucide-react';
import type { Doc } from '@convex/_generated/dataModel';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { cn, devConsole, createUserProfileLink } from '@/lib/utils';
import { userFacingErrorMessage } from '@/lib/errors';
import PostStatusBadge from '@/components/uis/PostStatusBadge';
import { createSignInHref } from '@/lib/authRedirect';
import { postPublishedTime } from '@/lib/postTime';
import { postPreview } from '@/lib/postPreview';
import { entranceEase } from '@/lib/motion';

export default function PostListItem({
  post,
  isEventsCategory = false,
  order = 0,
}: {
  post: Doc<'posts'>;
  isEventsCategory?: boolean;
  order?: number;
}) {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const [isLiking, setIsLiking] = useState(false);
  const [failedThumbnail, setFailedThumbnail] = useState<string | null>(null);
  const [failedAvatar, setFailedAvatar] = useState<string | null>(null);
  const author = useQuery(
    api.users.query.getProfile,
    post.authorId ? { userId: post.authorId } : 'skip',
  );
  const hasLiked = useQuery(api.posts.query.hasLiked, { postId: post._id });
  const toggleLike = useMutation(api.posts.mutation.toggleLike);
  const postUrl = `/post/${post.slug || post._id}`;
  const hasThumbnail = !!post.thumbnail && failedThumbnail !== post.thumbnail;
  const language = i18n.language.split('-')[0];
  const locale = language === 'ko' ? ko : language === 'ja' ? ja : undefined;
  const excerpt = postPreview(post.content);
  const likeLabel = isAuthenticated
    ? t(hasLiked ? 'common.unlike' : 'common.like')
    : t('posts.loginToLike');

  const handleLikeClick = async () => {
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

  const authorContent = (
    <>
      {author?.avatarUrl && failedAvatar !== author.avatarUrl ? (
        <img
          src={author.avatarUrl}
          alt=""
          loading="lazy"
          onError={() => setFailedAvatar(author.avatarUrl || null)}
          className="h-6 w-6 shrink-0 rounded-full border border-border/70 object-cover"
        />
      ) : (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/70 bg-muted/50">
          <User size={12} />
        </span>
      )}
      <span className="truncate">{author?.displayName || t('user.anonymousUser')}</span>
    </>
  );

  return (
    <motion.article
      className="journal-card group"
      initial={false}
      whileInView={
        reduceMotion
          ? undefined
          : {
              y: [8, 0],
              transition: { duration: 0.4, ease: entranceEase, delay: Math.min(order, 6) * 0.03 },
            }
      }
      viewport={{ once: true, amount: 0.1 }}
    >
      <Link
        to={postUrl}
        aria-label={post.title}
        className={cn('journal-story', hasThumbnail && 'journal-story-with-image')}
      >
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground">
              {t(`postCategories.${post.category}.name`, { defaultValue: post.category })}
            </span>
            <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/50" aria-hidden="true" />
            <time
              dateTime={new Date(postPublishedTime(post)).toISOString()}
              className="text-[11px] text-muted-foreground"
            >
              {formatDistanceToNow(new Date(postPublishedTime(post)), { addSuffix: true, locale })}
            </time>
            <PostStatusBadge post={post} />
          </div>
          <div className="flex items-start gap-3">
            <h3 className="min-w-0 flex-1 text-lg font-bold leading-snug tracking-[-0.035em] [overflow-wrap:anywhere] sm:text-2xl">
              {post.title}
            </h3>
            {!hasThumbnail && (
              <ArrowUpRight
                size={18}
                strokeWidth={1.5}
                className="mt-1 hidden shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none sm:block"
                aria-hidden="true"
              />
            )}
          </div>
          {excerpt && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{excerpt}</p>
          )}
          {post.tags.length > 0 && (
            <p className="mt-4 truncate font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
              {post.tags.slice(0, 3).join(' / ')}
            </p>
          )}
        </div>
        {hasThumbnail && (
          <div className="journal-thumbnail">
            <img
              src={post.thumbnail}
              alt=""
              loading="lazy"
              onError={() => setFailedThumbnail(post.thumbnail || null)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035] motion-reduce:transform-none"
            />
          </div>
        )}
      </Link>
      <div className="journal-card-footer">
        {author?.displayName ? (
          <Link
            to={createUserProfileLink(author.displayName)}
            className="inline-flex min-w-0 max-w-[50%] items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
          >
            {authorContent}
          </Link>
        ) : (
          <span className="inline-flex min-w-0 max-w-[50%] items-center gap-2 text-xs text-muted-foreground">
            {authorContent}
          </span>
        )}
        <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground sm:gap-3">
          <button
            type="button"
            onClick={() => void handleLikeClick()}
            disabled={isLiking}
            aria-busy={isLiking}
            aria-pressed={!!hasLiked}
            aria-label={`${likeLabel} · ${post.likeCount || 0}`}
            title={likeLabel}
            className={cn('journal-metric', hasLiked && 'text-foreground')}
          >
            {isLiking ? (
              <Loader2 size={14} className="animate-spin motion-reduce:animate-none" />
            ) : (
              <Heart size={14} className={cn(hasLiked && 'fill-current')} />
            )}
            {post.likeCount || 0}
          </button>
          <Link
            to={`${postUrl}#comments`}
            className="journal-metric"
            aria-label={t('posts.viewComments', { count: post.commentCount || 0 })}
          >
            <MessageSquare size={14} />
            {post.commentCount || 0}
          </Link>
          <span
            className="hidden items-center gap-1.5 sm:inline-flex"
            aria-label={`${t('posts.views')} · ${post.viewCount || 0}`}
          >
            <Eye size={14} />
            {post.viewCount || 0}
          </span>
        </div>
      </div>
      {isEventsCategory && post.startDate && post.endDate && (
        <div className="flex items-center gap-2 border-t border-border/70 px-5 py-3 text-xs text-muted-foreground sm:px-7">
          <CalendarDays size={14} />
          <span>
            {t('posts.eventPeriod', {
              start: new Date(post.startDate).toLocaleDateString(i18n.language),
              end: new Date(post.endDate).toLocaleDateString(i18n.language),
            })}
          </span>
        </div>
      )}
    </motion.article>
  );
}

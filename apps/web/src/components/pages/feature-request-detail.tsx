import { useState, useCallback, ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ArrowLeft, MessageSquare, Trash2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { revealVariants } from '@/lib/motion';
import RequestStatus from './feature-request/RequestStatus';
import VoteButton from './feature-request/VoteButton';
import RequestRoadmap from './feature-request/RequestRoadmap';
import useAuthGuard from '@/hooks/useAuthGuard';
import { Button } from '@/components/uis/Button';
import { Textarea } from '@/components/uis/Textarea';
import { devConsole } from '@/lib/utils';
import { useMetaTags } from '@/hooks/useMetaTags';

export default function FeatureRequestDetailPage() {
  useAuthGuard();
  const { t, i18n } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [isVoting, setIsVoting] = useState(false);

  const { featureRequestId } = useParams<{ featureRequestId: string }>();
  const navigate = useNavigate();

  const featureRequest = useQuery(
    api.featureRequests.query.getById,
    featureRequestId ? { id: featureRequestId as Id<'featureRequests'> } : 'skip',
  );
  const comments = useQuery(
    api.featureRequests.query.getComments,
    featureRequestId ? { featureRequestId: featureRequestId as Id<'featureRequests'> } : 'skip',
  );
  const currentUser = useQuery(api.users.query.currentUser);

  const voteForFeature = useMutation(api.featureRequests.mutation.vote);
  const deleteFeatureRequest = useMutation(api.featureRequests.mutation.deleteFeatureRequest);
  const addComment = useMutation(api.featureRequests.mutation.addComment);
  const deleteComment = useMutation(api.featureRequests.mutation.deleteComment);

  useMetaTags(
    featureRequest
      ? {
          title: `${featureRequest.title} | 기능 요청 | Cross-Platform Korea`,
          description:
            featureRequest.description?.slice(0, 160) ||
            `${featureRequest.title} - 크로스플랫폼 코리아 기능 요청`,
          canonical: `/feature-request/${featureRequest._id}`,
          ogUrl: `/feature-request/${featureRequest._id}`,
          ogType: 'article',
        }
      : undefined,
  );

  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (timestamp: number) => {
    const locale = i18n.language;
    return new Date(timestamp).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const hasVoted = () => {
    if (!currentUser || !featureRequest) return false;
    return featureRequest.voterIds?.includes(currentUser._id) ?? false;
  };

  const isOwner = featureRequest && currentUser && featureRequest.userId === currentUser._id;

  const handleVote = async () => {
    if (!featureRequestId) return;
    setIsVoting(true);
    try {
      await voteForFeature({ id: featureRequestId as Id<'featureRequests'> });
    } catch (err) {
      devConsole.error('Failed to vote:', err);
      toast.error(t('featureRequest.voteFailed'));
    } finally {
      setIsVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!featureRequestId) return;
    setIsDeleting(true);
    try {
      await deleteFeatureRequest({ id: featureRequestId as Id<'featureRequests'> });
      toast.success(t('featureRequest.deleteSuccess'));
      void navigate('/feature-request');
    } catch (err) {
      devConsole.error('Failed to delete:', err);
      toast.error(t('featureRequest.deleteFailed'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmitComment = useCallback(async () => {
    if (!featureRequestId || !commentContent.trim()) return;

    setIsSubmittingComment(true);
    try {
      await addComment({
        featureRequestId: featureRequestId as Id<'featureRequests'>,
        content: commentContent.trim(),
      });
      setCommentContent('');
      toast.success(t('featureRequest.commentAdded'));
    } catch (err) {
      devConsole.error('Failed to add comment:', err);
      toast.error(t('featureRequest.commentFailed'));
    } finally {
      setIsSubmittingComment(false);
    }
  }, [featureRequestId, commentContent, addComment, t]);

  const handleDeleteComment = async (commentId: Id<'featureRequestComments'>) => {
    try {
      await deleteComment({ commentId });
      toast.success(t('featureRequest.commentDeleted'));
    } catch (err) {
      devConsole.error('Failed to delete comment:', err);
      toast.error(t('featureRequest.commentDeleteFailed'));
    }
  };

  if (featureRequest === undefined)
    return (
      <div className="article-page community-page" role="status">
        <span className="sr-only">{t('common.loading')}</span>
        <div className="h-64 animate-pulse rounded-2xl bg-muted/40 motion-reduce:animate-none" />
      </div>
    );
  if (featureRequest === null)
    return (
      <div className="article-page community-page">
        <div className="journal-empty">
          <h1 className="text-xl font-semibold">{t('featureRequest.notFound')}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {t('featureRequest.notFoundDescription')}
          </p>
          <Link to="/feature-request" className="collection-link mt-6">
            <ArrowLeft size={16} />
            {t('featureRequest.backToList')}
          </Link>
        </div>
      </div>
    );

  return (
    <div className="article-page community-page">
      <motion.header
        className="article-header"
        initial={reducedMotion ? false : 'hidden'}
        animate="visible"
        variants={revealVariants}
      >
        <Link
          to="/feature-request"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
        >
          <ArrowLeft size={16} />
          {t('featureRequest.backToList')}
        </Link>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <span className="section-kicker">COMMUNITY / FEATURE REQUEST</span>
          <RequestStatus status={featureRequest.status} />
        </div>
        <h1 className="article-title">{featureRequest.title}</h1>
        <div className="article-byline">
          <div className="flex flex-wrap items-center gap-4">
            <VoteButton
              votes={featureRequest.votes}
              voted={hasVoted()}
              isOwner={!!isOwner}
              pending={isVoting}
              onVote={() => void handleVote()}
            />
            <p className="text-xs text-muted-foreground">
              {t('featureRequest.requestedOn')}{' '}
              <time dateTime={new Date(featureRequest._creationTime).toISOString()}>
                {formatDate(featureRequest._creationTime)}
              </time>
            </p>
          </div>
          {isOwner && (
            <div className="flex flex-wrap items-center gap-2">
              {!showDeleteConfirm ? (
                <Button
                  variant="ghost"
                  className="min-h-11 text-muted-foreground"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 size={15} />
                  {t('featureRequest.deleteButton')}
                </Button>
              ) : (
                <>
                  <p className="w-full text-xs text-muted-foreground">
                    {t('featureRequest.deleteConfirm')}
                  </p>
                  <Button
                    variant="outline"
                    className="min-h-11"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    variant="destructive"
                    className="min-h-11"
                    onClick={() => void handleDelete()}
                    disabled={isDeleting}
                  >
                    {t(isDeleting ? 'common.deleting' : 'common.delete')}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </motion.header>
      <div className="py-6">
        <RequestRoadmap status={featureRequest.status} />
      </div>
      <article className="article-body !pt-4">
        <p className="whitespace-pre-wrap break-words text-base leading-8 text-foreground/85 sm:text-lg sm:leading-9">
          {featureRequest.description}
        </p>
      </article>
      <section id="comments" className="article-comments" aria-labelledby="request-comments-title">
        <div className="mb-6 flex items-center gap-3">
          <MessageSquare size={20} className="text-muted-foreground" />
          <h2 id="request-comments-title" className="text-2xl font-semibold tracking-tight">
            {t('featureRequest.comments')}{' '}
            <span className="ml-1 font-mono text-sm text-muted-foreground">
              {comments === undefined ? '—' : comments.length}
            </span>
          </h2>
        </div>
        <form
          className="journal-card mb-8 p-5 sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmitComment();
          }}
        >
          <label htmlFor="request-comment" className="sr-only">
            {t('featureRequest.commentPlaceholder')}
          </label>
          <Textarea
            id="request-comment"
            value={commentContent}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCommentContent(e.target.value)}
            placeholder={t('featureRequest.commentPlaceholder')}
            rows={4}
            className="mb-4 text-sm"
            required
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="min-h-11"
              disabled={isSubmittingComment || !commentContent.trim()}
            >
              {t(
                isSubmittingComment
                  ? 'featureRequest.submittingComment'
                  : 'featureRequest.addComment',
              )}
            </Button>
          </div>
        </form>
        {comments === undefined ? (
          <p role="status" className="py-8 text-sm text-muted-foreground">
            {t('common.loading')}
          </p>
        ) : comments.length ? (
          <div className="divide-y divide-border/70">
            {comments.map((comment) => (
              <article key={comment._id} className="py-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-sm font-medium text-muted-foreground">
                    {comment.author?.avatarUrl ? (
                      <img
                        src={comment.author.avatarUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      comment.author?.displayName?.[0]?.toUpperCase() || '?'
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <span className="break-words text-sm font-semibold">
                        {comment.author?.displayName || t('user.anonymousUser')}
                      </span>
                      <div className="flex items-center gap-2">
                        <time
                          dateTime={new Date(comment._creationTime).toISOString()}
                          className="text-xs text-muted-foreground"
                        >
                          {formatDate(comment._creationTime)}
                        </time>
                        {currentUser && comment.authorId === currentUser._id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="min-h-11 min-w-11 text-muted-foreground"
                            onClick={() => void handleDeleteComment(comment._id)}
                            aria-label={t('common.delete')}
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-foreground/80">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            {t('featureRequest.noComments')}
          </p>
        )}
      </section>
    </div>
  );
}

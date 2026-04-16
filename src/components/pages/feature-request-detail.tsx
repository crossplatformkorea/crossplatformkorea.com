import { useState, useCallback, ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { t } from 'i18next';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import useAuthGuard from '@/hooks/useAuthGuard';
import { Button } from '@/components/uis/Button';
import { Textarea } from '@/components/uis/Textarea';
import { cn, devConsole } from '@/lib/utils';
import { useMetaTags } from '@/hooks/useMetaTags';

type StatusType = 'requested' | 'planned' | 'in-progress' | 'completed';

// Status badge component
const StatusBadge = ({ status }: { status: StatusType }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'requested':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100 border-blue-300 dark:border-blue-600';
      case 'planned':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100 border-purple-300 dark:border-purple-600';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100 border-yellow-300 dark:border-yellow-600';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 border-green-300 dark:border-green-600';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'requested':
        return t('featureRequest.status.requested');
      case 'planned':
        return t('featureRequest.status.planned');
      case 'in-progress':
        return t('featureRequest.status.inProgress');
      case 'completed':
        return t('featureRequest.status.completed');
      default:
        return status;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide border',
        getBadgeStyle(),
      )}
    >
      {getStatusText()}
    </span>
  );
};

// Chevron up icon for upvote
const ChevronUpIcon = ({ voted }: { voted?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={cn('h-5 w-5', voted ? 'text-primary' : 'text-gray-400 dark:text-gray-500')}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
      clipRule="evenodd"
    />
  </svg>
);

// Back icon
const BackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export default function FeatureRequestDetailPage() {
  useAuthGuard();

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
    const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
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
    try {
      await voteForFeature({ id: featureRequestId as Id<'featureRequests'> });
    } catch (err) {
      devConsole.error('Failed to vote:', err);
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
  }, [featureRequestId, commentContent, addComment]);

  const handleDeleteComment = async (commentId: Id<'featureRequestComments'>) => {
    try {
      await deleteComment({ commentId });
      toast.success(t('featureRequest.commentDeleted'));
    } catch (err) {
      devConsole.error('Failed to delete comment:', err);
      toast.error(t('featureRequest.commentDeleteFailed'));
    }
  };

  // Loading state
  if (featureRequest === undefined) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (featureRequest === null) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('featureRequest.notFound')}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('featureRequest.notFoundDescription')}
          </p>
          <div className="mt-4">
            <Link to="/feature-request">
              <Button variant="outline">{t('common.back')}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <Link
        to="/feature-request"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-6"
      >
        <BackIcon />
        {t('featureRequest.backToList')}
      </Link>

      {/* Main content */}
      <article className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Vote button */}
          <button
            onClick={() => !isOwner && void handleVote()}
            disabled={isOwner}
            className={cn(
              'flex flex-col items-center justify-center min-w-[48px] py-2 rounded-lg shrink-0',
              'border border-gray-200 dark:border-gray-700 transition-colors duration-200',
              isOwner || hasVoted()
                ? 'text-primary border-primary/30 bg-primary/5 cursor-default'
                : 'text-gray-400 dark:text-gray-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5',
            )}
          >
            <ChevronUpIcon voted={isOwner || hasVoted()} />
            <span className="text-sm font-semibold">{featureRequest.votes}</span>
          </button>

          {/* Title and status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {featureRequest.title}
              </h1>
              <div className="flex items-center gap-2">
                <StatusBadge status={featureRequest.status as StatusType} />
                {isOwner && !showDeleteConfirm && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-1 rounded text-gray-300 hover:text-red-400 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
                    title={t('featureRequest.deleteButton')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {isOwner && showDeleteConfirm && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t('featureRequest.deleteConfirm')}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => void handleDelete()}
                      disabled={isDeleting}
                    >
                      {isDeleting ? t('common.deleting') : t('common.delete')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              {t('featureRequest.requestedOn')} {formatDate(featureRequest._creationTime)}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {featureRequest.description}
          </p>
        </div>
      </article>

      {/* Comments section */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('featureRequest.comments')} ({comments?.length || 0})
        </h2>

        {/* Comment input */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4 mb-4">
          <Textarea
            value={commentContent}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCommentContent(e.target.value)}
            placeholder={t('featureRequest.commentPlaceholder')}
            rows={3}
            className="text-sm mb-3"
          />
          <div className="flex justify-end">
            <Button
              onClick={() => void handleSubmitComment()}
              disabled={isSubmittingComment || !commentContent.trim()}
              size="sm"
            >
              {isSubmittingComment
                ? t('featureRequest.submittingComment')
                : t('featureRequest.addComment')}
            </Button>
          </div>
        </div>

        {/* Comments list */}
        <div className="space-y-3">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden">
                    {comment.author?.avatarUrl ? (
                      <img
                        src={comment.author.avatarUrl}
                        alt={comment.author.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium">
                        {comment.author?.displayName?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {comment.author?.displayName || t('user.anonymousUser')}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {formatDate(comment._creationTime)}
                        </span>
                        {/* Delete button for comment author - subtle */}
                        {currentUser && comment.authorId === currentUser._id && (
                          <button
                            onClick={() => void handleDeleteComment(comment._id)}
                            className="p-1 rounded text-gray-300 hover:text-red-400 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
                            title={t('common.delete')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
              {t('featureRequest.noComments')}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

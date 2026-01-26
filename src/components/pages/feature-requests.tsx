import { useCallback, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { t } from 'i18next';
import { toast } from 'sonner';
import useAuthGuard from '@/hooks/useAuthGuard';
import { Button } from '@/components/uis/Button';
import { Textarea } from '@/components/uis/Textarea';
import { cn, devConsole } from '@/lib/utils';

type FeatureRequest = {
  _id: Id<'featureRequests'>;
  _creationTime: number;
  title: string;
  description: string;
  votes: number;
  status: string;
  userId: Id<'users'>;
  userEmail?: string;
  voterIds?: Id<'users'>[];
  deletedAt?: number;
  commentCount?: number;
};

type StatusType = 'requested' | 'planned' | 'in-progress' | 'completed';
type StatusBadgeProps = { status: StatusType };

// Enhanced Status badge component
const StatusBadge = ({ status }: StatusBadgeProps) => {
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
      default: {
        const unknownStatus = String(status);
        return unknownStatus.charAt(0).toUpperCase() + unknownStatus.slice(1);
      }
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
    className={cn('h-4 w-4', voted ? 'text-primary' : 'text-gray-400 dark:text-gray-500')}
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

// Comment icon
const CommentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-gray-400 dark:text-gray-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
      clipRule="evenodd"
    />
  </svg>
);

export default function FeatureRequestsPage() {
  useAuthGuard(); // Ensures user is authenticated for this page
  const navigate = useNavigate();

  const {
    results: featureRequests,
    status,
    loadMore,
  } = usePaginatedQuery(api.featureRequests.query.getAll, {}, { initialNumItems: 10 });
  const addFeatureRequest = useMutation(api.featureRequests.mutation.add);
  const voteForFeature = useMutation(api.featureRequests.mutation.vote);
  const currentUser = useQuery(api.users.query.currentUser);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const formatDate = (timestamp: number) => {
    const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
    return new Date(timestamp).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const onSubmitFeatureRequest = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (title.trim().length < 3) {
        throw new Error(t('featureRequest.validation.titleTooShort'));
      }
      if (description.trim().length < 10) {
        throw new Error(t('featureRequest.validation.descriptionTooShort'));
      }
      const _result = await addFeatureRequest({
        title: title.trim(),
        description: description.trim(),
      });
      setTitle('');
      setDescription('');
      setShowForm(false);
      toast.success(t('featureRequest.successMessage'));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t('featureRequest.validation.failedToSubmit');
      setError(errorMessage);
      devConsole.error('Error submitting feature request:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, addFeatureRequest]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      void onSubmitFeatureRequest();
    },
    [onSubmitFeatureRequest],
  );

  const handleVote = async (id: Id<'featureRequests'>) => {
    try {
      await voteForFeature({ id });
    } catch (err) {
      devConsole.error('Failed to vote:', err);
    }
  };

  const handleRequestFeatureToggle = () => {
    setShowForm(!showForm);
    if (!showForm) {
      setError(null);
    }
  };

  const handleNavigateToDetail = (id: Id<'featureRequests'>) => {
    void navigate(`/feature-request/${id}`);
  };

  const hasVoted = (request: FeatureRequest) => {
    if (!currentUser) return false;
    return request.voterIds?.includes(currentUser._id) ?? false;
  };

  // Icon for the request feature button
  const PlusIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  );

  const CancelIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t('featureRequest.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('featureRequest.description')}
          </p>
        </div>
        <Button
          onClick={handleRequestFeatureToggle}
          variant={showForm ? 'outline' : 'default'}
          className="shrink-0 flex items-center gap-2"
        >
          {showForm ? <CancelIcon /> : <PlusIcon />}
          {showForm ? t('featureRequest.cancelButton') : t('featureRequest.requestButton')}
        </Button>
      </header>

      {/* Form Section */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          showForm ? 'max-h-[600px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0',
        )}
      >
        <section className="bg-white dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('featureRequest.formTitle')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                {t('featureRequest.titleLabel')} <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder={t('featureRequest.titlePlaceholder')}
                required
                className={cn(
                  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm',
                  'dark:border-gray-600 dark:bg-gray-700/50 dark:text-white',
                  'focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all',
                )}
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                {t('featureRequest.descriptionLabel')} <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder={t('featureRequest.descriptionPlaceholder')}
                required
                className="text-sm"
              />
            </div>
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !title.trim() || !description.trim()}>
                {isSubmitting
                  ? t('featureRequest.submittingButton')
                  : t('featureRequest.submitButton')}
              </Button>
            </div>
          </form>
        </section>
      </div>

      <main>
        {status === 'LoadingFirstPage' && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('featureRequest.loading')}
            </p>
          </div>
        )}

        {!featureRequests || (featureRequests.length === 0 && status !== 'LoadingFirstPage') ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50">
            <svg
              className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="mt-3 text-base font-medium text-gray-900 dark:text-white">
              {t('featureRequest.noRequestsTitle')}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('featureRequest.noRequests')}
            </p>
            {!showForm && (
              <div className="mt-4">
                <Button onClick={handleRequestFeatureToggle} variant="outline" size="sm">
                  {t('featureRequest.beTheFirst')}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {featureRequests.map((request) => (
              <article
                key={request._id}
                onClick={() => handleNavigateToDetail(request._id)}
                className={cn(
                  'bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50',
                  'hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200',
                  'group cursor-pointer',
                )}
              >
                <div className="p-4 flex items-center gap-4">
                  {/* Vote Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const isOwner = currentUser && request.userId === currentUser._id;
                      if (!isOwner) void handleVote(request._id);
                    }}
                    disabled={currentUser && request.userId === currentUser._id}
                    className={cn(
                      'flex flex-col items-center justify-center min-w-[40px] py-1.5 rounded-lg',
                      'border border-gray-200 dark:border-gray-700 transition-colors duration-200',
                      currentUser && request.userId === currentUser._id
                        ? 'text-primary border-primary/30 bg-primary/5 cursor-default'
                        : hasVoted(request as FeatureRequest)
                          ? 'text-primary border-primary/30 bg-primary/5'
                          : 'text-gray-400 dark:text-gray-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5',
                    )}
                    aria-label={t('featureRequest.voteAriaLabel')}
                  >
                    <ChevronUpIcon
                      voted={
                        (currentUser && request.userId === currentUser._id) ||
                        hasVoted(request as FeatureRequest)
                      }
                    />
                    <span className="text-sm font-semibold">{request.votes}</span>
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                          {request.title}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                          {request.description}
                        </p>
                      </div>
                      <StatusBadge status={request.status as StatusType} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 mt-2">
                      <time dateTime={new Date(request._creationTime).toISOString()}>
                        {formatDate(request._creationTime)}
                      </time>
                      {(request.commentCount ?? 0) > 0 && (
                        <span className="flex items-center gap-1">
                          <CommentIcon />
                          {request.commentCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {status === 'CanLoadMore' && (
              <div className="flex justify-center pt-6">
                <Button onClick={() => loadMore(5)} variant="outline" size="lg">
                  {t('featureRequest.loadMore')}
                </Button>
              </div>
            )}
            {status === 'LoadingMore' && (
              <div className="flex justify-center pt-6">
                <div className="px-6 py-3 text-gray-600 dark:text-gray-400 text-lg">
                  {t('featureRequest.loadingMore')}...
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

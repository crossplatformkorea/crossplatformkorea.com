import { useCallback, useState, ChangeEvent } from 'react';
import { useMutation, usePaginatedQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { t } from 'i18next';
import useAuthGuard from '@/hooks/useAuthGuard';
import { Button } from '@/components/uis/Button';
import { Textarea } from '@/components/uis/Textarea';
import { cn } from '@/lib/utils';

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
        getBadgeStyle()
      )}
    >
      {getStatusText()}
    </span>
  );
};

// Icon for upvote
const UpvoteIcon = ({ voted }: { voted?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      'h-5 w-5',
      voted ? 'text-primary fill-primary/20' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary'
    )}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 3.293l-6.354 6.353.708.708L10 4.707l5.646 5.647.708-.708L10 3.293z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="M10 5a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V5.75A.75.75 0 0110 5z"
      clipRule="evenodd"
    />
  </svg>
);

export default function FeatureRequestsPage() {
  useAuthGuard(); // Ensures user is authenticated for this page

  const {
    results: featureRequests,
    status,
    loadMore,
  } = usePaginatedQuery(api.featureRequests.query.getAll, {}, { initialNumItems: 10 });
  const addFeatureRequest = useMutation(api.featureRequests.mutation.add);
  const voteForFeature = useMutation(api.featureRequests.mutation.vote);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(t('common.localeDate') || 'en-US', {
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
      // Consider using a toast notification library like sonner for success messages
      window.alert(t('featureRequest.successMessage'));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t('featureRequest.validation.failedToSubmit');
      setError(errorMessage);
      console.error('Error submitting feature request:', err);
      // Consider using a toast for errors too
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
      // Optionally, provide feedback to the user (e.g., optimistic update or toast)
    } catch (err) {
      console.error('Failed to vote:', err);
      // Optionally show an error toast
    }
  };

  const handleRequestFeatureToggle = () => {
    setShowForm(!showForm);
    if (!showForm) {
      // Reset error when opening form
      setError(null);
    }
  };

  // Icon for the request feature button
  const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  );

  const CancelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {t('featureRequest.title')}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {t('featureRequest.description')}
          </p>
        </div>
        <Button
          onClick={handleRequestFeatureToggle}
          size="lg"
          variant={showForm ? "outline" : "default"} // Change variant based on form visibility
          className="shrink-0 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center"
        >
          {showForm ? <CancelIcon /> : <PlusIcon />}
          {showForm ? t('featureRequest.cancelButton') : t('featureRequest.requestButton')}
        </Button>
      </header>

      {/* Wrapper div for transition */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          showForm
            ? 'max-h-[1000px] opacity-100 mb-12' // Adjust max-h if your form can be taller
            : 'max-h-0 opacity-0 mb-0' // Collapses the div and its margin when hidden
        )}
      >
        <section className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            {t('featureRequest.formTitle')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
                  "w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm sm:text-sm",
                  "dark:border-gray-600 dark:bg-gray-700 dark:text-white",
                  "focus:ring-primary focus:border-primary"
                )}
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {t('featureRequest.descriptionLabel')} <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder={t('featureRequest.descriptionPlaceholder')}
                required
                className="sm:text-sm" // Assuming Textarea component accepts className
              />
            </div>
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !title.trim() || !description.trim()}
                size="lg"
              >
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
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('featureRequest.loading')}
            </p>
          </div>
        )}

        {!featureRequests || (featureRequests.length === 0 && status !== 'LoadingFirstPage') ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 p-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">
              {t('featureRequest.noRequestsTitle')}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('featureRequest.noRequests')}
            </p>
            {!showForm && (
              <div className="mt-6">
                <Button onClick={handleRequestFeatureToggle} variant="outline">
                  {t('featureRequest.beTheFirst')}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {featureRequests.map((request) => (
              <article
                key={request._id}
                className={cn(
                  "bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700",
                  "hover:shadow-xl transition-shadow duration-300 ease-in-out"
                )}
              >
                <div className="p-5 sm:p-6 flex gap-4 sm:gap-6">
                  <div className="flex flex-col items-center pt-1 shrink-0">
                    <button
                      onClick={() => void handleVote(request._id)}
                      className={cn(
                        "group p-2.5 rounded-md border border-gray-300 dark:border-gray-600",
                        "hover:border-primary dark:hover:border-primary",
                        "bg-gray-50 dark:bg-gray-700/50",
                        "hover:bg-primary/5 dark:hover:bg-primary/10",
                        "transition-colors duration-150 flex flex-col items-center w-[60px]"
                      )}
                      aria-label={t('featureRequest.voteAriaLabel')}
                    >
                      <UpvoteIcon />
                      <span className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary">
                        {request.votes}
                      </span>
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-2">
                      <h2 className={cn(
                        "text-lg sm:text-xl font-semibold text-gray-900 dark:text-white cursor-pointer transition-colors",
                        "hover:text-primary dark:hover:text-primary"
                      )}>
                        {request.title}
                      </h2>
                      <div className="mt-2 sm:mt-0 sm:ml-4 shrink-0">
                        <StatusBadge status={request.status as StatusType} />
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 mb-3">
                      {request.description}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {t('featureRequest.requestedOn')}{' '}
                      <time dateTime={new Date(request._creationTime).toISOString()}>
                        {formatDate(request._creationTime)}
                      </time>
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

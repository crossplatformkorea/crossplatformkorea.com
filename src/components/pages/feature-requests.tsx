import { useCallback, useState } from 'react';
import { useMutation, usePaginatedQuery } from 'convex/react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import AppLoading from '../AppLoading';
import useAuthGuard from '@/hooks/useAuthGuard';
import { t } from 'i18next';

type StatusType = 'requested' | 'planned' | 'in-progress' | 'completed';
type StatusBadgeProps = { status: StatusType };

// Status badge component
const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getBadgeColor = () => {
    switch (status) {
      case 'requested':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'planned':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Map status to i18n key
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
        // Handle the default case with proper type safety
        const unknownStatus = String(status);
        return unknownStatus.charAt(0).toUpperCase() + unknownStatus.slice(1);
      }
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor()}`}
    >
      {getStatusText()}
    </span>
  );
};

export default function FeatureRequests() {
  const navigate = useNavigate();
  // Replace the direct auth check with useAuthGuard
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthGuard();

  const {
    results: featureRequests,
    status,
    loadMore,
  } = usePaginatedQuery(api.featureRequests.getAll, {}, { initialNumItems: 10 });
  const addFeatureRequest = useMutation(api.featureRequests.add);
  const voteForFeature = useMutation(api.featureRequests.vote);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const onSubmitFeatureRequest = useCallback(async () => {
    // Double-check authentication before proceeding
    if (!isAuthenticated) {
      void navigate('/sign-in');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (title.trim().length < 3) {
        throw new Error(t('featureRequest.validation.titleTooShort'));
      }

      if (description.trim().length < 10) {
        throw new Error(t('featureRequest.validation.descriptionTooShort'));
      }

      console.log('Submitting feature request:', { title, description });

      try {
        const result = await addFeatureRequest({
          title: title.trim(),
          description: description.trim(),
        });

        console.log('Feature request submitted successfully:', result);

        // Reset form
        setTitle('');
        setDescription('');
        setShowForm(false);

        // Show success toast or message
        window.alert(t('featureRequest.successMessage'));
      } catch (mutationError) {
        console.error('Mutation error:', mutationError);
        throw new Error(
          t('featureRequest.validation.serverError', {
            message: mutationError instanceof Error ? mutationError.message : 'Unknown error',
          }),
        );
      }
    } catch (err) {
      console.error('Error submitting feature request:', err);
      setError(err instanceof Error ? err.message : t('featureRequest.validation.failedToSubmit'));
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, addFeatureRequest, isAuthenticated, navigate]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      void onSubmitFeatureRequest();
    },
    [onSubmitFeatureRequest],
  );

  const handleVote = async (id: Id<'featureRequests'>) => {
    // Check if user is authenticated before voting
    if (!isAuthenticated) {
      void navigate('/sign-in');
      return;
    }

    try {
      await voteForFeature({ id });
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  const handleRequestFeature = () => {
    if (!isAuthenticated) {
      void navigate('/sign-in');
      return;
    }
    setShowForm(!showForm);
  };

  // Show loading before redirect for smooth transition
  if (isAuthLoading) {
    return <AppLoading />;
  }
  if (!isAuthenticated) {
    return <AppLoading />;
  }

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {t('featureRequest.title')}
            </h2>
            <p className="text-muted-foreground mt-2">{t('featureRequest.description')}</p>
          </div>

          <button
            onClick={handleRequestFeature}
            className="px-4 py-2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground dark:text-primary-foreground rounded-lg font-medium hover:from-primary/90 hover:to-primary/80 dark:hover:text-primary-foreground transition-all shadow-md shadow-primary/20"
          >
            {showForm ? t('featureRequest.cancelButton') : t('featureRequest.requestButton')}
          </button>
        </div>

        {showForm && (
          <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">{t('featureRequest.formTitle')}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  {t('featureRequest.titleLabel')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-border/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background/50 backdrop-blur-sm"
                  placeholder={t('featureRequest.titlePlaceholder')}
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  {t('featureRequest.descriptionLabel')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-border/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background/50 backdrop-blur-sm"
                  placeholder={t('featureRequest.descriptionPlaceholder')}
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm p-2 bg-red-100/30 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !description.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-primary/90 hover:to-primary/80 transition-all shadow-md shadow-primary/20"
                >
                  {isSubmitting
                    ? t('featureRequest.submittingButton')
                    : t('featureRequest.submitButton')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Feature request list */}
        <div className="space-y-4">
          {status === 'LoadingFirstPage' ? (
            <div className="text-center p-12 bg-background/80 backdrop-blur-md border border-border/50 rounded-xl">
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-12 h-12 mb-4">
                  <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
                </div>
                <p className="text-muted-foreground">{t('featureRequest.loading')}</p>
              </div>
            </div>
          ) : !featureRequests || featureRequests.length === 0 ? (
            <div className="text-center p-12 bg-background/80 backdrop-blur-md border border-border/50 rounded-xl">
              <p className="text-muted-foreground">{t('featureRequest.noRequests')}</p>
            </div>
          ) : (
            <>
              {featureRequests.map((request) => (
                <div
                  key={request._id}
                  className="p-6 bg-background/80 backdrop-blur-md border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Vote button */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => void handleVote(request._id)}
                        className="p-2 bg-background border border-border/50 rounded-md hover:bg-primary/5 transition-colors"
                        aria-label="Vote for this feature"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </button>
                      <span className="font-bold text-lg mt-1">{request.votes}</span>
                      <span className="text-xs text-muted-foreground">
                        {t('featureRequest.votes')}
                      </span>
                    </div>

                    {/* Feature content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{request.title}</h3>
                        <StatusBadge status={request.status as StatusType} />
                      </div>

                      <p className="text-muted-foreground whitespace-pre-line mb-4">
                        {request.description}
                      </p>

                      <div className="text-xs text-muted-foreground">
                        {t('featureRequest.requestedOn')} {formatDate(request._creationTime)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Load more button */}
              {status === 'CanLoadMore' && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => loadMore(5)}
                    className="px-4 py-2 bg-background border border-border/50 rounded-lg text-muted-foreground hover:bg-primary/5 transition-colors"
                  >
                    {t('featureRequest.loadMore')}
                  </button>
                </div>
              )}

              {status === 'LoadingMore' && (
                <div className="flex justify-center mt-6">
                  <div className="px-4 py-2 text-muted-foreground">
                    {t('featureRequest.loadingMore')}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

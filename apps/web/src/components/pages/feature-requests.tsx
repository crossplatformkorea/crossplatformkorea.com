import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ArrowUpRight, Lightbulb, MessageSquare, Plus, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import useAuthGuard from '@/hooks/useAuthGuard';
import { Button } from '@/components/uis/Button';
import { Textarea } from '@/components/uis/Textarea';
import { devConsole } from '@/lib/utils';
import { userFacingErrorMessage } from '@/lib/errors';
import { entranceEase, scrollRevealVariants } from '@/lib/motion';
import { useMetaTags } from '@/hooks/useMetaTags';
import CommunityPageHeader from '@/components/uis/CommunityPageHeader';
import RequestStatus from './feature-request/RequestStatus';
import VoteButton from './feature-request/VoteButton';
import RequestRoadmap from './feature-request/RequestRoadmap';

export default function FeatureRequestsPage() {
  useAuthGuard();
  const { t, i18n } = useTranslation();
  const reducedMotion = useReducedMotion();
  useMetaTags({
    title: `${t('featureRequest.title')} | Cross-Platform Korea`,
    description: t('featureRequest.description'),
    canonical: '/feature-request',
    ogUrl: '/feature-request',
    ogType: 'website',
  });
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
  const [votingIds, setVotingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const onSubmitFeatureRequest = useCallback(async () => {
    setError(null);
    if (title.trim().length < 3) {
      setError(t('featureRequest.validation.titleTooShort'));
      return;
    }
    if (description.trim().length < 10) {
      setError(t('featureRequest.validation.descriptionTooShort'));
      return;
    }
    setIsSubmitting(true);
    try {
      await addFeatureRequest({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
      setShowForm(false);
      toast.success(t('featureRequest.successMessage'));
    } catch (err) {
      setError(userFacingErrorMessage(err, t('featureRequest.validation.failedToSubmit')));
      devConsole.error('Error submitting feature request:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, addFeatureRequest, t]);

  const handleVote = async (id: Id<'featureRequests'>) => {
    setVotingIds((previous) => new Set(previous).add(id));
    try {
      await voteForFeature({ id });
    } catch (err) {
      toast.error(userFacingErrorMessage(err, t('featureRequest.voteFailed')));
    } finally {
      setVotingIds((previous) => {
        const next = new Set(previous);
        next.delete(id);
        return next;
      });
    }
  };
  const toggleForm = () => {
    setShowForm((value) => !value);
    setError(null);
  };
  return (
    <div className="journal-page community-page">
      <CommunityPageHeader
        eyebrow={t('featureRequest.header.eyebrow')}
        title={t('featureRequest.title')}
        description={t('featureRequest.description')}
        action={
          <Button
            onClick={toggleForm}
            variant={showForm ? 'outline' : 'default'}
            className="min-h-11"
            aria-expanded={showForm}
            aria-controls="request-form"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? t('featureRequest.cancelButton') : t('featureRequest.requestButton')}
          </Button>
        }
        aside={<RequestRoadmap />}
      />
      <AnimatePresence initial={false}>
        {showForm && (
          <motion.section
            id="request-form"
            className="overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: entranceEase }}
          >
            <div className="journal-card mb-8 p-5 sm:p-7">
              <div className="mb-6 flex items-start gap-3">
                <Lightbulb size={20} className="mt-1 shrink-0 text-muted-foreground" />
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {t('featureRequest.formTitle')}
                  </h2>
                  <p id="request-guidance" className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t('featureRequest.formGuidance')}
                  </p>
                </div>
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void onSubmitFeatureRequest();
                }}
                className="space-y-5"
                aria-describedby="request-guidance"
              >
                <div>
                  <label htmlFor="request-title" className="field-label">
                    {t('featureRequest.titleLabel')}
                  </label>
                  <input
                    id="request-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder={t('featureRequest.titlePlaceholder')}
                    required
                    className="field-control h-12 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="request-description" className="field-label">
                    {t('featureRequest.descriptionLabel')}
                  </label>
                  <Textarea
                    id="request-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={5}
                    placeholder={t('featureRequest.descriptionPlaceholder')}
                    required
                    className="text-sm"
                  />
                </div>
                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
                  >
                    {error}
                  </p>
                )}
                <div className="flex justify-end">
                  <Button type="submit" className="min-h-11" disabled={isSubmitting}>
                    {isSubmitting
                      ? t('featureRequest.submittingButton')
                      : t('featureRequest.submitButton')}
                    <ArrowUpRight size={16} />
                  </Button>
                </div>
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      <section
        aria-label={t('featureRequest.title')}
        aria-busy={status === 'LoadingFirstPage' || status === 'LoadingMore'}
      >
        <div className="community-section-label">
          <span className="section-kicker">{t('featureRequest.header.listKicker')}</span>
          <span className="text-xs text-muted-foreground">{t('featureRequest.listNote')}</span>
        </div>
        {status === 'LoadingFirstPage' ? (
          <div role="status" className="space-y-3">
            <span className="sr-only">{t('featureRequest.loading')}</span>
            {[0, 1, 2].map((value) => (
              <div
                key={value}
                className="journal-card h-36 animate-pulse bg-muted/40 motion-reduce:animate-none"
              />
            ))}
          </div>
        ) : featureRequests.length === 0 ? (
          <div className="journal-empty">
            <Lightbulb size={30} className="mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold">{t('featureRequest.noRequestsTitle')}</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              {t('featureRequest.noRequests')}
            </p>
            {!showForm && (
              <Button onClick={toggleForm} variant="outline" className="mt-6 min-h-11">
                {t('featureRequest.beTheFirst')}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {featureRequests.map((request) => (
              <motion.article
                key={request._id}
                className="journal-card"
                initial={false}
                whileInView={reducedMotion ? undefined : 'visible'}
                variants={scrollRevealVariants}
                viewport={{ once: true, amount: 0.15 }}
              >
                <div className="flex items-start gap-4 p-5 sm:gap-6 sm:p-7">
                  <VoteButton
                    votes={request.votes}
                    voted={
                      currentUser ? (request.voterIds?.includes(currentUser._id) ?? false) : false
                    }
                    isOwner={currentUser?._id === request.userId}
                    pending={votingIds.has(request._id)}
                    onVote={() => void handleVote(request._id)}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-3">
                      <RequestStatus status={request.status} />
                    </div>
                    <Link
                      to={`/feature-request/${request._id}`}
                      className="group block rounded-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
                    >
                      <h2 className="flex items-start gap-3 text-lg font-semibold leading-snug tracking-[-0.03em] sm:text-xl">
                        <span className="min-w-0 flex-1 break-words">{request.title}</span>
                        <ArrowUpRight
                          size={18}
                          className="mt-1 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                        />
                      </h2>
                      <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-muted-foreground">
                        {request.description}
                      </p>
                    </Link>
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <time dateTime={new Date(request._creationTime).toISOString()}>
                        {formatDate(request._creationTime)}
                      </time>
                      {(request.commentCount ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <MessageSquare size={13} aria-hidden="true" />
                          {request.commentCount} {t('featureRequest.comments')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
        {(status === 'CanLoadMore' || status === 'LoadingMore') && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              className="min-h-12"
              onClick={() => loadMore(5)}
              disabled={status === 'LoadingMore'}
            >
              {t(
                status === 'LoadingMore' ? 'featureRequest.loadingMore' : 'featureRequest.loadMore',
              )}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

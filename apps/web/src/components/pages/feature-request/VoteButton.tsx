import { ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export default function VoteButton({
  votes,
  voted,
  isOwner,
  pending,
  onVote,
}: {
  votes: number;
  voted: boolean;
  isOwner: boolean;
  pending: boolean;
  onVote: () => void;
}) {
  const { t } = useTranslation();
  const content = (
    <>
      <ChevronUp size={17} aria-hidden="true" />
      <span className="font-mono text-sm font-semibold tabular-nums">{votes}</span>
    </>
  );
  if (isOwner)
    return (
      <div
        className="roadmap-vote bg-muted/50"
        role="group"
        title={t('featureRequest.ownRequestCannotVote')}
        aria-label={`${votes} ${t('featureRequest.votes')}. ${t('featureRequest.ownRequestCannotVote')}`}
      >
        {content}
      </div>
    );
  return (
    <button
      type="button"
      onClick={onVote}
      disabled={pending}
      aria-pressed={voted}
      aria-label={t('featureRequest.voteAriaLabel')}
      aria-busy={pending}
      className={cn('roadmap-vote', voted && 'border-foreground/40 bg-muted/70 text-foreground')}
    >
      {content}
    </button>
  );
}

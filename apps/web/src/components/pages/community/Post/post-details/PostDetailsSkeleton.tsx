import { useTranslation } from 'react-i18next';

export default function PostDetailsSkeleton() {
  const { t } = useTranslation();
  return (
    <div role="status" aria-label={t('common.loading')}>
      <div
        className="animate-pulse space-y-6 border-b border-border/80 pb-7 motion-reduce:animate-none"
        aria-hidden="true"
      >
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-10 w-full rounded bg-muted sm:h-14" />
        <div className="h-10 w-3/4 rounded bg-muted sm:h-14" />
        <div className="flex items-center gap-3 pt-3">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-3 w-20 rounded bg-muted" />
          </div>
        </div>
      </div>
      <div
        className="article-body animate-pulse space-y-5 motion-reduce:animate-none"
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4, 5].map((line) => (
          <div key={line} className="h-4 w-full rounded bg-muted last:w-2/3" />
        ))}
      </div>
    </div>
  );
}

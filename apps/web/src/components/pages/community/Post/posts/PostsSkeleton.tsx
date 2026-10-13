import { useTranslation } from 'react-i18next';

export default function PostsSkeleton() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4" role="status" aria-label={t('common.loading')}>
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="journal-card p-5 sm:p-7" aria-hidden="true">
          <div className="animate-pulse space-y-4 motion-reduce:animate-none">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-6 w-4/5 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
            <div className="flex justify-between border-t border-border/70 pt-4">
              <div className="h-6 w-28 rounded bg-muted" />
              <div className="h-6 w-20 rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

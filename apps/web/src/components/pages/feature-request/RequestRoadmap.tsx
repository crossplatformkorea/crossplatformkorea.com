import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const statuses = ['requested', 'planned', 'in-progress', 'completed'];
export default function RequestRoadmap({ status }: { status?: string }) {
  const { t } = useTranslation();
  const current = status ? statuses.indexOf(status) : -1;
  return (
    <ol className="roadmap-steps" aria-label={t('featureRequest.progress')}>
      {statuses.map((value, index) => (
        <li
          key={value}
          aria-current={value === status ? 'step' : undefined}
          className={cn('roadmap-step', value === status && 'roadmap-step-current')}
        >
          <span
            className={cn(
              'roadmap-step-number',
              current >= index && 'border-foreground/40 text-foreground',
            )}
            aria-hidden="true"
          >
            0{index + 1}
          </span>
          <span>
            {t(`featureRequest.status.${value === 'in-progress' ? 'inProgress' : value}`)}
          </span>
        </li>
      ))}
    </ol>
  );
}

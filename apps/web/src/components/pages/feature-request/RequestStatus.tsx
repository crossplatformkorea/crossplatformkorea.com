import { useTranslation } from 'react-i18next';

export default function RequestStatus({ status }: { status: string }) {
  const { t } = useTranslation();
  const key = status === 'in-progress' ? 'inProgress' : status;
  return (
    <span className="roadmap-status" data-status={status}>
      <span aria-hidden="true" className="roadmap-status-dot" />
      {t(`featureRequest.status.${key}`, { defaultValue: status })}
    </span>
  );
}

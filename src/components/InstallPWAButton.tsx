import { Download } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { t } from '../lib/i18n';
import { cn } from '../lib/utils';

export default function InstallPWAButton() {
  const { isInstallable, isInstalled, installApp } = usePWA();

  if (isInstalled || !isInstallable) return null;

  return (
    <button
      onClick={() => void installApp()}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg',
        'bg-primary text-primary-foreground',
        'hover:bg-primary/90 transition-colors',
        'text-sm font-medium',
      )}
    >
      <Download size={16} />
      {t('pwa.install', { defaultValue: '앱 설치' })}
    </button>
  );
}

import { Download } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { t } from '../lib/i18n';
import { Button } from './uis/Button';

export default function InstallPWAButton() {
  const { isInstallable, isInstalled, installApp } = usePWA();

  if (isInstalled || !isInstallable) return null;

  return (
    <Button
      onClick={() => void installApp()}
      variant="default"
    >
      <Download size={16} />
      {t('pwa.install', { defaultValue: '앱 설치' })}
    </Button>
  );
}

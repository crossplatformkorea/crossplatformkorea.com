import { t } from '../lib/i18n';
import { cn } from '@/lib/utils';

interface AppLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

/**
 * A loading indicator component that can be used throughout the application
 * @param message Optional custom loading message
 * @param fullScreen Whether to display the loader as a full-screen component
 */
export default function AppLoading({ message, fullScreen = false }: AppLoadingProps) {
  const loadingMessage = message || t('common.loading');

  const content = (
    <div role="status" className="flex flex-col items-center justify-center">
      <div
        aria-hidden="true"
        className="mb-5 h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary motion-reduce:animate-none"
      />
      <p className="text-sm text-muted-foreground">{loadingMessage}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background text-foreground">
        {content}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex-1 overflow-auto p-8',
        'flex items-center justify-center bg-background text-foreground',
      )}
    >
      {content}
    </div>
  );
}

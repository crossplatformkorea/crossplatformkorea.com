import React from 'react';
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
    <div className="flex flex-col items-center justify-center">
      {/* Film reel animation */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute w-full h-full rounded-full border-4 border-primary/20 dark:border-primary/30 animate-spin-slow"></div>{' '}
        {/* Adjusted dark mode border opacity */}
        <div className="absolute w-full h-full rounded-full border-2 border-primary/30 dark:border-primary/40 animate-spin-reverse"></div>{' '}
        {/* Adjusted dark mode border opacity */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
          {' '}
          {/* Adjusted dark mode bg opacity */}
          <div className="w-3/4 h-3/4 rounded-full bg-background dark:bg-zinc-800 flex items-center justify-center">
            {' '}
            {/* Added dark:bg-zinc-800 */}
            <div className="w-1/2 h-1/2 rounded-full border-2 border-t-primary dark:border-t-primary border-primary/30 dark:border-primary/50 animate-spin"></div>{' '}
            {/* Adjusted dark mode border opacity */}
          </div>
        </div>
      </div>
      <p className="text-muted-foreground dark:text-zinc-400 text-sm animate-pulse">
        {loadingMessage}
      </p>{' '}
      {/* Added dark:text-zinc-400 */}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/95 dark:bg-zinc-900/95 backdrop-blur-sm flex items-center justify-center z-50">
        {' '}
        {/* Added dark:bg-zinc-900/95 */}
        {content}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex-1 overflow-auto p-8 overflow-y-scroll',
        'flex items-center justify-center',
      )}
    >
      {content}
    </div>
  );
}

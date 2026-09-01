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
        <div className="absolute w-full h-full rounded-full border-4 border-primary/20 animate-spin-slow"></div>
        <div className="absolute w-full h-full rounded-full border-2 border-primary/30 animate-spin-reverse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <div
            className="w-3/4 h-3/4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'hsl(var(--background))' }}
          >
            <div className="w-1/2 h-1/2 rounded-full border-2 border-t-primary border-primary/30 animate-spin"></div>
          </div>
        </div>
      </div>
      <p className="text-sm animate-pulse" style={{ color: 'hsl(var(--muted-foreground))' }}>
        {loadingMessage}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
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
      style={{
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
      }}
    >
      {content}
    </div>
  );
}

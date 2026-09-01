import React from 'react';
import { cn } from '@/lib/utils';

interface ShowcaseSkeletonProps {
  className?: string;
}

// Add the CSS animation as a global style using keyframes
const shimmerKeyframes = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  .shimmer {
    animation: shimmer 2s infinite;
  }
`;

const ShowcaseSkeleton = ({ className }: ShowcaseSkeletonProps) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border shadow-sm',
        'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        'animate-pulse',
        className,
      )}
    >
      {/* Image area skeleton */}
      <div className="relative w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        {/* Random height for masonry effect */}
        <div 
          className="w-full bg-gray-200 dark:bg-gray-700"
          style={{ height: `${200 + Math.random() * 100}px` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/30 dark:via-gray-600/30 to-transparent shimmer"></div>
        </div>
      </div>

      {/* Content area skeleton */}
      <div className="p-4 space-y-3">
        {/* Category and edit button */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-6 w-6 rounded-md bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Title */}
        <div className="h-5 w-full rounded bg-gray-200 dark:bg-gray-700"></div>

        {/* Description */}
        <div className="space-y-1">
          <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Links */}
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-md bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-6 w-20 rounded-md bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5">
          <div className="h-4 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 w-14 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Author info */}
        <div className="pt-2 mt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-1.5">
          <div className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      {/* Add animation styles via a regular style tag */}
      <style dangerouslySetInnerHTML={{ __html: shimmerKeyframes }} />
    </div>
  );
};

// Skeleton group component for rendering multiple skeletons
export const ShowcaseSkeletonGroup = ({ count = 6 }: { count?: number }) => {
  return (
    <div className={cn(
      'columns-1 sm:columns-2 lg:columns-3',
      'gap-6 space-y-0',
      '[&>*]:break-inside-avoid [&>*]:mb-6'
    )}>
      {Array.from({ length: count }).map((_, index) => (
        <ShowcaseSkeleton key={index} />
      ))}
    </div>
  );
};

export default ShowcaseSkeleton;

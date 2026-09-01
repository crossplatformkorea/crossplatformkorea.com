import React from 'react';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';

export default function PostDetailsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Post header section skeleton */}
      <div className="mb-8 bg-muted/5 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/10">
          {/* Category and tags skeleton */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-6 w-16 bg-primary/10 dark:bg-primary/20 rounded-full animate-pulse"></div>
            <div className="h-6 w-20 bg-primary/10 dark:bg-primary/20 rounded-full animate-pulse"></div>
          </div>

          {/* Title skeleton */}
          <div className="relative mb-4">
            <div className="h-9 w-full max-w-2xl bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          </div>

          {/* Author info and metadata skeleton */}
          <div className="flex items-center justify-between border-t border-border/10 mt-4 pt-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mr-3"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              </div>
            </div>

            {/* Stats row skeleton */}
            <div className="flex items-center gap-4">
              <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Post content skeleton */}
      <div
        className={cn(
          'px-8 py-10 relative overflow-hidden border-b border-border/30',
          'bg-white dark:bg-gray-800/30'
        )}
      >
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </div>
      </div>

      {/* Comments section skeleton */}
      <div
        className={cn('px-8 py-8 mt-2 rounded-lg shadow-sm', 'bg-background dark:bg-gray-800/20')}
      >
        {/* Comments header */}
        <div className="font-semibold text-xl mb-5 flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 opacity-40" />
          <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </div>

        {/* Comment form skeleton */}
        <div className="mb-8">
          <div className="border border-border dark:border-gray-700 rounded-md">
            <div className="w-full p-3 min-h-[100px] bg-gray-100 dark:bg-gray-800/50 animate-pulse rounded-t-md"></div>
            <div className="flex justify-end p-2 border-t border-border dark:border-gray-700 bg-muted/20 dark:bg-gray-800/50">
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Comments list skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="border-b border-border/30 dark:border-gray-700/30 pb-4 last:border-b-0"
            >
              {/* Comment author info */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mr-2"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-1"></div>
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Comment content */}
              <div className="ml-10 mb-2">
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-1"></div>
                <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export default function UserSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Back button skeleton */}
      <div className="flex items-center mb-6">
        <div className="w-20 h-8 bg-muted/30 rounded-md"></div>
      </div>

      {/* Profile header skeleton */}
      <div className="bg-card/30 border border-border/50 rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar skeleton */}
          <div className="w-20 h-20 bg-muted/40 rounded-full"></div>
          
          {/* User info skeleton */}
          <div className="flex-1 space-y-3">
            {/* Display name */}
            <div className="w-32 h-6 bg-muted/40 rounded-md"></div>
            
            {/* Organization */}
            <div className="w-48 h-4 bg-muted/30 rounded-md"></div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-6 bg-muted/30 rounded-full"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Social links skeleton */}
        <div className="flex gap-3 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 bg-muted/30 rounded-md"
            ></div>
          ))}
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex border-b border-border/50 mb-6">
        <div className="w-16 h-10 bg-muted/30 rounded-t-md mr-4"></div>
        <div className="w-16 h-10 bg-muted/20 rounded-t-md"></div>
      </div>

      {/* Content area skeleton */}
      <div className="space-y-4">
        {/* Title */}
        <div className="w-48 h-6 bg-muted/40 rounded-md mb-4"></div>

        {/* Post items skeleton */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-card/30 border border-border/50 rounded-lg p-4 space-y-3"
          >
            {/* Post header */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted/40 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="w-24 h-4 bg-muted/30 rounded-md"></div>
                <div className="w-32 h-3 bg-muted/20 rounded-md"></div>
              </div>
            </div>

            {/* Post title */}
            <div className="w-3/4 h-5 bg-muted/40 rounded-md"></div>

            {/* Post content */}
            <div className="space-y-2">
              <div className="w-full h-4 bg-muted/20 rounded-md"></div>
              <div className="w-5/6 h-4 bg-muted/20 rounded-md"></div>
              <div className="w-2/3 h-4 bg-muted/20 rounded-md"></div>
            </div>

            {/* Post tags */}
            <div className="flex gap-2">
              {Array.from({ length: 2 }).map((_, tagIndex) => (
                <div
                  key={tagIndex}
                  className="w-12 h-5 bg-muted/30 rounded-full"
                ></div>
              ))}
            </div>

            {/* Post actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-4">
                <div className="w-12 h-6 bg-muted/30 rounded-md"></div>
                <div className="w-12 h-6 bg-muted/30 rounded-md"></div>
              </div>
              <div className="w-16 h-6 bg-muted/30 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Alternative compact skeleton for list views
export function UserSkeletonCompact() {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 bg-card/20 border border-border/30 rounded-lg"
        >
          {/* Avatar */}
          <div className="w-10 h-10 bg-muted/40 rounded-full flex-shrink-0"></div>
          
          {/* Content */}
          <div className="flex-1 space-y-2">
            <div className="w-24 h-4 bg-muted/40 rounded-md"></div>
            <div className="w-32 h-3 bg-muted/20 rounded-md"></div>
          </div>

          {/* Action */}
          <div className="w-16 h-6 bg-muted/30 rounded-md flex-shrink-0"></div>
        </div>
      ))}
    </div>
  );
}

// Profile header only skeleton
export function ProfileHeaderSkeleton() {
  return (
    <div className="animate-pulse bg-card/30 border border-border/50 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Avatar skeleton */}
        <div className="w-20 h-20 bg-muted/40 rounded-full"></div>
        
        {/* User info skeleton */}
        <div className="flex-1 space-y-3">
          {/* Display name */}
          <div className="w-32 h-6 bg-muted/40 rounded-md"></div>
          
          {/* Organization */}
          <div className="w-48 h-4 bg-muted/30 rounded-md"></div>
          
          {/* Description */}
          <div className="space-y-2">
            <div className="w-full h-3 bg-muted/20 rounded-md"></div>
            <div className="w-3/4 h-3 bg-muted/20 rounded-md"></div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-16 h-6 bg-muted/30 rounded-full"
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Social links skeleton */}
      <div className="flex gap-3 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="w-8 h-8 bg-muted/30 rounded-md"
          ></div>
        ))}
      </div>
    </div>
  );
}

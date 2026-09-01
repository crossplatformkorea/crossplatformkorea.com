import React from 'react';
import { cn } from '@/lib/utils';
import { PenLine } from 'lucide-react';

export default function PostsSkeleton() {
  // Generate an array of skeleton post items
  const skeletonPosts = Array(5).fill(null);

  // 메인 카테고리 (전체)
  const mainCategory = { width: 'w-20', isActive: true }; // '전체(All)'는 활성화 상태로 가정

  // 서브 카테고리들 (소식, Q&A, 읽을거리 등) - 정확히 6개 메뉴만 표시
  const subCategories = [
    { width: 'w-24', text: 'w-16', isActive: false }, // 소식(News)
    { width: 'w-28', text: 'w-20', isActive: false }, // 질문과답변(Q&A)
    { width: 'w-32', text: 'w-24', isActive: false }, // 스터디자료(Study Materials)
    { width: 'w-26', text: 'w-18', isActive: false }, // 이벤트(Events)
    { width: 'w-28', text: 'w-20', isActive: false }, // 읽을거리(Reading)
  ];

  return (
    <div>
      {/* Header with breadcrumbs and write button skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Breadcrumbs skeleton - 실제 카테고리 버튼과 유사하게 스타일링 */}
        <div className="flex-1 w-full">
          {/* 모바일 화면에서는 세로로, 데스크톱에서는 가로로 레이아웃 변경 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
            {/* 메인 카테고리 (전체) - 항상 상단에 표시 */}
            <div
              className={cn(
                'rounded-md animate-pulse flex items-center justify-center h-9 mb-3 sm:mb-0',
                mainCategory.width,
                'bg-primary/10 border border-primary/20 shadow-sm',
              )}
            >
              {/* 텍스트 영역만 표시 */}
              <div className="h-4 w-10"></div>
            </div>

            {/* 서브 카테고리 컨테이너 - 모바일에서는 가로 스크롤, 데스크톱에서는 나란히 */}
            <div className="w-full max-w-full overflow-x-auto scrollbar-none pb-2 sm:pb-0">
              <div className="flex flex-nowrap gap-2 min-w-min pr-4">
                {subCategories.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      'rounded-md animate-pulse flex items-center justify-center h-9 shrink-0',
                      item.width,
                      'bg-gray-200 dark:bg-gray-700 border border-transparent',
                    )}
                  >
                    {/* 텍스트 영역 - 너비 명시적으로 지정 */}
                    <div className={cn('h-4', item.text)}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Write button skeleton */}
        <div className="h-10 w-24 bg-primary/30 dark:bg-primary/20 rounded-md animate-pulse flex items-center justify-center gap-2">
          <PenLine size={18} className="opacity-30" />
          <div className="h-4 w-14 bg-white/30 dark:bg-white/20 rounded-sm"></div>
        </div>
      </div>

      {/* 나머지 코드는 변경하지 않음 */}
      {/* Category title and description skeleton */}
      <div className="mb-6">
        <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-3"></div>
        <div className="h-4 w-full max-w-2xl bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
      </div>

      {/* Skeleton posts */}
      <div className="space-y-5">
        {skeletonPosts.map((_, index) => (
          <div
            key={index}
            className={cn(
              'block overflow-hidden rounded-md shadow-sm border',
              'bg-background/60 border-border/10 dark:border-border/15',
              'dark:bg-gray-800/40 dark:shadow-md dark:shadow-black/5',
            )}
          >
            {/* Main content area */}
            <div className="p-4 pb-3">
              {/* Title and category badge skeleton */}
              <div className="flex items-start justify-between mb-2">
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>

              {/* Tags skeleton */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <div className="h-5 w-16 bg-primary/10 dark:bg-primary/20 rounded-full animate-pulse"></div>
                <div className="h-5 w-14 bg-primary/10 dark:bg-primary/20 rounded-full animate-pulse"></div>
                <div className="h-5 w-20 bg-primary/10 dark:bg-primary/20 rounded-full animate-pulse"></div>
              </div>

              {/* Content preview skeleton */}
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-1"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-3"></div>
            </div>

            {/* Subtle divider */}
            <div className="border-t border-border/20 dark:border-gray-700 mx-4"></div>

            {/* Footer with stats skeleton */}
            <div
              className={cn(
                'px-4 py-3 flex items-center justify-between',
                'bg-muted/5 dark:bg-gray-800/70',
              )}
            >
              {/* Left side - author and date */}
              <div className="flex items-center gap-2">
                {/* 작성자 아바타 */}
                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              </div>

              {/* Right side - engagement metrics */}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <div className="h-4 w-4 mr-1 rounded-sm bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="h-4 w-6 rounded-sm bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 mr-1 rounded-sm bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="h-4 w-6 rounded-sm bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 mr-1 rounded-sm bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="h-4 w-6 rounded-sm bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

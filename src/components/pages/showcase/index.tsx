import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import ShowcaseItem, { ShowcaseItemType } from './ShowcaseItem';
import { Search, Plus, AppWindow, X, ChevronDown } from 'lucide-react';
import ShowcaseFormModal from './ShowcaseFormModal';
import { ShowcaseSkeletonGroup } from './ShowcaseSkeleton';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useMetaTags } from '../../../hooks/useMetaTags';
import { t } from '../../../lib/i18n';
import { Button } from '../../uis/Button';
import MasonryGrid from '../../uis/MasonryGrid';

export default function ShowcasePage() {
  // Apply showcase-specific meta tags
  useMetaTags({
    title: `${t('showcase.title')} - ${t('meta.title')}`,
  });

  const { t: translate } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingShowcase, setEditingShowcase] = useState<ShowcaseItemType | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);

  // 카테고리 목록 조회
  const categories = useQuery(api.showcases.query.getCategories) || [];

  // 사용자 정보 조회
  const user = useQuery(api.users.query.currentUser);

  // 쇼케이스 목록 조회 (기본 페이지네이션 적용)
  const showcaseResult = useQuery(api.showcases.query.getShowcasesByCategory, {
    paginationOpts: { cursor, numItems: 12 },
    category: selectedCategory || 'all',
    searchText: searchText.trim(),
  });

  // 페이지네이션 데이터
  const showcases = showcaseResult?.page || [];
  const isDone = showcaseResult?.isDone || false;
  const continueCursor = showcaseResult?.continueCursor || null;

  // 로딩 상태 판단
  const isLoading = showcaseResult === undefined;

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCursor(null);
  };

  // 카테고리 필터 핸들러
  const handleCategoryChange = (categoryKey: string | null) => {
    setSelectedCategory(categoryKey);
    setCursor(null);
  };

  // 더 보기 핸들러
  const handleLoadMore = () => {
    setCursor(continueCursor);
  };

  // 쇼케이스 편집 핸들러
  const handleEditShowcase = (showcase: ShowcaseItemType) => {
    setEditingShowcase(showcase);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  // 폼 제출 후 핸들러
  const handleFormSubmitSuccess = () => {
    setIsFormOpen(false);
    setIsEditMode(false);
    setEditingShowcase(null);

    // 첫 페이지부터 다시 로드
    setCursor(null);
  };

  // 로그인 여부 확인
  const isAuthenticated = !!user;

  return (
    <div className="min-h-full">
      {/* 헤더 영역 */}
      <div className="mb-8">
        <h1
          className={cn(
            'mb-2 text-center text-3xl font-bold sm:text-left',
            'text-gray-800 dark:text-gray-100',
          )}
        >
          {translate('showcase.title')}
        </h1>
        <p className={cn('text-center sm:text-left', 'text-gray-600 dark:text-gray-400')}>
          {translate('showcase.description')}
        </p>
      </div>

      {/* 검색 & 필터 영역 */}
      <div className="mb-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
        {/* 검색 창 */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder={translate('showcase.searchPlaceholder')}
            className={cn(
              'h-10 w-full rounded-full border pl-10 pr-4',
              'border-gray-300 dark:border-gray-600',
              'bg-white dark:bg-gray-700',
              'text-gray-800 dark:text-gray-200',
              'focus:border-gray-500 dark:focus:border-gray-400',
              'focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400',
            )}
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400 dark:text-gray-500" />
          </div>
          {searchText && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchText('')}
              className="absolute inset-y-0 right-3 flex items-center p-0 h-auto"
              aria-label="Clear search"
            >
              <X
                size={18}
                className={cn(
                  'text-gray-400 dark:text-gray-500',
                  'hover:text-gray-600 dark:hover:text-gray-300',
                )}
              />
            </Button>
          )}
        </div>

        {/* 카테고리 필터 드롭다운 */}
        <div className="relative">
          <select
            value={selectedCategory || ''}
            onChange={(e) => handleCategoryChange(e.target.value || null)}
            className={cn(
              'h-10 w-full rounded-full border pr-10 pl-4 py-2 appearance-none',
              'border-gray-300 dark:border-gray-600',
              'bg-white dark:bg-gray-700',
              'text-gray-800 dark:text-gray-200',
              'focus:border-gray-500 dark:focus:border-gray-400',
              'focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400',
            )}
          >
            <option value="">{translate('showcase.allCategories')}</option>
            {categories.map((category) => (
              <option key={category.key} value={category.key}>
                {translate(`showcaseCategories.${category.key}.name`, {
                  defaultValue: category.name || category.key,
                })}
              </option>
            ))}
          </select>
          {/* 커스텀 화살표 아이콘 추가 */}
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
          </div>
        </div>

        {/* 새 쇼케이스 추가 버튼 */}
        {isAuthenticated && (
          <Button
            variant="default"
            onClick={() => {
              setIsEditMode(false);
              setEditingShowcase(null);
              setIsFormOpen(true);
            }}
          >
            <Plus size={16} /> {translate('showcase.addNew')}
          </Button>
        )}
      </div>

      {/* 쇼케이스 목록 영역 */}
      {isLoading ? (
        // 로딩 중에는 스켈레톤 UI 표시
        <ShowcaseSkeletonGroup count={12} />
      ) : showcases.length === 0 ? (
        <div
          className={cn(
            'flex flex-col items-center justify-center rounded-xl py-16 text-center',
            'border border-gray-200 dark:border-gray-700',
            'bg-gray-100 dark:bg-gray-800',
          )}
        >
          <div className="mb-4 text-gray-400 dark:text-gray-500">
            <AppWindow size={48} />
          </div>
          <h3 className={cn('mb-2 text-xl font-medium', 'text-gray-800 dark:text-gray-200')}>
            {searchText
              ? translate('showcase.noSearchResults')
              : translate('showcase.noShowcases')}
          </h3>
          <p className={cn('mx-auto max-w-md', 'text-gray-500 dark:text-gray-400')}>
            {searchText ? translate('showcase.tryAdjusting') : translate('showcase.beTheFirst')}
          </p>
          {isAuthenticated && (
            <Button
              variant="default"
              className="mt-6"
              onClick={() => {
                setIsEditMode(false);
                setEditingShowcase(null);
                setIsFormOpen(true);
              }}
            >
              <Plus size={16} />
              <span>{translate('showcase.addFirst')}</span>
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Pinterest-style masonry layout with JavaScript positioning */}
          <MasonryGrid
            className="w-full"
            columnGap={24}
            rowGap={24}
            breakpoints={{
              sm: 1,
              md: 2,
              lg: 3,
              xl: 3,
            }}
          >
            {showcases.map((showcase) => (
              <ShowcaseItem
                key={showcase._id}
                showcase={{
                  ...showcase,
                  categoryName: categories.find((c) => c.key === showcase.category)
                    ? translate(`showcaseCategories.${showcase.category}.name`, {
                        defaultValue:
                          categories.find((c) => c.key === showcase.category)?.name ||
                          showcase.category,
                      })
                    : showcase.category,
                }}
                isEditable={user ? user._id === showcase.userId : false}
                onEditClick={() => handleEditShowcase(showcase)}
              />
            ))}
          </MasonryGrid>

          {/* 더 보기 버튼 */}
          {!isDone && (
            <div className="mt-8 flex justify-center">
              <Button variant="default" onClick={handleLoadMore}>
                {translate('showcase.loadMore')}
              </Button>
            </div>
          )}
        </>
      )}

      {/* 쇼케이스 추가/편집 모달 */}
      {isFormOpen && (
        <ShowcaseFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          isEditMode={isEditMode}
          showcase={editingShowcase}
          onSubmitSuccess={handleFormSubmitSuccess}
          categories={categories}
        />
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import CuratedShowcases from './CuratedShowcases';
import ShowcaseItem, { ShowcaseItemType } from './ShowcaseItem';
import { Search, Plus, AppWindow, X } from 'lucide-react';
import ShowcaseFormModal from './ShowcaseFormModal';
import { ShowcaseSkeletonGroup } from './ShowcaseSkeleton';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useMetaTags } from '../../../hooks/useMetaTags';
import { t } from '../../../lib/i18n';
import { Button } from '../../uis/Button';
import SignInAction from '../../uis/SignInAction';
import CommunityPageHeader from '../../uis/CommunityPageHeader';
import { curatedApps } from './catalog-data';
import { technologies } from './catalog';
import { useAuthStore } from '@/stores/authStore';

export default function ShowcasePage() {
  // Apply showcase-specific meta tags
  useMetaTags({
    title: `${t('showcase.title')} - ${t('meta.title')}`,
  });

  const { t: translate } = useTranslation();
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}${location.hash}`;
  const [params, setParams] = useSearchParams();
  const collection = params.get('collection') === 'community' ? 'community' : 'curated';
  const selectCollection = (value: 'curated' | 'community') => {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set('collection', value);
      return next;
    });
  };
  const { isAuthenticated } = useAuthStore();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingShowcase, setEditingShowcase] = useState<ShowcaseItemType | null>(null);

  // 카테고리 목록 조회
  const categories = useQuery(api.showcases.query.getCategories) || [];

  // 사용자 정보 조회
  const user = useQuery(api.users.query.currentUser);

  const {
    results: showcases,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.showcases.query.getShowcasesByCategory,
    collection === 'community'
      ? { category: selectedCategory || 'all', searchText: searchText.trim() }
      : 'skip',
    { initialNumItems: 12 },
  );
  const isLoading = status === 'LoadingFirstPage';

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // 카테고리 필터 핸들러
  const handleCategoryChange = (categoryKey: string | null) => {
    setSelectedCategory(categoryKey);
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

    selectCollection('community');
  };

  const openCreateForm = () => {
    setIsEditMode(false);
    setEditingShowcase(null);
    setIsFormOpen(true);
  };

  return (
    <div className="journal-page community-page">
      <CommunityPageHeader
        eyebrow={translate('showcase.header.eyebrow')}
        title={translate('showcase.title')}
        description={translate('showcase.catalog.description')}
        action={
          isAuthenticated ? (
            <Button onClick={openCreateForm} className="min-h-11">
              <Plus size={16} />
              {translate('showcase.addNew')}
            </Button>
          ) : (
            <SignInAction returnTo={returnTo}>{translate('showcase.signInToAdd')}</SignInAction>
          )
        }
        aside={
          <div className="flex flex-wrap gap-x-8 gap-y-4 sm:gap-x-12">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold tracking-tight tabular-nums">
                {curatedApps.length}
              </span>
              <span className="text-xs text-muted-foreground">
                {translate('showcase.catalog.curated')}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold tracking-tight tabular-nums">
                {technologies.length}
              </span>
              <span className="text-xs text-muted-foreground">
                {translate('showcase.catalog.technology')}
              </span>
            </div>
          </div>
        }
      />

      <div
        className="journal-filters mb-7 flex gap-2 py-2"
        role="group"
        aria-label={translate('showcase.catalog.collection')}
      >
        {(['curated', 'community'] as const).map((value) => (
          <Button
            key={value}
            variant="ghost"
            aria-pressed={collection === value}
            onClick={() => selectCollection(value)}
            className={cn(
              'min-h-11 shrink-0 rounded-lg border border-transparent',
              collection === value && 'border-border bg-muted/60',
            )}
          >
            {translate(`showcase.catalog.${value}`)}
          </Button>
        ))}
      </div>
      {collection === 'curated' ? (
        <CuratedShowcases />
      ) : (
        <>
          {/* 검색 & 필터 영역 */}
          <div className="community-toolbar mb-7">
            {/* 검색 창 */}
            <div className="relative flex-1">
              <input
                type="search"
                aria-label={translate('showcase.searchPlaceholder')}
                value={searchText}
                onChange={handleSearchChange}
                placeholder={translate('showcase.searchPlaceholder')}
                className="field-control h-11 pl-10 pr-10"
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              {searchText && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchText('');
                  }}
                  className="absolute inset-y-0 right-0 flex min-h-11 min-w-11 items-center p-0"
                  aria-label={translate('showcase.clearSearch')}
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
                aria-label={translate('showcase.allCategories')}
                onChange={(e) => handleCategoryChange(e.target.value || null)}
                className="field-control h-11 py-2 sm:min-w-48"
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
            </div>
          </div>

          {/* 쇼케이스 목록 영역 */}
          {isLoading ? (
            // 로딩 중에는 스켈레톤 UI 표시
            <ShowcaseSkeletonGroup count={12} />
          ) : showcases.length === 0 ? (
            <div className="journal-empty">
              <div className="mb-4 text-gray-400 dark:text-gray-500">
                <AppWindow size={48} />
              </div>
              <h3 className={cn('mb-2 text-xl font-bold', 'text-gray-800 dark:text-gray-200')}>
                {searchText
                  ? translate('showcase.noSearchResults')
                  : translate('showcase.noShowcases')}
              </h3>
              <p className={cn('mx-auto max-w-md', 'text-gray-500 dark:text-gray-400')}>
                {searchText ? translate('showcase.tryAdjusting') : translate('showcase.beTheFirst')}
              </p>
              {isAuthenticated ? (
                <Button className="mt-6" onClick={openCreateForm}>
                  <Plus size={16} />
                  <span>{translate('showcase.addFirst')}</span>
                </Button>
              ) : (
                <SignInAction returnTo={returnTo} className="mt-6">
                  {translate('showcase.signInToAdd')}
                </SignInAction>
              )}
            </div>
          ) : (
            <>
              <div className="collection-grid">
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
              </div>

              {/* 더 보기 버튼 */}
              {(status === 'CanLoadMore' || status === 'LoadingMore') && (
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="outline"
                    className="min-h-12"
                    onClick={() => loadMore(12)}
                    disabled={status === 'LoadingMore'}
                  >
                    {translate(status === 'LoadingMore' ? 'common.loading' : 'showcase.loadMore')}
                  </Button>
                </div>
              )}
            </>
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

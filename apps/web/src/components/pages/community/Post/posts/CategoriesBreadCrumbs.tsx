import React, { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../uis/Button';
import { cn } from '../../../../../lib/utils';

export default function CategoriesBreadCrumbs() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');

  // Fetch categories from Convex
  const categories = useQuery(api.categories.query.getCategories);

  // Function to handle category click - 메모이제이션 적용
  const handleCategoryClick = useCallback(
    (slug: string | null) => {
      // Using a callback to avoid stale state
      setSearchParams(
        (prevParams) => {
          const newParams = new URLSearchParams(prevParams);
          if (slug) {
            newParams.set('category', slug);
          } else {
            newParams.delete('category');
          }
          return newParams;
        },
        {
          // URL 업데이트는 하되 페이지 이동은 하지 않도록 설정
          replace: true,
        },
      );
    },
    [setSearchParams],
  );

  // Loading state
  if (!categories) {
    return (
      <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
        <div className="animate-pulse h-5 bg-muted rounded w-24"></div>
        <span>/</span>
        <div className="animate-pulse h-5 bg-muted rounded w-32"></div>
      </div>
    );
  }

  return (
    <div className="flex min-w-max items-center gap-2 text-sm">
      <div className="flex items-center">
        {/* "All" category - remove the category param */}
        <Button
          onClick={() => handleCategoryClick(null)}
          variant={!currentCategory ? 'outline' : 'ghost'}
          size="sm"
          className={cn(
            'flex h-auto items-center rounded-lg px-3 py-1.5 transition-all duration-200',
            !currentCategory
              ? 'text-primary font-medium bg-primary/10 border border-primary/20 shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent',
          )}
        >
          <span className="text-base mr-1">📋</span>
          <span>{t('common.all')}</span>
        </Button>
      </div>

      {/* Show all categories as a list */}
      <div className="flex gap-2 border-l border-border/70 pl-3">
        {categories.map((category) => (
          <Button
            key={category.key}
            onClick={() => handleCategoryClick(category.slug)}
            variant={currentCategory === category.slug ? 'outline' : 'ghost'}
            size="sm"
            className={cn(
              'flex h-auto items-center rounded-lg px-3 py-1.5 transition-all duration-200',
              currentCategory === category.slug
                ? 'text-primary font-medium bg-primary/10 border border-primary/20 shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent',
            )}
          >
            <span className="text-base mr-1">{category.icon}</span>
            <span>{t(`postCategories.${category.key}.name`)}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

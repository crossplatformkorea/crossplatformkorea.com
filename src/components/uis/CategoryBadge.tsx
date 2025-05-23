import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className }) => {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        'px-2 py-0.5 text-xs font-medium rounded-md whitespace-nowrap border',
        'bg-secondary/10 text-secondary',
        'dark:bg-gray-700/70 dark:text-gray-100 dark:border-gray-600/50',
        className,
      )}
    >
      {t(`postCategories.${category}.name`, {
        defaultValue: category,
      })}
    </span>
  );
};

export default CategoryBadge;

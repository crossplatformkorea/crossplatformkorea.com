import React from 'react';
import { useTranslation } from 'react-i18next';

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className }) => {
  const { t } = useTranslation();

  return (
    <span 
      className={`px-2 py-0.5 text-xs bg-secondary/10 dark:bg-gray-700/70 
      text-secondary dark:text-gray-100 font-medium rounded-md 
      whitespace-nowrap border dark:border-gray-600/50 ${className || ''}`}
    >
      {t(`postCategories.${category}.name`, {
        defaultValue: category,
      })}
    </span>
  );
};

export default CategoryBadge;

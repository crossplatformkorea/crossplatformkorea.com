import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { interactionSpring } from '@/lib/motion';

export default function CategoriesBreadCrumbs() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = useQuery(api.categories.query.getCategories);
  const selected = categories?.find((category) => category.slug === searchParams.get('category'));
  const selectCategory = (slug: string | null) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (slug) next.set('category', slug);
        else next.delete('category');
        return next;
      },
      { replace: true },
    );
  };

  return (
    <nav aria-label={t('posts.categoryLabel')} className="flex min-w-max gap-1.5 py-3">
      {[
        { key: 'all', slug: null, label: t('common.all') },
        ...(categories || []).map((category) => ({
          ...category,
          label: t(`postCategories.${category.key}.name`, { defaultValue: category.key }),
        })),
      ].map((category) => {
        const active = category.key === (selected?.key || 'all');
        return (
          <motion.button
            key={category.key}
            type="button"
            onClick={() => selectCategory(category.slug)}
            aria-pressed={active}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={interactionSpring}
            className={cn(
              'relative inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-xs transition-colors sm:text-sm',
              active
                ? 'border-border bg-muted/60 font-semibold text-foreground'
                : 'border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground',
            )}
          >
            {active && (
              <span className="h-1 w-1 shrink-0 rounded-full bg-foreground" aria-hidden="true" />
            )}
            {category.label}
          </motion.button>
        );
      })}
    </nav>
  );
}

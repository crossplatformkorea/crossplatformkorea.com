export type CategoryType = {
  key: string;
  icon: string;
  slug: string;
  order: number;
};

export const CATEGORIES: CategoryType[] = [
  {
    key: "NEWS",
    icon: "📰",
    slug: "news",
    order: 1,
  },
  {
    key: "QA",
    icon: "❓",
    slug: "qa",
    order: 2,
  },
  {
    key: "READING",
    icon: "📚",
    slug: "reading",
    order: 3,
  },
  {
    key: "INFO_SHARE",
    icon: "💡",
    slug: "info-share",
    order: 4,
  },
  {
    key: "FREE_BOARD",
    icon: "🗣️",
    slug: "free-board",
    order: 5,
  },
];

export function getCategoryBySlug(slug: string): CategoryType | undefined {
  return CATEGORIES.find(cat => cat.slug === slug);
}

export function getCategoryByKey(key: string): CategoryType | undefined {
  return CATEGORIES.find(cat => cat.key === key);
}

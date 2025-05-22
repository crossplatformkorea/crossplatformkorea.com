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

// Add default category constant to standardize usage
export const DEFAULT_CATEGORY = CATEGORIES[4].key;

/**
 * Error codes used throughout the application.
 * These keys map directly to translation strings in the client locale files.
 * Each key corresponds to entries in src/locales/{language}.json under the "errors" section.
 *
 * Example usage:
 * 1. Return from Convex: { success: false, errorCode: ErrorCode.DISPLAY_NAME_TAKEN }
 * 2. In React: setSaveError(t(result.errorCode))
 */
export enum ErrorCode {
  // User profile errors
  DISPLAY_NAME_REQUIRED = "errors.profile.displayNameRequired",
  DISPLAY_NAME_TAKEN = "errors.profile.displayNameTaken",
  PROFILE_NOT_FOUND = "errors.profile.notFound",
  AUTH_REQUIRED = "errors.auth.required",
  GENERAL_ERROR = "errors.general",
}

export function getCategoryBySlug(slug: string): CategoryType | undefined {
  return CATEGORIES.find(cat => cat.slug === slug);
}

export function getCategoryByKey(key: string): CategoryType | undefined {
  return CATEGORIES.find(cat => cat.key === key);
}

// Helper to get category key from slug or return default
export function getCategoryKeyFromSlug(slug: string | null): string {
  if (!slug) return DEFAULT_CATEGORY;
  const category = getCategoryBySlug(slug);
  return category ? category.key : DEFAULT_CATEGORY;
}

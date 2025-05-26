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
  {
    key: "JOB_POSTING",
    icon: "💼",
    slug: "job-posting",
    order: 6,
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

export type ShowcaseCategoryType = {
  key: string;
  name: string;
  description: string;
  order: number;
};

export const SHOWCASE_CATEGORIES: ShowcaseCategoryType[] = [
  {
    key: "REACT_NATIVE",
    name: "React Native",
    description: "JavaScript 및 React로 구축된 네이티브 모바일 앱을 위한 프레임워크",
    order: 1,
  },
  {
    key: "FLUTTER",
    name: "Flutter",
    description: "Google의 UI 툴킷으로 단일 코드베이스에서 모바일, 웹, 데스크톱 애플리케이션 제작",
    order: 2,
  },
  {
    key: "MAUI",
    name: "MAUI",
    description: "Microsoft의 .NET Multi-platform App UI 프레임워크로 단일 코드베이스로 다중 플랫폼 애플리케이션 개발",
    order: 3,
  },
  {
    key: "KOTLIN",
    name: "Kotlin Multiplatform",
    description: "JetBrains의 Kotlin을 사용한 다중 플랫폼 모바일 및 데스크톱 앱 개발 프레임워크",
    order: 4,
  },
  {
    key: "CAPACITOR",
    name: "Capacitor",
    description: "웹 기술로 네이티브 모바일 앱 개발을 위한 Ionic 팀의 오픈소스 프레임워크",
    order: 5,
  },
  {
    key: "CORDOVA",
    name: "Cordova",
    description: "HTML, CSS, JavaScript를 사용하여 모바일 네이티브 앱을 개발하기 위한 오픈소스 프레임워크",
    order: 6,
  },
  {
    key: "IONIC",
    name: "Ionic",
    description: "Angular, React, Vue를 활용한 크로스플랫폼 모바일 앱 개발 프레임워크",
    order: 7,
  },
  {
    key: "XAMARIN",
    name: "Xamarin",
    description: "Microsoft의 .NET 기반 크로스플랫폼 모바일 앱 개발 도구",
    order: 8,
  },
  {
    key: "TAURI",
    name: "Tauri",
    description: "Rust 기반의 경량 데스크톱 앱 개발 프레임워크",
    order: 9,
  },
  {
    key: "ELECTRON",
    name: "Electron",
    description: "JavaScript, HTML, CSS를 사용한 데스크톱 앱 개발 프레임워크",
    order: 10,
  },
  {
    key: "PWA",
    name: "Progressive Web App",
    description: "네이티브 앱과 같은 기능을 제공하는 웹 앱을 개발하기 위한 기술 모음",
    order: 11,
  },
  {
    key: "UNITY",
    name: "Unity",
    description: "게임 및 인터랙티브 콘텐츠 개발을 위한 크로스플랫폼 게임 엔진",
    order: 12,
  },
  {
    key: "LYNX",
    name: "Lynx",
    description: "웹 기술을 기반으로 한 현대적인 크로스플랫폼 앱 프레임워크",
    order: 13,
  },
  {
    key: "PHP_NATIVE",
    name: "PHP Native",
    description: "PHP를 사용한 네이티브 앱 개발 프레임워크",
    order: 14,
  },
  {
    key: "OTHER",
    name: "기타",
    description: "기타 크로스플랫폼 개발 기술",
    order: 15,
  },
];

export function getShowcaseCategoryByKey(key: string): ShowcaseCategoryType | undefined {
  return SHOWCASE_CATEGORIES.find(cat => cat.key === key);
}

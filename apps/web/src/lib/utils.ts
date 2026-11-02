import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getLocale } from './i18n';

// Utility for conditional class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date based on current locale
/**
 * True while an IME (Hangul, kana, …) is still composing. Safari reports
 * `isComposing: false` on the Enter that confirms a candidate but keeps
 * keyCode 229, so both are checked.
 */
export function isImeComposing(event: { nativeEvent: KeyboardEvent }): boolean {
  return event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const locale = getLocale();

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// Development-only console.log utility
export function devLog(...args: any[]): void {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
}

// Development-only console utilities
export const devConsole = {
  log: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.error(...args);
    }
  },
  info: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.info(...args);
    }
  },
  debug: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.debug(...args);
    }
  },
};

/**
 * Creates a user profile link using display name
 */
export const createUserProfileLink = (displayName: string): string => {
  // Encode the display name to handle special characters and convert to lowercase
  const encodedDisplayName = encodeURIComponent(displayName.toLowerCase());
  return `/@${encodedDisplayName}`;
};

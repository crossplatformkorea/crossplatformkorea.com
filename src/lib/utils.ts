import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getLocale } from "./i18n";

// Utility for conditional class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date based on current locale
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const locale = getLocale();

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

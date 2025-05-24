import { v } from 'convex/values';
import { SHOWCASE_CATEGORIES } from './constants';

// URL validator
export const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

// Showcase validators
export const showcaseValidator = {
  // Validate title (required, between 2-100 characters)
  title: v.string(),
  
  // Description (can be empty but must be a string)
  description: v.string(),
  
  // Category must be one of the defined categories
  category: v.union(...SHOWCASE_CATEGORIES.map(cat => v.literal(cat.key))),
  
  // URL fields - optional but must follow URL pattern if provided
  appStoreUrl: v.optional(v.string()),
  playStoreUrl: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  
  // Other links (comma-separated string)
  otherLinks: v.optional(v.string()),
  
  // Tags (array of strings)
  tags: v.optional(v.array(v.string())),
  
  // Image URL (required)
  imageUrl: v.string(),
};

// Validate if a string is a valid URL
export function isValidUrl(url: string): boolean {
  return urlPattern.test(url);
}

// Validate if at least one URL field is provided
export function hasAtLeastOneUrl(
  websiteUrl?: string, 
  appStoreUrl?: string, 
  playStoreUrl?: string
): boolean {
  return Boolean(
    (websiteUrl && websiteUrl.trim()) || 
    (appStoreUrl && appStoreUrl.trim()) || 
    (playStoreUrl && playStoreUrl.trim())
  );
}

// Ensure URL has https:// prefix
export function ensureHttpsPrefix(url: string): string {
  if (!url) return url;
  return url.startsWith('http') ? url : `https://${url}`;
}

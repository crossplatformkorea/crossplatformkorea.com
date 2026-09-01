import { v } from 'convex/values';
import { SHOWCASE_CATEGORIES } from './constants';

// URL validator - supports query parameters, hashes, and special characters
export const urlPattern =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\w\-._~:/?#[\]@!$&'()*+,;=%]*)*\/?$/i;

// Showcase validators
export const showcaseValidator = {
  // Validate title (required, between 2-100 characters)
  title: v.string(),

  // Description (can be empty but must be a string)
  description: v.string(),

  // Category must be one of the defined categories
  category: v.union(...SHOWCASE_CATEGORIES.map((cat) => v.literal(cat.key))),

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
  playStoreUrl?: string,
): boolean {
  return Boolean(
    (websiteUrl && websiteUrl.trim()) ||
      (appStoreUrl && appStoreUrl.trim()) ||
      (playStoreUrl && playStoreUrl.trim()),
  );
}

// Ensure URL has https:// prefix
export function ensureHttpsPrefix(url: string): string {
  if (!url) return url;
  return url.startsWith('http') ? url : `https://${url}`;
}

// GitHub-style username validation
const GITHUB_USERNAME_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
const MIN_USERNAME_LENGTH = 1;
const MAX_USERNAME_LENGTH = 39;

// Validate GitHub-style username
export function isValidGitHubUsername(username: string): boolean {
  if (!username) return false;

  // Check length
  if (username.length < MIN_USERNAME_LENGTH || username.length > MAX_USERNAME_LENGTH) {
    return false;
  }

  // Check pattern (alphanumeric + hyphens, cannot start/end with hyphen)
  if (!GITHUB_USERNAME_PATTERN.test(username)) {
    return false;
  }

  // Cannot be only hyphens
  if (username.replace(/-/g, '').length === 0) {
    return false;
  }

  return true;
}

// Get detailed validation error for username
export function getUsernameValidationError(username: string): string | null {
  if (!username) {
    return 'errors.username.required';
  }

  if (username.length < MIN_USERNAME_LENGTH) {
    return 'errors.username.tooShort';
  }

  if (username.length > MAX_USERNAME_LENGTH) {
    return 'errors.username.tooLong';
  }

  if (!GITHUB_USERNAME_PATTERN.test(username)) {
    if (username.startsWith('-') || username.endsWith('-')) {
      return 'errors.username.cannotStartOrEndWithHyphen';
    }

    if (username.includes('--')) {
      return 'errors.username.consecutiveHyphens';
    }

    if (!/^[a-zA-Z0-9-]+$/.test(username)) {
      return 'errors.username.invalidCharacters';
    }
  }

  if (username.replace(/-/g, '').length === 0) {
    return 'errors.username.onlyHyphens';
  }

  return null;
}

// Reserved usernames that should not be allowed
const RESERVED_USERNAMES = [
  'admin',
  'administrator',
  'root',
  'api',
  'www',
  'ftp',
  'mail',
  'blog',
  'help',
  'support',
  'about',
  'contact',
  'terms',
  'privacy',
  'security',
  'login',
  'signin',
  'signup',
  'register',
  'logout',
  'profile',
  'user',
  'users',
  'account',
  'settings',
  'config',
  'system',
  'test',
  'demo',
  'example',
  'sample',
  'null',
  'undefined',
  'true',
  'false',
  'index',
  'home',
  'dashboard',
  'assets',
  'static',
  'public',
  'private',
  'internal',
];

// Check if username is reserved
export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.includes(username.toLowerCase());
}

// Complete username validation (pattern + reserved check)
export function validateUsername(username: string): { isValid: boolean; error?: string } {
  // Check basic validation
  const basicError = getUsernameValidationError(username);
  if (basicError) {
    return { isValid: false, error: basicError };
  }

  // Check if reserved
  if (isReservedUsername(username)) {
    return { isValid: false, error: 'errors.username.reserved' };
  }

  return { isValid: true };
}

/**
 * Normalize username by replacing spaces and special characters with hyphens
 * and ensuring it follows GitHub username rules
 */
export function normalizeUsername(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Step 1: Replace spaces and special characters with hyphens
  // Allow only alphanumeric characters, keep existing hyphens, replace everything else with hyphens
  let normalized = input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') // Replace non-alphanumeric (except hyphens) with hyphens
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, '') // Remove trailing hyphens
    .replace(/-{2,}/g, '-'); // Replace multiple consecutive hyphens with single hyphen

  // Step 2: Ensure it doesn't start or end with hyphen and handle edge cases
  if (normalized.length === 0) {
    return '';
  }

  // Step 3: Truncate to maximum length (39 characters for GitHub style)
  if (normalized.length > 39) {
    normalized = normalized.substring(0, 39);
    // Remove trailing hyphen if truncation created one
    normalized = normalized.replace(/-+$/, '');
  }

  return normalized;
}

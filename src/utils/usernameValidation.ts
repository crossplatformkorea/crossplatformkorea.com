// GitHub-style username validation for frontend
const GITHUB_USERNAME_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
const MIN_USERNAME_LENGTH = 1;
const MAX_USERNAME_LENGTH = 39;

// Reserved usernames that should not be allowed
const RESERVED_USERNAMES = [
  'admin', 'administrator', 'root', 'api', 'www', 'ftp', 'mail', 'blog',
  'help', 'support', 'about', 'contact', 'terms', 'privacy', 'security',
  'login', 'signin', 'signup', 'register', 'logout', 'profile', 'user',
  'users', 'account', 'settings', 'config', 'system', 'test', 'demo',
  'example', 'sample', 'null', 'undefined', 'true', 'false', 'index',
  'home', 'dashboard', 'assets', 'static', 'public', 'private', 'internal'
];

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

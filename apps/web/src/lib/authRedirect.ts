const SIGN_IN_PATH = '/sign-in';
const CANONICAL_ORIGIN = 'https://crossplatformkorea.com';

export function sanitizeReturnTo(value: string | null | undefined): string {
  if (!value?.startsWith('/') || value.includes('\\') || /%5c/i.test(value)) {
    return '/';
  }

  try {
    const destination = new URL(value, CANONICAL_ORIGIN);
    if (destination.origin !== CANONICAL_ORIGIN) return '/';

    const normalized = `${destination.pathname}${destination.search}${destination.hash}`;
    if (normalized.startsWith('//')) return '/';

    const canonicalDestination = new URL(normalized, CANONICAL_ORIGIN);
    if (canonicalDestination.origin !== CANONICAL_ORIGIN) return '/';

    if (
      canonicalDestination.pathname === SIGN_IN_PATH ||
      canonicalDestination.pathname.startsWith(`${SIGN_IN_PATH}/`)
    ) {
      return '/';
    }

    return `${canonicalDestination.pathname}${canonicalDestination.search}${canonicalDestination.hash}`;
  } catch {
    return '/';
  }
}

export function createSignInHref(returnTo: string): string {
  return `${SIGN_IN_PATH}?returnTo=${encodeURIComponent(sanitizeReturnTo(returnTo))}`;
}

export function getBrowserReturnTo(): string {
  if (typeof window === 'undefined') return '/';

  return sanitizeReturnTo(
    `${window.location.pathname}${window.location.search}${window.location.hash}`,
  );
}

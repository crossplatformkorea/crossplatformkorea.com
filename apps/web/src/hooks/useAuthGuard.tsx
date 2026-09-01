import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useConvexAuth } from 'convex/react';
import { createSignInHref, sanitizeReturnTo } from '@/lib/authRedirect';

interface UseAuthGuardOptions {
  /**
   * Whether to redirect to sign-in page if not authenticated.
   * @default true
   */
  requireAuth?: boolean;

  /**
   * Path to redirect to if authentication is required but user is not authenticated.
   * @default "/sign-in"
   */
  redirectTo?: string;
}

/**
 * A hook to protect routes that require authentication.
 * Redirects unauthenticated users to the sign-in page.
 */
export default function useAuthGuard({
  requireAuth = true,
  redirectTo = '/sign-in',
}: UseAuthGuardOptions = {}) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Wait until auth state is determined
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      const separator = redirectTo.includes('?') ? '&' : '?';
      const returnTo = sanitizeReturnTo(`${location.pathname}${location.search}${location.hash}`);
      const destination =
        redirectTo === '/sign-in'
          ? createSignInHref(returnTo)
          : `${redirectTo}${separator}returnTo=${encodeURIComponent(returnTo)}`;
      void navigate(destination, { replace: true });
    }
  }, [
    isAuthenticated,
    isLoading,
    location.pathname,
    location.search,
    location.hash,
    navigate,
    redirectTo,
    requireAuth,
  ]);

  return {
    isAuthenticated,
    isLoading,
    isAuthorized: !requireAuth || isAuthenticated,
  };
}

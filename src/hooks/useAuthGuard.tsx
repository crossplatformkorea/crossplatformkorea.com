import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConvexAuth } from 'convex/react';

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

    useEffect(() => {
        // Wait until auth state is determined
        if (isLoading) return;

        if (requireAuth && !isAuthenticated) {
            // User is not authenticated but authentication is required
            void navigate(redirectTo, { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate, redirectTo, requireAuth]);

    return {
        isAuthenticated,
        isLoading,
        isAuthorized: !requireAuth || isAuthenticated
    };
}

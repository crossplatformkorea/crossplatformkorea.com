import React, { ReactNode, useEffect } from 'react';
import { useConvexAuth } from 'convex/react';
import { useAuthStore } from '../stores/authStore';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const convexAuth = useConvexAuth();
  const { isAuthenticated, setAuthState } = useAuthStore();
  const user = useQuery(api.users.query.currentUser);
  const ensureProfile = useMutation(api.users.mutation.ensureUserProfile);

  // Convex의 인증 상태를 Zustand 스토어에 동기화
  useEffect(() => {
    setAuthState(
      // Directly call setAuthState from the store instance
      convexAuth.isAuthenticated,
      convexAuth.isLoading,
    );
  }, [convexAuth.isAuthenticated, convexAuth.isLoading, setAuthState]);

  // AuthStateListener 로직 통합
  useEffect(() => {
    // 인증되었지만 프로필이 없는 경우 프로필 생성
    if (isAuthenticated && user !== undefined) {
      // Check user is not undefined (still loading or loaded)
      const hasProfile = user && user.profile;

      // 프로필이 없으면 생성
      if (!hasProfile) {
        void ensureProfile();
      }
    }
  }, [isAuthenticated, user, ensureProfile]);

  return <>{children}</>;
}

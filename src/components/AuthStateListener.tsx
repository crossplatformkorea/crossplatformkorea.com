import { useEffect } from 'react';
import { useConvexAuth } from 'convex/react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function AuthStateListener() {
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.query.currentUser);
  const ensureProfile = useMutation(api.users.mutation.ensureUserProfile);

  useEffect(() => {
    // 인증되었지만 프로필이 없는 경우 프로필 생성
    if (isAuthenticated && user !== undefined) {
      const hasProfile = user && user.profile;

      // 프로필이 없으면 생성
      if (!hasProfile) {
        void ensureProfile();
      }
    }
  }, [isAuthenticated, user, ensureProfile]);

  // UI를 렌더링하지 않는 컴포넌트
  return null;
}

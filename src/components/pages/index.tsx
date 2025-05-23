import { Routes, Route, useLocation } from 'react-router-dom';
import CommunityPage from './community';
import SignInPage from './sign-in';
import { AppLayout } from './layout';
import ProfilePage from './profile';
import UserProfilePage from './user';
import FeatureRequestsPage from './feature-requests';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';

// This component only handles routing
export default function AppRoutes() {
  const location = useLocation();
  const isSignInPage = location.pathname === '/sign-in';

  return (
    <AppLayout>
      {isSignInPage ? (
        <Routes>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/*" element={<CommunityPage />} />
        </Routes>
      ) : (
        // Apply the container styles to all other pages>
        <div
          className={cn(
            'bg-background px-4 overflow-y-scroll',
            'sm:px-8 md:px-16 pt-6 sm:pt-10 pb-16 sm:pb-24',
          )}
        >
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/user/:userId" element={<UserProfilePage />} />
            <Route path="/feature-request" element={<FeatureRequestsPage />} />
            <Route path="/*" element={<CommunityPage />} />
          </Routes>
        </div>
      )}
      <Toaster theme="system" position="bottom-right" richColors closeButton />
    </AppLayout>
  );
}

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
          <Route path="/*" element={<div className="h-full w-full"><CommunityPage /></div>} />
        </Routes>
      ) : (
        // Apply the container styles to all other pages
        <div
          className={cn(
            'bg-background w-full overflow-y-auto', // Changed overflow-y-scroll to overflow-y-auto for better mobile experience
            'px-3 py-4 sm:px-4 md:px-6 lg:px-16 sm:pt-6 sm:pb-16 md:pt-8 md:pb-20', // Progressive padding for different screen sizes
          )}
        >
          <div className="max-w-5xl mx-auto"> {/* Added max-width container for large screens */}
            <Routes>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/user/:userId" element={<UserProfilePage />} />
              <Route path="/feature-request" element={<FeatureRequestsPage />} />
              <Route path="/*" element={<CommunityPage />} />
            </Routes>
          </div>
        </div>
      )}
      <Toaster theme="system" position="bottom-right" richColors closeButton />
    </AppLayout>
  );
}

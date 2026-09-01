import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppLayout } from './layout';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import PostsPage from './community/Post/posts';
import { useMetaTags } from '../../hooks/useMetaTags';
import DevPanel from '../DevPanel';
import AppLoading from '../AppLoading';
import PostDetailsPage from './community/Post/post-details';
import SummaryPage from './community/Summary';

// Lazy load pages for better performance
const CommunityPage = lazy(() => import('./community/Post/posts'));
const SignInPage = lazy(() => import('./sign-in'));
const ProfilePage = lazy(() => import('./profile'));
const UserProfilePage = lazy(() => import('./user'));
const FeatureRequestsPage = lazy(() => import('./feature-requests'));
const FeatureRequestDetailPage = lazy(() => import('./feature-request-detail'));
const ShowcasePage = lazy(() => import('./showcase'));
const NotificationsPage = lazy(() => import('./notifications'));
const ChatGptPage = lazy(() => import('./chatgpt'));
const NotFoundPage = lazy(() => import('./NotFound'));

// This component only handles routing
export default function AppRoutes() {
  const location = useLocation();
  const isSignInPage = location.pathname === '/sign-in';
  const isChatGptPage = location.pathname === '/chatgpt';

  // Apply default meta tags for home page
  useMetaTags();

  return (
    <AppLayout>
      <Suspense fallback={<AppLoading />}>
        {isSignInPage ? (
          <Routes>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route
              path="/*"
              element={
                <div className="h-full w-full">
                  <CommunityPage />
                </div>
              }
            />
          </Routes>
        ) : isChatGptPage ? (
          // ChatGPT page takes full screen without container styles
          <div className="h-full w-full">
            <Routes>
              <Route path="/chatgpt" element={<ChatGptPage />} />
            </Routes>
          </div>
        ) : (
          // Apply the container styles to all other pages
          <div
            className={cn(
              'site-canvas bg-background w-full overflow-y-auto', // Changed overflow-y-scroll to overflow-y-auto for better mobile experience
              'px-3 py-4 sm:px-4 md:px-6 lg:px-16 sm:pt-6 sm:pb-16 md:pt-8 md:pb-20', // Progressive padding for different screen sizes
            )}
          >
            <div className="max-w-5xl mx-auto">
              {' '}
              {/* Added max-width container for large screens */}
              <Routes>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/showcase" element={<ShowcasePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/feature-request" element={<FeatureRequestsPage />} />
                <Route
                  path="/feature-request/:featureRequestId"
                  element={<FeatureRequestDetailPage />}
                />
                <Route path="/posts" element={<PostsPage />} />
                <Route path="/post/:slugOrId" element={<PostDetailsPage />} />
                <Route path="/" element={<SummaryPage />} />
                {/* @로 시작하는 모든 경로를 UserProfilePage로 라우팅 */}
                <Route path="/:displayName" element={<UserProfilePage />} />
                {/* 404 Catch-all route - must be last */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </div>
        )}
      </Suspense>
      <Toaster theme="system" position="bottom-right" richColors closeButton />
      <DevPanel />
    </AppLayout>
  );
}

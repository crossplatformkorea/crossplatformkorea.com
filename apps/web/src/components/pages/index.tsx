import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppLayout } from './layout';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import { useMetaTags } from '../../hooks/useMetaTags';
import DevPanel from '../DevPanel';
import AppLoading from '../AppLoading';
import { ErrorBoundary } from '../uis/ErrorBoundary';
import SummaryPage from './community/Summary';
import { loadRouteModule } from '@/lib/routeImport';

const lazyPage: typeof lazy = (load) => lazy(() => loadRouteModule(load));

// Lazy load pages for better performance
const PostsPage = lazyPage(() => import('./community/Post/posts'));
const PostDetailsPage = lazyPage(() => import('./community/Post/post-details'));
const SignInPage = lazyPage(() => import('./sign-in'));
const ProfilePage = lazyPage(() => import('./profile'));
const UserProfilePage = lazyPage(() => import('./user'));
const FeatureRequestsPage = lazyPage(() => import('./feature-requests'));
const FeatureRequestDetailPage = lazyPage(() => import('./feature-request-detail'));
const ShowcasePage = lazyPage(() => import('./showcase'));
const NotificationsPage = lazyPage(() => import('./notifications'));
const ChatGptPage = lazyPage(() => import('./chatgpt'));
const NotFoundPage = lazyPage(() => import('./NotFound'));

// This component only handles routing
export default function AppRoutes() {
  const location = useLocation();
  const isSignInPage = location.pathname === '/sign-in';
  const isChatGptPage = location.pathname === '/chatgpt';

  // Apply default meta tags for home page
  useMetaTags();

  return (
    <AppLayout>
      {/* Keyed on the path so navigating away clears a crashed page. Inside the
          layout, so a page-level throw keeps the nav usable instead of blanking
          the app — a failing Convex `useQuery` throws during render. */}
      <ErrorBoundary key={location.pathname}>
        <Suspense fallback={<AppLoading />}>
          {isSignInPage ? (
            <Routes>
              <Route path="/sign-in" element={<SignInPage />} />
              <Route
                path="/*"
                element={
                  <div className="h-full w-full">
                    <PostsPage />
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
                'px-5 py-4 sm:px-8 lg:px-12 sm:pt-6 sm:pb-16 md:pt-8 md:pb-20',
              )}
            >
              <div className="mx-auto max-w-6xl">
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
      </ErrorBoundary>
      <Toaster theme="system" position="bottom-right" richColors closeButton />
      <DevPanel />
    </AppLayout>
  );
}

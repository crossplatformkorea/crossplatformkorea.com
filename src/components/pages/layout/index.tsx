import { ReactNode, useState, useEffect } from 'react';
import { useConvexAuth } from 'convex/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import AppLoading from '../../AppLoading';
import Sidebar from './Sidebar';
import { Header } from './Header';
import { t } from 'i18next';
import { cn } from '@/lib/utils';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { getLocale } from '../../../lib/i18n';

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { requestPermissionOnLoad } = usePushNotifications();

  // 현재 사용자 정보 조회
  const currentUser = useQuery(api.users.query.currentUser);
  // locale 전용 업데이트 mutation
  const updateUserLocale = useMutation(api.users.mutation.updateUserLocale);

  // Initialize sidebar state from localStorage or default to closed (false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    return savedState ? JSON.parse(savedState) : false;
  });

  // Track sidebar transition state
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  // Auto-request notification permission when user is authenticated
  useEffect(() => {
    void requestPermissionOnLoad();
  }, [requestPermissionOnLoad]);

  // 사용자 locale 업데이트 (locale만 업데이트)
  useEffect(() => {
    const updateLocaleIfNeeded = async () => {
      if (!isAuthenticated || !currentUser?.profile) return;

      const currentLocale = getLocale();
      const userLocale = currentUser.profile.locale;

      // locale이 저장되지 않았거나 현재 언어와 다른 경우에만 업데이트
      if (!userLocale || userLocale !== currentLocale) {
        try {
          await updateUserLocale({
            locale: currentLocale,
          });
          console.log(`User locale updated to: ${currentLocale}`);
        } catch (error) {
          console.error('Failed to update user locale:', error);
        }
      }
    };

    void updateLocaleIfNeeded();
  }, [isAuthenticated, currentUser?.profile?.locale, updateUserLocale, currentUser?.profile]);

  const toggleSidebar = () => {
    setIsTransitioning(true);
    // Set a timeout to end the transition state
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Match this to your transition duration

    const newSidebarState = !isSidebarOpen;
    setIsSidebarOpen(newSidebarState);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('sidebarStateChange', {
      detail: { isOpen: newSidebarState }
    }));
  };

  if (isLoading) {
    return <AppLoading fullScreen message={t('common.loading')} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header at the top level with sidebar toggle */}
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content with sidebar */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Desktop Sidebar: Pushes content, hidden on mobile */}
        <div className="hidden md:block">
          <div
            className={cn(
              'transition-all duration-300 overflow-hidden h-full',
              isSidebarOpen ? 'w-64' : 'w-0',
            )}
          >
            {isSidebarOpen && (
              <Sidebar
                isOpen={isSidebarOpen}
                isTransitioning={isTransitioning}
                onClose={toggleSidebar}
              />
            )}
          </div>
        </div>

        {/* Mobile Sidebar: Overlays content, shown only on mobile */}
        <div className="md:hidden">
          {/* Backdrop for mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50"
              onClick={toggleSidebar}
              aria-hidden="true"
            />
          )}
          {/* Sidebar container for mobile */}
          <div
            className={cn(
              'fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out',
              // The Sidebar component itself provides its background color
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
            )}
            role="dialog"
            aria-modal="true"
          >
            <Sidebar
              isOpen={isSidebarOpen}
              isTransitioning={isTransitioning}
              onClose={toggleSidebar}
            />
          </div>
        </div>

        {/* Main content area */}
        <main className="flex flex-col flex-1 w-full h-full overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

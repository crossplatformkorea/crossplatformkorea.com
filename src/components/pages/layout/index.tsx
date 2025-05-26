import { ReactNode, useState, useEffect } from 'react';
import { useConvexAuth } from 'convex/react';
import AppLoading from '../../AppLoading';
import Sidebar from './Sidebar';
import { Header } from './Header';
import { t } from 'i18next';
import { cn } from '@/lib/utils';
import { usePushNotifications } from '@/hooks/usePushNotifications';

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const { isLoading } = useConvexAuth();
  const { requestPermissionOnLoad } = usePushNotifications();

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

  const toggleSidebar = () => {
    setIsTransitioning(true);
    // Set a timeout to end the transition state
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Match this to your transition duration

    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return <AppLoading fullScreen message={t('common.loading')} />;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header at the top level with sidebar toggle */}
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content with sidebar */}
      <div className="flex flex-1 overflow-hidden">
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
        <main className="flex flex-col flex-1 w-full">{children}</main>
      </div>
    </div>
  );
}

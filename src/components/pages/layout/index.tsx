import { ReactNode, useState, useEffect } from 'react';
import { useConvexAuth } from 'convex/react';
import AppLoading from '../../AppLoading';
import Sidebar from './Sidebar';
import { Header } from './Header';
import { t } from 'i18next';

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const { isLoading } = useConvexAuth();

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
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header at the top level with sidebar toggle */}
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Collapsible sidebar */}
        <div
          className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}
        >
          <Sidebar isOpen={isSidebarOpen} isTransitioning={isTransitioning} />
        </div>

        {/* Main content area */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

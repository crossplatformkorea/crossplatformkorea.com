import { ReactNode, useState, useEffect, useRef } from 'react';
import { useConvexAuth } from 'convex/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import AppLoading from '../../AppLoading';
import Sidebar from './Sidebar';
import { Header } from './Header';
import i18next, { t } from 'i18next';
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

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  // Auto-request notification permission when user is authenticated
  useEffect(() => {
    void requestPermissionOnLoad();
  }, [requestPermissionOnLoad]);

  // 이 기기의 UI 언어. i18next 이벤트를 구독해, 실제로 언어가 바뀔 때만
  // 아래 effect가 다시 돌게 한다.
  const [deviceLocale, setDeviceLocale] = useState<string>(() => getLocale());

  useEffect(() => {
    const handleLanguageChanged = () => setDeviceLocale(getLocale());

    i18next.on('languageChanged', handleLanguageChanged);

    return () => {
      i18next.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  // 이 클라이언트가 서버에 이미 기록한 locale.
  // profile.locale은 계정 단위로 공유되므로, 언어가 서로 다른 세션이 같은
  // 계정에 붙으면 서로의 값을 끝없이 덮어쓴다. 같은 값을 두 번 쓰지 않게
  // 막아 그 순환을 끊는다.
  const writtenLocaleRef = useRef<string | null>(null);

  // 의존성은 전부 원시값으로 둔다. currentUser.profile 객체를 그대로 넣으면
  // 쿼리가 갱신될 때마다 새 객체가 되어 effect가 끝없이 다시 돈다.
  const hasProfile = currentUser?.profile != null;
  const profileLocale = currentUser?.profile?.locale;

  // 사용자 locale 업데이트 (locale만 업데이트)
  useEffect(() => {
    const updateLocaleIfNeeded = async () => {
      if (!isAuthenticated || !hasProfile) return;

      if (profileLocale === deviceLocale) return;
      if (writtenLocaleRef.current === deviceLocale) return;

      writtenLocaleRef.current = deviceLocale;

      try {
        await updateUserLocale({
          locale: deviceLocale,
        });
      } catch (error) {
        console.error('Failed to update user locale:', error);
        writtenLocaleRef.current = null;
      }
    };

    void updateLocaleIfNeeded();
  }, [
    isAuthenticated,
    hasProfile,
    profileLocale,
    deviceLocale,
    updateUserLocale,
  ]);

  const toggleSidebar = () => {
    const newSidebarState = !isSidebarOpen;
    setIsSidebarOpen(newSidebarState);

    // Dispatch custom event to notify other components
    window.dispatchEvent(
      new CustomEvent('sidebarStateChange', {
        detail: { isOpen: newSidebarState },
      }),
    );
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
        {/* Tablet/Desktop Sidebar: stays as an icon rail when collapsed */}
        <div className="hidden shrink-0 md:block">
          <div
            className={cn(
              'h-full overflow-hidden transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
              isSidebarOpen ? 'w-64 lg:w-72' : 'w-[72px]',
            )}
          >
            <Sidebar isOpen={isSidebarOpen} />
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
              'fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
              // The Sidebar component itself provides its background color
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
            )}
            role="dialog"
            aria-modal="true"
          >
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
          </div>
        </div>

        {/* Main content area */}
        <main className="flex flex-col flex-1 w-full h-full overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

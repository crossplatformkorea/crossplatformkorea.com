import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from './uis/Button';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { t } from '../lib/i18n';
import { cn } from '../lib/utils';
import { useConvexAuth } from 'convex/react';
import { BANNER_REDISPLAY_INTERVAL } from '../constants';

interface NotificationPermissionBannerProps {
  className?: string;
}

export default function NotificationPermissionBanner({ className }: NotificationPermissionBannerProps) {
  const { isAuthenticated } = useConvexAuth();
  const { isSupported, permission, requestPermission } = usePushNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 배너 표시 조건:
    // 1. 로그인된 사용자
    // 2. 브라우저가 알림을 지원함
    // 3. 권한이 아직 요청되지 않음 (default 상태)
    // 4. 배너 닫기 시간이 24시간 이전이거나 설정되지 않음
    const checkDismissalExpiry = () => {
      const dismissedAt = localStorage.getItem('notificationBannerDismissedAt');
      if (!dismissedAt) return true; // 한 번도 닫지 않았음
      
      const dismissedTime = parseInt(dismissedAt, 10);
      const now = Date.now();
      
      return (now - dismissedTime) > BANNER_REDISPLAY_INTERVAL; // 24시간이 지났으면 true
    };

    const shouldShow = 
      isAuthenticated && 
      isSupported && 
      permission === 'default' &&
      checkDismissalExpiry();

    if (shouldShow) {
      // 약간의 지연 후 배너 표시 (페이지 로드 완료 후)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isAuthenticated, isSupported, permission]);

  const handleEnableNotifications = async () => {
    try {
      setIsLoading(true);
      const granted = await requestPermission();
      
      if (granted) {
        setIsVisible(false);
      } else {
        // 사용자가 거부한 경우에도 배너 숨김 (24시간 후 다시 표시)
        localStorage.setItem('notificationBannerDismissedAt', Date.now().toString());
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('notificationBannerDismissedAt', Date.now().toString());
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 right-4 z-50',
        'md:left-auto md:right-4 md:max-w-md',
        'bg-primary/95 backdrop-blur-sm text-primary-foreground',
        'rounded-lg shadow-lg border border-primary/20',
        'p-4',
        'animate-in slide-in-from-bottom-2 duration-300',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="p-2 bg-primary-foreground/10 rounded-lg">
            <Bell className="w-5 h-5" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1">
            {t('notifications.pushNotifications.banner.title')}
          </h3>
          <p className="text-xs text-primary-foreground/80 mb-3">
            {t('notifications.pushNotifications.banner.description')}
          </p>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleEnableNotifications}
              disabled={isLoading}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-primary-foreground/20"
            >
              {isLoading ? t('common.loading') : t('notifications.pushNotifications.banner.enable')}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              {t('common.dismiss')}
            </Button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded-full hover:bg-primary-foreground/10 transition-colors"
          aria-label={t('common.close')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

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
  const { isSupported, permission, requestPermission, subscribe } = usePushNotifications();
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
    }  }, [isAuthenticated, isSupported, permission]);
  const [, setIsPermissionBlocked] = useState(false); // _ 사용하지 않음 표시
  const [showSettingsGuide, setShowSettingsGuide] = useState(false);
  const handleEnableNotifications = async () => {
    try {
      setIsLoading(true);

      // 권한이 이미 차단된 경우 감지
      if (Notification.permission === 'denied') {
        setIsPermissionBlocked(true);
        setShowSettingsGuide(true);
        return;
      }

      // 권한 요청 후 허용되면 자동으로 구독까지 진행
      const granted = await requestPermission();

      if (granted) {
        try {
          // 권한이 허용되면 알림 구독까지 바로 진행
          await subscribe();
          // 구독 성공 후 배너 닫기
          setIsVisible(false);
        } catch (subscribeError) {
          console.error('Subscription failed:', subscribeError);
          // 구독 실패 시에도 배너 닫기 (권한은 이미 허용됨)
          setIsVisible(false);
        }
      } else {
        // 사용자가 거부한 경우에도 배너 숨김 (24시간 후 다시 표시)
        localStorage.setItem('notificationBannerDismissedAt', Date.now().toString());
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      // 권한 요청 실패 시에도 차단 상태 확인
      if (Notification.permission === 'denied') {
        setIsPermissionBlocked(true);
        setShowSettingsGuide(true);
      }
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
  }  // 브라우저 종류에 따른 설정 가이드 메시지
  const getBrowserSettingsGuide = () => {
    const isChrome = navigator.userAgent.indexOf("Chrome") > -1;
    const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
    const isSafari = navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1;
    const isEdge = navigator.userAgent.indexOf("Edg") > -1;

    if (isChrome || isEdge) {
      return "주소 표시줄 왼쪽의 자물쇠/정보 아이콘을 클릭한 후 '사이트 설정'에서 알림 권한을 '허용'으로 변경해주세요.";
    } else if (isFirefox) {
      return "주소 표시줄 왼쪽의 정보 아이콘을 클릭한 후 '사이트 권한 더보기'에서 알림 설정을 변경해주세요.";
    } else if (isSafari) {
      return "Safari 설정 > 웹사이트 > 알림에서 이 사이트의 알림을 허용해주세요.";
    } else {
      return "브라우저 설정에서 알림 권한을 허용해주세요.";
    }
  };

  // 브라우저 설정 가이드 모달
  if (showSettingsGuide) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-card max-w-md w-full rounded-lg shadow-lg border border-border p-6 animate-in fade-in-50 duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold">알림 권한이 차단되었습니다</h2>
          </div>

          <p className="text-muted-foreground mb-4">
            이전에 알림 권한이 거부되어 브라우저에서 알림을 차단했습니다. 알림을 받으려면 브라우저 설정에서 권한을 변경해야 합니다.
          </p>

          <div className="bg-muted/30 rounded-lg p-4 border border-border/30 mb-4">
            <h3 className="font-medium mb-2">브라우저 설정 변경 방법:</h3>
            <p className="text-sm">{getBrowserSettingsGuide()}</p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setShowSettingsGuide(false);
                handleDismiss();
              }}
            >
              다음에 하기
            </Button>
            <Button              onClick={() => {
                setShowSettingsGuide(false);
                // 권한 재요청 (이미 차단된 경우 효과 없음)
                void handleEnableNotifications(); // void 연산자로 Promise 무시
              }}
            >
              알림 다시 요청하기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed top-4 left-4 right-4 z-50',
        'md:left-auto md:right-4 md:max-w-md',
        'bg-primary/95 backdrop-blur-sm text-primary-foreground',
        'rounded-lg shadow-lg border border-primary/20',
        'p-4',
        'animate-in slide-in-from-top-2 duration-300',
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
              variant="outline"              onClick={() => void handleEnableNotifications()} // void로 Promise 처리
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

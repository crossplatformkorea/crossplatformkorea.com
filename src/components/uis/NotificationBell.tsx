import { useState, useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { getAuthUserId } from '@convex-dev/auth/server';
import { useConvexAuth } from 'convex/react';
import { cn } from '../../lib/utils';
import { Button } from '../uis/Button';
import { t } from '../../lib/i18n';
import { formatDistanceToNow } from 'date-fns';
import { ko, ja, enUS } from 'date-fns/locale';
import { getLocale } from '../../lib/i18n';

const formatTimeAgo = (timestamp: number) => {
  const locale = getLocale();
  const locales = { en: enUS, ko, ja };
  const currentLocale = locales[locale] || enUS;
  
  return formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
    locale: currentLocale,
  });
};

export default function NotificationBell() {
  const { isAuthenticated } = useConvexAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 알림 데이터 조회
  const unreadCount = useQuery(
    api.notifications.query.getUnreadCount,
    isAuthenticated ? {} : 'skip',
  );
  
  const recentNotifications = useQuery(
    api.notifications.query.getRecentNotifications,
    isAuthenticated ? { limit: 5 } : 'skip',
  );

  // 알림 읽음 처리 뮤테이션
  const markAsRead = useMutation(api.notifications.mutation.markAsRead);
  const markAllAsRead = useMutation(api.notifications.mutation.markAllAsRead);

  // 클릭 외부 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 인증되지 않은 사용자는 렌더링하지 않음
  if (!isAuthenticated) {
    return null;
  }

  const handleBellClick = () => {
    setIsOpen(!isOpen);
  };
  const handleNotificationClick = async (notificationId: Id<'notifications'>, isRead: boolean) => {
    if (!isRead) {
      await markAsRead({ notificationId });
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead({});
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 알림 벨 아이콘 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBellClick}
        className="relative p-2"
        aria-label={t('notifications.bellAriaLabel')}
      >
        <Bell size={20} />
        {unreadCount && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {/* 알림 드롭다운 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-lg">{t('notifications.title')}</h3>
            <div className="flex items-center gap-2">
              {unreadCount && unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  {t('notifications.markAllAsRead')}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1"
              >
                <X size={16} />
              </Button>
            </div>
          </div>

          {/* 알림 목록 */}
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications && recentNotifications.length > 0 ? (
              <div className="divide-y divide-border">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={cn(
                      'p-4 hover:bg-muted/50 cursor-pointer transition-colors',
                      !notification.isRead && 'bg-primary/5',
                    )}
                    onClick={() => handleNotificationClick(notification._id, notification.isRead)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground">
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification._creationTime)}
                          </span>
                          {notification.triggeredByUser && (
                            <span className="text-xs text-muted-foreground">
                              • {notification.triggeredByUser.name}
                            </span>
                          )}
                        </div>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Bell size={48} className="mx-auto mb-4 opacity-30" />
                <p>{t('notifications.noNotifications')}</p>
              </div>
            )}
          </div>

          {/* 모든 알림 보기 링크 */}
          {recentNotifications && recentNotifications.length > 0 && (
            <div className="p-4 border-t border-border">
              <Button
                variant="ghost"
                className="w-full text-center"
                onClick={() => {
                  setIsOpen(false);
                  // TODO: 알림 페이지로 이동
                  window.location.href = '/notifications';
                }}
              >
                {t('notifications.viewAll')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

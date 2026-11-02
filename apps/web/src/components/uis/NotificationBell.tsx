import { useState, useRef, useEffect, useId } from 'react';
import { Bell, X } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useConvexAuth } from 'convex/react';
import { Link } from 'react-router-dom';
import type { Id } from '@convex/_generated/dataModel';
import { toast } from 'sonner';
import { cn, devConsole } from '../../lib/utils';
import { userFacingErrorMessage } from '../../lib/errors';
import { notificationHref } from '../../lib/notificationTarget';
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
  const bellRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  // 알림 데이터 조회
  const unreadCount = useQuery(
    api.notifications.query.getUnreadCount,
    isAuthenticated ? {} : 'skip',
  );

  const recentNotifications = useQuery(
    api.notifications.query.getRecentNotifications,
    isAuthenticated ? { limit: 5, locale: getLocale() } : 'skip',
  );

  // 알림 읽음 처리 뮤테이션
  const markAsRead = useMutation(api.notifications.mutation.markAsRead);

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

  // Escape closes the panel and hands focus back to the bell.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      bellRef.current?.focus();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // 인증되지 않은 사용자는 렌더링하지 않음
  if (!isAuthenticated) {
    return null;
  }

  // Opening a notification is a plain link; marking it read rides along and
  // must never swallow the navigation the user clicked for.
  const handleNotificationClick = async (notification: {
    _id: Id<'notifications'>;
    isRead: boolean;
  }) => {
    setIsOpen(false);
    if (notification.isRead) return;
    try {
      await markAsRead({ notificationId: notification._id });
    } catch (error) {
      devConsole.error('Failed to mark notification as read:', error);
      toast.error(userFacingErrorMessage(error, t('errors.notificationUpdateFailed')));
    }
  };

  const hasUnread = unreadCount !== undefined && unreadCount > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 알림 벨 아이콘 */}
      <Button
        ref={bellRef}
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen((open) => !open)}
        className="relative p-2"
        aria-label={
          hasUnread
            ? `${t('notifications.bellAriaLabel')} · ${t('notifications.unreadCount', { count: unreadCount })}`
            : t('notifications.bellAriaLabel')
        }
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <Bell size={20} aria-hidden="true" />
        {/* Not `unreadCount &&`: when the count is 0 that yields the number
            0, which React renders as a literal "0" beside the bell. */}
        {hasUnread && (
          <span
            aria-hidden="true"
            className={cn(
              'absolute -top-1 -right-1',
              'bg-foreground text-background text-[11px] font-semibold tabular-nums',
              'rounded-full min-w-5 h-5 px-1',
              'flex items-center justify-center',
            )}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {/* 알림 드롭다운 */}
      {isOpen && (
        <div
          id={panelId}
          className={cn(
            'fixed sm:absolute',
            'left-1/2 sm:left-auto right-auto sm:right-0',
            'top-16 sm:top-auto',
            'transform -translate-x-1/2 sm:translate-x-0',
            'mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-80',
            'bg-background border border-border rounded-lg shadow-lg z-50',
          )}
        >
          {/* 헤더 */}
          <div className={cn('flex items-center justify-between p-4', 'border-b border-border')}>
            <h2 className="flex-1 font-bold text-lg">
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="hover:underline underline-offset-4"
              >
                {t('notifications.title')}
                {/* Unread, matching the bell badge. */}
                {hasUnread && (
                  <span className="text-sm text-muted-foreground ml-2 tabular-nums">
                    ({unreadCount})
                  </span>
                )}
              </Link>
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                bellRef.current?.focus();
              }}
              className="p-1 w-8 h-8 rounded-md"
              aria-label={t('common.close')}
            >
              <X size={16} aria-hidden="true" />
            </Button>
          </div>

          {/* 알림 목록 */}
          <div className="max-h-96 overflow-y-auto overscroll-contain">
            {recentNotifications && recentNotifications.length > 0 ? (
              <ul className="divide-y divide-border">
                {recentNotifications.map((notification) => {
                  // Comment notifications land on the comment itself, not the post header.
                  const href = notificationHref(notification);
                  const rowClassName = cn(
                    'flex items-start gap-3 p-4 transition-colors',
                    href && 'hover:bg-muted/50',
                    !notification.isRead && 'bg-primary/5',
                  );
                  const body = (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground">{notification.title}</p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification._creationTime)}
                          </span>
                          {notification.triggeredByUser && (
                            <span className="text-xs text-muted-foreground">
                              <span aria-hidden="true">• </span>
                              {notification.triggeredByUser.name}
                            </span>
                          )}
                        </div>
                      </div>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1">
                          <span className="sr-only">{t('notifications.unread')}</span>
                        </span>
                      )}
                    </>
                  );
                  return (
                    <li key={notification._id}>
                      {href ? (
                        <Link
                          to={href}
                          onClick={() => void handleNotificationClick(notification)}
                          className={rowClassName}
                        >
                          {body}
                        </Link>
                      ) : (
                        // Nothing to open, but a click still marks it read.
                        <button
                          type="button"
                          onClick={() => {
                            void handleNotificationClick(notification);
                            // The row unmounts with the panel; keep keyboard focus on the bell.
                            bellRef.current?.focus();
                          }}
                          className={cn(rowClassName, 'w-full text-left hover:bg-muted/50')}
                        >
                          {body}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className={cn('p-8 text-center text-muted-foreground')}>
                <Bell size={48} className="mx-auto mb-4 opacity-30" aria-hidden="true" />
                <p>{t('notifications.noNotifications')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

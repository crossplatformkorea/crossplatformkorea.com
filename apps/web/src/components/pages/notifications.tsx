import { useState } from 'react';
import { Bell, Trash2, Check, CheckCheck, LogIn } from 'lucide-react';
import { usePaginatedQuery, useMutation } from 'convex/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '@convex/_generated/api';
import { useConvexAuth } from 'convex/react';
import { toast } from 'sonner';
import { cn, devConsole } from '../../lib/utils';
import { userFacingErrorMessage } from '../../lib/errors';
import { Button } from '../uis/Button';
import { t } from '../../lib/i18n';
import { formatDistanceToNow } from 'date-fns';
import { ko, ja, enUS } from 'date-fns/locale';
import { getLocale } from '../../lib/i18n';
import { Id } from '@convex/_generated/dataModel';
import PageHeader from '../uis/PageHeader';
import { createSignInHref } from '../../lib/authRedirect';
import { notificationHref } from '../../lib/notificationTarget';

const formatTimeAgo = (timestamp: number) => {
  const locale = getLocale();
  const locales = { en: enUS, ko, ja };
  const currentLocale = locales[locale] || enUS;

  return formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
    locale: currentLocale,
  });
};

export default function NotificationsPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedNotifications, setSelectedNotifications] = useState<Set<Id<'notifications'>>>(
    new Set(),
  );

  // 알림 데이터 조회 (페이지네이션)
  const {
    results: notifications,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.notifications.query.getUserNotifications,
    isAuthenticated ? { locale: getLocale() } : 'skip',
    { initialNumItems: 20 },
  );

  // 뮤테이션
  const markAsRead = useMutation(api.notifications.mutation.markAsRead);
  const markAllAsRead = useMutation(api.notifications.mutation.markAllAsRead);
  const deleteNotification = useMutation(api.notifications.mutation.deleteNotification);

  // 로딩 중이거나 인증되지 않은 경우
  if (isLoading || status === 'LoadingFirstPage') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto" role="status" aria-label={t('common.loading')}>
          <div className="animate-pulse space-y-4 motion-reduce:animate-none">
            <div className="h-8 bg-muted rounded w-1/3" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 border border-border rounded-lg">
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border/70 bg-card/60 p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('notifications.title')}</h1>
          <p className="mb-6 text-muted-foreground">{t('errors.auth.loginRequired')}</p>
          <Button
            variant="outline"
            onClick={() => {
              const returnTo = `${location.pathname}${location.search}${location.hash}`;
              void navigate(createSignInHref(returnTo));
            }}
          >
            <LogIn size={16} />
            {t('notifications.signInToView')}
          </Button>
        </div>
      </div>
    );
  }

  // Opening a notification is a plain link; marking it read rides along and
  // must never block the navigation the user asked for.
  const handleMarkAsRead = async (notificationId: Id<'notifications'>, isRead: boolean) => {
    if (isRead) return;
    try {
      await markAsRead({ notificationId });
    } catch (error) {
      devConsole.error('Failed to mark notification as read:', error);
      toast.error(userFacingErrorMessage(error, t('errors.notificationUpdateFailed')));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead({});
    } catch (error) {
      devConsole.error('Failed to mark all notifications as read:', error);
      toast.error(userFacingErrorMessage(error, t('errors.notificationUpdateFailed')));
    }
  };

  const handleDeleteNotification = async (notificationId: Id<'notifications'>) => {
    try {
      await deleteNotification({ notificationId });
    } catch (error) {
      devConsole.error('Failed to delete notification:', error);
      toast.error(userFacingErrorMessage(error, t('errors.notificationDeleteFailed')));
    }
  };

  const handleSelectNotification = (notificationId: Id<'notifications'>) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(notificationId)) {
      newSelected.delete(notificationId);
    } else {
      newSelected.add(notificationId);
    }
    setSelectedNotifications(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedNotifications.size === notifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(notifications.map((n) => n._id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (
      !window.confirm(
        t('notifications.deleteSelectedConfirm', { count: selectedNotifications.size }),
      )
    ) {
      return;
    }
    try {
      await Promise.all(
        [...selectedNotifications].map((notificationId) => deleteNotification({ notificationId })),
      );
    } catch (error) {
      // One rejection used to abandon the loop mid-way with the selection intact
      // and no explanation; clear the selection either way so the list and the
      // checkboxes cannot drift apart.
      devConsole.error('Failed to delete selected notifications:', error);
      toast.error(userFacingErrorMessage(error, t('errors.notificationDeleteFailed')));
    } finally {
      setSelectedNotifications(new Set());
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <PageHeader
          title={t('notifications.title')}
          description={
            unreadNotifications.length > 0
              ? t('notifications.unreadCount', { count: unreadNotifications.length })
              : t('notifications.description')
          }
          action={
            unreadNotifications.length > 0 ? (
              <Button variant="outline" size="sm" onClick={() => void handleMarkAllAsRead()}>
                <CheckCheck size={16} />
                {t('notifications.markAllAsRead')}
              </Button>
            ) : undefined
          }
        />

        {/* 일괄 작업 */}
        {notifications.length > 0 && (
          <div className="surface-card mb-4 flex items-center gap-4 p-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedNotifications.size === notifications.length}
                onChange={handleSelectAll}
                className="rounded"
              />
              <span className="text-sm">
                {selectedNotifications.size === notifications.length
                  ? t('notifications.deselectAll')
                  : t('notifications.selectAll')}
              </span>
            </label>
            {selectedNotifications.size > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleDeleteSelected()}
                className="ml-auto text-destructive hover:text-destructive"
              >
                <Trash2 size={16} className="mr-2" />
                {t('notifications.deleteSelected', { count: selectedNotifications.size })}
              </Button>
            )}
          </div>
        )}

        {/* 알림 목록 */}
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              // Comment notifications land on the comment itself, not the post header.
              const href = notificationHref(notification);
              const body = (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium text-foreground">{notification.title}</p>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0">
                        <span className="sr-only">{t('notifications.unread')}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3 break-words">{notification.message}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatTimeAgo(notification._creationTime)}</span>
                    {notification.triggeredBy && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span>{notification.triggeredBy.displayName}</span>
                      </>
                    )}
                  </div>
                </>
              );
              return (
                <div
                  key={notification._id}
                  className={cn(
                    'surface-card-interactive overflow-hidden',
                    !notification.isRead && 'border-primary/30 bg-primary/5',
                  )}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.has(notification._id)}
                        onChange={() => handleSelectNotification(notification._id)}
                        aria-label={t('notifications.selectOne', { title: notification.title })}
                        className="mt-1 rounded"
                      />
                      {href ? (
                        <Link
                          to={href}
                          onClick={() =>
                            void handleMarkAsRead(notification._id, notification.isRead)
                          }
                          className="flex-1 min-w-0 rounded-md"
                        >
                          {body}
                        </Link>
                      ) : (
                        <div className="flex-1 min-w-0">{body}</div>
                      )}
                      <div className="flex items-center gap-1">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => void handleMarkAsRead(notification._id, false)}
                            className="p-1 w-8 h-8 rounded-full"
                            title={t('notifications.markAsRead')}
                            aria-label={t('notifications.markAsRead')}
                          >
                            <Check size={16} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => void handleDeleteNotification(notification._id)}
                          className="p-1 text-destructive hover:text-destructive w-8 h-8 rounded-full"
                          title={t('notifications.delete')}
                          aria-label={t('notifications.delete')}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="surface-card py-16 text-center">
              <Bell size={64} className="mx-auto mb-4 opacity-30" />
              <h2 className="text-lg font-bold mb-2">{t('notifications.noNotifications')}</h2>
              <p className="text-muted-foreground">{t('notifications.noNotificationsDesc')}</p>
            </div>
          )}
        </div>

        {/* 더 보기 */}
        {(status === 'CanLoadMore' || status === 'LoadingMore') && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => loadMore(20)}
              disabled={status === 'LoadingMore'}
            >
              {status === 'LoadingMore' ? t('common.loading') : t('common.loadMore')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

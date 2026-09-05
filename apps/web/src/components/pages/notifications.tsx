import { useState } from 'react';
import { Bell, Trash2, Check, CheckCheck, LogIn } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const notifications = useQuery(
    api.notifications.query.getUserNotifications,
    isAuthenticated
      ? {
          paginationOpts: {
            numItems: 20,
            cursor: null,
          },
        }
      : 'skip',
  );

  // 뮤테이션
  const markAsRead = useMutation(api.notifications.mutation.markAsRead);
  const markAllAsRead = useMutation(api.notifications.mutation.markAllAsRead);
  const deleteNotification = useMutation(api.notifications.mutation.deleteNotification);

  // 로딩 중이거나 인증되지 않은 경우
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
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
            {t('common.signIn')}
          </Button>
        </div>
      </div>
    );
  }

  const handleNotificationClick = async (
    notificationId: Id<'notifications'>,
    isRead: boolean,
    notification: any,
  ) => {
    // Mark as read if not already read. A failure here must not block the
    // navigation the user actually asked for.
    if (!isRead) {
      try {
        await markAsRead({ notificationId });
      } catch (error) {
        devConsole.error('Failed to mark notification as read:', error);
        toast.error(userFacingErrorMessage(error, t('errors.notificationUpdateFailed')));
      }
    }

    // Navigate to appropriate page based on notification type
    if (notification.postId) {
      // Navigate to post details
      void navigate(`/post/${notification.postId}`);
    } else if (notification.showcaseId) {
      // Navigate to showcase details
      void navigate(`/showcase/${notification.showcaseId}`);
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
    if (!notifications?.page) return;

    if (selectedNotifications.size === notifications.page.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(notifications.page.map((n) => n._id)));
    }
  };

  const handleDeleteSelected = async () => {
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

  const unreadNotifications = notifications?.page?.filter((n) => !n.isRead) || [];

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <PageHeader
          eyebrow="INBOX / ACTIVITY"
          title={t('notifications.title')}
          description={t('notifications.noNotificationsDesc')}
          action={
            unreadNotifications.length > 0 ? (
              <Button variant="outline" size="sm" onClick={() => void handleMarkAllAsRead()}>
                <CheckCheck size={16} />
                {t('notifications.markAllAsRead')}
              </Button>
            ) : undefined
          }
        />

        {/* 통계 */}
        {notifications?.page && notifications.page.length > 0 && (
          <div className="surface-card mb-6 p-4">
            <div className="flex items-center justify-between text-sm">
              <span>{t('notifications.totalCount', { count: notifications.page.length })}</span>
              <span className="text-muted-foreground">
                {t('notifications.unreadCount', { count: unreadNotifications.length })}
              </span>
            </div>
          </div>
        )}

        {/* 일괄 작업 */}
        {notifications?.page && notifications.page.length > 0 && (
          <div className="surface-card mb-4 flex items-center gap-4 p-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedNotifications.size === notifications.page.length}
                onChange={handleSelectAll}
                className="rounded"
              />
              <span className="text-sm">
                {selectedNotifications.size === notifications.page.length
                  ? t('notifications.deselectAll')
                  : t('notifications.selectAll')}
              </span>
            </label>
            {selectedNotifications.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => void handleDeleteSelected()}
                className="ml-auto"
              >
                <Trash2 size={16} className="mr-2" />
                {t('notifications.deleteSelected', { count: selectedNotifications.size })}
              </Button>
            )}
          </div>
        )}

        {/* 알림 목록 */}
        <div className="space-y-4">
          {notifications?.page && notifications.page.length > 0 ? (
            notifications.page.map((notification) => (
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
                      className="mt-1 rounded"
                    />
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() =>
                        void handleNotificationClick(
                          notification._id,
                          notification.isRead,
                          notification,
                        )
                      }
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium text-foreground">{notification.title}</p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{notification.message}</p>{' '}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatTimeAgo(notification._creationTime)}</span>
                        {notification.triggeredBy && (
                          <>
                            <span>•</span>
                            <span>{notification.triggeredBy.displayName}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            void handleNotificationClick(notification._id, false, notification)
                          }
                          className="p-1 w-8 h-8 rounded-full"
                          title={t('notifications.markAsRead')}
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
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="surface-card py-16 text-center">
              <Bell size={64} className="mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">{t('notifications.noNotifications')}</h3>
              <p className="text-muted-foreground">{t('notifications.noNotificationsDesc')}</p>
            </div>
          )}
        </div>

        {/* 더 보기 */}
        {notifications && !notifications.isDone && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => {
                // TODO: Load more notifications
              }}
            >
              {t('common.loadMore')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

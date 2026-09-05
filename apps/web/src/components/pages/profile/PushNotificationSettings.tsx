import { useState } from 'react';
import { Bell, BellOff, Settings, TestTube, Shield, AlertCircle, CheckCircle, XCircle, Info, Code } from 'lucide-react';
import { Button } from '../../uis/Button';
import { usePushNotifications } from '../../../hooks/usePushNotifications';
import { t } from '../../../lib/i18n';
import { cn } from '../../../lib/utils';
import { userFacingErrorMessage } from '../../../lib/errors';

interface PushNotificationSettingsProps {
  className?: string;
}

interface UIProps {
  className?: string;
  state: {
    isSupported: boolean;
    isSubscribed: boolean;
    isLoading: boolean;
    permission: NotificationPermission;
  };
  handlers: {
    handleSubscribe: () => Promise<void>;
    handleUnsubscribe: () => Promise<void>;
    handleRequestPermission: () => Promise<void>;
    handleTestNotification: () => Promise<void>;
    error: string | null;
    successMessage: string | null;
  };
}

// Production UI Component - Clean interface without dev features
function ProductionUI({ className, state, handlers }: UIProps) {
  const { isSupported, isSubscribed, isLoading, permission } = state;
  const { handleSubscribe, handleRequestPermission, error, successMessage } = handlers;

  if (!isSupported) {
    return (
      <div className={cn('bg-card rounded-xl border border-border/50 shadow-sm p-6', className)}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-muted/50 rounded-lg">
            <BellOff className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t('notifications.pushNotifications.title')}</h3>
            <p className="text-sm text-muted-foreground">Browser not supported</p>
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
          <p className="text-sm text-muted-foreground">
            {t('notifications.pushNotifications.help.browserNotSupported')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-card rounded-xl border border-border/50 shadow-sm p-6', className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{t('notifications.pushNotifications.title')}</h3>
          <p className="text-sm text-muted-foreground">{t('notifications.pushNotifications.description')}</p>
        </div>
      </div>

      {/* Messages */}
      {(error || successMessage) && (
        <div className="mb-4 space-y-2">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700 dark:text-green-400">{successMessage}</p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {/* Permission Status */}
        <div className="bg-background/50 rounded-lg p-4 border border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{t('notifications.pushNotifications.permission.title')}</span>
              </div>
              <div className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                permission === 'granted' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                permission === 'denied' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                permission === 'default' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              )}>
                {permission === 'granted' && <CheckCircle className="w-3 h-3" />}
                {permission === 'denied' && <XCircle className="w-3 h-3" />}
                {permission === 'default' && <AlertCircle className="w-3 h-3" />}
                {permission === 'granted' && t('notifications.pushNotifications.permission.granted')}
                {permission === 'denied' && t('notifications.pushNotifications.permission.denied')}
                {permission === 'default' && t('notifications.pushNotifications.permission.default')}
              </div>
            </div>
            {permission !== 'granted' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleRequestPermission()}
                disabled={isLoading}
                className="flex items-center gap-1.5"
              >
                <Settings className="w-4 h-4" />
                {t('notifications.pushNotifications.buttons.requestPermission')}
              </Button>
            )}
          </div>
          {permission === 'default' && (
            <p className="text-xs text-muted-foreground mt-2">
              {t('notifications.pushNotifications.help.permissionDefault')}
            </p>
          )}
          {permission === 'denied' && (
            <p className="text-xs text-muted-foreground mt-2">
              {t('notifications.pushNotifications.help.permissionDenied')}
            </p>
          )}
        </div>

        {/* Subscription Status */}
        <div className="bg-background/50 rounded-lg p-4 border border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{t('notifications.pushNotifications.subscription.title')}</span>
              </div>
              <div className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                isSubscribed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
              )}>
                {isSubscribed ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {isSubscribed ? t('notifications.pushNotifications.subscription.subscribed') : t('notifications.pushNotifications.subscription.notSubscribed')}
              </div>
            </div>            {!isSubscribed && (
              <div>
                <Button
                  size="sm"
                  onClick={() => void handleSubscribe()}
                  disabled={isLoading || permission !== 'granted'}
                  className="flex items-center gap-1.5"
                >
                  <Bell className="w-4 h-4" />
                  {t('notifications.pushNotifications.buttons.subscribe')}
                </Button>
              </div>
            )}
          </div>
          {!isSubscribed && permission === 'granted' && (
            <p className="text-xs text-muted-foreground mt-2">
              {t('notifications.pushNotifications.help.subscriptionHelp')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Development UI Component - Enhanced interface with dev features
function DevelopmentUI({ className, state, handlers }: UIProps) {
  const { isSupported, isSubscribed, isLoading, permission } = state;
  const { handleSubscribe, handleUnsubscribe, handleRequestPermission, handleTestNotification, error, successMessage } = handlers;
  const [showRevokeGuide, setShowRevokeGuide] = useState(false);

  const handleRevokePermission = async () => {
    try {
      if (isSubscribed) {
        await handleUnsubscribe();
      }
      setShowRevokeGuide(true);
    } catch (err) {
      console.error('Error during permission revocation setup:', err);
    }
  };

  if (!isSupported) {
    return (
      <div className={cn('bg-card rounded-xl border border-border/50 shadow-sm p-6', className)}>
        {/* DEV Mode Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
            <Code className="w-3 h-3" />
            DEV MODE
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-muted/50 rounded-lg">
            <BellOff className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t('notifications.pushNotifications.title')}</h3>
            <p className="text-sm text-muted-foreground">Browser not supported</p>
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
          <p className="text-sm text-muted-foreground">
            {t('notifications.pushNotifications.help.browserNotSupported')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-card rounded-xl border border-border/50 shadow-sm p-6 space-y-6', className)}>
      {/* DEV Mode Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t('notifications.pushNotifications.title')}</h3>
            <p className="text-sm text-muted-foreground">Development mode with enhanced controls</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
          <Code className="w-3 h-3" />
          DEV MODE
        </div>
      </div>

      {/* Messages */}
      {(error || successMessage) && (
        <div className="space-y-2">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700 dark:text-green-400">{successMessage}</p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {/* Permission Status */}
        <div className="bg-background/50 rounded-lg p-4 border border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{t('notifications.pushNotifications.permission.title')}</span>
              </div>
              <div className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                permission === 'granted' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                permission === 'denied' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                permission === 'default' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              )}>
                {permission === 'granted' && <CheckCircle className="w-3 h-3" />}
                {permission === 'denied' && <XCircle className="w-3 h-3" />}
                {permission === 'default' && <AlertCircle className="w-3 h-3" />}
                {permission === 'granted' && t('notifications.pushNotifications.permission.granted')}
                {permission === 'denied' && t('notifications.pushNotifications.permission.denied')}
                {permission === 'default' && t('notifications.pushNotifications.permission.default')}
              </div>
            </div>
            <div className="flex gap-2">
              {permission !== 'granted' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void handleRequestPermission()}
                  disabled={isLoading}
                  className="flex items-center gap-1.5"
                >
                  <Settings className="w-4 h-4" />
                  {t('notifications.pushNotifications.buttons.requestPermission')}
                </Button>
              )}
              {permission === 'granted' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void handleRevokePermission()}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20"
                >
                  <XCircle className="w-4 h-4" />
                  Revoke (Dev)
                </Button>
              )}
            </div>
          </div>
          {permission === 'default' && (
            <p className="text-xs text-muted-foreground mt-2">
              {t('notifications.pushNotifications.help.permissionDefault')}
            </p>
          )}
        </div>

        {/* Subscription Status */}
        <div className="bg-background/50 rounded-lg p-4 border border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{t('notifications.pushNotifications.subscription.title')}</span>
              </div>
              <div className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                isSubscribed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
              )}>
                {isSubscribed ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {isSubscribed ? t('notifications.pushNotifications.subscription.subscribed') : t('notifications.pushNotifications.subscription.notSubscribed')}
              </div>
            </div>
            <div className="flex gap-2">
              {isSubscribed ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void handleTestNotification()}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20"
                  >
                    <TestTube className="w-4 h-4" />
                    Test (Dev)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void handleUnsubscribe()}
                    disabled={isLoading}
                    className="flex items-center gap-1.5"
                  >
                    <BellOff className="w-4 h-4" />
                    {t('notifications.pushNotifications.buttons.unsubscribe')}
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={() => void handleSubscribe()}
                  disabled={isLoading || permission !== 'granted'}
                  className="flex items-center gap-1.5"
                >
                  <Bell className="w-4 h-4" />
                  {t('notifications.pushNotifications.buttons.subscribe')}
                </Button>
              )}
            </div>
          </div>
          {!isSubscribed && permission === 'granted' && (
            <p className="text-xs text-muted-foreground mt-2">
              {t('notifications.pushNotifications.help.subscriptionHelp')}
            </p>
          )}
        </div>

        {/* Development Features Info */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-800 dark:text-orange-300">Development Features</span>
          </div>
          <ul className="text-xs text-orange-700 dark:text-orange-400 space-y-1">
            <li>• Test notification button for testing push notifications</li>
            <li>• Permission revocation for testing permission flow</li>
            <li>• Enhanced debugging information and controls</li>
            <li>• These features are hidden in production builds</li>
          </ul>
        </div>
      </div>

      {/* Permission Revocation Guide Modal */}
      {showRevokeGuide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Info className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Permission Revocation Guide</h3>
                <p className="text-xs text-orange-600 dark:text-orange-400">(Development Mode Only)</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">To manually revoke permission in browser:</p>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>Click the lock icon in the address bar</li>
                <li>Find "Notifications" setting and change to "Block"</li>
                <li>Refresh the page</li>
              </ol>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 mt-4 border border-orange-200 dark:border-orange-800">
                <p className="text-xs">
                  <strong>Developer Note:</strong> Subscription has been removed. To fully revoke permission, 
                  follow the steps above. This feature is not shown in production.
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowRevokeGuide(false)}
              >
                Close
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setShowRevokeGuide(false);
                  window.location.reload();
                }}
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Component with Single isDev Check
const PushNotificationSettings = ({ className }: PushNotificationSettingsProps) => {
  const {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
    requestPermission,
    sendTestNotification,
  } = usePushNotifications();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Single isDev check at the top level
  const isDev = import.meta.env.DEV;

  // Clear messages after a timeout
  const clearMessages = () => {
    setTimeout(() => {
      setError(null);
      setSuccessMessage(null);
    }, 3000);
  };

  const handleSubscribe = async () => {
    try {
      setError(null);
      setSuccessMessage(null);
      console.log('Attempting to subscribe to push notifications...');
      await subscribe();
      console.log('Successfully subscribed to push notifications');
      setSuccessMessage(t('notifications.pushNotifications.messages.subscribeSuccess'));
      clearMessages();
    } catch (err) {
      console.error('Failed to subscribe to push notifications:', err);
      const errorMessage = userFacingErrorMessage(err, t('notifications.pushNotifications.errors.subscriptionFailed'));
      setError(errorMessage);
      clearMessages();
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setError(null);
      setSuccessMessage(null);
      await unsubscribe();
      setSuccessMessage(t('notifications.pushNotifications.messages.unsubscribeSuccess'));
      clearMessages();
    } catch (err) {
      const errorMessage = userFacingErrorMessage(err, t('notifications.pushNotifications.errors.unsubscriptionFailed'));
      setError(errorMessage);
      clearMessages();
    }
  };

  const handleRequestPermission = async () => {
    try {
      setError(null);
      setSuccessMessage(null);
      await requestPermission();
      setSuccessMessage(t('notifications.pushNotifications.messages.permissionGranted'));
      clearMessages();
    } catch (err) {
      const errorMessage = userFacingErrorMessage(err, t('notifications.pushNotifications.errors.permissionDenied'));
      setError(errorMessage);
      clearMessages();
    }
  };

  const handleTestNotification = async () => {
    try {
      setError(null);
      setSuccessMessage(null);
      await sendTestNotification();
      setSuccessMessage(t('notifications.pushNotifications.messages.testNotificationSent'));
      clearMessages();
    } catch (err) {
      const errorMessage = userFacingErrorMessage(err, t('notifications.pushNotifications.errors.testNotificationFailed'));
      setError(errorMessage);
      clearMessages();
    }
  };

  const state = {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
  };

  const handlers = {
    handleSubscribe,
    handleUnsubscribe,
    handleRequestPermission,
    handleTestNotification,
    error,
    successMessage,
  };

  // Single conditional render based on isDev
  return isDev ? 
    <DevelopmentUI className={className} state={state} handlers={handlers} /> : 
    <ProductionUI className={className} state={state} handlers={handlers} />;
};

export default PushNotificationSettings;

import { useState, useEffect, useCallback } from 'react';
import { useConvexAuth } from 'convex/react';
import { useMutation, useQuery, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { BANNER_REDISPLAY_INTERVAL } from '../constants';

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const usePushNotifications = () => {
  const { isAuthenticated } = useConvexAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');  // Convex mutations
  const subscribeToPush = useMutation(api.notifications.mutation.subscribeToPush);
  const unsubscribeFromPush = useMutation(api.notifications.mutation.unsubscribeFromPush);
  
  // Convex actions
  const sendTestPushAction = useAction(api.notifications.action.sendTestPush);

  // 구독 상태 쿼리
  const subscriptionStatus = useQuery(
    api.notifications.query.getUserPushSubscriptionStatus,
    isAuthenticated ? {} : 'skip'
  );

  // 브라우저 지원 확인
  useEffect(() => {
    const checkSupport = () => {
      const supported = 
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window;
      
      setIsSupported(supported);
      
      if (supported && Notification.permission) {
        setPermission(Notification.permission);
      }
    };

    checkSupport();
  }, []);
  // 현재 구독 상태 확인
  const checkSubscription = useCallback(async () => {
    if (!isSupported || !navigator.serviceWorker) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      const isCurrentlySubscribed = !!subscription;
      setIsSubscribed(isCurrentlySubscribed);
      return subscription;
    } catch (error) {
      console.error('구독 상태 확인 실패:', error);
      return null;
    }
  }, [isSupported]);

  // 서버 구독 상태와 동기화
  useEffect(() => {
    if (subscriptionStatus) {
      setIsSubscribed(subscriptionStatus.hasSubscriptions);
    }
  }, [subscriptionStatus]);

  // 권한 요청
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      throw new Error('푸시 노티피케이션이 지원되지 않습니다.');
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      return permission === 'granted';
    } catch (error) {
      console.error('권한 요청 실패:', error);
      throw new Error('노티피케이션 권한을 얻을 수 없습니다.');
    }
  }, [isSupported]);

  // 자동 권한 요청 (사이트 방문 시)
  const requestPermissionOnLoad = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !isAuthenticated) {
      return false;
    }

    // 이미 권한이 설정된 경우 요청하지 않음
    if (permission !== 'default') {
      return permission === 'granted';
    }

    // localStorage에서 이전에 거부했는지 확인 (24시간 후 재시도)
    const checkDismissalExpiry = () => {
      const dismissedAt = localStorage.getItem('notificationPermissionDismissedAt');
      if (!dismissedAt) return true; // 한 번도 거부하지 않았음
      
      const dismissedTime = parseInt(dismissedAt, 10);
      const now = Date.now();
      
      return (now - dismissedTime) > BANNER_REDISPLAY_INTERVAL; // 설정된 간격이 지났으면 true
    };

    if (!checkDismissalExpiry()) {
      return false;
    }

    try {
      // 약간의 지연 후 권한 요청 (UX 개선)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const granted = await requestPermission();
      
      if (!granted) {
        // 사용자가 거부한 경우 현재 시간 기록
        localStorage.setItem('notificationPermissionDismissedAt', Date.now().toString());
      }
      
      return granted;
    } catch (error) {
      console.error('자동 권한 요청 실패:', error);
      return false;
    }
  }, [isSupported, isAuthenticated, permission, requestPermission]);

  // 푸시 구독
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !isAuthenticated) {
      throw new Error('푸시 노티피케이션을 사용할 수 없습니다.');
    }

    setIsLoading(true);

    try {
      // 권한 확인
      if (permission !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          throw new Error('노티피케이션 권한이 필요합니다.');
        }
      }

      // Service Worker 등록 확인
      const registration = await navigator.serviceWorker.ready;
      
      // VAPID 키 (환경변수에서 가져오거나 서버에서 받아올 것)
      const applicationServerKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!applicationServerKey) {
        throw new Error('VAPID 공개 키가 설정되지 않았습니다.');
      }

      // 푸시 구독 생성
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
      });      // 서버에 구독 정보 저장
      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(subscription.getKey('auth')!),
        },
      };

      // Convex mutation으로 구독 정보 저장
      await subscribeToPush({
        endpoint: subscriptionData.endpoint,
        p256dh: subscriptionData.keys.p256dh,
        auth: subscriptionData.keys.auth,
        userAgent: navigator.userAgent,
      });
      
      setIsSubscribed(true);
      return true;
    } catch (error) {
      console.error('푸시 구독 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, isAuthenticated, permission, requestPermission]);

  // 푸시 구독 해제
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      throw new Error('푸시 노티피케이션이 지원되지 않습니다.');
    }

    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();      if (subscription) {
        // 서버에서 구독 정보 제거
        await unsubscribeFromPush({
          endpoint: subscription.endpoint,
        });

        const success = await subscription.unsubscribe();
        
        if (success) {
          console.log('구독 해제됨');
          setIsSubscribed(false);
        }
        
        return success;
      }
      
      return true;
    } catch (error) {
      console.error('푸시 구독 해제 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // 테스트 노티피케이션 보내기
  const sendTestNotification = useCallback(async (title?: string, message?: string) => {
    if (!isAuthenticated) {
      console.warn('Authentication required for push notifications');
      return;
    }

    if (!isSupported || permission !== 'granted') {
      console.warn('Push notifications not supported or permission not granted');
      return;
    }

    try {
      setIsLoading(true);
      const result = await sendTestPushAction({
        title: title || 'Test Notification',
        message: message || 'This is a test push notification from the server!',
      });
      
      if (result.success) {
        console.log(`Test push notification sent successfully to ${result.sentCount} subscription(s)`);
      } else {
        console.error('Test push notification failed:', result.errors);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to send test push notification:', error);
      return {
        success: false,
        sentCount: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isSupported, permission, sendTestPushAction, setIsLoading]);

  // 컴포넌트 마운트 시 구독 상태 확인
  useEffect(() => {
    if (isSupported && isAuthenticated) {
      void checkSubscription();
    }
  }, [isSupported, isAuthenticated, checkSubscription]);

  return {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
    requestPermission,
    requestPermissionOnLoad,
    sendTestNotification,
    checkSubscription,
  };
};

// 유틸리티 함수들
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  try {
    // 입력값 검증
    if (!base64String || typeof base64String !== 'string') {
      throw new Error('Invalid base64 string provided');
    }

    console.log('Original VAPID key:', base64String);
    console.log('VAPID key length:', base64String.length);
    
    // 문자열을 정리하고 공백 제거
    let cleanedString = base64String.trim();
    
    // 잘못된 문자 제거 (Base64에 허용되지 않는 문자들)
    cleanedString = cleanedString.replace(/[^A-Za-z0-9+/=_-]/g, '');
    
    console.log('Cleaned VAPID key:', cleanedString);
    console.log('Cleaned key length:', cleanedString.length);
    
    // URL-safe base64인지 확인 (URL-safe는 - 및 _ 문자를 사용)
    const isUrlSafe = /[-_]/.test(cleanedString);
    console.log('Is URL-safe base64:', isUrlSafe);
    
    let base64: string;
    if (isUrlSafe) {
      // URL-safe base64를 표준 base64로 변환
      base64 = cleanedString.replace(/-/g, '+').replace(/_/g, '/');
    } else {
      base64 = cleanedString;
    }
    
    // 패딩 추가
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    base64 = base64 + padding;
    
    console.log('Final base64 for decoding:', base64);
    console.log('Final base64 length:', base64.length);
    
    // base64 형식 검증
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(base64)) {
      console.error('Invalid base64 format detected');
      console.error('Invalid characters:', base64.replace(/[A-Za-z0-9+/=]/g, ''));
      throw new Error('Invalid base64 format after cleaning');
    }
    
    // Base64 디코딩
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    console.log('Successfully converted to Uint8Array, length:', outputArray.length);
    return outputArray;
  } catch (error) {
    console.error('=== VAPID Key Conversion Error ===');
    console.error('Original input:', base64String);
    console.error('Error details:', error);
    
    // 더 자세한 에러 정보 제공
    if (error instanceof DOMException && error.name === 'InvalidCharacterError') {
      throw new Error('VAPID 키에 잘못된 Base64 문자가 포함되어 있습니다. 환경변수를 확인해주세요.');
    }
    
    throw new Error(`VAPID key conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

import { useState, useEffect, useRef } from 'react';
import { devConsole } from '../lib/utils';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Service Worker 등록 상태를 전역으로 관리
let isServiceWorkerRegistered = false;

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 이미 초기화되었다면 중복 실행 방지
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Service Worker 등록 (전역 상태로 중복 방지)
    if ('serviceWorker' in navigator && !isServiceWorkerRegistered) {
      void navigator.serviceWorker
        .getRegistration()
        .then((existingRegistration) => {
          if (existingRegistration) {
            devConsole.log('SW already registered');
            isServiceWorkerRegistered = true;
            return;
          }

          return navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          });
        })
        .then((registration) => {
          if (registration) {
            devConsole.log('SW registered:', registration);
            isServiceWorkerRegistered = true;
          }
        })
        .catch((registrationError) => {
          devConsole.log('SW registration failed:', registrationError);
        });
    }

    // 설치 프롬프트 이벤트 리스너
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // 앱 설치됨 이벤트 리스너
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // 이미 설치되었는지 확인
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } catch (error) {
      devConsole.error('앱 설치 중 오류 발생:', error);
    }
  };

  return {
    isInstallable,
    isInstalled,
    installApp,
  };
}

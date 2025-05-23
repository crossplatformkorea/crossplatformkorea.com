import { create } from 'zustand';
import { toast } from 'sonner';
import { t } from '../lib/i18n';

// Auth 스토어 타입 정의
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  requireAuth: () => void;
  setAuthState: (isAuthenticated: boolean, isLoading: boolean) => void;
}

interface AuthStore extends AuthState, AuthActions {}

// Zustand 스토어 생성
export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  requireAuth: () => {
    toast.error(t('errors.auth.loginRequired'));
  },
  setAuthState: (isAuthenticated, isLoading) => {
    set({ isAuthenticated, isLoading });
  },
}));

import { create } from 'zustand';
import { createSignInHref, getBrowserReturnTo } from '../lib/authRedirect';

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
    if (typeof window !== 'undefined') {
      window.location.assign(createSignInHref(getBrowserReturnTo()));
    }
  },
  setAuthState: (isAuthenticated, isLoading) => {
    set({ isAuthenticated, isLoading });
  },
}));

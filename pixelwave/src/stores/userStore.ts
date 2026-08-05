import { create } from 'zustand';
import { fetchApi } from '../lib/api';

export interface UserState {
  isLoggedIn: boolean;
  token: string | null;
  userId: string | null;
  username: string | null;
  role: string | null;
  waveLevel: number;
  pixelBalance: number;
  avatarUrl: string | null;

  setLoginData: (token: string, user: any) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: typeof window !== 'undefined' ? !!localStorage.getItem('pixelwave_token') : false,
  token: typeof window !== 'undefined' ? localStorage.getItem('pixelwave_token') : null,
  userId: null,
  username: null,
  role: null,
  avatarUrl: null,
  pixelBalance: 0,
  waveLevel: 1,
  
  setLoginData: (token: string, userData: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pixelwave_token', token);
    }
    set({
      isLoggedIn: true,
      token,
      username: userData.username,
      role: userData.role,
      avatarUrl: userData.avatarUrl,
      pixelBalance: userData.pixelBalance,
      waveLevel: userData.waveLevel
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pixelwave_token');
    }
    set({
      isLoggedIn: false,
      token: null,
      username: null,
      role: null,
      avatarUrl: null,
      pixelBalance: 0,
      waveLevel: 1
    });
  },

  fetchProfile: async () => {
    try {
      const user = await fetchApi<any>('/auth/me');
      set({
        isLoggedIn: true,
        userId: user.id,
        username: user.username,
        role: user.role,
        avatarUrl: user.avatarUrl,
        pixelBalance: user.pixelBalance,
        waveLevel: user.waveLevel
      });
    } catch (e) {
      console.error('Failed to fetch profile', e);
      // Auto logout on token expiration
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pixelwave_token');
      }
      set({ isLoggedIn: false, username: null });
    }
  }
}));

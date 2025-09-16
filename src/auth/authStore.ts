import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NavigateFunction } from 'react-router-dom';
import API from '@/lib/axios';
import { config } from '@/config/app.config';
import { toast } from 'sonner';

type User = {
  username: string;
  role: string[];
  [key: string]: any; // TODO: change this when you know the restTODo
};

type AuthState = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, navigate: NavigateFunction) => Promise<void>;
  logout: (navigate: NavigateFunction) => void;
  updateUser: (updates: Partial<User>) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,

      login: async (email, password, navigate) => {
        set({ isLoading: true });
        try {
          const res = await API.post('/auth/login', { email, password });
          if (res.status === 200) {
            const token = res.data.token;

            const userRes = await API.get('/auth/me', {
              headers: { Authorization: `Bearer ${token}` },
            });

            const user = userRes.data.user;

            set({ token, user });

            // toast({
            //   title: 'Login successful',
            //   description: `Welcome back ${user.username}!`,
            //   duration: 1000,
            // });

            toast('Login successful');

            if (user.role.includes('mentee')) {
              navigate('/student-history');
            } else if (user.role.includes('mentor')) {
              navigate('/mentor-history');
            }
          }
        } catch (err) {
          // toast({
          //   title: 'Login failed',
          //   description: 'Invalid email or password. Please try again.',
          //   variant: 'destructive',
          //   duration: 2000,
          // });
          toast('Login failed');
        } finally {
          set({ isLoading: false });
        }
      },

      logout: (navigate) => {
        set({ token: null, user: null });
        useAuthStore.persist.clearStorage();
        navigate('/login');
      },

      updateUser(updates) {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    {
      name: config.STORE_KEY,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

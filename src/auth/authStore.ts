import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NavigateFunction } from 'react-router-dom';
import { gql } from '@apollo/client';
import client from '@/lib/apollo-client';
import { config } from '@/config/app.config';
import { toast } from 'sonner';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string[];
  address?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  expiresAt: number | null;
  login: (email: string, password: string, navigate: NavigateFunction) => Promise<void>;
  logout: (navigate: NavigateFunction) => void;
  updateUser: (updates: Partial<User>) => void;
};

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        firstName
        lastName
        email
        phone
        role
      }
    }
  }
`;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      expiresAt: null,

      login: async (email, password, navigate) => {
        set({ isLoading: true });
        try {
          type LoginMutationResponse = {
            login: {
              token: string;
              user: User;
            };
          };

          const { data } = await client.mutate<LoginMutationResponse>({
            mutation: LOGIN_MUTATION,
            variables: { email, password },
          });

          if (data?.login) {
            const { token, user } = data.login;
            const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 1 week from now

            set({ token, user, expiresAt });

            toast.success('Login successful');
            navigate('/dashboard');
          } else {
            toast('Login failed');
          }
        } catch (err: any) {
          toast('Login failed');
          console.error('Login error:', err.message);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: (navigate) => {
        set({ token: null, user: null, expiresAt: null });
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
        expiresAt: state.expiresAt,
      }),
      onRehydrateStorage: () => (state) => {
        // Check for token expiration after rehydration
        if (state?.expiresAt && Date.now() > state.expiresAt) {
          state.token = null;
          state.user = null;
          state.expiresAt = null;
        }
      },
    }
  )
);

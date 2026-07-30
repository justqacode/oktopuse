import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NavigateFunction } from 'react-router-dom';
import { gql } from '@apollo/client';
import client from '@/lib/apollo-client';
import { config } from '@/config/app.config';
import { toast } from 'sonner';
import type { Role } from '@/types';
import { MFA_MUTATION, type MFALoginResponse } from '@/components/auth/Verification2FAForm';

export type User = {
  id: string;
  oktoID: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: Role | Role[];
  address?: string;
  profilePhoto?: string;
  ACHProfile: {
    ACHRouting?: number | string | undefined;
    ACHAccount?: number | string | undefined;
  };
  tenantInfo: {
    [key: string]: any;
  };
  [key: string]: any;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isLoadingGoogle: boolean;
  expiresAt: number | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  mfaLogin: (verificationCode: string, navigate: NavigateFunction, rememberDevice: boolean) => Promise<void>;
  loginWithGoogle: (
    credential: string,
    ipa: string,
    ua: string,
    navigate: NavigateFunction,
  ) => Promise<void>;
  logout: (navigate: NavigateFunction) => void;
  updateUser: (updates: Partial<User>) => void;
};

const GOOGLE_LOGIN_MUTATION = gql`
  mutation Login($googleToken: String!, $ipa: String, $ua: String) {
    login(googleToken: $googleToken, ipa: $ipa, ua: $ua) {
      token
      user {
        id
        oktoID
        firstName
        lastName
        email
        phone
        role
        status
        verificationStatus
        notificationPreferences
        emergencyContact {
          name
          phone
          relationship
        }
        ACHProfile {
          ACHRouting
          ACHAccount
        }
        managerInfo {
          managerID
          companyName
          companyAddress
          propertyManagerEmail
          propertyManagerName
          propertyManagerPhone
        }
        landlordInfo {
          ownerID
          ownedProperties
        }
        tenantInfo {
          propertyId
          leaseStartDate
          leaseEndDate
          rentAmount
          balanceDue
          paymentFrequency
          rentalAddress
          rentAmount
          rentalZip
          rentalState
          rentalCity
        }
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
      isLoadingGoogle: false,
      expiresAt: null,

      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),

      mfaLogin: async (verificationCode, navigate, rememberDevice) => {
        set({ isLoading: true });
        try {
          const { data } = await client.mutate<MFALoginResponse>({
            mutation: MFA_MUTATION,
            variables: { mfaCode: verificationCode, rememberDevice },
            fetchPolicy: 'no-cache', // Always make a fresh network call — never return a cached result
          });

          if (data?.MFAlogin) {
            const { token, user: rawUser } = data.MFAlogin;
            const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hr from now

            const user: User = {
              ...rawUser,
              role: rawUser.role as Role | Role[],
            };

            set({ token, user, expiresAt });

            if (
              user.role === 'admin' ||
              (Array.isArray(user.role) && user.role.includes('admin'))
            ) {
              toast.success('Login was successful!');
              navigate('/dashboard/admin/users');
            } else if (user.role != null) {
              toast.success('Login was successful!');
              navigate('/dashboard');
            } else {
              toast.error('Incorrect verification code. Please try again.');
            }
          } else {
            toast.error('Incorrect verification code. Please try again.');
          }
        } catch (err: any) {
          const serverMessage =
            err?.graphQLErrors?.[0]?.message ||
            err?.networkError?.result?.errors?.[0]?.message ||
            err?.message;
          console.error('Login error:', err);
          // If the session has expired, clear auth state to allow re-login
          if (typeof serverMessage === 'string' && serverMessage.includes('Session expired')) {
            // Clear token and user info
            set({ token: null, user: null, expiresAt: null });
            toast.warning('Session expired. Please log in again.');
          } else {
            toast.error(serverMessage || 'Incorrect or expired code. Please try again.');
          }
        } finally {
          set({ isLoading: false });
        }
      },

      loginWithGoogle: async (credential, ipa, ua, navigate) => {
        set({ isLoadingGoogle: true });
        try {
          type GoogleLoginResponse = {
            login: {
              token: string;
              user: User;
            };
          };

          const { data } = await client.mutate<GoogleLoginResponse>({
            mutation: GOOGLE_LOGIN_MUTATION,
            variables: { googleToken: credential, ipa, ua },
          });

          if (data?.login) {
            const { token: authToken, user: rawUser } = data.login;
            const expiresAt = Date.now() + 60 * 60 * 1000;

            const user: User = {
              ...rawUser,
              role: rawUser.role as Role | Role[],
            };

            set({ token: authToken, user, expiresAt });
            toast.success('Logged in with Google');
            navigate('/dashboard');
          } else {
            toast('Google login failed');
          }
        } catch (err: any) {
          toast('Google login failed', {
            className: '!bg-red-600 !text-white !font-bold  !text-[14px]',
            duration: 10000,
          });
          console.error('Google login error:', err.message);
        } finally {
          set({ isLoadingGoogle: false });
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
    },
  ),
);

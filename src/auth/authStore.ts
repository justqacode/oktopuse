import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NavigateFunction } from 'react-router-dom';
import { gql } from '@apollo/client';
import client from '@/lib/apollo-client';
import { config } from '@/config/app.config';
import { toast } from 'sonner';
import type { Role } from '@/types';

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
  expiresAt: number | null;
  login: (
    email: string,
    password: string,
    ipa: string,
    ua: string,
    navigate: NavigateFunction
  ) => Promise<void>;
  loginWithGoogle: (
    credential: string,
    ipa: string,
    ua: string,
    navigate: NavigateFunction
  ) => Promise<void>;
  logout: (navigate: NavigateFunction) => void;
  updateUser: (updates: Partial<User>) => void;
};

const LOGIN_MUTATION = gql`
  mutation Login(
    $ipa: String
    $ua: String
    $email: String!
    $password: String!
    $tenantInfo: TenantInfoInput
    $managerInfo: ManagerInfoInput
  ) {
    login(
      ipa: $ipa
      ua: $ua
      email: $email
      password: $password
      tenantInfo: $tenantInfo
      managerInfo: $managerInfo
    ) {
      token
      user {
        id
        oktoID
        firstName
        lastName
        email
        phone
        role
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
      expiresAt: null,

      login: async (email, password, ipa, ua, navigate) => {
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
            variables: { email, password, ipa, ua },
          });

          if (data?.login) {
            const { token, user } = data.login;
            const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hr from now

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

      loginWithGoogle: async (credential, ipa, ua, navigate) => {
        set({ isLoading: true });
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
            const { token: authToken, user } = data.login;
            const expiresAt = Date.now() + 60 * 60 * 1000;

            set({ token: authToken, user, expiresAt });
            toast.success('Logged in with Google');
            navigate('/dashboard');
          } else {
            toast('Google login failed');
          }
        } catch (err: any) {
          toast('Google login failed');
          console.error('Google login error:', err.message);
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

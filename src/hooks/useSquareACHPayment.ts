import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { payments } from '@square/web-sdk';
import { config } from '@/config/app.config';
import { toast } from 'sonner';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useAuthStore } from '@/auth/authStore';
import { usePaymentStore } from '@/stores/usePaymentStore';

const RENT_MUTATION = gql`
  mutation CollectPayment(
    $amountPaid: Float!
    $rentForMonth: String!
    $note: String!
    $purpose: String!
    $paymentToken: String
  ) {
    collectPayment(
      amountPaid: $amountPaid
      rentForMonth: $rentForMonth
      note: $note
      purpose: $purpose
      paymentToken: $paymentToken
    ) {
      success
      message
    }
  }
`;

interface CollectPaymentResponse {
  collectPayment: {
    success: boolean;
    message: string;
  };
}

interface PaymentParams {
  amount: number;
  month?: string; // Format: YYYY-MM
  notes?: string;
  accountHolderName?: string;
}

export function useSquareACHPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const paymentsInstanceRef = useRef<any>(null);
  const achInstanceRef = useRef<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  const [rentMutation] = useMutation<CollectPaymentResponse>(RENT_MUTATION);

  // Initialize Square Payments SDK on mount
  useEffect(() => {
    const initSquarePayments = async () => {
      console.log('[Square] Starting initialization.....');
      const appId = config.SQUARE_APPLICATION_ID?.trim() || '';
      const locationId = config.SQUARE_LOCATION_ID?.trim() || '';

      const maskValue = (val: string) => {
        if (!val || val.length === 0) return 'Missing/Empty';
        if (val.length <= 8) return '***';
        return `${val.substring(0, 4)}...${val.substring(val.length - 4)}`;
      };

      console.log('[Square] Application ID:', appId ? `Present (${maskValue(appId)})` : 'Missing');
      console.log(
        '[Square] Location ID:',
        locationId ? `Present (${maskValue(locationId)})` : 'Missing'
      );

      if (!appId || appId.length === 0 || !locationId || locationId.length === 0) {
        console.warn('[Square] Credentials not configured - Square ACH will not be available');
        return;
      }

      // Validate format
      const validAppIdPrefixes = ['sandbox-', 'sq0idb-', 'sq0idp-'];
      const hasValidPrefix = validAppIdPrefixes.some((prefix) => appId.startsWith(prefix));

      if (!hasValidPrefix) {
        console.error('[Square] Invalid Application ID format.');
        return;
      }

      if (!/^[A-Z0-9]+$/.test(locationId)) {
        console.error('[Square] Invalid Location ID format.');
        return;
      }

      console.log('[Square] Credentials validated successfully');

      try {
        console.log('[Square] Creating payments instance...');
        const paymentsInstance = await payments(appId, locationId);

        if (!paymentsInstance) {
          console.error('[Square] Failed to initialize Square Payments instance');
          return;
        }

        console.log('[Square] Payments instance created successfully');
        paymentsInstanceRef.current = paymentsInstance;

        const transactionId = `rent-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const basePath = window.location.pathname;
        const redirectURI = `${window.location.origin}${basePath}`;
        const cleanRedirectURI = redirectURI.split('?')[0].split('#')[0];

        console.log('[Square] Initializing ACH instance...');

        let achInstance;
        try {
          const achOptions = {
            redirectURI: cleanRedirectURI,
            transactionId: transactionId,
          };
          achInstance = await paymentsInstance.ach(achOptions as any);
        } catch (achError: any) {
          console.error('[Square] ACH initialization error:', achError);
          if (achError?.name === 'PaymentMethodUnsupportedError') {
            console.error('[Square] ACH is not supported.');
            return;
          }
          throw achError;
        }

        console.log('[Square] ACH instance initialized successfully');
        achInstanceRef.current = achInstance;
        setIsInitialized(true);
      } catch (error) {
        console.error('[Square] Failed to initialize Square Payments:', error);
      }
    };

    initSquarePayments();

    return () => {
      if (achInstanceRef.current) {
        achInstanceRef.current = null;
      }
      if (paymentsInstanceRef.current) {
        paymentsInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Square redirect callback
  useEffect(() => {
    const handleSquareCallback = async () => {
      console.log('[Square Callback] Checking for payment token...');

      const paymentToken =
        searchParams.get('token') ||
        searchParams.get('paymentToken') ||
        searchParams.get('bauth') ||
        window.location.hash.match(/[?&]token=([^&]+)/)?.[1] ||
        window.location.hash.match(/[?&]paymentToken=([^&]+)/)?.[1] ||
        window.location.hash.match(/[?&]bauth=([^&]+)/)?.[1];

      console.log('[Square Callback] Payment token found:', paymentToken ? 'Yes' : 'No');

      if (paymentToken) {
        console.log('[Square Callback] Processing payment token');
        const storedFormData = sessionStorage.getItem('rentPaymentFormData');

        if (storedFormData) {
          try {
            const formData = JSON.parse(storedFormData);
            console.log('[Square Callback] Parsed form data:', formData);
            setIsLoading(true);

            const { triggerRefetch } = usePaymentStore.getState();

            const { data: result } = await rentMutation({
              variables: {
                userId: user?.id,
                amountPaid: formData.amountPaid,
                rentForMonth: formData.scheduleDate,
                note: formData.notes || '',
                purpose: 'Rent',
                paymentToken: paymentToken,
              },
            });

            console.log('[Square Callback] Backend response:', result);
            if (result?.collectPayment.success) {
              console.log('[Square Callback] Payment successful!');
              triggerRefetch();
              toast.success(result?.collectPayment.message || 'Payment successful!');

              // Clean up
              sessionStorage.removeItem('rentPaymentFormData');
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.delete('token');
              newSearchParams.delete('paymentToken');
              newSearchParams.delete('bauth');
              setSearchParams(newSearchParams);

              if (window.location.hash) {
                window.history.replaceState(
                  null,
                  '',
                  window.location.pathname + window.location.search
                );
              }
            } else {
              console.error('[Square Callback] Payment failed:', result);
              toast.error(result?.collectPayment.message || 'Payment failed');
            }
          } catch (err: any) {
            console.error('[Square Callback] Error processing payment:', err);
            toast.error(err?.message || 'Payment failed. Please try again.');
            sessionStorage.removeItem('rentPaymentFormData');
          } finally {
            setIsLoading(false);
          }
        } else {
          console.warn('[Square Callback] No stored form data found');
        }

        // Clean up URL
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('token');
        newSearchParams.delete('paymentToken');
        newSearchParams.delete('bauth');
        setSearchParams(newSearchParams);
      }
    };

    handleSquareCallback();
  }, [searchParams, rentMutation, user, setSearchParams]);

  // Initiate payment - this is what you call from your button
  const initiatePayment = useCallback(
    async (params: PaymentParams) => {
      if (!achInstanceRef.current) {
        toast.error('Payment system not initialized. Please refresh and try again.');
        return;
      }

      if (!params.amount || params.amount <= 0) {
        toast.error('Please enter a valid payment amount.');
        return;
      }

      setIsLoading(true);

      // Get account holder name
      let accountHolderName = params.accountHolderName || '';

      if (!accountHolderName) {
        if (user?.firstName || user?.lastName) {
          const firstName = user.firstName || '';
          const lastName = user.lastName || '';
          accountHolderName = `${firstName} ${lastName}`.trim();
        } else if (user?.firstName) {
          accountHolderName = user.firstName;
        }
      }

      if (!accountHolderName || accountHolderName.length === 0) {
        console.error('[Payment] Account holder name is missing');
        toast.error('Account holder name is required. Please update your profile.');
        setIsLoading(false);
        return;
      }

      // Store payment data for callback
      const paymentData = {
        amountPaid: params.amount,
        scheduleDate: params.month || new Date().toISOString().slice(0, 7),
        notes: params.notes || '',
      };

      console.log('[Payment] Storing form data:', paymentData);
      sessionStorage.setItem('rentPaymentFormData', JSON.stringify(paymentData));

      try {
        console.log('[Payment] Calling Square tokenize with:', {
          accountHolderName,
          intent: 'CHARGE',
          amount: params.amount.toFixed(2),
          currency: 'USD',
        });

        const tokenizeResult = await achInstanceRef.current.tokenize({
          accountHolderName: accountHolderName,
          intent: 'CHARGE',
          amount: params.amount.toFixed(2),
          currency: 'USD',
        });

        console.log('[Payment] Tokenize result:', tokenizeResult);
        console.log('[Payment] Redirecting to Square...');

        // User will be redirected to Square
        // Don't set loading to false - redirect will happen
      } catch (tokenizeError: any) {
        console.error('[Payment] Square ACH tokenization error:', tokenizeError);
        sessionStorage.removeItem('rentPaymentFormData');
        toast.error(tokenizeError?.message || 'Failed to initiate payment. Please try again.');
        setIsLoading(false);
      }
    },
    [user]
  );

  return {
    initiatePayment,
    isLoading,
    isInitialized,
  };
}

export default useSquareACHPayment;

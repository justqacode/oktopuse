import { useState, useEffect, useRef } from 'react';

interface TokenResult {
  status: string;
  token?: string;
  errors?: any;
}

interface PaymentMethodEventDetail {
  tokenResult: TokenResult;
  error?: any;
}

interface PaymentMethodEvent extends Event {
  detail: PaymentMethodEventDetail;
}

interface BillingContact {
  givenName: string;
  familyName: string;
}

interface ACHOptions {
  accountHolderName: string;
  intent: string;
  amount: string;
  currency: string;
}

interface SquarePaymentModalProps {
  open: boolean;
  onOpenChange: (show: boolean) => void;
}

export function AchPayment({
  open: showPaymentModal,
  onOpenChange: setShowPaymentModal,
}: SquarePaymentModalProps) {
  const [givenName, setGivenName] = useState<string>('');
  const [familyName, setFamilyName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failure' | null>(null);
  const paymentsRef = useRef<any>(null);
  const achRef = useRef<any>(null);

  const appId = 'sandbox-sq0idb-D1TsBauwS-5Rfl1yPUEpgQ';
  const locationId = 'LV3G83HT78D81';

  const initializeACH = async (payments: any): Promise<any> => {
    try {
      const ach = await payments.ach();
      return ach;
    } catch (error) {
      console.error('Failed to initialize ACH:', error);
      throw error;
    }
  };

  const createPayment = async (token: string): Promise<any> => {
    const body = JSON.stringify({
      locationId,
      sourceId: token,
      idempotencyKey: window.crypto.randomUUID(),
    });

    const paymentResponse = await fetch('http://localhost:8301/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    if (paymentResponse.ok) {
      return paymentResponse.json();
    }

    const errorBody = await paymentResponse.text();
    throw new Error(errorBody);
  };

  const tokenize = async (paymentMethod: any, options: ACHOptions): Promise<void> => {
    return new Promise((resolve, reject) => {
      const handleTokenization = async (event: PaymentMethodEvent) => {
        const { tokenResult, error } = event.detail;

        // Remove event listener after use
        paymentMethod.removeEventListener('ontokenization', handleTokenization);

        if (error !== undefined) {
          reject(new Error(`Tokenization failed with error: ${error}`));
          return;
        }

        if (tokenResult.status === 'OK' && tokenResult.token) {
          try {
            const paymentResults = await createPayment(tokenResult.token);
            setPaymentStatus('success');
            console.debug('Payment Success', paymentResults);
            resolve();
          } catch (paymentError) {
            reject(paymentError);
          }
        } else {
          let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
          if (tokenResult.errors) {
            errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
          }
          reject(new Error(errorMessage));
        }
      };

      paymentMethod.addEventListener('ontokenization', handleTokenization);

      // Start tokenization
      paymentMethod.tokenize(options).catch(reject);
    });
  };

  const getBillingContact = (): BillingContact => {
    return {
      givenName,
      familyName,
    };
  };

  const getACHOptions = (): ACHOptions => {
    const billingContact = getBillingContact();
    const accountHolderName = `${billingContact.givenName} ${billingContact.familyName}`;

    return {
      accountHolderName,
      intent: 'CHARGE',
      amount: '1.00',
      currency: 'USD',
    };
  };

  const handleSubmitPayment = async (event?: any) => {
    if (event) {
      event.preventDefault();
    }

    if (!achRef.current) {
      console.error('ACH not initialized');
      setPaymentStatus('failure');
      return;
    }

    // Validate form
    if (!givenName.trim() || !familyName.trim()) {
      setPaymentStatus('failure');
      return;
    }

    setIsLoading(true);
    setPaymentStatus(null);

    try {
      const achOptions = getACHOptions();
      await tokenize(achRef.current, achOptions);
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('failure');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    if (!isLoading) {
      setShowPaymentModal(false);
      // Reset form state after a delay to allow modal close animation
      setTimeout(() => {
        setGivenName('');
        setFamilyName('');
        setPaymentStatus(null);
      }, 300);
    }
  };

  useEffect(() => {
    const initializeSquare = async () => {
      if (!window.Square) {
        console.error('Square.js failed to load properly');
        return;
      }

      try {
        const payments = window.Square.payments(appId, locationId);
        paymentsRef.current = payments;

        const ach = await initializeACH(payments);
        achRef.current = ach;
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Square payments:', error);
        setPaymentStatus('failure');
      }
    };

    // Only initialize if modal is open
    if (showPaymentModal) {
      // Load Square SDK if not already loaded
      if (!document.querySelector('script[src*="square.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
        script.type = 'text/javascript';
        script.onload = initializeSquare;
        script.onerror = () => {
          console.error('Failed to load Square SDK');
          setPaymentStatus('failure');
        };
        document.head.appendChild(script);
      } else if (window.Square) {
        initializeSquare();
      }
    }

    // Cleanup
    return () => {
      // Cleanup can be done here if needed
    };
  }, [showPaymentModal]);

  if (!showPaymentModal) return null;

  return (
    <div className='fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>Pay Rent with Bank Account</h2>
          <button
            onClick={handleModalClose}
            className='text-gray-500 hover:text-gray-700 transition-colors'
            disabled={isLoading}
            aria-label='Close modal'
          >
            ✕
          </button>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>First Name</label>
            <input
              type='text'
              autoComplete='given-name'
              aria-required='true'
              aria-label='First Name'
              required
              placeholder='Given Name'
              value={givenName}
              onChange={(e) => setGivenName(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed'
              disabled={isLoading}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Last Name</label>
            <input
              type='text'
              autoComplete='family-name'
              aria-required='true'
              aria-label='Last Name'
              required
              placeholder='Family Name'
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed'
              disabled={isLoading}
            />
          </div>

          {paymentStatus && (
            <div
              className={`p-4 rounded-md ${
                paymentStatus === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              <div className='flex items-center'>
                {paymentStatus === 'success' ? (
                  <>
                    <svg
                      className='w-5 h-5 mr-2 text-green-600'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span>Payment successful!</span>
                  </>
                ) : (
                  <>
                    <svg
                      className='w-5 h-5 mr-2 text-red-600'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span>Payment failed. Please try again.</span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className='flex gap-3 pt-2'>
            <button
              onClick={handleModalClose}
              className='flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed'
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitPayment}
              disabled={isLoading || !isInitialized || !givenName.trim() || !familyName.trim()}
              className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
            >
              {isLoading ? (
                <span className='flex items-center justify-center'>
                  <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Confirm Payment'
              )}
            </button>
          </div>

          {!isInitialized && (
            <div className='text-sm text-yellow-600 text-center p-2 bg-yellow-50 rounded-md border border-yellow-200'>
              <div className='flex items-center justify-center'>
                <svg
                  className='animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-600'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                Initializing payment system...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

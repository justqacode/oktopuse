import { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuthStore } from '@/auth/authStore';
import { Textarea } from './ui/textarea';
import { config } from '@/config/app.config';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const formSchema = z.object({
  givenName: z.string().min(1, { message: 'First name is required' }),
  familyName: z.string().min(1, { message: 'Last name is required' }),
  buyerEmailAddress: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  note: z.string().min(1, { message: 'Note is required' }),
  referenceId: z.string().min(1, { message: 'Reference ID is required' }),
});

type FormValues = z.infer<typeof formSchema>;

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

const ACH_PAYMENT_MUTATION = gql`
  mutation InitiatePayment(
    $idempotencyKey: String!
    $locationId: String
    $note: String!
    $sourceId: String!
    $amountMoney: String!
    $referenceId: String!
    $email: String!
  ) {
    initiateSqrPayment(
      idempotencyKey: $idempotencyKey
      locationId: $locationId
      note: $note
      sourceId: $sourceId
      amountMoney: $amountMoney
      referenceId: $referenceId
      email: $email
    ) {
      success
      message
      status
    }
  }
`;

type ACHPaymentProp = {
  initiateSqrPayment: {
    locationId: string;
    sourceId: string;
    idempotencyKey: string;
    email: string;
    note: string;
    referenceId: string;
    amountMoney: string;
    success: boolean;
    message: string;
    status: string;
  };
};

export function AchPayment({ open, onOpenChange }: SquarePaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failure' | null>(null);
  const { user } = useAuthStore();

  const [achMutation] = useMutation<ACHPaymentProp>(ACH_PAYMENT_MUTATION);

  const paymentsRef = useRef<any>(null);
  const achRef = useRef<any>(null);

  const appId = config.SQUARE_APPLICATION_ID;
  const locationId = config.SQUARE_LOCATION_ID;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      givenName: user?.firstName || '',
      familyName: user?.lastName,
      buyerEmailAddress: user?.email || '',
      note: '',
      referenceId: user?.id || '',
    },
  });

  const initializeACH = async (payments: any): Promise<any> => {
    try {
      const ach = await payments.ach();
      return ach;
    } catch (error) {
      // console.error('Failed to initialize ACH:', error);
      toast.error('Failed to initialize ACH:');
      throw error;
    }
  };

  const createPayment = async (token: string, formData: FormValues): Promise<any> => {
    // const body = JSON.stringify({
    //   locationId,
    //   sourceId: token,
    //   idempotencyKey: window.crypto.randomUUID(),
    //   email: formData.buyerEmailAddress,
    //   note: formData.note,
    //   referenceId: formData.referenceId,
    //   amountMoney: user?.tenantInfo?.rentAmount,
    // });

    // const paymentResponse = await fetch('http://localhost:3044/payment', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body,
    // });

    // if (paymentResponse?.ok) {
    //   return paymentResponse.json();
    // }

    // const errorBody = await paymentResponse.text();
    // throw new Error(errorBody);

    try {
      const { data: paymentResponse } = await achMutation({
        variables: {
          locationId,
          sourceId: token,
          idempotencyKey: window.crypto.randomUUID(),
          email: formData.buyerEmailAddress,
          note: formData.note,
          referenceId: formData.referenceId,
          amountMoney: String(user?.tenantInfo?.rentAmount),
        },
      });

      if (paymentResponse?.initiateSqrPayment.success) {
        toast.success(paymentResponse?.initiateSqrPayment.message || 'Payment is processing!');
      }
    } catch (error) {
      error instanceof Error ? error.message : 'Payment failed. Please try again later.';
    }
  };

  const tokenize = async (
    paymentMethod: any,
    options: ACHOptions,
    formData: FormValues,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const handleTokenization = async (event: PaymentMethodEvent) => {
        const { tokenResult, error } = event.detail;

        paymentMethod.removeEventListener('ontokenization', handleTokenization);

        if (error !== undefined) {
          reject(new Error(`Tokenization failed with error: ${error}`));
          return;
        }

        if (tokenResult.status === 'OK' && tokenResult.token) {
          try {
            const paymentResults = await createPayment(tokenResult.token, formData);
            setPaymentStatus('success');
            // toast.success('Payment successful!');
            // console.debug('Payment Success', paymentResults);
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
      paymentMethod.tokenize(options).catch(reject);
    });
  };

  const getBillingContact = (data: FormValues): BillingContact => {
    return {
      givenName: data.givenName,
      familyName: data.familyName,
    };
  };

  const getACHOptions = (data: FormValues): ACHOptions => {
    const billingContact = getBillingContact(data);
    const accountHolderName = `${billingContact.givenName} ${billingContact.familyName}`;

    return {
      accountHolderName,
      intent: 'CHARGE',
      // amount: '5000.00',
      amount: String(user?.tenantInfo?.rentAmount) || '5000.00',
      currency: 'USD',
    };
  };

  const onSubmit = async (data: FormValues) => {
    if (!achRef.current) {
      console.error('ACH not initialized');
      toast.error('Payment system not initialized');
      setPaymentStatus('failure');
      return;
    }

    setIsLoading(true);
    setPaymentStatus(null);

    try {
      const achOptions = getACHOptions(data);
      await tokenize(achRef.current, achOptions, data);

      // Reset form and close modal after success
      setTimeout(() => {
        form.reset();
        setPaymentStatus(null);
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      // console.error('Payment failed:', error);
      toast.error(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      setPaymentStatus('failure');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      setTimeout(() => {
        form.reset({
          givenName: '',
          familyName: '',
          buyerEmailAddress: user?.email || '',
          note: '',
          referenceId: user?.id || '',
        });
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
        toast.error('Failed to initialize payment system');
        setPaymentStatus('failure');
      }
    };

    if (open) {
      // const squareSrc = import.meta.env?.PROD
      //   ? 'https://web.squarecdn.com/v1/square.js'
      //   : 'https://sandbox.web.squarecdn.com/v1/square.js';

      const PROD_HOSTNAMES = ['https://www.oktopuse.com', 'oktopuse.com', 'oktopuse.vercel.app'];

      const isProductionDomain =
        typeof window !== 'undefined' && PROD_HOSTNAMES.includes(window.location.hostname);

      if (!document.querySelector('script[src*="square.js"]')) {
        const script = document.createElement('script');
        // script.src = squareSrc;
        script.src = isProductionDomain
          ? 'https://web.squarecdn.com/v1/square.js'
          : 'https://sandbox.web.squarecdn.com/v1/square.js';
        script.type = 'text/javascript';
        script.onload = initializeSquare;
        script.onerror = () => {
          // console.error('Failed to load Square SDK');
          toast.error('Failed to load payment system');
          setPaymentStatus('failure');
        };
        document.head.appendChild(script);
      } else if (window.Square) {
        initializeSquare();
      }
    }

    return () => {
      // Cleanup if needed
    };
  }, [open]);

  if (!open) return null;

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
                  {/* <span>Payment successful!</span> */}
                  <span>Payment is processing!</span>
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

        <Form {...form}>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='givenName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter first name' disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='familyName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter last name' disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='buyerEmailAddress'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='Enter email address' disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='referenceId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference ID *</FormLabel>
                  <FormControl>
                    <Input placeholder='Reference ID' disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='note'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Note *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='e.g., Rent'
                      disabled={isLoading || !isInitialized}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className='gap-2 sm:gap-0 mt-6'>
            <Button type='button' variant='outline' onClick={handleModalClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type='button'
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading || !isInitialized}
            >
              {isLoading ? (
                <span className='flex items-center'>
                  <span className='animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full'></span>
                  Processing...
                </span>
              ) : (
                <>
                  <CreditCard className='mr-2 h-4 w-4' />
                  Confirm Payment
                </>
              )}
            </Button>
          </DialogFooter>
        </Form>
      </div>
    </div>
  );
}

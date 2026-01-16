import { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router-dom';
import { CreditCard, CheckCircle2, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { payments } from '@square/web-sdk';
import { config } from '@/config/app.config';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { gql } from '@apollo/client';
import { toast } from 'sonner';

import { useAuthStore } from '@/auth/authStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { useMutation } from '@apollo/client/react';

// Safe converter for all money operations
function safeMoney(value: unknown): number {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

// -------------------------
// ZOD SCHEMA
// -------------------------
const formSchema = z
  .object({
    amountType: z.enum(['full', 'half', 'custom']),
    customAmount: z.string().optional(),
    scheduleDate: z.string().min(1, 'Please select a payment month'),
    notes: z.string().optional(),
    // Bank details fields
    accountNumber: z
      .string()
      .min(6, { message: 'Account number must be between 6-17 digits' })
      .max(17, { message: 'Account number must be between 6-17 digits' })
      .optional(),
    routingNumber: z.string().min(9, { message: 'Routing number must be 9 digits' }).optional(),
    accountHolderName: z.string().min(1, 'Please enter a valid holder name').optional(),
    accountHolderType: z.enum(['individual', 'business']).optional(),
  })
  .refine(
    (data) => {
      if (data.amountType === 'custom') {
        const val = safeMoney(data.customAmount);
        return val > 0;
      }
      return true;
    },
    {
      message: 'Please enter a valid custom amount',
      path: ['customAmount'],
    }
  );

type FormValues = z.infer<typeof formSchema>;

const RENT_MUTATION = gql`
  mutation CollectPayment(
    $amountPaid: Float!
    $rentForMonth: String!
    $note: String!
    $purpose: String!
    $bankDetails: BankDetailsInput
    $paymentToken: String
  ) {
    collectPayment(
      amountPaid: $amountPaid
      rentForMonth: $rentForMonth
      note: $note
      purpose: $purpose
      bankDetails: $bankDetails
      paymentToken: $paymentToken
    ) {
      success
      message
    }
  }
`;

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CollectPaymentResponse {
  collectPayment: {
    success: boolean;
    message: string;
  };
}

// -------------------------
// COMPONENT
// -------------------------
export default function PaymentModal({ open, onOpenChange }: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const paymentsInstanceRef = useRef<any>(null);
  const achInstanceRef = useRef<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { user } = useAuthStore();
  const rent = safeMoney(user?.tenantInfo?.rentAmount);
  const rentalAddress = user?.tenantInfo?.rentalAddress;

  const [rentMutation] = useMutation<CollectPaymentResponse>(RENT_MUTATION);

  // Initialize Square Payments SDK
  useEffect(() => {
    const initSquarePayments = async () => {
      console.log('[Square] Starting initialization.....');
      // Trim whitespace and check for empty strings
      const appId = config.SQUARE_APPLICATION_ID?.trim() || '';
      const locationId = config.SQUARE_LOCATION_ID?.trim() || '';

      // Log masked values for debugging (show first 4 and last 4 chars)
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
      console.log('[Square] Application ID length:', appId.length);
      console.log('[Square] Location ID length:', locationId.length);

      if (!appId || appId.length === 0 || !locationId || locationId.length === 0) {
        console.warn(
          '[Square] Credentials not configured or empty - Square ACH will not be available'
        );
        console.warn('[Square] App ID empty:', !appId || appId.length === 0);
        console.warn('[Square] Location ID empty:', !locationId || locationId.length === 0);
        return;
      }

      // Validate format - Square Application ID should start with 'sandbox-' or 'sq0idb-' or 'sq0idp-'
      const validAppIdPrefixes = ['sandbox-', 'sq0idb-', 'sq0idp-'];
      const hasValidPrefix = validAppIdPrefixes.some((prefix) => appId.startsWith(prefix));

      if (!hasValidPrefix) {
        console.error('[Square] Invalid Application ID format.');
        console.error('[Square] Should start with one of:', validAppIdPrefixes.join(', '));
        console.error(
          '[Square] Current value starts with:',
          appId.substring(0, Math.min(10, appId.length))
        );
        console.error('[Square] Full masked value:', maskValue(appId));
        return;
      }

      // Validate Location ID format - should be alphanumeric uppercase (Square format)
      if (!/^[A-Z0-9]+$/.test(locationId)) {
        console.error('[Square] Invalid Location ID format.');
        console.error('[Square] Should be alphanumeric uppercase (e.g., "ABC123XYZ")');
        console.error('[Square] Current value:', maskValue(locationId));
        return;
      }

      console.log('[Square] Credentials validated successfully');

      try {
        console.log('[Square] Creating payments instance...');
        console.log('[Square] Using Application ID:', maskValue(appId));
        console.log('[Square] Using Location ID:', maskValue(locationId));
        const paymentsInstance = await payments(appId, locationId);

        if (!paymentsInstance) {
          console.error('[Square] Failed to initialize Square Payments instance - returned null');
          return;
        }

        console.log('[Square] Payments instance created successfully');
        paymentsInstanceRef.current = paymentsInstance;

        // Generate a unique transaction ID
        const transactionId = `rent-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const redirectURI = `${window.location.origin}${window.location.pathname}`;
        console.log('[Square] Transaction ID:', transactionId);
        console.log('[Square] Redirect URI:', redirectURI);

        // Initialize ACH with required options (using type assertion for redirectURI)
        // Note: redirectURI is required by Square SDK but may not be in TypeScript definitions
        console.log('[Square] Initializing ACH instance...');
        const achInstance = await paymentsInstance.ach({
          redirectURI: redirectURI,
          transactionId: transactionId,
        } as any);

        console.log('[Square] ACH instance initialized successfully');
        achInstanceRef.current = achInstance;
        console.log('[Square] Initialization complete - Square ACH is ready');
      } catch (error) {
        console.error('[Square] Failed to initialize Square Payments:', error);
        console.error('[Square] Error details:', error);
      }
    };

    if (open) {
      console.log('[Square] Modal opened - initializing Square...');
      initSquarePayments();
    } else {
      console.log('[Square] Modal closed - skipping initialization');
    }

    // Cleanup on unmount or when modal closes
    return () => {
      if (achInstanceRef.current) {
        console.log('[Square] Cleaning up ACH instance');
        achInstanceRef.current = null;
      }
      if (paymentsInstanceRef.current) {
        console.log('[Square] Cleaning up payments instance');
        paymentsInstanceRef.current = null;
      }
    };
  }, [open]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amountType: 'full',
      customAmount: '',
      scheduleDate: new Date().toISOString().slice(0, 7),
      notes: '',
      accountNumber: undefined,
      routingNumber: undefined,
      accountHolderName: undefined,
      accountHolderType: 'individual',
    },
  });

  const amountType = form.watch('amountType');

  // Handle Square redirect callback - check for token when component mounts or modal opens
  useEffect(() => {
    const handleSquareCallback = async () => {
      console.log('[Square Callback] Checking for payment token...');
      console.log('[Square Callback] Current URL:', window.location.href);
      console.log('[Square Callback] Search params:', Object.fromEntries(searchParams.entries()));
      console.log('[Square Callback] Hash:', window.location.hash);

      // Check for paymentToken in URL parameters or hash
      // Square may return it as 'token', 'paymentToken', 'bauth', or in hash fragment
      const paymentToken =
        searchParams.get('token') ||
        searchParams.get('paymentToken') ||
        searchParams.get('bauth') ||
        window.location.hash.match(/[?&]token=([^&]+)/)?.[1] ||
        window.location.hash.match(/[?&]paymentToken=([^&]+)/)?.[1] ||
        window.location.hash.match(/[?&]bauth=([^&]+)/)?.[1];

      console.log('[Square Callback] Payment token found:', paymentToken ? 'Yes' : 'No');

      if (paymentToken) {
        console.log('[Square Callback] Processing payment token:', paymentToken);
        // Retrieve stored form data from sessionStorage
        const storedFormData = sessionStorage.getItem('rentPaymentFormData');

        if (storedFormData) {
          try {
            const formData = JSON.parse(storedFormData);
            console.log('[Square Callback] Parsed form data:', formData);
            setIsLoading(true);
            console.log('[Square Callback] Sending payment to backend...');

            const { triggerRefetch } = usePaymentStore.getState();
            const amountPaid = safeMoney(formData.amountPaid);

            // Send payment to backend with Square token
            const { data: result } = await rentMutation({
              variables: {
                userId: user?.id,
                amountPaid,
                rentForMonth: formData.scheduleDate,
                note: formData.notes || '',
                purpose: 'Rent',
                ...(formData.bankDetails && { bankDetails: formData.bankDetails }),
                paymentToken: paymentToken,
              },
            });

            console.log('[Square Callback] Backend response:', result);
            if (result?.collectPayment.success) {
              console.log('[Square Callback] Payment successful!');
              triggerRefetch();
              form.reset();
              setShowBankDetails(false);
              toast.success(result?.collectPayment.message || 'Payment successful!');

              // Clean up URL and sessionStorage
              sessionStorage.removeItem('rentPaymentFormData');
              // Clear URL parameters
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.delete('token');
              newSearchParams.delete('paymentToken');
              newSearchParams.delete('bauth');
              setSearchParams(newSearchParams);
              // Clear hash if present
              if (window.location.hash) {
                window.history.replaceState(
                  null,
                  '',
                  window.location.pathname + window.location.search
                );
              }
              onOpenChange(false);
            } else {
              console.error('[Square Callback] Payment failed:', result);
            }
          } catch (err: any) {
            console.error('[Square Callback] Error processing payment:', err);
            toast.error(err?.message || 'Payment failed. Please try again.');
            sessionStorage.removeItem('rentPaymentFormData');
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete('token');
            newSearchParams.delete('paymentToken');
            newSearchParams.delete('bauth');
            setSearchParams(newSearchParams);
          } finally {
            console.log('[Square Callback] Setting loading to false');
            setIsLoading(false);
          }
        } else {
          console.warn('[Square Callback] No stored form data found');
          // Clean up URL even if no stored data
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete('token');
          newSearchParams.delete('paymentToken');
          newSearchParams.delete('bauth');
          setSearchParams(newSearchParams);
        }
      } else {
        console.log('[Square Callback] No payment token in URL');
      }
    };

    // Check for callback token whenever modal opens or search params change
    if (open) {
      console.log('[Square Callback] Modal is open - checking for callback');
      handleSquareCallback();
    }
  }, [open, searchParams, rentMutation, user, form, setSearchParams, onOpenChange]);

  // -------------------------
  // PAYMENT AMOUNT LOGIC
  // -------------------------
  const getPaymentAmount = () => {
    const type = form.getValues('amountType');

    if (type === 'full') return rent;
    if (type === 'half') return rent / 2;

    return safeMoney(form.getValues('customAmount'));
  };

  // -------------------------
  // SUBMIT
  // -------------------------
  const onSubmit = async (data: FormValues) => {
    console.log('[Payment] Submit started');
    setIsLoading(true);

    const { triggerRefetch } = usePaymentStore.getState();
    const amountPaid = safeMoney(getPaymentAmount());
    console.log('[Payment] Amount:', amountPaid);

    // Collect bank details if provided
    const bankDetails = showBankDetails
      ? {
          accountNumber: data.accountNumber || '',
          routingNumber: data.routingNumber || '',
          accountHolderName: data.accountHolderName || '',
          accountHolderType: data.accountHolderType || 'individual',
        }
      : null;

    // Use Square ACH payment if ACH instance is available and credentials are configured
    const hasAchInstance = !!achInstanceRef.current;
    const hasAppId = !!config.SQUARE_APPLICATION_ID;
    const hasLocationId = !!config.SQUARE_LOCATION_ID;
    const useSquare = hasAchInstance && hasAppId && hasLocationId;

    console.log('[Payment] Square check:', {
      hasAchInstance,
      hasAppId,
      hasLocationId,
      useSquare,
    });

    if (useSquare) {
      console.log('[Payment] Using Square ACH payment flow');
      const accountHolderName = data.accountHolderName || user?.name || '';
      console.log('[Payment] Account holder name:', accountHolderName);

      if (!accountHolderName) {
        console.error('[Payment] Account holder name is missing');
        toast.error('Account holder name is required for ACH payment');
        setIsLoading(false);
        return;
      }

      // Store form data in sessionStorage before redirecting
      const formDataToStore = {
        amountPaid,
        scheduleDate: data.scheduleDate,
        notes: data.notes || '',
        bankDetails,
      };
      console.log('[Payment] Storing form data:', formDataToStore);
      sessionStorage.setItem('rentPaymentFormData', JSON.stringify(formDataToStore));

      // Trigger Square ACH tokenization which will redirect to Square
      try {
        console.log('[Payment] Calling Square tokenize with:', {
          accountHolderName,
          intent: 'CHARGE',
          amount: amountPaid.toFixed(2),
          currency: 'USD',
        });
        const tokenizeResult = await achInstanceRef.current.tokenize({
          accountHolderName: accountHolderName,
          intent: 'CHARGE',
          amount: amountPaid.toFixed(2),
          currency: 'USD',
        });
        console.log('[Payment] Tokenize result:', tokenizeResult);
        // User will be redirected to Square, so we return early
        // The callback handler will process the result when they return
        // Don't set isLoading to false here as the redirect will happen
        console.log('[Payment] Redirecting to Square...');
        return;
      } catch (tokenizeError: any) {
        console.error('[Payment] Square ACH tokenization error:', tokenizeError);
        console.error('[Payment] Error details:', {
          message: tokenizeError?.message,
          error: tokenizeError,
        });
        sessionStorage.removeItem('rentPaymentFormData');
        toast.error(tokenizeError?.message || 'Failed to initiate payment. Please try again.');
        setIsLoading(false);
        return;
      }
    }

    console.log('[Payment] Square not available - using fallback flow');

    // Fallback to original payment flow if Square is not initialized or not configured
    // try {
    //   const { data: result } = await rentMutation({
    //     variables: {
    //       userId: user?.id,
    //       amountPaid,
    //       rentForMonth: data.scheduleDate,
    //       note: data.notes || '',
    //       purpose: 'Rent',
    //       ...(bankDetails && { bankDetails }),
    //     },
    //   });

    //   if (result?.collectPayment.success) {
    //     triggerRefetch();
    //     form.reset();
    //     setShowBankDetails(false);
    //     toast.success(result?.collectPayment.message || 'Payment successful!');
    //     onOpenChange(false);
    //   }
    // } catch (err: any) {
    //   console.error(err);
    //   toast.error(err?.message || 'Payment failed. Please try again.');
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>Pay Rent</DialogTitle>
          <DialogDescription className='text-base font-medium pt-2'>
            {rentalAddress}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className='space-y-6'>
            {/* AMOUNT OPTIONS */}
            <FormField
              control={form.control}
              name='amountType'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>Amount *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className='flex flex-col space-y-2'
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='full' id='full' />
                        <label htmlFor='full' className='cursor-pointer font-medium text-sm'>
                          Full Rent (${safeMoney(rent).toFixed(2)})
                        </label>
                      </div>

                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='half' id='half' />
                        <label htmlFor='half' className='cursor-pointer font-medium text-sm'>
                          Half Rent (${(rent / 2).toFixed(2)})
                        </label>
                      </div>

                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='custom' id='custom' />
                        <label htmlFor='custom' className='cursor-pointer font-medium text-sm'>
                          Custom Amount
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CUSTOM AMOUNT */}
            {amountType === 'custom' && (
              <FormField
                control={form.control}
                name='customAmount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Amount *</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                          $
                        </span>
                        <Input
                          type='number'
                          step='0.01'
                          min='0'
                          placeholder='0.00'
                          className='pl-7'
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* TOTAL DISPLAY */}
            <div className='bg-muted p-4 rounded-lg'>
              <div className='flex justify-between items-center'>
                <span className='font-medium text-sm'>Payment Amount:</span>
                <span className='font-bold text-2xl'>
                  ${safeMoney(getPaymentAmount()).toFixed(2)}
                </span>
              </div>
            </div>

            {/* SCHEDULE */}
            <FormField
              control={form.control}
              name='scheduleDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule *</FormLabel>
                  <FormControl>
                    <Input type='month' {...field} min={new Date().toISOString().slice(0, 7)} />
                  </FormControl>
                  <FormDescription>Select the month to apply the payment.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* NOTES */}
            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className='min-h-[80px] resize-none'
                      placeholder='Add any notes for the landlord…'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Any additional information about this payment.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* BANK DETAILS TOGGLE BUTTON */}
            <div className='border-t pt-4'>
              <Button
                type='button'
                variant='outline'
                className='w-full'
                onClick={() => setShowBankDetails(!showBankDetails)}
              >
                <Building2 className='mr-2 h-4 w-4' />
                {showBankDetails ? 'Hide Bank Details' : 'Click here to use another ACH details'}
                {showBankDetails ? (
                  <ChevronUp className='ml-2 h-4 w-4' />
                ) : (
                  <ChevronDown className='ml-2 h-4 w-4' />
                )}
              </Button>
            </div>

            {/* BANK DETAILS SECTION */}
            {showBankDetails && (
              <div className='space-y-4 border rounded-lg p-4 bg-slate-50'>
                <h3 className='font-semibold text-sm flex items-center'>
                  <Building2 className='mr-2 h-4 w-4' />
                  Bank Account Details
                </h3>

                <FormField
                  control={form.control}
                  name='accountNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder='000123456789' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='routingNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Routing Number</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder='110000000' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='accountHolderName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder='Jane Landlord' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='accountHolderType'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>Account Holder Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className='flex flex-col space-y-2'
                        >
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='individual' id='individual' />
                            <label
                              htmlFor='individual'
                              className='cursor-pointer font-medium text-sm'
                            >
                              Individual
                            </label>
                          </div>

                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='business' id='business' />
                            <label
                              htmlFor='business'
                              className='cursor-pointer font-medium text-sm'
                            >
                              Business
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* BUTTON */}
            <DialogFooter>
              <Button
                type='button'
                className='w-full sm:w-auto'
                size='lg'
                disabled={isLoading}
                onClick={form.handleSubmit(onSubmit)}
              >
                {isLoading ? (
                  <span className='flex items-center'>
                    <span className='animate-spin mr-2 h-4 w-4 border-2 border-t-transparent rounded-full' />
                    Processing…
                  </span>
                ) : (
                  <>
                    <CreditCard className='mr-2 h-4 w-4' />
                    Pay Now
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, CheckCircle2, Building2, ChevronDown, ChevronUp } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  ) {
    collectPayment(
      amountPaid: $amountPaid
      rentForMonth: $rentForMonth
      note: $note
      purpose: $purpose
      bankDetails: $bankDetails
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);

  const { user } = useAuthStore();
  const rent = safeMoney(user?.tenantInfo?.rentAmount);
  const rentalAddress = user?.tenantInfo?.rentalAddress;

  const [rentMutation] = useMutation<CollectPaymentResponse>(RENT_MUTATION);

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
    setIsLoading(true);

    const { triggerRefetch } = usePaymentStore.getState();
    const amountPaid = safeMoney(getPaymentAmount());

    // Collect bank details if provided
    const bankDetails = showBankDetails
      ? {
          accountNumber: data.accountNumber || '',
          routingNumber: data.routingNumber || '',
          accountHolderName: data.accountHolderName || '',
          accountHolderType: data.accountHolderType || 'individual',
        }
      : null;

    try {
      const { data: result } = await rentMutation({
        variables: {
          userId: user?.id,
          amountPaid,
          rentForMonth: data.scheduleDate,
          note: data.notes || '',
          purpose: 'Rent',
          ...(bankDetails && { bankDetails }),
        },
      });

      if (result?.collectPayment.success) {
        triggerRefetch();
        form.reset();
        setShowSuccess(true);
        setShowBankDetails(false);
        toast.success(result?.collectPayment.message || 'Payment successful!');
        onOpenChange(false);
        // setTimeout(() => {
        //   setShowSuccess(false);
        //   onOpenChange(false);
        // }, 1200);
      }
    } catch (err) {
      console.error(err);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

        {/* {showSuccess ? (
          <Alert className='bg-green-50 border-green-200'>
            <CheckCircle2 className='h-5 w-5 text-green-600' />
            <AlertDescription className='text-green-800 font-medium'>
              Payment processed successfully!
            </AlertDescription>
          </Alert>
        ) : ( */}
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
        {/* )} */}
      </DialogContent>
    </Dialog>
  );
}

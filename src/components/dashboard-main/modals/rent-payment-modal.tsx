import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, Wallet, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { useAuthStore } from '@/auth/authStore';
import { usePaymentStore } from '@/stores/usePaymentStore';

const formSchema = z
  .object({
    amountType: z.enum(['full', 'half', 'custom'], {
      required_error: 'Please select an amount type',
    }),
    customAmount: z.string().optional(),
    scheduleDate: z.string().min(1, { message: 'Please select a payment date' }),
    // enableAutoPay: z.boolean(),
    // paymentMethod: z.string().min(1, { message: 'Please select a payment method' }),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.amountType === 'custom') {
        const amount = parseFloat(data.customAmount || '0');
        return amount > 0;
      }
      return true;
    },
    {
      message: 'Please enter a valid custom amount',
      path: ['customAmount'],
    }
  );

type FormValues = z.infer<typeof formSchema>;

// Mock data - replace with actual data from your auth/property store
const mockPropertyData = {
  propertyName: 'Sunset View Apartments - Unit 204',
  fullRentAmount: 1500.0,
  tenantId: 'tenant-123',
  propertyId: 'property-001',
  unitId: 'unit-204',
};

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// {
//   "query": "mutation PayRent($amountPaid: Float!, $rentForMonth:String!,$note:String!) { payRent(amountPaid: $amountPaid, rentForMonth:$rentForMonth,note:$note) { id amountPaid date } }",
//   "variables": {

//     "amountPaid": 12100,
//     "rentForMonth":"October Mid 2025",
//     "note":"All good"
//   }
// }

const RENT_MUTATION = gql`
  mutation PayRent($amountPaid: Float!, $rentForMonth: String!, $note: String!) {
    payRent(amountPaid: $amountPaid, rentForMonth: $rentForMonth, note: $note) {
      id
      amountPaid
      date
    }
  }
`;

export default function PaymentModal({ open, onOpenChange }: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rentMutation] = useMutation(RENT_MUTATION);
  const { user } = useAuthStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amountType: 'full',
      customAmount: '',
      // scheduleDate: new Date().toISOString().split('T')[0],
      // scheduleDate: new Date().toISOString().split('T')[0],
      // enableAutoPay: false,
      // paymentMethod: '',
      notes: '',
      scheduleDate: new Date().toISOString().slice(0, 7),
    },
  });

  const amountType = form.watch('amountType');
  // const enableAutoPay = form.watch('enableAutoPay');

  const getPaymentAmount = () => {
    const type = form.getValues('amountType');
    if (type === 'full') return mockPropertyData.fullRentAmount;
    if (type === 'half') return mockPropertyData.fullRentAmount / 2;
    return parseFloat(form.getValues('customAmount') || '0');
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const { triggerRefetch } = usePaymentStore.getState();

    try {
      const paymentAmount = getPaymentAmount();

      // const paymentData = {
      //   // ...data,
      //   // amount: paymentAmount,
      //   // propertyName: mockPropertyData.propertyName,
      //   // tenantId: mockPropertyData.tenantId,
      //   // propertyId: mockPropertyData.propertyId,
      //   // unitId: mockPropertyData.unitId,
      //   amountPaid: paymentAmount,
      //   rentForMonth: data.scheduleDate,
      //   note: data.notes,
      // };

      const { data: result } = await rentMutation({
        variables: {
          userId: user?.id,
          amountPaid: paymentAmount,
          rentForMonth: data.scheduleDate,
          note: data.notes,
        },
      });

      if (result) {
        triggerRefetch();
        setShowSuccess(false);
        form.reset();
        onOpenChange(false);
        toast.success('Payment successfull');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment failed. Please try again.');
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold flex items-center gap-2'>Pay Rent</DialogTitle>
          <DialogDescription className='text-base font-medium text-foreground pt-2'>
            {mockPropertyData.propertyName}
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <Alert className='bg-green-50 border-green-200'>
            <CheckCircle2 className='h-5 w-5 text-green-600' />
            <AlertDescription className='text-green-800 font-medium'>
              Payment processed successfully! You will receive a confirmation email shortly.
            </AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <div className='space-y-6'>
              {/* Amount Section */}
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='amountType'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>Amount *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className='flex flex-col space-y-2'
                        >
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='full' id='full' />
                            <label htmlFor='full' className='text-sm font-medium cursor-pointer'>
                              Full Rent (${mockPropertyData.fullRentAmount.toFixed(2)})
                            </label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='half' id='half' />
                            <label htmlFor='half' className='text-sm font-medium cursor-pointer'>
                              Half Rent (${(mockPropertyData.fullRentAmount / 2).toFixed(2)})
                            </label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='custom' id='custom' />
                            <label htmlFor='custom' className='text-sm font-medium cursor-pointer'>
                              Custom Amount
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                {/* Display Total Amount */}
                <div className='bg-muted p-4 rounded-lg'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium'>Payment Amount:</span>
                    <span className='text-2xl font-bold'>${getPaymentAmount().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Schedule Section */}
              {/* <FormField
                control={form.control}
                name='scheduleDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule *</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        {...field}
                        min={new Date().toISOString().split('T')[0]}
                        className='block w-full'
                      />
                    </FormControl>
                    <FormDescription>
                      Select the date you want to process this payment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name='scheduleDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule *</FormLabel>
                    <FormControl>
                      <Input
                        type='month'
                        {...field}
                        min={new Date().toISOString().slice(0, 7)} // yyyy-MM
                        className='block w-full'
                      />
                    </FormControl>
                    <FormDescription>
                      Select the month you want to process this payment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* AutoPay Toggle */}
              {/* <FormField
                control={form.control}
                name='enableAutoPay'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Enable AutoPay</FormLabel>
                      <FormDescription>
                        Automatically pay rent on the scheduled date each month
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              /> */}

              {/* {enableAutoPay && (
                <Alert>
                  <AlertDescription>
                    AutoPay will be set up to recur monthly on the selected date using your chosen
                    payment method.
                  </AlertDescription>
                </Alert>
              )} */}

              {/* Payment Method */}
              {/* <FormField
                control={form.control}
                name='paymentMethod'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a payment method' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='credit_debit'>
                          <div className='flex items-center gap-2'>
                            <CreditCard className='h-4 w-4' />
                            <span>Credit/Debit Card</span>
                          </div>
                        </SelectItem>
                        <SelectItem value='ach'>
                          <div className='flex items-center gap-2'>
                            <span>ACH Bank Transfer</span>
                          </div>
                        </SelectItem>
                        <SelectItem value='wallet'>
                          <div className='flex items-center gap-2'>
                            <Wallet className='h-4 w-4' />
                            <span>Wallet</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Notes */}
              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Add any notes for the landlord/manager...'
                        className='min-h-[80px] resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Any additional information about this payment</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <DialogFooter>
                <Button
                  type='button'
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isLoading}
                  className='w-full sm:w-auto'
                  size='lg'
                >
                  {isLoading ? (
                    <span className='flex items-center'>
                      <span className='animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full'></span>
                      Processing...
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
        )}
      </DialogContent>
    </Dialog>
  );
}

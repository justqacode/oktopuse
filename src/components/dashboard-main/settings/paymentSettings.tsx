import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertCircle, Wallet } from 'lucide-react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/auth/authStore';

import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const PAYMENT_MUTATION = gql`
  mutation UpdateRenterProfile($ACHProfile: ACHProfileInput) {
    updateRenterProfile(ACHProfile: $ACHProfile) {
      ACHProfile {
        ACHRouting
        ACHAccount
      }
    }
  }
`;

type UpdateRenterProfileProp = {
  updateRenterProfile: {
    ACHProfile: {
      ACHRouting?: number | string | undefined;
      ACHAccount?: number | string | undefined;
    };
  };
};

// Profile form schema
const paymentSchema = z.object({
  accountNumber: z
    .string()
    .min(6, { message: 'Account number must be between 6-17 digits' })
    .max(17, { message: 'Account number must be between 6-17 digits' }),
  routingNumber: z.string().min(9, { message: 'Routing number must be 9 digits' }),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export function PaymentSettings() {
  const { user, updateUser } = useAuthStore();

  console.log('User ACH Profile:', user?.ACHProfile);

  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [hasPaymentChanges, setHasPaymentChanges] = useState(false);

  const [paymentMutation] = useMutation<UpdateRenterProfileProp>(PAYMENT_MUTATION);

  // Profile form
  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      accountNumber: user?.ACHProfile?.ACHAccount as string,
      routingNumber: user?.ACHProfile?.ACHRouting as string,
    },
  });

  console.log('Payment Form Values:', paymentForm.getValues());

  // Track payment form changes
  useEffect(() => {
    const subscription = paymentForm.watch((value) => {
      const hasChanged =
        value.accountNumber !== user?.ACHProfile.ACHAccount ||
        value.routingNumber !== user?.ACHProfile.ACHRouting;
      setHasPaymentChanges(hasChanged);
    });
    return () => subscription.unsubscribe();
  }, [paymentForm, user]);

  const onPaymentSubmit = async (data: PaymentFormValues) => {
    setIsPaymentLoading(true);
    setPaymentError('');
    setPaymentSuccess(false);

    try {
      const { data: result } = await paymentMutation({
        variables: {
          ACHProfile: {
            ACHAccount: data.accountNumber,
            ACHRouting: data.routingNumber,
          },
        },
      });

      if (result?.updateRenterProfile) {
        updateUser({
          ...user?.tenantInfo,
          ACHProfile: {
            ACHAccount: data.accountNumber,
            ACHRouting: data.routingNumber,
          },
        });

        setPaymentSuccess(true);
        setHasPaymentChanges(false);
      }

      setTimeout(() => setPaymentSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setPaymentError('Update failed. Please try again later.');
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Wallet className='h-5 w-5' />
          Payment Information
        </CardTitle>
        <CardDescription>Update your ACH details</CardDescription>
      </CardHeader>
      <CardContent>
        {paymentSuccess && (
          <Alert className='mb-6 bg-green-50 border-green-200'>
            <CheckCircle2 className='h-4 w-4 text-green-600' />
            <AlertDescription className='text-green-800'>
              Payment updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {paymentError && (
          <Alert className='mb-6 bg-red-50 border-red-200'>
            <AlertCircle className='h-4 w-4 text-red-600' />
            <AlertDescription className='text-red-800'>{paymentError}</AlertDescription>
          </Alert>
        )}

        <Form {...paymentForm}>
          <div className='space-y-4'>
            <FormField
              control={paymentForm.control}
              name='accountNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number *</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='0123456789123456' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={paymentForm.control}
              name='routingNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routing Number *</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='123456789' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end'>
              <Button
                type='button'
                onClick={paymentForm.handleSubmit(onPaymentSubmit)}
                disabled={isPaymentLoading || !hasPaymentChanges}
              >
                {isPaymentLoading ? (
                  <span className='flex items-center'>
                    <span className='animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full'></span>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}

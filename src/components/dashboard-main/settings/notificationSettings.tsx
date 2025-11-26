import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bell, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuthStore } from '@/auth/authStore';

const NOTIFICATION_MUTATION = gql`
  mutation UpdateRenterProfile($notificationPreferences: String!) {
    updateRenterProfile(notificationPreferences: $notificationPreferences) {
      notificationPreferences
    }
  }
`;

type NotificationProps = {
  updateRenterProfile: {
    notificationPreferences: string;
  };
};

const notificationSchema = z.object({
  mode: z.enum(['Email', 'SMS']),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

export function NotificationSettings() {
  const { user, updateUser } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [notificationPref] = useMutation<NotificationProps>(NOTIFICATION_MUTATION);

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      mode: 'Email',
    },
  });

  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: NotificationFormValues) => {
    setIsLoading(true);
    setSuccess(false);

    try {
      const { data: result } = await notificationPref({
        variables: { notificationPreferences: data.mode },
      });

      if (result?.updateRenterProfile) {
        updateUser({
          ...user?.tenantInfo,
          notificationPreferences: data.mode,
        });

        setSuccess(true);
        setHasChanges(false);
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Bell className='h-5 w-5' />
          Notification Preferences
        </CardTitle>
        <CardDescription>Select how you want to be notified</CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className='mb-6 bg-green-50 border-green-200'>
            <CheckCircle2 className='h-4 w-4 text-green-600' />
            <AlertDescription className='text-green-800'>
              Notification preferences updated successfully!
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='mode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Choose Notification Method</FormLabel>
                  <FormDescription>You can only select one option</FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className='space-y-3 mt-2'
                    >
                      <div className='flex items-center space-x-3 border rounded-lg p-3'>
                        <RadioGroupItem value='Email' id='email' />
                        <label htmlFor='email'>Email</label>
                      </div>

                      <div className='flex items-center space-x-3 border rounded-lg p-3'>
                        <RadioGroupItem value='SMS' id='sms' />
                        <label htmlFor='sms'>SMS</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className='flex justify-end'>
              <Button
                type='button'
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading || !hasChanges}
              >
                {isLoading ? (
                  <span className='flex items-center'>
                    <span className='animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full'></span>
                    Saving...
                  </span>
                ) : (
                  'Save Preferences'
                )}
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}

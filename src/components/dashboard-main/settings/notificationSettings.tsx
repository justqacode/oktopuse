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
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/auth/authStore';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const NOTIFICATION_MUTATION = gql`
  mutation UpdateRenterProfile($oldPassword: String!, $password: String!) {
    updateRenterProfile(oldPassword: $oldPassword, password: $password) {
      id
      firstName
      lastName
      email
      role
    }
  }
`;

// Notification preferences schema
const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

export function NotificationSettings() {
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState(false);
  const [hasNotificationChanges, setHasNotificationChanges] = useState(false);

  const [notificationMutation] = useMutation(NOTIFICATION_MUTATION);

  // Notification form
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
    },
  });

  // Track notification form changes
  useEffect(() => {
    const subscription = notificationForm.watch(() => {
      setHasNotificationChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [notificationForm]);

  const onNotificationSubmit = async (data: NotificationFormValues) => {
    setIsNotificationLoading(true);
    setNotificationSuccess(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would make your actual API call:
      // const response = await fetch('/api/user/notifications', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId: user.id, ...data }),
      // });

      // console.log('Notification Preferences:', { userId: user?.id, ...data });

      setNotificationSuccess(true);
      setHasNotificationChanges(false);

      setTimeout(() => setNotificationSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating notifications:', error);
    } finally {
      setIsNotificationLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Bell className='h-5 w-5' />
          Notification Preferences
        </CardTitle>
        <CardDescription>Manage how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent>
        {notificationSuccess && (
          <Alert className='mb-6 bg-green-50 border-green-200'>
            <CheckCircle2 className='h-4 w-4 text-green-600' />
            <AlertDescription className='text-green-800'>
              Notification preferences updated successfully!
            </AlertDescription>
          </Alert>
        )}

        <Form {...notificationForm}>
          <div className='space-y-4'>
            <FormField
              control={notificationForm.control}
              name='emailNotifications'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Email Notifications</FormLabel>
                    <FormDescription>Receive notifications via email</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={notificationForm.control}
              name='smsNotifications'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>SMS Notifications</FormLabel>
                    <FormDescription>Receive notifications via text message</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className='flex justify-end'>
              <Button
                type='button'
                onClick={notificationForm.handleSubmit(onNotificationSubmit)}
                disabled={isNotificationLoading || !hasNotificationChanges}
              >
                {isNotificationLoading ? (
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

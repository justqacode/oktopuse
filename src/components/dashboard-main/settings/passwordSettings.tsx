import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Bell, CheckCircle2, AlertCircle, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/auth/authStore';

import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const PASSWORD_MUTATION = gql`
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

// Password form schema
const passwordSchema = z
  .object({
    oldPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    newPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function PasswordSettings() {
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [passwordMutation] = useMutation(PASSWORD_MUTATION);

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess(false);

    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would make your actual API call:
      // const response = await fetch('/api/user/password', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: user.id,
      //     oldPassword: data.oldPassword,
      //     newPassword: data.newPassword
      //   }),
      // });

      // console.log('Password Change Data:', {
      //   userId: user?.id,
      //   oldPassword: '***',
      //   newPassword: '***',
      // });

      const { data: result } = await passwordMutation({
        variables: {
          oldPassword: data.oldPassword,
          password: data.newPassword,
        },
      });

      if (result) {
        setPasswordSuccess(true);
        passwordForm.reset();
      }

      // setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Update failed. Please try again later.');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Lock className='h-5 w-5' />
          Change Password
        </CardTitle>
        <CardDescription>Update your password to keep your account secure</CardDescription>
      </CardHeader>
      <CardContent>
        {passwordSuccess && (
          <Alert className='mb-6 bg-green-50 border-green-200'>
            <CheckCircle2 className='h-4 w-4 text-green-600' />
            <AlertDescription className='text-green-800'>
              Password changed successfully!
            </AlertDescription>
          </Alert>
        )}

        {passwordError && (
          <Alert className='mb-6 bg-red-50 border-red-200'>
            <AlertCircle className='h-4 w-4 text-red-600' />
            <AlertDescription className='text-red-800'>{passwordError}</AlertDescription>
          </Alert>
        )}

        <Form {...passwordForm}>
          <div className='space-y-4'>
            <FormField
              control={passwordForm.control}
              name='oldPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password *</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={passwordForm.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password *</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password *</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end'>
              <Button
                type='button'
                onClick={passwordForm.handleSubmit(onPasswordSubmit)}
                disabled={isPasswordLoading}
              >
                {isPasswordLoading ? (
                  <span className='flex items-center'>
                    <span className='animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full'></span>
                    Changing...
                  </span>
                ) : (
                  'Change Password'
                )}
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}

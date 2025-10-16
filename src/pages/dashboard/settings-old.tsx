import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock, Bell, CheckCircle2, AlertCircle, Wallet } from 'lucide-react';
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

const PROFILE_MUTATION = gql`
  mutation UpdateRenterProfile($firstName: String!, $lastName: String!, $phone: String!) {
    updateRenterProfile(firstName: $firstName, lastName: $lastName, phone: $phone) {
      id
      firstName
      lastName
      email
      role
    }
  }
`;

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

// Profile form schema
const profileSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  address: z.string().optional(),
});

// Profile form schema
const paymentSchema = z.object({
  accountNumber: z
    .string()
    .min(6, { message: 'Account number is required' })
    .max(17, { message: 'Account number must be between 9-17 digits' }),
  routingNumber: z.string().min(9, { message: 'Routing number is required' }),
});

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

// Notification preferences schema
const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PaymentFormValues = z.infer<typeof paymentSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type NotificationFormValues = z.infer<typeof notificationSchema>;

// Mock user data - replace with useAuthStore
const mockUser = {
  id: '68',
  email: 'email@email.com',
  firstName: 'Freeman',
  lastName: 'notFail',
  phone: '9065218409',
  role: 'tenant',
  address: '123 Main Street, Apt 4B',
};

const getRoleDisplay = (role: string) => {
  const roleMap: Record<string, string> = {
    tenant: 'Tenant',
    landlord: 'Landlord',
    manager: 'Property Manager/Agent',
    // agent: 'Property Manager/Agent',
  };
  return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
};

export default function Settings() {
  const { user } = useAuthStore();
  // const user = mockUser;

  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [hasProfileChanges, setHasProfileChanges] = useState(false);
  const [hasPaymentChanges, setHasPaymentChanges] = useState(false);
  const [hasNotificationChanges, setHasNotificationChanges] = useState(false);

  const [profileMutation] = useMutation(PROFILE_MUTATION);
  const [passwordMutation] = useMutation(PASSWORD_MUTATION);

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  });

  // Profile form
  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      accountNumber: user?.accountNumber || '',
      routingNumber: user?.routingNumber || '',
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Notification form
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
    },
  });

  // Track profile form changes
  useEffect(() => {
    const subscription = profileForm.watch((value) => {
      const hasChanged =
        value.firstName !== user?.firstName ||
        value.lastName !== user?.lastName ||
        value.email !== user?.email ||
        value.phone !== user?.phone ||
        value.address !== user?.address;
      setHasProfileChanges(hasChanged);
    });
    return () => subscription.unsubscribe();
  }, [profileForm, user]);

  // Track notification form changes
  useEffect(() => {
    const subscription = notificationForm.watch(() => {
      setHasNotificationChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [notificationForm]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsProfileLoading(true);
    setProfileError('');
    setProfileSuccess(false);

    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would make your actual API call:
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId: user?.id, ...data }),
      // });

      // console.log('Profile Update Data:', { userId: user?.id, ...data });
      const { data: result } = await profileMutation({
        variables: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
      });

      if (result) {
        setProfileSuccess(true);
        setHasProfileChanges(false);
      }

      // setTimeout(() => setProfileSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError('Update failed. Please try again later.');
    } finally {
      setIsProfileLoading(false);
    }
  };

  const onPaymentSubmit = async (data: PaymentFormValues) => {
    setIsPaymentLoading(true);
    setPaymentError('');
    setPaymentSuccess(false);

    try {
      // console.log('Payment Update Data:', { userId: user?.id, ...data });
      const { data: result } = await profileMutation({
        variables: {
          accountNumber: data.accountNumber,
          routingNumber: data.routingNumber,
        },
      });

      if (result) {
        setPaymentSuccess(true);
        setHasPaymentChanges(false);
      }

      // setTimeout(() => setPaymentSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setPaymentError('Update failed. Please try again later.');
    } finally {
      setIsPaymentLoading(false);
    }
  };

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
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <div className='space-y-6'>
              {/* Header */}
              <div>
                <h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
                <p className='text-muted-foreground'>
                  Manage your account settings and preferences
                </p>
              </div>

              {/* Profile Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <User className='h-5 w-5' />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profileSuccess && (
                    <Alert className='mb-6 bg-green-50 border-green-200'>
                      <CheckCircle2 className='h-4 w-4 text-green-600' />
                      <AlertDescription className='text-green-800'>
                        Profile updated successfully!
                      </AlertDescription>
                    </Alert>
                  )}

                  {profileError && (
                    <Alert className='mb-6 bg-red-50 border-red-200'>
                      <AlertCircle className='h-4 w-4 text-red-600' />
                      <AlertDescription className='text-red-800'>{profileError}</AlertDescription>
                    </Alert>
                  )}

                  <Form {...profileForm}>
                    <div className='space-y-4'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormField
                          control={profileForm.control}
                          name='firstName'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name='lastName'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name='email'
                        disabled
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type='email' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name='phone'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input type='tel' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <FormLabel>Role</FormLabel>
                        <Input
                          value={getRoleDisplay(
                            Array.isArray(user?.role) ? user?.role[0] ?? '' : user?.role ?? ''
                          )}
                          disabled
                          className='bg-muted cursor-not-allowed'
                        />
                        <p className='text-sm text-muted-foreground mt-2'>
                          Your role cannot be changed
                        </p>
                      </div>

                      <FormField
                        control={profileForm.control}
                        name='address'
                        disabled
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='flex justify-end'>
                        <Button
                          type='button'
                          onClick={profileForm.handleSubmit(onProfileSubmit)}
                          disabled={isProfileLoading || !hasProfileChanges}
                        >
                          {isProfileLoading ? (
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

              {/* Payment Information Card */}
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
                      <AlertDescription className='text-red-800'>{profileError}</AlertDescription>
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
                              <Input {...field} />
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
                              <Input {...field} />
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

              {/* Change Password Card */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Lock className='h-5 w-5' />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
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

              {/* Notification Preferences Card */}
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
                              <FormDescription>
                                Receive notifications via text message
                              </FormDescription>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

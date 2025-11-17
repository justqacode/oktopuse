import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, CheckCircle2, AlertCircle } from 'lucide-react';
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

type UpdateRenterProfileProp = {
  updateRenterProfile: {
    firstName: string;
    lastName: string;
    tenantInfo: {
      ACHProfile: {
        ACHRouting?: number | string | undefined;
        ACHAccount?: number | string | undefined;
      };
    };
  };
};

// Profile form schema
const profileSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const getRoleDisplay = (role: string) => {
  const roleMap: Record<string, string> = {
    tenant: 'Tenant',
    landlord: 'Landlord',
    manager: 'Property Manager/Agent',
    // agent: 'Property Manager/Agent',
  };
  return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
};

export function ProfileSettings() {
  const { user, updateUser } = useAuthStore();

  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [hasProfileChanges, setHasProfileChanges] = useState(false);

  const [profileMutation] = useMutation<UpdateRenterProfileProp>(PROFILE_MUTATION);

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

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsProfileLoading(true);
    setProfileError('');
    setProfileSuccess(false);

    try {
      const { data: result } = await profileMutation({
        variables: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
      });

      if (result?.updateRenterProfile) {
        updateUser({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        });
        setProfileSuccess(true);
        setHasProfileChanges(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError('Update failed. Please try again later.');
    } finally {
      setIsProfileLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <User className='h-5 w-5' />
          Profile Information
        </CardTitle>
        <CardDescription>Update your personal information and contact details</CardDescription>
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
              <p className='text-sm text-muted-foreground mt-2'>Your role cannot be changed</p>
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
  );
}

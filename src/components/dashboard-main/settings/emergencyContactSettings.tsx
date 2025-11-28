import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertCircle, Phone } from 'lucide-react';
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

const EMERGENCY_MUTATION = gql`
  mutation UpdateRenterProfile($emergencyContact: EmergencyContactInput) {
    updateRenterProfile(emergencyContact: $emergencyContact) {
      emergencyContact {
        name
        relationship
        phone
      }
    }
  }
`;

type EmergencyProps = {
  updateRenterProfile: {
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
};

const emergencySchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  relationship: z.string().min(2, { message: 'Relationship is required' }),
  phone: z.string().min(10, { message: 'Enter a valid phone number' }),
});

type EmergencyFormValues = z.infer<typeof emergencySchema>;

export function EmergencySettings() {
  const { user, updateUser } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const [updateEmergency] = useMutation<EmergencyProps>(EMERGENCY_MUTATION);

  const form = useForm<EmergencyFormValues>({
    resolver: zodResolver(emergencySchema),
    defaultValues: {
      name: user?.emergencyContact?.name || '',
      relationship: user?.emergencyContact?.relationship || '',
      phone: user?.emergencyContact?.phone || '',
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      const changed =
        value.name !== user?.emergencyContact?.name ||
        value.relationship !== user?.emergencyContact?.relationship ||
        value.phone !== user?.emergencyContact?.phone;
      setHasChanges(changed);
    });
    return () => subscription.unsubscribe();
  }, [form, user]);

  const onSubmit = async (data: EmergencyFormValues) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { data: result } = await updateEmergency({
        variables: {
          emergencyContact: {
            name: data.name,
            relationship: data.relationship,
            phone: data.phone,
          },
        },
      });

      if (result?.updateRenterProfile?.emergencyContact) {
        updateUser({
          ...user,
          emergencyContact: data,
        });

        setSuccess(true);
        setHasChanges(false);
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error('Error updating emergency contact:', e);
      setError('Update failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Phone className='h-5 w-5' />
          Emergency Contact
        </CardTitle>
        <CardDescription>Update your emergency contact details</CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className='mb-6 bg-green-50 border-green-200'>
            <CheckCircle2 className='h-4 w-4 text-green-600' />
            <AlertDescription className='text-green-800'>
              Emergency contact updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className='mb-6 bg-red-50 border-red-200'>
            <AlertCircle className='h-4 w-4 text-red-600' />
            <AlertDescription className='text-red-800'>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder='Full name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='relationship'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship *</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g. Sister, Father' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone *</FormLabel>
                  <FormControl>
                    <Input placeholder='0123456789' {...field} />
                  </FormControl>
                  <FormMessage />
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

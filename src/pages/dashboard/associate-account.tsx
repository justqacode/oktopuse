import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertCircle, Phone, LandPlot } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const ASSOCIATE_MUTATION = gql`
  mutation associateUserWithProperty($userId: String!, $propertyId: String!, $role: String!) {
    associateUserWithProperty(userID: $userId, propertyID: $propertyId, role: $role) {
      success
      message
    }
  }
`;

type AssociateProps = {
  associateUserWithProperty: {
    associateUserWithProperty: {
      role: string;
      propertyId: string;
      userId: string;
    };
  };
};

const associateSchema = z.object({
  role: z.string().min(2, { message: 'Name is required' }),
  userId: z.string().min(2, { message: 'Relationship is required' }),
  propertyId: z.string().min(10, { message: 'Enter a valid PropertyId number' }),
});

type AssociateFormValues = z.infer<typeof associateSchema>;

export default function AssociateAccount() {
  const { user, updateUser } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const [associateProperty] = useMutation<AssociateProps>(ASSOCIATE_MUTATION);

  const form = useForm<AssociateFormValues>({
    resolver: zodResolver(associateSchema),
    defaultValues: {
      role: user?.emergencyContact?.name || '',
      userId: user?.emergencyContact?.userId || '',
      propertyId: user?.emergencyContact?.propertyId || '',
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      const changed =
        value.role !== user?.emergencyContact?.role ||
        value.userId !== user?.emergencyContact?.userId ||
        value.propertyId !== user?.emergencyContact?.propertyId;
      setHasChanges(changed);
    });
    return () => subscription.unsubscribe();
  }, [form, user]);

  const onSubmit = async (data: AssociateFormValues) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { data: result } = await associateProperty({
        variables: {
          role: data.role,
          userId: data.userId,
          propertyId: data.propertyId,
        },
      });
      toast.success('Account associated successfully!');

      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error('Error updating emergency contact:', e);
      setError('Update failed. Please try again later.');
    } finally {
      setIsLoading(false);
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
                <h1 className='text-3xl font-bold tracking-tight'>Associate Account</h1>
                <p className='text-muted-foreground'>
                  Manage account associations and linked profiles
                </p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <LandPlot className='h-5 w-5' />
                    Associate Landlord with Property
                  </CardTitle>
                  {/* <CardDescription>Update your emergency contact details</CardDescription> */}
                </CardHeader>
                <CardContent>
                  {success && (
                    <Alert className='mb-6 bg-green-50 border-green-200'>
                      <CheckCircle2 className='h-4 w-4 text-green-600' />
                      <AlertDescription className='text-green-800'>
                        Account associated successfully!
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
                        name='role'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select a Role' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='landlord'>Landlord</SelectItem>
                                <SelectItem value='tenant'>Tenant</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='userId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User Email or Id *</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter existing account email' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='propertyId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Proprty name or Id *</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter property name or ID' {...field} />
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
                            'Associate Property'
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

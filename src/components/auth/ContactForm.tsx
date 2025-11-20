import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from './schemas';
import { LifeBuoy } from 'lucide-react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';

const CONTACT_MUTATION = gql`
  mutation Contact(
    $firstName: String!
    $lastName: String!
    $email: String!
    $phone: String!
    $message: String!
  ) {
    contact(
      firstName: $firstName
      lastName: $lastName
      email: $email
      phone: $phone
      message: $message
    ) {
      id
      firstName
      lastName
      email
    }
  }
`;

type ContactProps = {
  contact: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [contactMutation] = useMutation<ContactProps>(CONTACT_MUTATION);

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setSuccess(false);

    try {
      const { data: result } = await contactMutation({
        variables: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          message: data.message,
        },
      });

      if (result) {
        toast.success('Contact request sent successfully');
        setSuccess(true);
        form.reset();
      }
    } catch (error: any) {
      // console.error('Registration failed:', error.message);
      toast.error(`Registration failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
      {/* Success Message */}
      {success && (
        <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
          <p className='text-green-800 text-sm'>Your request was sent successfully</p>
        </div>
      )}

      {/* First Name */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>First Name</label>
        <input
          {...form.register('firstName')}
          type='text'
          placeholder='Enter your first name'
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
        />
        {form.formState.errors.firstName && (
          <p className='text-red-500 text-xs mt-1'>{form.formState.errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Last Name</label>
        <input
          {...form.register('lastName')}
          type='text'
          placeholder='Enter your last name'
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
        />
        {form.formState.errors.lastName && (
          <p className='text-red-500 text-xs mt-1'>{form.formState.errors.lastName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
        <input
          {...form.register('email')}
          type='email'
          placeholder='Enter your email'
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
        />
        {form.formState.errors.email && (
          <p className='text-red-500 text-xs mt-1'>{form.formState.errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Phone</label>
        <input
          {...form.register('phone')}
          type='tel'
          placeholder='Enter your phone number'
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
        />
        {form.formState.errors.phone && (
          <p className='text-red-500 text-xs mt-1'>{form.formState.errors.phone.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Message</label>
        <textarea
          {...form.register('message')}
          // type='email'
          placeholder='Enter your message'
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
        />
        {form.formState.errors.email && (
          <p className='text-red-500 text-xs mt-1'>{form.formState.errors.email.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type='submit'
        disabled={isLoading}
        className='w-full bg-primary hover:bg-blue-500 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2'
      >
        {isLoading ? (
          <>
            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <LifeBuoy className='w-4 h-4' />
            <span>Submit</span>
          </>
        )}
      </button>
    </form>
  );
};

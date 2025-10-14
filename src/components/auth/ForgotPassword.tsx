import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from './schemas';
import { Eye, EyeOff, LogIn, Check } from 'lucide-react';
import type z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/auth/authStore';
import { useState } from 'react';
import { Button } from '../ui/button';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';

type FormValues = z.infer<typeof forgotPasswordSchema>;

const FORGOTPASSWORD_MUTATION = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      email
    }
  }
`;

// "query": "mutation RequestPasswordReset($email: String!) { requestPasswordReset(email: $email) { resetToken } }",
// "variables": {
//     "email": "babsam480@gmail.com"
// }

export const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [forgotPasswordMutation] = useMutation(FORGOTPASSWORD_MUTATION);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setSuccess(false);

    try {
      const { data: result } = await forgotPasswordMutation({
        variables: {
          email: data.email,
        },
      });

      // console.log('Registration successful:', result);
      toast.success('Request sent successfully! Check your email');
      setSuccess(true);
      form.reset();
    } catch (error: any) {
      // console.error('Registration failed:', error.message);
      toast.error(`Request failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
      {/* Email */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
        <div className='relative'>
          <input
            {...form.register('email')}
            type='email'
            placeholder='you@example.com'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
          />
          {/* <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
            <Check className='w-5 h-5 text-green-500' />
          </div> */}
        </div>
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
            <span>Sending request...</span>
          </>
        ) : (
          <>
            <LogIn className='w-4 h-4' />
            <span>Continue</span>
          </>
        )}
      </button>
    </form>
  );
};

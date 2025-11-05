import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { resetPasswordSchema } from './schemas';
import { Button } from '../ui/button';

// ✅ GraphQL mutation
const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($resetToken: String!, $newPassword: String!) {
    resetPassword(resetToken: $resetToken, newPassword: $newPassword)
  }
`;

export const ResetPasswordAfterForgetForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL
  const searchParams = new URLSearchParams(location.search);
  const resetToken = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [resetPasswordMutation] = useMutation(RESET_PASSWORD_MUTATION);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '' },
  });

  const onSubmit = async (values: { password: string }) => {
    setIsLoading(true);
    try {
      await resetPasswordMutation({
        variables: {
          resetToken,
          newPassword: values.password,
        },
      });

      toast.success('Password reset successful');
      form.reset();
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
      {/* Password Field */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>New Password</label>
        <div className='relative'>
          <input
            {...form.register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter your new password'
            className='w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
          />
          <button
            type='button'
            onClick={() => setShowPassword((prev) => !prev)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
          >
            {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className='text-red-500 text-xs mt-1'>{form.formState.errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type='submit'
        disabled={isLoading}
        className='w-full bg-primary hover:bg-blue-500 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2'
      >
        {isLoading ? (
          <>
            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
            <span>Resetting...</span>
          </>
        ) : (
          <>
            <LogIn className='w-4 h-4' />
            <span>Continue</span>
          </>
        )}
      </Button>
    </form>
  );
};

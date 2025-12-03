import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from './schemas';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import type z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/auth/authStore';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RESEND_VERIFY_MUTATION, type ResendVerifyAccountProps } from '@/pages/Verify';
import { useMutation } from '@apollo/client/react';

type FormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [resendVerifyMutation] = useMutation<ResendVerifyAccountProps>(RESEND_VERIFY_MUTATION);

  console.log('User after login attempt:', user);
  console.log('Verification status:', user?.verificationStatus);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const resendVerificationEmail = async (email: string) => {
    try {
      const res = await resendVerifyMutation({ variables: { token: email } });
      if (res?.data?.resendVerification?.success) {
        toast.success('Verification link resent successfully.');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to resend verification link.');
    }
  };

  useEffect(() => {
    if (user && user.verificationStatus === false) {
      toast.warning('You need to verify your account!', {
        classNames: {
          toast: 'flex-col !items-start ',
          actionButton: ' !justify-start mt-2',
        },
        description: 'Click on the button below to resend the verification email.',
        action: {
          label: <div>Resend Verification Email</div>,
          onClick: () => {
            resendVerificationEmail(user.email);
          },
        },
        duration: 8000,
      });
    }
  }, [user]);

  const onSubmit = async (data: FormValues) => {
    await login(data.email, data.password, navigate);
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

      {/* Password */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
        <div className='relative'>
          <input
            {...form.register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder='••••••••'
            className='w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
          >
            {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className='text-red-500 text-xs mt-1'>{form.formState.errors.password.message}</p>
        )}
      </div>

      {/* Forgot Password */}
      <div className='flex justify-end'>
        <div className='text-sm bg-transparent text-blue-600 hover:text-blue-800 font-medium'>
          <Link to='/forgotpassword'>Forgot password?</Link>
        </div>
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
            <span>Signing in...</span>
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

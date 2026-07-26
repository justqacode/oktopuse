import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from './schemas';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import type z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, type User } from '@/auth/authStore';
import { useState } from 'react';
import { toast } from 'sonner';
// import { RESEND_VERIFY_MUTATION, type ResendVerifyAccountProps } from '@/pages/Verify';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useIP } from '@/hooks/user-ip';

const LOGIN_MUTATION = gql`
  mutation Login($ipa: String, $ua: String, $email: String!, $password: String!) {
    login(ipa: $ipa, ua: $ua, email: $email, password: $password) {
      token
    }
  }
`;

type FormValues = z.infer<typeof loginSchema>;
type LoginMutationResponse = {
  login: {
    token: string;
    user: User;
  };
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const { setToken } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  // const [resendVerifyMutation] = useMutation<ResendVerifyAccountProps>(RESEND_VERIFY_MUTATION);
  const [loginMutation, { loading: isLoading }] =
    useMutation<LoginMutationResponse>(LOGIN_MUTATION);

  const userAgent = navigator.userAgent || 'N/A';

  const ip = useIP();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormValues) => {
    // await login(data.email, data.password, ip, userAgent, navigate);

    try {
      const { data: result } = await loginMutation({
        variables: { email: data.email, password: data.password, ipa: ip, ua: userAgent },
      });

      if (result) {
        toast.success('Please check your email account for the authentication code');
        form.reset();

        // Persist token in zustand (and localStorage via persist middleware)
        setToken(result.login.token);
        navigate('/2fa');
      }
    } catch (error: any) {
      // toast.error(`Login failed: ${error.message}`);
      toast('Login failed. Please try again with the correct credentials or contact support for assistance.', {
        className: '!bg-red-600 !text-white !font-bold  !text-[14px]',
        duration: 10000,
      });
    }
  };

  // const resendVerificationEmail = async (email: string) => {
  //   try {
  //     const res = await resendVerifyMutation({ variables: { token: email } });
  //     if (res?.data?.resendVerification?.success) {
  //       toast.success('Verification link resent successfully.');
  //     }
  //   } catch (e) {
  //     toast.error(e instanceof Error ? e.message : 'Failed to resend verification link.');
  //   }
  // };

  // useEffect(() => {
  //   if (user && user.verificationStatus === false) {
  //     toast.warning('You need to verify your account!', {
  //       classNames: {
  //         toast: 'flex-col !items-start ',
  //         actionButton: ' !justify-start mt-2'
  //       },
  //       description: 'Click on the button below to resend the verification email.',
  //       action: {
  //         label: <div>Resend Verification Email</div>,
  //         onClick: () => {
  //           resendVerificationEmail(user.email);
  //         },
  //       },
  //       duration: 8000,
  //     });
  //   }
  // }, [user]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
      {/* Email */}
      <div>
        <label className='block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5'>Email Address</label>
        <div className='relative'>
          <input
            {...form.register('email')}
            type='email'
            placeholder='you@example.com'
            className='w-full px-4 py-2.5 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary/35 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/60 text-sm'
          />
        </div>
        {form.formState.errors.email && (
          <p className='text-destructive text-xs mt-1'>{form.formState.errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className='block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5'>Password</label>
        <div className='relative'>
          <input
            {...form.register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder='••••••••'
            className='w-full px-4 py-2.5 pr-12 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary/35 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/60 text-sm'
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
          >
            {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className='text-destructive text-xs mt-1'>{form.formState.errors.password.message}</p>
        )}
      </div>

      {/* Forgot Password */}
      <div className='flex justify-end'>
        <div className='text-xs text-primary hover:text-primary-hover font-semibold transition-colors duration-200'>
          <Link to='/forgotpassword'>Forgot password?</Link>
        </div>
      </div>

      {/* Submit */}
      <button
        type='submit'
        disabled={isLoading}
        className='sams-btn w-full mt-2'
      >
        {isLoading ? (
          <>
            <div className='w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2'></div>
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <LogIn className='w-4 h-4 mr-2' />
            <span>Continue</span>
          </>
        )}
      </button>
    </form>
  );
};

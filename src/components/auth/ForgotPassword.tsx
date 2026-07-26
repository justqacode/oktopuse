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
      resetToken
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

      if (result) {
        toast.success('Request sent successfully! Check your email');
        setSuccess(true);
        form.reset();
      }
    } catch (error: any) {
      // console.error('Registration failed:', error.message);
      toast.error(`Request failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Submit */}
      <button
        type='submit'
        disabled={isLoading}
        className='sams-btn w-full mt-2'
      >
        {isLoading ? (
          <>
            <div className='w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2'></div>
            <span>Sending request...</span>
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

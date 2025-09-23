import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from './schemas';
import { Eye, EyeOff, LogIn, Check } from 'lucide-react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
// import { useNavigate } from 'react-router-dom';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        firstName
        lastName
        email
        phone
        role
      }
    }
  }
`;

export const LoginForm = () => {
  // const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //  const [mutate, { data, loading, error}] = useMutation(LOGIN_MUTATION)
  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // const [loginMutation] = useMutation(LOGIN_MUTATION);

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const { data: result } = await loginMutation({
        variables: {
          email: data.email,
          password: data.password,
        },
      });

      console.log(result);
    } catch (error: any) {
      console.error('Login failed:', error.message);
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
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
            <Check className='w-5 h-5 text-green-500' />
          </div>
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
        <button type='button' className='text-sm text-blue-600 hover:text-blue-800 font-medium'>
          Forgot password?
        </button>
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

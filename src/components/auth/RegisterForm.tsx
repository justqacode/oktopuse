import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from './schemas';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', agreeToTerms: false },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Register data:', data);
      setIsLoading(false);
      //   alert('Registration successful!');
    }, 1000);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
      {/* Name */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
        <input
          {...form.register('name')}
          type='text'
          placeholder='Enter your name'
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
        />
        {form.formState.errors.name && (
          <p className='text-red-500 text-xs mt-1'>{form.formState.errors.name.message}</p>
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

      {/* Password */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
        <div className='relative'>
          <input
            {...form.register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter your password'
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

      {/* Terms */}
      <div className='flex items-start space-x-2'>
        <input
          {...form.register('agreeToTerms')}
          type='checkbox'
          id='agreeToTerms'
          className='mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
        />
        <label htmlFor='agreeToTerms' className='text-sm text-gray-700'>
          I agree to all the{' '}
          <button type='button' className='text-blue-600 hover:text-blue-800 font-medium underline'>
            Terms & Conditions
          </button>
        </label>
      </div>
      {form.formState.errors.agreeToTerms && (
        <p className='text-red-500 text-xs'>{form.formState.errors.agreeToTerms.message}</p>
      )}

      {/* Submit */}
      <button
        type='submit'
        disabled={isLoading}
        className='w-full bg-primary hover:bg-blue-500 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2'
      >
        {isLoading ? (
          <>
            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
            <span>Creating account...</span>
          </>
        ) : (
          <>
            <UserPlus className='w-4 h-4' />
            <span>Sign up</span>
          </>
        )}
      </button>
    </form>
  );
};

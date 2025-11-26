import { useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from './schemas';
import { Eye, EyeOff, UserPlus, Check, X } from 'lucide-react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const REGISTER_MUTATION = gql`
  mutation Register(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $phone: String!
    $role: String!
  ) {
    register(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      phone: $phone
      role: $role
    ) {
      id
      firstName
      lastName
      email
      role
    }
  }
`;

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [registerMutation] = useMutation(REGISTER_MUTATION);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      role: '',
      agreeToTerms: false,
    },
  });

  const passwordChecks = {
    minLength: passwordValue.length >= 9,
    hasUppercase: /[A-Z]/.test(passwordValue),
    hasLowercase: /[a-z]/.test(passwordValue),
    hasNumber: /[0-9]/.test(passwordValue),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue),
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setSuccess(false);

    try {
      const { data: result } = await registerMutation({
        variables: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phone: data.phone,
          role: data.role,
        },
      });

      // console.log('Registration successful:', result);
      if (result) {
        toast.success(
          'Your registration was successful! Please navigate to your email account to confirm and complete the registration.'
        );
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

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setPasswordValue(value);
    form.setValue('password', value);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
      {/* Success Message */}
      {success && (
        <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
          <p className='text-green-800 text-sm'>
            Your registration was successful! Please navigate to your email account to confirm and
            complete the registration.
          </p>
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

      {/* Password */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
        <div className='relative'>
          <input
            {...form.register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter your password'
            value={passwordValue}
            onChange={handlePasswordChange}
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

        {/* Password Requirements Checklist */}
        {passwordValue && (
          <div className='mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200'>
            <p className='text-xs font-medium text-gray-700 mb-2'>Password requirements:</p>
            <div className='space-y-1'>
              <div className='flex items-center space-x-2'>
                {passwordChecks.minLength ? (
                  <Check className='w-4 h-4 text-green-600' />
                ) : (
                  <X className='w-4 h-4 text-gray-400' />
                )}
                <span
                  className={`text-xs ${
                    passwordChecks.minLength ? 'text-green-600' : 'text-gray-600'
                  }`}
                >
                  Minimum 9 characters
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                {passwordChecks.hasUppercase ? (
                  <Check className='w-4 h-4 text-green-600' />
                ) : (
                  <X className='w-4 h-4 text-gray-400' />
                )}
                <span
                  className={`text-xs ${
                    passwordChecks.hasUppercase ? 'text-green-600' : 'text-gray-600'
                  }`}
                >
                  One uppercase letter (A–Z)
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                {passwordChecks.hasLowercase ? (
                  <Check className='w-4 h-4 text-green-600' />
                ) : (
                  <X className='w-4 h-4 text-gray-400' />
                )}
                <span
                  className={`text-xs ${
                    passwordChecks.hasLowercase ? 'text-green-600' : 'text-gray-600'
                  }`}
                >
                  One lowercase letter (a–z)
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                {passwordChecks.hasNumber ? (
                  <Check className='w-4 h-4 text-green-600' />
                ) : (
                  <X className='w-4 h-4 text-gray-400' />
                )}
                <span
                  className={`text-xs ${
                    passwordChecks.hasNumber ? 'text-green-600' : 'text-gray-600'
                  }`}
                >
                  One number (0–9)
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                {passwordChecks.hasSpecial ? (
                  <Check className='w-4 h-4 text-green-600' />
                ) : (
                  <X className='w-4 h-4 text-gray-400' />
                )}
                <span
                  className={`text-xs ${
                    passwordChecks.hasSpecial ? 'text-green-600' : 'text-gray-600'
                  }`}
                >
                  One special character (!@#$%^&* etc.)
                </span>
              </div>
            </div>
          </div>
        )}

        {form.formState.errors.password && (
          <p className='text-red-500 text-xs mt-1'>{form.formState.errors.password.message}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Role</label>
        <select
          {...form.register('role')}
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
        >
          <option value=''>--Select an option--</option>
          <option value='tenant'>Tenant</option>
          <option value='landlord'>Landlord</option>
          <option value='manager'>Property Manager</option>
        </select>
        {form.formState.errors.role && (
          <p className='text-red-500 text-xs mt-1'>{form.formState.errors.role.message}</p>
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
          {/* <Button
            type='button'
            asChild
            className='text-blue-600 hover:text-blue-800 font-medium underline'
          > */}
          <Link to='/terms' target='_blank' className='underline text-blue-600 hover:text-blue-800'>
            Terms and Conditions
          </Link>
          {/* </Button> */}
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

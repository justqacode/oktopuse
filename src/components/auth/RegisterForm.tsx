import { useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from './schemas';
import { Eye, EyeOff, UserPlus, Check, X, Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { Link, useParams } from 'react-router-dom';

const REGISTER_MUTATION = gql`
  mutation Register(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $phone: String!
    $role: [String!]!
    $referredBy: String
    $smsOptIn: Boolean
    $emailOptIn: Boolean
  ) {
    register(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      phone: $phone
      role: $role
      referredBy: $referredBy
      smsOptIn: $smsOptIn
      emailOptIn: $emailOptIn
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
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [emailOptIn, setEmailOptIn] = useState(false);
  const [registerMutation] = useMutation(REGISTER_MUTATION);

  const { '*': param } = useParams();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      role: [],
      referredBy: param || '',
      agreeToTerms: false,
    },
  });

  const phoneValue = form.watch('phone');

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
          referredBy: data.referredBy,
          role: data.role,
          smsOptIn,
          emailOptIn,
        },
      });

      // console.log('Registration successful:', result);
      if (result) {
        toast.success(
          'Your registration was successful! Please navigate to your email account to confirm and complete the registration.',
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
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
      {/* Success Message */}
      {success && (
        <div className='bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4'>
          <p className='text-emerald-500 text-sm'>
            Your registration was successful! Please navigate to your email account to confirm and
            complete the registration.
          </p>
        </div>
      )}

      {/* First Name */}
      <div>
        <label className='block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5'>First Name</label>
        <input
          {...form.register('firstName')}
          type='text'
          placeholder='Enter your first name'
          className='w-full px-4 py-2.5 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary/35 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/60 text-sm'
        />
        {form.formState.errors.firstName && (
          <p className='text-destructive text-xs mt-1'>{form.formState.errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className='block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5'>Last Name</label>
        <input
          {...form.register('lastName')}
          type='text'
          placeholder='Enter your last name'
          className='w-full px-4 py-2.5 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary/35 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/60 text-sm'
        />
        {form.formState.errors.lastName && (
          <p className='text-destructive text-xs mt-1'>{form.formState.errors.lastName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className='block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5'>Email</label>
        <input
          {...form.register('email')}
          type='email'
          placeholder='Enter your email'
          className='w-full px-4 py-2.5 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary/35 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/60 text-sm'
        />
        {form.formState.errors.email && (
          <p className='text-destructive text-xs mt-1'>{form.formState.errors.email.message}</p>
        )}

        <div className='flex items-center gap-2.5 mt-2.5'>
          <input
            type='checkbox'
            id='emailOptIn'
            checked={emailOptIn}
            onChange={(e) => setEmailOptIn(e.target.checked)}
            className='w-4 h-4 rounded border-border text-primary focus:ring-primary/35 cursor-pointer bg-background'
          />
          <label htmlFor='emailOptIn' className='text-xs text-muted-foreground cursor-pointer select-none font-medium'>
            Opt-in to receive email notifications for this account
          </label>
        </div>
      </div>

      {/* Phone */}
      <div>
        <div className='flex items-center gap-1.5 mb-1.5'>
          <label className='block text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Phone</label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className='w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors' />
            </TooltipTrigger>
            <TooltipContent>
              <p className='text-xs'>You will receive verification codes for your account <br></br>via SMS if you opt-in to SMS notifications.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <input
          {...form.register('phone')}
          type='tel'
          placeholder='2704389566'
          maxLength={10}
          onKeyDown={(e) => {
            const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
            if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
              e.preventDefault();
            }
          }}
          className='w-full px-4 py-2.5 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary/35 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/60 text-sm'
        />
        {phoneValue && phoneValue.length > 0 && phoneValue.length < 10 && !form.formState.errors.phone && (
          <p className='text-amber-500 text-xs mt-1 flex items-center gap-1'>
            <span>⚠</span>
            <span>{phoneValue.length}/10 digits — must be exactly 10</span>
          </p>
        )}
        {form.formState.errors.phone && (
          <p className='text-destructive text-xs mt-1'>{form.formState.errors.phone.message}</p>
        )}

        {/* SMS Opt-in */}
        <div className='flex items-center gap-2.5 mt-2.5'>
          <input
            type='checkbox'
            id='smsOptIn'
            checked={smsOptIn}
            onChange={(e) => setSmsOptIn(e.target.checked)}
            className='w-4 h-4 rounded border-border text-primary focus:ring-primary/35 cursor-pointer bg-background'
          />
          <label htmlFor='smsOptIn' className='text-xs text-muted-foreground cursor-pointer select-none font-medium'>
            Opt-in to receive SMS notifications for this account
          </label>
        </div>
      </div>

      {/* Password */}
      <div>
        <label className='block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5'>Password</label>
        <div className='relative'>
          <input
            {...form.register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter your password'
            value={passwordValue}
            onChange={handlePasswordChange}
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

        {/* Password Requirements Checklist */}
        {passwordValue && (
          <div className='mt-3 p-3 bg-muted/40 rounded-lg border border-border/50'>
            <p className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2'>Password requirements:</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-1.5'>
              <div className='flex items-center space-x-2'>
                {passwordChecks.minLength ? (
                  <Check className='w-3.5 h-3.5 text-emerald-500' />
                ) : (
                  <X className='w-3.5 h-3.5 text-muted-foreground/60' />
                )}
                <span
                  className={`text-xs ${passwordChecks.minLength ? 'text-emerald-500 font-medium' : 'text-muted-foreground'
                    }`}
                >
                  Minimum 9 characters
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                {passwordChecks.hasUppercase ? (
                  <Check className='w-3.5 h-3.5 text-emerald-500' />
                ) : (
                  <X className='w-3.5 h-3.5 text-muted-foreground/60' />
                )}
                <span
                  className={`text-xs ${passwordChecks.hasUppercase ? 'text-emerald-500 font-medium' : 'text-muted-foreground'
                    }`}
                >
                  One uppercase letter (A–Z)
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                {passwordChecks.hasLowercase ? (
                  <Check className='w-3.5 h-3.5 text-emerald-500' />
                ) : (
                  <X className='w-3.5 h-3.5 text-muted-foreground/60' />
                )}
                <span
                  className={`text-xs ${passwordChecks.hasLowercase ? 'text-emerald-500 font-medium' : 'text-muted-foreground'
                    }`}
                >
                  One lowercase letter (a–z)
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                {passwordChecks.hasNumber ? (
                  <Check className='w-3.5 h-3.5 text-emerald-500' />
                ) : (
                  <X className='w-3.5 h-3.5 text-muted-foreground/60' />
                )}
                <span
                  className={`text-xs ${passwordChecks.hasNumber ? 'text-emerald-500 font-medium' : 'text-muted-foreground'
                    }`}
                >
                  One number (0–9)
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                {passwordChecks.hasSpecial ? (
                  <Check className='w-3.5 h-3.5 text-emerald-500' />
                ) : (
                  <X className='w-3.5 h-3.5 text-muted-foreground/60' />
                )}
                <span
                  className={`text-xs ${passwordChecks.hasSpecial ? 'text-emerald-500 font-medium' : 'text-muted-foreground'
                    }`}
                >
                  One special character
                </span>
              </div>
            </div>
          </div>
        )}

        {form.formState.errors.password && (
          <p className='text-destructive text-xs mt-1'>{form.formState.errors.password.message}</p>
        )}
      </div>

      {/* Role Selection */}
      <div className='space-y-2'>
        <label className='block text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Role</label>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-2.5'>
          {[
            { value: 'tenant', label: 'Tenant' },
            { value: 'landlord', label: 'Landlord' },
            { value: 'manager', label: 'Manager' },
          ].map(({ value, label }) => (
            <label
              key={value}
              className='flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border bg-card
          hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-all duration-200
          has-[:checked]:border-primary has-[:checked]:bg-primary/5 shadow-xs'
            >
              <input
                type='checkbox'
                value={value}
                {...form.register('role')}
                className='w-4 h-4 rounded border-border text-primary
            focus:ring-primary/35 cursor-pointer bg-background'
              />
              <span className='text-xs font-semibold text-foreground select-none'>{label}</span>
            </label>
          ))}
        </div>

        {form.formState.errors.role && (
          <p className='flex items-center gap-1 text-destructive text-xs mt-1'>
            <span aria-hidden='true'>⚠</span>
            {form.formState.errors.role.message as string}
          </p>
        )}
      </div>

      {/* Referral */}
      <div>
        <label className='block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5'>Referral Code</label>
        <input
          {...form.register('referredBy')}
          type='text'
          placeholder='Enter your referral code (optional)'
          className='w-full px-4 py-2.5 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary/35 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/60 text-sm'
        />
        {form.formState.errors.referredBy && (
          <p className='text-destructive text-xs mt-1'>{form.formState.errors.referredBy.message}</p>
        )}
      </div>

      {/* Terms */}
      <div className='flex items-start space-x-2.5 pt-1'>
        <input
          {...form.register('agreeToTerms')}
          type='checkbox'
          id='agreeToTerms'
          className='mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary/35 cursor-pointer bg-background'
        />
        <label htmlFor='agreeToTerms' className='text-xs text-muted-foreground font-medium cursor-pointer select-none'>
          I agree to the{' '}
          <Link to='/terms' target='_blank' className='underline text-primary hover:text-primary-hover font-semibold transition-colors'>
            Terms and Conditions
          </Link>
        </label>
      </div>
      {form.formState.errors.agreeToTerms && (
        <p className='text-destructive text-xs mt-1'>{form.formState.errors.agreeToTerms.message}</p>
      )}

      {/* Submit */}
      <button
        type='submit'
        disabled={isLoading}
        className='sams-btn w-full mt-4'
      >
        {isLoading ? (
          <>
            <div className='w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2'></div>
            <span>Creating account...</span>
          </>
        ) : (
          <>
            <UserPlus className='w-4 h-4 mr-2' />
            <span>Sign up</span>
          </>
        )}
      </button>
    </form>
  );
};

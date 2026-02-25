import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { Control, UseFormSetValue } from 'react-hook-form';
import { gql } from '@apollo/client';
import { useAuthStore } from '@/auth/authStore';

export const MFA_MUTATION = gql`
  mutation MFA($mfaCode: String!) {
    MFAlogin(mfaCode: $mfaCode) {
      token
      user {
        id
        oktoID
        firstName
        lastName
        email
        phone
        role
        verificationStatus
        notificationPreferences
        emergencyContact {
          name
          phone
          relationship
        }
        ACHProfile {
          ACHRouting
          ACHAccount
        }
        managerInfo {
          managerID
          companyName
          companyAddress
          propertyManagerEmail
          propertyManagerName
          propertyManagerPhone
        }
        landlordInfo {
          ownerID
          ownedProperties
        }
        tenantInfo {
          propertyId
          leaseStartDate
          leaseEndDate
          rentAmount
          balanceDue
          paymentFrequency
          rentalAddress
          rentAmount
          rentalZip
          rentalState
          rentalCity
        }
      }
    }
  }
`;

const CODE_LENGTH = 6;

export const verifySchema = z.object({
  verificationCode: z.string().length(CODE_LENGTH, `Code must be ${CODE_LENGTH} characters`),
  // .regex(/^[A-Z0-9]+$/, 'Code must contain only capital letters and numbers'),
});

export type VerifyFormValues = z.infer<typeof verifySchema>;

export type MFALoginResponse = {
  MFAlogin: {
    token: string;
    user: {
      id: string;
      oktoID: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      role: string | string[];
      verificationStatus: string;
      notificationPreferences: any;
      emergencyContact: {
        name: string;
        phone: string;
        relationship: string;
      };
      ACHProfile: {
        ACHRouting: string;
        ACHAccount: string;
      };
      managerInfo: {
        managerID: string;
        companyName: string;
        companyAddress: string;
      };
      landlordInfo: {
        ownerID: string;
        ownedProperties: any[];
      };
      tenantInfo: {
        propertyId: string;
        leaseStartDate: string;
        leaseEndDate: string;
        rentAmount: number;
        balanceDue: number;
        paymentFrequency: string;
        rentalAddress: string;
        rentalZip: string;
        rentalState: string;
        rentalCity: string;
      };
    };
  };
};

const VerificationCodeInput = ({
  control,
  setValue,
  name,
}: {
  control: Control<VerifyFormValues>;
  setValue: UseFormSetValue<VerifyFormValues>;
  name: 'verificationCode';
}) => {
  const [values, setValues] = useState(Array(CODE_LENGTH).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;

    const capitalizedValue = value.toUpperCase();

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    // Update form value immediately
    setValue(name, newValues.join(''), { shouldValidate: true });

    // Auto-focus next input if value was entered
    if (capitalizedValue && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();

      if (values[index]) {
        // Clear current input if it has a value
        const newValues = [...values];
        newValues[index] = '';
        setValues(newValues);
        setValue(name, newValues.join(''), { shouldValidate: true });
      } else if (index > 0) {
        // Move to previous input and clear it if current is empty
        const newValues = [...values];
        newValues[index - 1] = '';
        setValues(newValues);
        setValue(name, newValues.join(''), { shouldValidate: true });
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    // Get pasted content and extract only digits
    const pasted = e.clipboardData
      .getData('text')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase();

    if (pasted.length === 0) return;

    // Fill the inputs with the pasted digits (up to CODE_LENGTH)
    const newValues = Array(CODE_LENGTH).fill('');
    const digitsToUse = pasted.slice(0, CODE_LENGTH);

    for (let i = 0; i < digitsToUse.length; i++) {
      newValues[i] = digitsToUse[i];
    }

    setValues(newValues);
    setValue(name, newValues.join(''), { shouldValidate: true });

    // Focus the next empty input or the last filled one
    setTimeout(() => {
      if (digitsToUse.length >= CODE_LENGTH) {
        // If all boxes are filled, focus the last one
        inputsRef.current[CODE_LENGTH - 1]?.focus();
      } else {
        // Otherwise focus the next empty box
        inputsRef.current[digitsToUse.length]?.focus();
      }
    }, 0);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select the content when focusing for easier editing
    e.target.select();
  };

  return (
    <div className='space-y-2'>
      <FormLabel>Enter verification code</FormLabel>
      <div className='flex gap-2 justify-center'>
        {values.map((val, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            type='text'
            inputMode='numeric'
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={handlePaste}
            onFocus={handleFocus}
            className='w-8 h-8 sm:w-12 sm:h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            autoComplete='off'
          />
        ))}
      </div>
    </div>
  );
};

export const Verification2FA = () => {
  const navigate = useNavigate();
  const { mfaLogin, isLoading: mfaLoading, user } = useAuthStore();
  // const [mfaMutation, { loading: mfaLoading }] = useMutation<MFALoginResponse>(MFA_MUTATION);

  const veriForm = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      verificationCode: '',
    },
  });

  const onSubmit = async (data: VerifyFormValues) => {
    const capify = data.verificationCode.toUpperCase();
    await mfaLogin(capify, navigate);
  };

  return (
    <div className='max-w-md mx-auto p-6'>
      <Form {...veriForm}>
        <form onSubmit={veriForm.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={veriForm.control}
            name='verificationCode'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <VerificationCodeInput
                    control={veriForm.control}
                    setValue={veriForm.setValue}
                    name='verificationCode'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' disabled={mfaLoading} className='w-full'>
            {mfaLoading ? 'Verifying...' : 'Verify'}
          </Button>
        </form>
      </Form>

      <div className='mt-8'>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-300' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-white text-gray-500'>Send another token in 10:00 mins</span>
          </div>
        </div>
      </div>
    </div>
  );
};

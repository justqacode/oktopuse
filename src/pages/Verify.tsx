import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Spinner } from '@/components/ui/spinner';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const VERIFY_MUTATION = gql`
  mutation Verify($token: String!) {
    verifyAccount(token: $token) {
      id
      firstName
      lastName
      email
      phone
      role
    }
  }
`;

type VerifyAccountProps = {
  verifyAccount: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
  };
};

export const RESEND_VERIFY_MUTATION = gql`
  mutation ResendVerification($token: String!) {
    resendVerification(token: $token) {
      success
      message
    }
  }
`;

export type ResendVerifyAccountProps = {
  resendVerification: {
    success: boolean;
    message: string;
  };
};

export const Verify = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const [verifyMutation] = useMutation<VerifyAccountProps>(VERIFY_MUTATION);
  const [resendVerifyMutation] = useMutation<ResendVerifyAccountProps>(RESEND_VERIFY_MUTATION);
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const [apiMessage, setApiMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    async function fetchVerify() {
      try {
        const res = await verifyMutation({ variables: { token } });
        const data = res?.data?.verifyAccount;

        if (data) {
          setState('success');
          timer = setTimeout(() => navigate('/login'), 2500);
        } else {
          setState('error');
        }
      } catch (e) {
        if (e instanceof Error) {
          // console.log('Verification error:', e.message);
          setApiMessage(e.message);
        } else {
          // console.log('Verification error:', e);
          setApiMessage(
            'Something went wrong. Please register your account or attempt a password reset.',
          );
        }
        setState('error');
      }
    }

    fetchVerify();
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleResendLink = async () => {
    try {
      const res = await resendVerifyMutation({ variables: { token } });
      const data = res?.data?.resendVerification;

      if (data?.success) {
        toast.success(data.message || 'Verification link resent successfully.');
      } else {
        toast.error(data?.message || 'Failed to resend verification link.');
      }
    } catch (e) {
      toast.error('Failed to resend verification link.');
    }
  };

  const renderErrorActions = () => {
    switch (apiMessage) {
      case 'User not found':
        return (
          <Link
            to='/register'
            className='text-sm px-3 py-2 bg-black text-white rounded-md hover:bg-blue-400/70'
          >
            Go to Register
          </Link>
        );

      case 'Something went wrong. Please register your account or attempt a password reset.':
        return (
          <Link
            to='/register'
            className='text-sm px-3 py-2 bg-black text-white rounded-md hover:bg-blue-400/70'
          >
            Go to Register
          </Link>
        );

      case 'Account already verified.':
        return (
          <Link
            to='/login'
            className='text-sm px-3 py-2 bg-black text-white rounded-md hover:bg-blue-400/70'
          >
            Go to Login
          </Link>
        );

      case 'Something went wrong. Please reset your password to get a new verification email.':
        return (
          <Link
            to='/forgot-password'
            className='text-sm px-3 py-2 bg-black text-white rounded-md hover:bg-blue-400/70'
          >
            Reset Password
          </Link>
        );

      case 'A new verification email has been successfully sent.':
        return (
          <p className='text-sm text-green-700'>
            A new verification email has been successfully sent.
          </p>
        );

      default:
        return (
          <button
            onClick={handleResendLink}
            className='px-2 py-2 rounded-md bg-black hover:bg-blue-400/70 text-white text-sm'
          >
            Resend verification link
          </button>
        );
    }
  };

  return (
    <div className='w-full h-dvh flex justify-center items-center pt-6'>
      <div className='flex w-full max-w-xs flex-col gap-4 [--radius:1rem]'>
        {state === 'loading' && (
          <Item variant='muted'>
            <ItemMedia>
              <Spinner />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className='line-clamp-1'>
                Please wait while we verify your email...
              </ItemTitle>
            </ItemContent>
          </Item>
        )}

        {state === 'success' && (
          <div className='text-center p-4 bg-green-100 text-green-800 rounded-md'>
            <p>Email verified successfully!</p>
            <p className='text-xs mt-2'>Redirecting...</p>
          </div>
        )}

        {state === 'error' && (
          <div className='flex flex-col gap-4 text-center p-4 bg-red-100 text-red-800 rounded-md'>
            <p>{apiMessage}</p>
            {renderErrorActions()}
            <Link to='/' className='text-xs hover:underline'>
              Back to home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

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

const RESEND_VERIFY_MUTATION = gql`
  mutation ResendVerification($token: String!) {
    resendVerification(token: $token) {
      success
      message
    }
  }
`;

type ResendVerifyAccountProps = {
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

  useEffect(() => {
    // let timer: ReturnType<typeof setTimeout>;

    async function fetchVerify() {
      try {
        const res = await verifyMutation({
          variables: { token },
        });

        if (res?.data?.verifyAccount?.email) {
          setState('success');
          // timer = setTimeout(() => navigate('/login'), 2500);
        } else {
          setState('error');
          // timer = setTimeout(() => navigate('/register'), 8000);
        }
      } catch (e) {
        setState('error');
        // timer = setTimeout(() => navigate('/register'), 8000);
      }
    }

    fetchVerify();
    // return () => {
    //   clearTimeout(timer);
    // };
  }, []);

  const handleResendLink = async () => {
    try {
      const res = await resendVerifyMutation({ variables: { token } });
      if (res?.data?.resendVerification?.success) {
        toast.success('Verification link resent successfully.');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to resend verification link.');
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
            <p>Your link is invalid or has expired.</p>
            <button
              onClick={handleResendLink}
              className='px-2 py-2 rounded-md bg-black hover:bg-blue-400/70 text-white text-sm'
            >
              Resend verification link
            </button>
            <Link to='/' className='text-xs hover:underline '>
              Back to home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

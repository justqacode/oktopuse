import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Spinner } from '@/components/ui/spinner';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// const REGISTER_MUTATION = gql`
//   mutation Register(
//     $firstName: String!
//     $lastName: String!
//     $email: String!
//     $password: String!
//     $phone: String!
//     $role: String!
//   ) {
//     register(
//       firstName: $firstName
//       lastName: $lastName
//       email: $email
//       password: $password
//       phone: $phone
//       role: $role
//     ) {
//       id
//       firstName
//       lastName
//       email
//       role
//     }
//   }
// `;

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

// {
//   "query": "mutation verifyAccount($token: String!) { verifyAccount(token: $token) { id firstName lastName email phone role } }",
//   "variables": {
//     "token": "true"
//   }
// }

export const Verify = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const [verifyMutation] = useMutation(VERIFY_MUTATION);
  const [resp, setResp] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVerify() {
      let res = await verifyMutation({
        variables: {
          token,
        },
      });

      setResp(res);
    }

    fetchVerify();
  }, []);

  useEffect(() => {
    if (!!resp?.data?.verifyAccount?.email) {
      toast.success('Email verified successfully!');
      navigate('/login');
    } else {
      toast.error('Verification failed!', {
        description: 'Your link is invalid or has expired.',
        action: {
          label: 'Resend verification link',
          onClick: () => console.log('Undo'),
        },
        duration: 5000,
      });
      navigate('/login');
    }
  }, [resp]);

  return (
    <div className='w-full h-dvh flex justify-center items-center pt-6'>
      <div className='flex w-full max-w-xs flex-col gap-4 [--radius:1rem]'>
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
      </div>
    </div>
  );
};

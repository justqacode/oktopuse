import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_PROPERTY = gql`
  query GetProperty($id: ID!) {
    property(id: $id) {
      id
      name
      address {
        street
        city
        state
        zip
      }
      amount
      description
      images
      ownerID
      createdAt
    }
  }
`;

export const Home = () => {
  const { data, loading, error } = useQuery(GET_PROPERTY, {
    variables: { id: '68cd55761d1285352ee0219e' }, // replace with actual ID
  });

  if (loading) console.log('Loading property...');
  if (error) console.error('GraphQL Error:', error);
  if (data) console.log('GraphQL result:', data);

  return (
    <div className='w-full h-dvh flex justify-center items-center pt-6'>
      <p>Here is home</p>
    </div>
  );
};

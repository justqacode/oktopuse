import { DataTable } from '@/components/data-table';
import { rentHistoryColumn } from './columns';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useAuthStore } from '@/auth/authStore';

const sampleData = [
  {
    id: 1,
    header: '20-09-2024',
    type: 'Executive Summary',
    status: 'paid',
  },
  {
    id: 2,
    header: '20-09-2024',
    type: 'Technical Approach',
    status: 'pending',
  },
  {
    id: 3,
    header: '20-09-2024',
    type: 'Design',
    status: 'overdue',
  },
];

const GET_PAYMENT_HISTORY = gql`
  query GetPaymentHistoryByTenant {
    getPaymentHistoryByTenantID {
      _id
      propertyID
      tenantID
      amount
      date
      rentForMonth
      note
      status
      paymentMethod
      purpose
    }
  }
`;

// const GET_PAYMENT_HISTORY = gql`
//   query GetPaymentHistoryByTenant($tenantID: ID!) {
//     getPaymentHistoryByTenantID(tenantID: $tenantID) {
//       _id
//       propertyID
//       tenantID
//       amount
//       date
//       rentForMonth
//       note
//     }
//   }
// `;

export default function RentHistory() {
  const { user } = useAuthStore();
  // console.log(user);
  const { data, loading, error } = useQuery(GET_PAYMENT_HISTORY, {
    // variables: { tenantID: user?.id },
    // variables: { tenantID: '68ccdee49efe164572477f50' },
    // skip: !user?.id,
    fetchPolicy: 'cache-and-network',
  });

  if (loading) console.log('Loading property...');
  if (error) console.error('GraphQL Error:', error);
  if (data) console.log('GraphQL result:', data);
  return (
    <DataTable
      columns={rentHistoryColumn}
      data={sampleData}
      enablePagination
      enableSorting
      enableFiltering
      pageSize={5}
    />
  );
}

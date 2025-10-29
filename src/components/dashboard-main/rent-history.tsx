import { DataTable } from '@/components/data-table';
import { rentHistoryColumn } from './columns';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { useEffect } from 'react';
import formatDate from '@/utils/format-date';

interface PaymentHistoryItem {
  _id: string;
  propertyID?: string;
  tenantID?: string;
  amount?: number;
  date?: string;
  rentForMonth?: string;
  note?: string;
  status?: string;
  paymentMethod?: string;
  purpose?: string;
}

interface GetPaymentHistoryResult {
  getPaymentHistoryByTenantID: PaymentHistoryItem[];
}

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

export default function RentHistory() {
  const { data, refetch } = useQuery<GetPaymentHistoryResult>(GET_PAYMENT_HISTORY, {
    fetchPolicy: 'cache-and-network',
  });

  const { shouldRefetch, resetRefetch } = usePaymentStore();

  useEffect(() => {
    if (shouldRefetch) {
      refetch().then(() => {
        resetRefetch();
      });
    }
  }, [shouldRefetch, refetch, resetRefetch]);

  // if (loading) console.log('Loading property...');
  // if (error) console.error('GraphQL Error:', error);
  // if (data) console.log('GraphQL result:', data.getPaymentHistoryByTenantID);

  const rentHistoryData = data?.getPaymentHistoryByTenantID || [];
  const rentHistoryFormatted = rentHistoryData
    .slice()
    .reverse()
    .map((item) => ({
      id: item._id,
      date: formatDate(item.date),
      amount: item.amount || 0,
      rentForMonth: item.rentForMonth,
      status: item.status || 'pending',
      tenantId: item.tenantID,
      propertyId: item.propertyID,
    }));

  // const rentda = rentHistoryFormatted.slice().reverse();

  return (
    <DataTable
      columns={rentHistoryColumn}
      data={rentHistoryFormatted}
      enablePagination
      enableSorting
      enableFiltering
      pageSize={10}
    />
  );
}

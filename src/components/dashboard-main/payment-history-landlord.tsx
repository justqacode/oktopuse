import { DataTable } from '@/components/data-table';
import { paymentHistoryLandlordColumn } from './columns';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useAuthStore } from '@/auth/authStore';
import formatDate from '@/utils/format-date';

const GET_LANDLORD_RENT_PAYMENT_HISTORY = gql`
  query GetPaymentHistoryByLandLord {
    getPayHistoryByLandLord {
      _id
      owner
      status
      createdAt
      docLink
    }
  }
`;

export default function PaymentHistoryLandlord() {
  const { user } = useAuthStore();
  const { data, loading } = useQuery<any>(GET_LANDLORD_RENT_PAYMENT_HISTORY, {
    fetchPolicy: 'cache-and-network',
    // variables: { ownerID: '68ccdee49efe164572477f50' },
    variables: { ownerID: user?.id },
  });

  const paymentHistoryData = data?.getPayHistoryByLandLord || [];
  const paymentHistoryFormatted = paymentHistoryData.map((item: any) => ({
    id: '...' + item._id.slice(-6),
    date: formatDate(item.createdAt) || '',
    property: item.description || 'Sam says v2',
    tenant: item.description || 'Sam says v2',
    amount: item.amount || 'needs fix f Sam',
    method: item.paymentMethod || 'needs fix f Sam',
    status: item.status || 'N/A',
    statement: item.docLink || 'N/A',
  }));

  // console.log('paymentHistoryData n', paymentHistoryData);
  // console.log('paymentHistoryData', data);

  return (
    <DataTable
      columns={paymentHistoryLandlordColumn}
      data={paymentHistoryFormatted}
      // enableDragAndDrop
      // enableSelection
      enablePagination
      enableColumnVisibility
      enableSorting
      enableFiltering
      pageSize={5}
      loading={loading}
    />
  );
}

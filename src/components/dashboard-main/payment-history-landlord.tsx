import { DataTable } from '@/components/data-table';
import { paymentHistoryLandlordColumn } from './columns';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useAuthStore } from '@/auth/authStore';
import formatDate from '@/utils/format-date';
import { formatCurrency } from '@/utils/format-currency';

const GET_LANDLORD_RENT_PAYMENT_HISTORY = gql`
  query GetPaymentHistoryByLandLord {
    getPayHistoryByLandLord {
      _id
      status
      date
      amountReceived
      note
      docLink
    }
  }
`;

export default function PaymentHistoryLandlord() {
  const { user } = useAuthStore();
  const { data, loading } = useQuery<any>(GET_LANDLORD_RENT_PAYMENT_HISTORY, {
    fetchPolicy: 'cache-and-network',
    variables: { ownerID: user?.id },
  });

  const paymentHistoryData = data?.getPayHistoryByLandLord || [];
  const paymentHistoryFormatted = paymentHistoryData.map((item: any) => ({
    id: '...' + item._id.slice(-6),
    date: formatDate(item.date) || 'N/A',
    property: item.propertyDetails?.name || 'N/A',
    tenant: item.description || 'N/A',
    amount: formatCurrency(Number(item.amountReceived)) || 'N/A',
    method: item.paymentMethod || 'needs fix f Sam',
    status: item.status || 'N/A',
    statement: item.docLink || 'N/A',
  }));

  return (
    <DataTable
      columns={paymentHistoryLandlordColumn}
      data={paymentHistoryFormatted}
      enablePagination
      enableColumnVisibility
      enableSorting
      enableFiltering
      pageSize={10}
      loading={loading}
    />
  );
}

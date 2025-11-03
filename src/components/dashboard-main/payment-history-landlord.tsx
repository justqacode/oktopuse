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

  // const paymentHistoryData = data?.getPayHistoryByLandLord || [];
  // const maintenanceHistoryFormatted = paymentHistoryData.map((item: any) => ({
  //   id: '...' + item._id.slice(-6),
  //   date: formatDate(item.createdAt) || '',
  //   property: item.description.split(0, 22) || 0,
  //   tenant: item.description.split(0, 22) || 0,
  //   category: item.category,
  //   status: item.status || 'pending',
  // }));

  // console.log('paymentHistoryData', paymentHistoryData);
  console.log('paymentHistoryData', data);

  return (
    // <DataTable
    //   columns={paymentHistoryLandlordColumn}
    //   data={data}
    //   // enableDragAndDrop
    //   // enableSelection
    //   enablePagination
    //   enableColumnVisibility
    //   enableSorting
    //   enableFiltering
    //   pageSize={5}
    //   loading={loading}
    // />
    <div>Payment History Landlord Component - Work in Progress</div>
  );
}

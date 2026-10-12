import { DataTable } from '@/components/data-table';
import { useAuthStore } from '@/auth/authStore';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { paymentHistoryManagerColumn } from '@/components/dashboard-main/columns';
import formatDate from '@/utils/format-date';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format-currency';
import { useState } from 'react';
import { CreateRentHistoryDialog } from '@/components/dashboard-main/CreateRentHistoryDialog';

const GET_ALL_MANAGER_PAYMENTS = gql`
  query GetRentHistoryForManager {
    getRentHistoryForManager {
      _id
      status
      propertyID
      date
      amountReceived
      note
      paymentRef
      docLink
    }
  }
`;

export default function PaymentHistoryManager() {
  const { user } = useAuthStore();
  const [historyOpen, setHistoryOpen] = useState(false);
  const { data, loading, refetch } = useQuery<any>(GET_ALL_MANAGER_PAYMENTS, {
    fetchPolicy: 'cache-and-network',
    variables: { managerID: user?.id },
  });

  const rentHistoryData = data?.getRentHistoryForManager || [];
  const rentHistoryFormatted = rentHistoryData.map((item: any) => ({
    id: '...' + item._id.slice(-6),
    paymentRef: item.paymentRef,
    date: formatDate(item.date),
    amountReceived: formatCurrency(item.amountReceived) || 0,
    note: item.note?.split(0, 22) || 'N/A',
    docLink: item.docLink || 'N/A',
    status: item.status || 'pending',
  }));

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <div className='py-4 lg:py-6 px-8'>
            <div className='flex justify-between text-lg font-semibold mb-2'>
              <p>Payment History</p>
              <div className='flex gap-2'>
                <Button variant='outline' size='sm' onClick={() => setHistoryOpen(true)}>
                  Create rent history
                </Button>
                <Button
                  variant='default'
                  size='sm'
                  className='hidden sm:flex'
                  // onClick={() => console.log('pay landlord')}
                >
                  Pay landlord
                </Button>
              </div>
            </div>
            <DataTable
              columns={paymentHistoryManagerColumn}
              data={rentHistoryFormatted}
              enablePagination
              enableColumnVisibility
              enableSorting
              enableFiltering
              pageSize={10}
              loading={loading}
            />
            <CreateRentHistoryDialog
              open={historyOpen}
              onOpenChange={setHistoryOpen}
              onCreated={() => refetch()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

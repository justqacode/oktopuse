import { DataTable } from '@/components/data-table';
import { useAuthStore } from '@/auth/authStore';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { paymentHistoryManagerColumn, usersAdminColumn } from '@/components/dashboard-main/columns';
import formatDate from '@/utils/format-date';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format-currency';
import { usersAdminMockData } from '@/components/dashboard-main/chats';

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

export default function UsersPage() {
  const { user } = useAuthStore();
  const { data, loading } = useQuery<any>(GET_ALL_MANAGER_PAYMENTS, {
    fetchPolicy: 'cache-and-network',
    variables: { managerID: user?.id },
  });

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <div className='py-4 lg:py-6 px-8'>
            <div className='flex justify-between text-lg font-semibold mb-2'>
              <p>Registered Users</p>
              <Button
                variant='default'
                size='sm'
                className='hidden sm:flex'
                onClick={() => console.log('should be search')}
              >
                Should be search
              </Button>
            </div>
            <DataTable
              columns={usersAdminColumn}
              data={usersAdminMockData}
              enablePagination
              enableColumnVisibility
              enableSorting
              enableFiltering
              pageSize={10}
              loading={loading}
              emptyState='No registered users found.'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

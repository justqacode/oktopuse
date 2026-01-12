import { DataTable } from '@/components/data-table';
import { useAuthStore } from '@/auth/authStore';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { paymentHistoryManagerColumn, usersAdminColumn } from '@/components/dashboard-main/columns';
import { Button } from '@/components/ui/button';
import { usersAdminMockData } from '@/components/dashboard-main/chats';
import { useState } from 'react';

const GET_ALL_USERS_ADMIN = gql`
  query GetAllRegisteredUsers {
    getAllRegisteredUsers {
      firstName
      lastName
      email
      phone
      status
      verificationStatus
      role
      notificationPreferences
      createdAt
      updatedAt
    }
  }
`;

export default function UsersPage() {
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { data, loading } = useQuery<any>(GET_ALL_USERS_ADMIN, {
    fetchPolicy: 'cache-and-network',
  });
  const users = data?.getAllRegisteredUsers || [];

  console.log('Registered Users Data:', users);

  const handleStatusUpdate = async (maintenanceId: string, newStatus: string) => {
    // try {
    //   await updateMaintenanceStatus({
    //     variables: {
    //       requestID: maintenanceId,
    //       status: newStatus,
    //     },
    //   });
    // } catch (error) {
    //   // console.error('Failed to update status:', error);
    //   toast.error('Failed to update status. Please try again.');
    // }

    console.log(maintenanceId, newStatus);
  };

  const viewItem = (request: {}) => {
    setSelectedRequest(request);
    setPreviewOpen(true);
  };

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
              columns={usersAdminColumn(handleStatusUpdate, viewItem)}
              // data={usersAdminMockData}
              data={users}
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

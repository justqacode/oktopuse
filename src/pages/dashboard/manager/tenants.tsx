import { DataTable } from '@/components/data-table';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { usersAdminColumn } from '@/components/dashboard-main/columns';

import { useState } from 'react';

const GET_ALL_TENANTS_MANAGER = gql`
  query GetMyTenants {
    getMyTenants {
      firstName
      lastName
      email
      phone
      status
      verificationStatus
      role
      notificationPreferences
      oktoID
      createdAt
      updatedAt
      id
    }
  }
`;

export default function TenantPage() {
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('tenant');
  const [previewOpen, setPreviewOpen] = useState(false);
  const { data, loading } = useQuery<any>(GET_ALL_TENANTS_MANAGER, {
    fetchPolicy: 'cache-and-network',
  });
  const usersx = data?.getMyTenants || [];

  //   const filteredUsers = users.filter((usr) =>
  //   selectedRoles.length === 0
  //     ? true
  //     : usr.role?.some((r: string) => selectedRoles.includes(r))  // use original usr.role array
  // );

  // const users =
  //   usersx?.map((usr: any) => ({
  //     ...usr,
  //     role: usr.role.includes('tenant'),
  //   })) || [];

  // console.log('Registered Users Data:', users);

  const users =
    usersx
      ?.filter((usr: any) => (selectedRole === '' ? true : usr.role.includes(selectedRole)))
      ?.map((usr: any) => ({
        ...usr,
        role: usr.role?.[0] || '',
      })) || [];

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
    // console.log(maintenanceId, newStatus);
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
              <p>Registered Tenants</p>
              {/* <Button
                variant='default'
                size='sm'
                className='hidden sm:flex'
                onClick={() => console.log('should be search')}
              >
                Should be search
              </Button> */}
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

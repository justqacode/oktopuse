import { DataTable } from '@/components/data-table';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { usersTableColumnTenant } from '@/components/dashboard-main/columns';

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
  const [selectedRole, setSelectedRole] = useState<string>('tenant');
  const { data, loading } = useQuery<any>(GET_ALL_TENANTS_MANAGER, {
    fetchPolicy: 'cache-and-network',
  });
  const usersx = data?.getMyTenants || [];

  const users =
    usersx
      ?.filter((usr: any) => (selectedRole === '' ? true : usr.role.includes(selectedRole)))
      ?.map((usr: any) => ({
        ...usr,
        role: usr.role?.[0] || '',
      })) || [];

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
              columns={usersTableColumnTenant}
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

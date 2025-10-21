import { DataTable } from '@/components/data-table';
import { maintenanceRequestsColumn } from './columns';
import { Button } from '../ui/button';
import { IconPlus } from '@tabler/icons-react';
import MaintenanceRequestModal from './modals/maintenance-modal';
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useAuthStore } from '@/auth/authStore';

// {
//   "query": "query GetHistory($tenantID: ID!) { getMaintenanceHistoryByTenant(tenantID: $tenantID) { _id description status createdAt } }",
//   "variables": {
//     "tenantID": "68d68aacb92da2ce0d44e758"
//   }
// }

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

const GET_MAINTENANCE_HISTORY = gql`
  query GetHistory($tenantID: ID!) {
    getMaintenanceHistoryByTenant(tenantID: $tenantID) {
      _id
      description
      status
      createdAt
    }
  }
`;

export default function MaintenanceRequests() {
  const { user } = useAuthStore();
  const { data, loading, error } = useQuery(GET_MAINTENANCE_HISTORY, {
    variables: { tenantID: user?.id },
    // variables: { tenantID: '68ccdee49efe164572477f50' },
    // skip: !user?.id,
    fetchPolicy: 'cache-and-network',
  });

  if (loading) console.log('Loading property...');
  if (error) console.error('GraphQL Error:', error);
  if (data) console.log('GraphQL result:', data);

  return (
    <DataTable
      columns={maintenanceRequestsColumn}
      data={sampleData}
      enableDragAndDrop
      enableSelection
      enablePagination
      enableColumnVisibility
      enableSorting
      enableFiltering
      pageSize={5}
    />
  );
}

MaintenanceRequests.HeaderButton = function HeaderButton() {
  const [open, setOpen] = useState(false);
  const handleRequestMaintenance = () => {
    console.log('Request maintenance triggered from header!');
    setOpen(true);
  };

  return (
    <div className='flex gap-2'>
      <Button variant='outline' size='sm' onClick={handleRequestMaintenance}>
        <IconPlus /> Request Maintenance
      </Button>

      <MaintenanceRequestModal open={open} onOpenChange={setOpen} />
    </div>
  );
};

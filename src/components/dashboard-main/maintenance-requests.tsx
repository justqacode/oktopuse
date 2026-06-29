import { DataTable } from '@/components/data-table';
import { maintenanceRequestsColumn } from './columns';
import { Button } from '../ui/button';
import { IconPlus } from '@tabler/icons-react';
import MaintenanceRequestModal from './modals/maintenance-modal';
import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useAuthStore } from '@/auth/authStore';
import formatDate from '@/utils/format-date';
import { useMaintenanceStore } from '@/stores/useMaintenanceStore';
import MaintenanceRequestPreviewModal from './modals/maintenance-preview-modal';

const GET_MAINTENANCE_HISTORY = gql`
  query GetHistory($tenantID: ID!) {
    getMaintenanceHistoryByTenant(tenantID: $tenantID) {
      _id
      description
      status
      createdAt
      category
      preferedDateOfResolution
      preferedTimeOfResolution
      images
      canManagementAccess
      costOfRepair
    }
  }
`;

export default function MaintenanceRequests() {
  const { user } = useAuthStore();
  const { data, refetch, loading } = useQuery<any>(GET_MAINTENANCE_HISTORY, {
    fetchPolicy: 'cache-and-network',
    variables: { tenantID: user?.id },
  });
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { shouldRefetch, resetRefetch } = useMaintenanceStore();

  useEffect(() => {
    if (shouldRefetch) {
      refetch().then(() => {
        resetRefetch();
      });
    }
  }, [shouldRefetch, refetch, resetRefetch]);

  const maintenanceHistoryData = data?.getMaintenanceHistoryByTenant || [];
  const maintenanceHistoryFormatted = maintenanceHistoryData.map((item: any) => ({
    id: '...' + item._id.slice(-6),
    date: formatDate(item.createdAt) || '',
    description: item.description || '',
    category: item.category || 'N/A',
    status: item.status || 'pending',
    property: item,
  }));

  const viewItem = (request: {}) => {
    const requests = {
      property: request,
    };
    setSelectedRequest(requests);
    setPreviewOpen(true);
  };

  return (
    <>
      <DataTable
        columns={maintenanceRequestsColumn(viewItem)}
        data={maintenanceHistoryFormatted}
        enablePagination
        enableColumnVisibility
        enableSorting
        enableFiltering
        pageSize={10}
        loading={loading}
      />
      <MaintenanceRequestPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        requests={selectedRequest}
      />
    </>
  );
}

MaintenanceRequests.HeaderButton = function HeaderButton() {
  const [open, setOpen] = useState(false);
  const handleRequestMaintenance = () => {
    // console.log('Request maintenance triggered from header!');
    setOpen(true);
  };

  return (
    <div className='flex gap-2'>
      <Button variant='default' size='sm' onClick={handleRequestMaintenance}>
        <IconPlus /> Request Maintenance
      </Button>

      <MaintenanceRequestModal open={open} onOpenChange={setOpen} />
    </div>
  );
};

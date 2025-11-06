import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { maintenanceRequestsLandlordColumn } from './columns';
import type { LandlordRequest, ManagerRequest } from './types';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useAuthStore } from '@/auth/authStore';
import formatDate from '@/utils/format-date';
import MaintenanceRequestPreviewModal from './modals/maintenance-preview-modal';

const sampleData: ManagerRequest[] = [
  {
    id: 1,
    date: '20-09-2024',
    property: 'Mariot 43',
    tenant: 'Peter McMayers',
    category: 'Executive Summary',
    status: 'in-progress',
  },
  {
    id: 2,
    date: '20-09-2024',
    property: 'Mariot 43',
    tenant: 'Peter McMayers',
    category: 'Executive Summary',
    status: 'pending',
  },
  {
    id: 3,
    date: '20-09-2024',
    property: 'Mariot 43',
    tenant: 'Peter McMayers',
    category: 'Executive Summary',
    status: 'completed',
  },
  {
    id: 4,
    date: '20-09-2024',
    property: 'Mariot 43',
    tenant: 'Peter McMayers',
    category: 'Executive Summary',
    status: 'rejected',
  },
];

const GET_LANDLORD_MAINTENANCE_REQUESTS = gql`
  query GetMaintenanceHistoryByLandLord {
    getMaintenanceHistoryByLandLord {
      _id
      description
      status
      createdAt
      category
      images
      propertyDetails {
        name
        propertyType
        address {
          street
          city
          state
          zip
        }
      }
    }
  }
`;

export default function MaintenanceRequestsLandlord() {
  const { user } = useAuthStore();
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { data, loading } = useQuery<any>(GET_LANDLORD_MAINTENANCE_REQUESTS, {
    fetchPolicy: 'cache-and-network',
    // variables: { ownerID: '68ccdee49efe164572477f50' },
    variables: { ownerID: user?.id },
  });

  const maintenanceHistoryData = data?.getMaintenanceHistoryByLandLord || [];
  const maintenanceHistoryFormatted = maintenanceHistoryData.map((item: any) => ({
    id: '...' + item._id.slice(-6),
    date: formatDate(item.createdAt) || '',
    property: item.description.split(0, 22) || 0,
    tenant: item.description.split(0, 22) || 0,
    category: item.category,
    status: item.status || 'pending',
  }));

  const handleRowClick = (request: any) => {
    setSelectedRequest(request);
    setPreviewOpen(true);
  };

  return (
    <>
      <DataTable
        columns={maintenanceRequestsLandlordColumn}
        data={maintenanceHistoryFormatted}
        enablePagination
        enableColumnVisibility
        enableSorting
        enableFiltering
        pageSize={5}
        loading={loading}
        onRowClick={handleRowClick}
      />

      <MaintenanceRequestPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        request={selectedRequest}
      />
    </>
  );
}

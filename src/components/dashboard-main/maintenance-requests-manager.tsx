import { DataTable } from '@/components/data-table';
import { maintenanceRequestsManagerColumn } from './columns';
import type { ManagerRequest } from './types';
import { useAuthStore } from '@/auth/authStore';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

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

const GET_MANAGER_MAINTENANCE_REQUESTS = gql`
  query GetHistory($managerID: ID!) {
    getMaintenanceHistoryByManager(managerID: $managerID) {
      _id
      description
      status
      createdAt
    }
  }
`;

export default function MaintenanceRequestsManager() {
  const { user } = useAuthStore();
  const { data } = useQuery<any>(GET_MANAGER_MAINTENANCE_REQUESTS, {
    fetchPolicy: 'cache-and-network',
    // variables: { ownerID: '68ccdee49efe164572477f50' },
    variables: { managerID: user?.id },
  });

  // console.log('Landlord Maintenance Requests:', data);

  const maintenanceHistoryData = data?.getMaintenanceHistoryByLandLord || [];
  const maintenanceHistoryFormatted = maintenanceHistoryData.map((item: any) => ({
    id: item._id,
    date: item.createdAt,
    property: item.description.split(0, 22) || 0,
    tenant: item.description.split(0, 22) || 0,
    category: item._id,
    status: item.status || 'pending',
  }));
  return (
    <DataTable
      columns={maintenanceRequestsManagerColumn}
      data={maintenanceHistoryFormatted}
      // enableDragAndDrop
      // enableSelection
      enablePagination
      enableColumnVisibility
      enableSorting
      enableFiltering
      pageSize={5}
    />
  );
}

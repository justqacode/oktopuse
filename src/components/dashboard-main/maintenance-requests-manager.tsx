import { DataTable } from '@/components/data-table';
import { maintenanceRequestsManagerColumn } from './columns';
import type { ManagerRequest } from './types';

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

export default function MaintenanceRequestsManager() {
  return (
    <DataTable
      columns={maintenanceRequestsManagerColumn}
      data={sampleData}
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

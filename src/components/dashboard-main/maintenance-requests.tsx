import { DataTable } from '@/components/data-table';
import { maintenanceRequestsColumn, rentHistoryColumn } from './columns';

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

export default function MaintenanceRequests() {
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

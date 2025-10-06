import { DataTable } from '@/components/data-table';
import { maintenanceRequestsColumn, rentHistoryColumn } from './columns';
import { Button } from '../ui/button';
import { IconPlus } from '@tabler/icons-react';
import MaintenanceRequestModal from './modals/maintenance-modal';
import { useState } from 'react';

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

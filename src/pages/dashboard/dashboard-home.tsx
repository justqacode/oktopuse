import { SectionCards } from '@/components/section-cards';
import { IconCircleCheckFilled, IconLoader, IconPlus } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter';
import { DataTable } from '@/components/data-table';
import { TabsContent, TabsLayout } from '@/components/tab-layout';

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

const columns: ColumnDef<(typeof sampleData)[0]>[] = [
  {
    accessorKey: 'id',
    header: 'Payment ID',
    cell: ({ row }) => (
      <Button variant='link' className='text-foreground w-fit px-0 text-left'>
        {row.original.id}
      </Button>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'date',
    header: 'Payment Date',
    cell: ({ row }) => (
      <Button variant='link' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.header}
      </Button>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <Button variant='ghost' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.type}
      </Button>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant='outline' className='text-muted-foreground px-1.5'>
        {row.original.status === 'paid' ? (
          <IconCircleCheckFilled className='fill-green-500 dark:fill-green-400' />
        ) : (
          <IconLoader />
        )}
        {capitalizeFirstLetter(row.original.status)}
      </Badge>
    ),
  },
];

// Example 1: With Tabs
const tabs = [
  { value: 'rent-history', label: 'Rent History' },
  { value: 'maintenance-requests', label: 'Maintenance Request' },
  { value: 'lease-documents', label: 'Lease Documents', badge: 2 },
];

export default function DashboardHome() {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <SectionCards />

          <div className='py-4 lg:py-6 px-8'>
            <TabsLayout
              tabs={tabs}
              defaultValue='rent-history'
              header={
                <div className='flex items-center gap-2'>
                  <Button variant='outline' size='sm' onClick={() => console.log('Add clicked')}>
                    <IconPlus />
                    <span className='hidden lg:inline'>{'button label'}</span>
                  </Button>
                  <Button variant='outline' size='sm' onClick={() => console.log('Add clicked')}>
                    <IconPlus />
                    <span className='hidden lg:inline'>{'button label'}</span>
                  </Button>
                </div>
              }
            >
              <TabsContent value='rent-history'>
                <DataTable
                  columns={columns}
                  data={sampleData}
                  enableDragAndDrop
                  enableSelection
                  enablePagination
                  enableColumnVisibility
                  enableSorting
                  enableFiltering
                  pageSize={5}
                />
              </TabsContent>

              <TabsContent value='maintenance-requests'>
                <DataTable
                  columns={columns}
                  data={sampleData}
                  enableDragAndDrop
                  enableSelection
                  enablePagination
                  enableColumnVisibility
                  enableSorting
                  enableFiltering
                  pageSize={5}
                />
              </TabsContent>

              <TabsContent value='lease-documents'>
                <DataTable
                  columns={columns}
                  data={sampleData}
                  enableDragAndDrop
                  enableSelection
                  enablePagination
                  enableColumnVisibility
                  enableSorting
                  enableFiltering
                  pageSize={5}
                />
              </TabsContent>
            </TabsLayout>
          </div>
        </div>
      </div>
    </div>
  );
}

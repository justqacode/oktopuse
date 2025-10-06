import { SectionCards } from '@/components/section-cards';
import { DataTable } from '@/components/data-table';
import { IconCircleCheckFilled, IconLoader } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter';

const sampleData = [
  {
    id: 1,
    header: '20-09-2024',
    type: 'Executive Summary',
    status: 'paid',
    // target: '2',
    // limit: '3',
    // reviewer: 'Eddie Lake',
  },
  {
    id: 2,
    header: '20-09-2024',
    type: 'Technical Approach',
    status: 'pending',
    // target: '5',
    // limit: '7',
    // reviewer: 'Assign reviewer',
  },
  {
    id: 3,
    header: '20-09-2024',
    type: 'Design',
    status: 'overdue',
    // target: '3',
    // limit: '4',
    // reviewer: 'Jamik Tashpulatov',
  },
];

// with date, status ( paid, pending, overdue) and amount. (most recent three)

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
  // {
  //   accessorKey: 'amount',
  //   header: 'Amount',
  //   cell: ({ row }) => (
  //     <div className='w-32'>
  //       <Badge variant='outline' className='text-muted-foreground px-1.5'>
  //         {row.original.type}
  //       </Badge>
  //     </div>
  //   ),
  // },
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
  // {
  //   accessorKey: 'target',
  //   header: () => <div className='w-full text-right'>Target</div>,
  //   cell: ({ row }) => (
  //     <form
  //       onSubmit={(e) => {
  //         e.preventDefault();
  //         toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
  //           loading: `Saving ${row.original.header}`,
  //           success: 'Done',
  //           error: 'Error',
  //         });
  //       }}
  //     >
  //       <Label htmlFor={`${row.original.id}-target`} className='sr-only'>
  //         Target
  //       </Label>
  //       <Input
  //         className='hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent'
  //         defaultValue={row.original.target}
  //         id={`${row.original.id}-target`}
  //       />
  //     </form>
  //   ),
  // },
  // {
  //   accessorKey: 'limit',
  //   header: () => <div className='w-full text-right'>Limit</div>,
  //   cell: ({ row }) => (
  //     <form
  //       onSubmit={(e) => {
  //         e.preventDefault();
  //         toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
  //           loading: `Saving ${row.original.header}`,
  //           success: 'Done',
  //           error: 'Error',
  //         });
  //       }}
  //     >
  //       <Label htmlFor={`${row.original.id}-limit`} className='sr-only'>
  //         Limit
  //       </Label>
  //       <Input
  //         className='hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent'
  //         defaultValue={row.original.limit}
  //         id={`${row.original.id}-limit`}
  //       />
  //     </form>
  //   ),
  // },
  // {
  //   accessorKey: 'reviewer',
  //   header: 'Reviewer',
  //   cell: ({ row }) => {
  //     const isAssigned = row.original.reviewer !== 'Assign reviewer';

  //     if (isAssigned) {
  //       return row.original.reviewer;
  //     }

  //     return (
  //       <>
  //         <Label htmlFor={`${row.original.id}-reviewer`} className='sr-only'>
  //           Reviewer
  //         </Label>
  //         <Select>
  //           <SelectTrigger
  //             className='w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate'
  //             size='sm'
  //             id={`${row.original.id}-reviewer`}
  //           >
  //             <SelectValue placeholder='Assign reviewer' />
  //           </SelectTrigger>
  //           <SelectContent align='end'>
  //             <SelectItem value='Eddie Lake'>Eddie Lake</SelectItem>
  //             <SelectItem value='Jamik Tashpulatov'>Jamik Tashpulatov</SelectItem>
  //           </SelectContent>
  //         </Select>
  //       </>
  //     );
  //   },
  // },
];

const tabs = [
  { value: 'rent-history', label: 'Rent History' },
  // { value: 'maintenance-requests', label: 'Maintenance Request', badge: 3 },
  { value: 'maintenance-requests', label: 'Maintenance Request' },
  { value: 'lease-documents', label: 'Lease Documents', badge: 2 },
  // { value: 'focus-documents', label: 'Focus Documents' },
];

export default function TestPage() {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6 '>
          <div className='py-4 lg:py-6 px-4'>
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
          </div>
        </div>
      </div>
    </div>
  );
}

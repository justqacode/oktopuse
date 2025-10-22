import { IconCircleCheckFilled, IconCircleXFilled, IconLoader } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter';
import type { Expenses, ManagerRequest, Messages, Properties } from './types';

export const rentHistoryColumn: ColumnDef<any>[] = [
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
        {row.original.date}
      </Button>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <Button variant='ghost' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.amount}
      </Button>
    ),
  },
  {
    accessorKey: 'rentForMonth',
    header: 'Rent For Month',
    cell: ({ row }) => (
      <Button variant='ghost' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.rentForMonth}
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

export const maintenanceRequestsColumn: ColumnDef<any>[] = [
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

export const maintenanceRequestsManagerColumn: ColumnDef<ManagerRequest>[] = [
  {
    accessorKey: 'date',
    header: 'Date Submitted',
    cell: ({ row }) => (
      <Button variant='link' className='text-foreground w-fit px-0 text-left'>
        {row.original.date}
      </Button>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'property',
    header: 'Property',
    cell: ({ row }) => (
      <Button variant='link' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.property}
      </Button>
    ),
  },
  {
    accessorKey: 'tenant',
    header: 'Tenant',
    cell: ({ row }) => (
      <Button variant='ghost' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.tenant}
      </Button>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <Button variant='ghost' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.category}
      </Button>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant='outline' className='text-muted-foreground px-1.5'>
        {row.original.status === 'completed' ? (
          <IconCircleCheckFilled className='fill-green-500 dark:fill-green-400' />
        ) : row.original.status === 'rejected' ? (
          <IconCircleXFilled className='fill-red-500 dark:fill-red-400' />
        ) : (
          <IconLoader />
        )}
        {capitalizeFirstLetter(row.original.status)}
      </Badge>
    ),
  },
];

export const leaseDocColumn: ColumnDef<any>[] = [
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

export const expensesColumn: ColumnDef<Expenses>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => (
      <Button variant='link' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.date}
      </Button>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <Badge variant='outline' className='text-muted-foreground w-fit px-1.5 text-left'>
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <Button variant='ghost' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.amount}
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

export const propertiesColumn: ColumnDef<Properties>[] = [
  {
    accessorKey: 'propertyName',
    header: 'Property Name',
    cell: ({ row }) => (
      <Button variant='link' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.propertyName}
      </Button>
    ),
  },
  {
    accessorKey: 'tenant',
    header: 'Tenant',
    cell: ({ row }) => (
      <Badge variant='outline' className='text-muted-foreground w-fit px-1.5 text-left'>
        {row.original.tenant}
      </Badge>
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

export const messagesColumn: ColumnDef<Messages>[] = [
  {
    accessorKey: 'from',
    header: 'From',
    cell: ({ row }) => (
      <Button variant='link' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.from}
      </Button>
    ),
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => (
      <Button variant='link' className='text-muted-foreground w-fit px-1.5 text-left'>
        {row.original.subject}
      </Button>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => (
      <Button variant='link' className='text-muted-foreground w-fit px-1.5 text-left'>
        {row.original.date}
      </Button>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant='outline' className='text-muted-foreground px-1.5'>
        {row.original.status === 'sent' ? (
          <IconCircleCheckFilled className='fill-green-500 dark:fill-green-400' />
        ) : (
          <IconLoader />
        )}
        {capitalizeFirstLetter(row.original.status)}
      </Badge>
    ),
  },
];

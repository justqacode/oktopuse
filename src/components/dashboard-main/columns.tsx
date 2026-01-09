import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconCreditCard,
  IconDotsVertical,
  IconLoader,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter';
import type {
  Expenses,
  LandlordRentHistory,
  LandlordRequest,
  ManagerRequest,
  Messages,
  PaymentHistoryManager,
  Properties,
  TenantRequest,
  UserAdmin,
} from './types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { SidebarMenuButton } from '../ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuthStore } from '@/auth/authStore';
import { Check, DotIcon, EllipsisVertical, Eye, MoreHorizontal, TicketCheck } from 'lucide-react';
import { getStatusIcon } from './maintenance-requests-manager';
import formatDate from '@/utils/format-date';

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

export const maintenanceRequestsColumn: ColumnDef<TenantRequest>[] = [
  {
    accessorKey: 'id',
    header: 'Request ID',
    cell: ({ row }) => (
      <Button variant='link' className='text-foreground w-fit px-0 text-left'>
        {row.original.id}
      </Button>
    ),
    enableHiding: false,
  },
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
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <Button variant='link' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.description}
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

export const maintenanceRequestsManagerColumn = (
  onStatusUpdate: (maintenanceId: string, newStatus: string) => void,
  viewItem: (maintenanceId: {}) => void
): ColumnDef<ManagerRequest>[] => [
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
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-medium text-black'>
            {row.original.property.propertyDetails.propertyType}
          </span>
          <span className='text-muted-foreground truncate text-xs'>
            {row.original.property.propertyDetails.address.street}
          </span>
          <span className='text-muted-foreground truncate text-xs'>
            {row.original.property.propertyDetails.address.city},{' '}
            {row.original.property.propertyDetails.address.state}
          </span>
        </div>
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
      <div className='flex items-center gap-2'>
        {getStatusIcon(row.original.status)}
        {capitalizeFirstLetter(row.original.status)}
      </div>
    ),
    // cell: ({ row }) => (
    //   <Badge variant='outline' className='text-muted-foreground px-1.5'>
    //     {row.original.status === 'completed' ? (
    //       <IconCircleCheckFilled className='fill-green-500 dark:fill-green-400' />
    //     ) : row.original.status === 'rejected' ? (
    //       <IconCircleXFilled className='fill-red-500 dark:fill-red-400' />
    //     ) : (
    //       <IconLoader />
    //     )}
    //     {capitalizeFirstLetter(row.original.status)}
    //   </Badge>
    // ),
  },
  {
    accessorKey: 'action',
    header: 'Actions',
    cell: ({ row }) => {
      const statuses = [
        { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
        { value: 'in-progress', label: 'In Progress', color: 'text-blue-600' },
        { value: 'resolved', label: 'Resolved', color: 'text-green-600' },
        { value: 'rejected', label: 'Rejected', color: 'text-red-600' },
      ];

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className='h-8 w-8 p-0'>
              <MoreHorizontal className='h-4 w-4' />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <span
              onClick={() => viewItem(row.original)}
              className='flex items-center p-2 text-sm cursor-pointer gap-2 hover:text-blue-400 hover:underline'
            >
              <Eye className='w-4 h-4 text-gray-500' />
              View
            </span>
            <hr />
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={() => onStatusUpdate(row.original.maintenanceId, status.value)}
                className={`flex items-center gap-2 cursor-pointer ${status.color}`}
                disabled={status.value === row.original.status}
              >
                {getStatusIcon(status.value)}
                <span>{status.label}</span>
                {status.value === row.original.status && (
                  <span className='ml-auto text-xs text-gray-500'>(Current)</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const maintenanceRequestsLandlordColumn2: ColumnDef<ManagerRequest>[] = [
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
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-medium text-black'>
            {row.original.property.propertyDetails.propertyType}
          </span>
          <span className='text-muted-foreground truncate text-xs'>
            {row.original.property.propertyDetails.address.street}
          </span>
          <span className='text-muted-foreground truncate text-xs'>
            {row.original.property.propertyDetails.address.city},{' '}
            {row.original.property.propertyDetails.address.state}
          </span>
        </div>
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

export const maintenanceRequestsLandlordColumn: ColumnDef<LandlordRequest>[] = [
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
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <Button variant='ghost' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.description}
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

export const paymentHistoryLandlordColumn: ColumnDef<LandlordRentHistory>[] = [
  {
    accessorKey: 'date',
    header: 'Date Received',
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
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <Badge variant='outline' className='text-muted-foreground w-fit px-1.5 text-left'>
        {row.original.amount}
      </Badge>
    ),
  },
  // {
  //   accessorKey: 'method',
  //   header: 'Payment Method',
  //   cell: ({ row }) => (
  //     <Badge variant='outline' className='text-muted-foreground w-fit px-1.5 text-left'>
  //       {row.original.method}
  //     </Badge>
  //   ),
  // },
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
  {
    accessorKey: 'statement',
    header: 'Statement',
    cell: ({ row }) => (
      <Button variant='link' className='text-muted-foreground w-fit px-1.5 text-left underline'>
        {/* {row.original.statement} */}
        Download
      </Button>
    ),
  },
];

export const leaseDocColumn: ColumnDef<any>[] = [
  {
    accessorKey: 'docName',
    header: 'Document Name',
    cell: ({ row }) => (
      <Button variant='link' className='text-foreground w-fit px-0 text-left'>
        {row.original.docName}
      </Button>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <Button variant='link' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.type}
      </Button>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Date Uploaded',
    cell: ({ row }) => (
      <Button variant='link' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.date}
      </Button>
    ),
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => (
      <Button variant='ghost' className='text-muted-foreground w-fit px-0 text-left underline'>
        {/* {row.original.type} */}
        Download
      </Button>
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
    accessorKey: 'id',
    header: 'Property ID',
    cell: ({ row }) => (
      <Button variant='link' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.id}
      </Button>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Date Added',
    cell: ({ row }) => (
      <Button variant='link' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.date}
      </Button>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Property Name',
    cell: ({ row }) => (
      <Button variant='link' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.name}
      </Button>
    ),
  },
  {
    accessorKey: 'propertyType',
    header: 'Property Type',
    cell: ({ row }) => (
      <Badge variant='outline' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.propertyType}
      </Badge>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <Button variant='link' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.amount}
      </Button>
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

// id: '...' + item._id.slice(-6),
// paymentRef: item.paymentRef,
// date: item.date,
// amountReceived: item.amountReceived || 0,
// note: item.note.split(0, 22) || 0,
// docLink: 'needs fix from sam',
// status: item.status || 'pending',

export const paymentHistoryManagerColumn: ColumnDef<PaymentHistoryManager>[] = [
  {
    accessorKey: 'paymentRef',
    header: 'Payment Ref',
    cell: ({ row }) => (
      <Button variant='link' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.paymentRef}
      </Button>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => (
      <div className='text-muted-foreground w-fit text-left'>{row.original.date}</div>
    ),
  },
  {
    accessorKey: 'amountReceived',
    header: 'Amount Received',
    cell: ({ row }) => (
      <Button variant='ghost' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.amountReceived}
      </Button>
    ),
  },
  {
    accessorKey: 'note',
    header: 'Note',
    cell: ({ row }) => (
      <Button variant='ghost' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.note}
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
  {
    accessorKey: 'docLink',
    header: 'Doc',
    cell: ({ row }) => (
      <Button variant='ghost' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.docLink}
      </Button>
    ),
  },
];

// export const usersAdminColumn: ColumnDef<UserAdmin>[] = [
export const usersAdminColumn = (
  onStatusUpdate: (maintenanceId: string, newStatus: string) => void,
  viewItem: (maintenanceId: {}) => void
): ColumnDef<any>[] => [
  {
    accessorKey: 'userName',
    header: 'Name',
    cell: ({ row }) => (
      <Button variant='link' className='text-muted-foreground w-fit px-0 text-left'>
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-medium text-black'>
            {' '}
            {`${row.original.firstName} ${row.original.lastName}`}
          </span>
          <span className='text-muted-foreground truncate text-xs'>{row.original.email}</span>
        </div>
      </Button>
    ),
  },
  // {
  //   accessorKey: 'email',
  //   header: 'Email',
  //   cell: ({ row }) => (
  //     <div className='text-muted-foreground w-fit text-left'>{row.original.email}</div>
  //   ),
  // },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <Button variant='ghost' className='text-muted-foreground w-fit px-0 text-left'>
        {row.original.role}
      </Button>
    ),
  },

  {
    accessorKey: 'accountStatus',
    header: 'Account Status',
    cell: ({ row }) => (
      <Badge variant='outline' className='text-muted-foreground px-1.5'>
        {row.original.status === 'Active' ? (
          <IconCircleCheckFilled className='fill-green-500 dark:fill-green-400' />
        ) : (
          <IconLoader />
        )}
        {capitalizeFirstLetter(row.original.status)}
      </Badge>
    ),
  },
  {
    accessorKey: 'registerdDate',
    header: 'Registered Date',
    cell: ({ row }) => (
      <Button variant='ghost' className='text-muted-foreground w-fit px-0 text-left'>
        {/* {row.original.registerdDate} */}
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-medium text-black'>
            {' '}
            {formatDate(row.original.createdAt)}
          </span>
          <span className='text-muted-foreground truncate text-xs'>
            {/* Last login: {formatDate(row.original.createdAt) - formatDate(row.original.updatedAt)} */}
            Last login:{' '}
            {formatDate((row.original.updatedAt || 0) - (row.original.createdAt || 0))?.day} days
            ago
          </span>
        </div>
      </Button>
    ),
  },
  // {
  //   accessorKey: 'lastLogin',
  //   header: 'Last Login',
  //   cell: ({ row }) => (
  //     <Button variant='ghost' className='text-muted-foreground w-fit px-0 text-left'>
  //       {row.original.lastLogin}
  //     </Button>
  //   ),
  // },
  {
    accessorKey: 'verified',
    header: 'Verified',
    cell: ({ row }) => (
      <Badge variant='outline' className='text-muted-foreground px-1.5 border  rounded-full'>
        {row.original.verificationStatus === true ? (
          <span className='flex items-center text-green-500 [&>svg]:size-4'>
            <Check className='mr-1' /> Verified
          </span>
        ) : (
          'Unverified'
        )}
      </Badge>
    ),
  },
  {
    accessorKey: 'action',
    header: 'Actions',
    cell: ({ row }) => {
      const statuses = [
        { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
        { value: 'in-progress', label: 'In Progress', color: 'text-blue-600' },
        { value: 'resolved', label: 'Resolved', color: 'text-green-600' },
        { value: 'rejected', label: 'Rejected', color: 'text-red-600' },
      ];

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className='h-8 w-8 p-0'>
              <MoreHorizontal className='h-4 w-4' />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <span
              onClick={() => viewItem(row.original)}
              className='flex items-center p-2 text-sm cursor-pointer gap-2 hover:text-blue-400 hover:underline'
            >
              View
            </span>
            <hr />
            <DropdownMenuItem>Deactivate Account</DropdownMenuItem>
            <DropdownMenuItem>Resend Verification Email</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

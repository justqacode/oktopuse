import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import PaymentModal from './dashboard-main/modals/rent-payment-modal';
import { useState } from 'react';
import { useAuthStore } from '@/auth/authStore';
import AddPropertyModal from './dashboard-main/modals/add-property-modal';
import CreateNoteModal from './dashboard-main/modals/create-note-modal';
import { AchPayment } from './ach-payment';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';

const GET_MANAGER_MAINTENANCE_REQUESTS = gql`
  query GetMaintenanceHistoryStakeHolder {
    getMaintenanceHistoryStakeHolder {
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

export function SiteHeader() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [openAddProperty, setOpenAddProperty] = useState(false);
  const [openCreateNote, setOpenCreateNote] = useState(false);

  const landlord = user?.role.includes('landlord');
  const tenant = user?.role.includes('tenant');
  const manager = user?.role.includes('manager');

  const rentAmount = user?.tenantInfo?.rentAmount || 0;

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { data } = useQuery<any>(GET_MANAGER_MAINTENANCE_REQUESTS, {
    fetchPolicy: 'cache-and-network',
    variables: { managerID: user?.id },
  });

  const mono = data?.getMaintenanceHistoryStakeHolder || [];

  return (
    <>
      {user?.role === 'manager' && mono.length > 0 && (
        <div className='bg-red-500 text-white w-full h-8 flex items-center justify-center'>
          You have <span className='font-bold px-2'>{mono.length}</span> maintenance requests
          pending. Please address them promptly.
        </div>
      )}
      <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) z-500'>
        <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mx-2 data-[orientation=vertical]:h-4' />
          <h1 className='text-base font-medium'>Welcome {user?.firstName}</h1>

          {tenant && (
            <div className='ml-auto flex items-center gap-2'>
              <Button
                variant={'default'}
                size='sm'
                onClick={() => setShowPaymentModal(true)}
                className='hidden sm:flex'
              >
                Pay rent
              </Button>
            </div>
          )}

          {landlord && (
            <div className='ml-auto flex items-center gap-2'>
              <Link
                // variant='outline'
                // size='sm'
                className='hidden sm:flex justify-center items-center text-sm border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5'
                // onClick={() => setOpen(true)}
                to='/dashboard/messages'
              >
                Message PM
              </Link>
              {/* <Button
                variant='outline'
                size='sm'
                className='hidden sm:flex'
                onClick={() => setOpen(true)}
              >
                Message PM
              </Button> */}
              <Button
                variant='default'
                size='sm'
                className='hidden sm:flex'
                onClick={() => setOpenAddProperty(true)}
              >
                + Add Property
              </Button>
            </div>
          )}
          {manager && (
            <div className='ml-auto flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='hidden sm:flex'
                onClick={() => setOpenCreateNote(true)}
              >
                Send Notice
              </Button>
              <Button
                variant='default'
                size='sm'
                className='hidden sm:flex'
                onClick={() => setOpenAddProperty(true)}
              >
                + Add Property
              </Button>
            </div>
          )}
        </div>

        <PaymentModal open={open} onOpenChange={setOpen} />
        <AddPropertyModal open={openAddProperty} onOpenChange={setOpenAddProperty} />
        <CreateNoteModal open={openCreateNote} onOpenChange={setOpenCreateNote} />

        <AchPayment open={showPaymentModal} onOpenChange={setShowPaymentModal} />
      </header>
    </>
  );
}

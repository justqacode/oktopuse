import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import PaymentModal from './dashboard-main/modals/rent-payment-modal';
import { useState } from 'react';
import { useAuthStore } from '@/auth/authStore';
// import { userMockLandlord } from '@/mockData/user';

export function SiteHeader() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const dueDate = new Date('2024-09-30');
  const today = new Date();
  const sixMonths = 365 / 2;

  const daysLeft = dueDate.getDate() - today.getDate();

  const landlord = user?.role.includes('landlord');
  const tenant = user?.role.includes('tenant');
  const manager = user?.role.includes('manager');

  // console.log('daysleft: ', daysLeft);
  return (
    <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mx-2 data-[orientation=vertical]:h-4' />
        <h1 className='text-base font-medium'>Welcome {user?.firstName}</h1>
        {tenant && (
          <div className='ml-auto flex items-center gap-2'>
            <Button
              // variant={daysLeft <= 3 ? 'default' : 'destructive'}
              variant={'default'}
              size='sm'
              className='hidden sm:flex'
              onClick={() => setOpen(true)}
            >
              {/* {daysLeft <= 3 ? 'Pay Rent' : `Rent due in ${daysLeft} days! Renew now`} */}
              Pay Rent
            </Button>
          </div>
        )}

        {landlord && (
          <div className='ml-auto flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='hidden sm:flex'
              onClick={() => setOpen(true)}
            >
              Message PM
            </Button>
            <Button
              variant='default'
              size='sm'
              className='hidden sm:flex'
              onClick={() => setOpen(true)}
            >
              + Add Property
            </Button>
          </div>
        )}
        {manager && (
          <div className='ml-auto flex items-center gap-2'>
            <Button
              variant='default'
              size='sm'
              className='hidden sm:flex'
              onClick={() => setOpen(true)}
            >
              Send Notice
            </Button>
          </div>
        )}
      </div>

      <PaymentModal open={open} onOpenChange={setOpen} />
    </header>
  );
}

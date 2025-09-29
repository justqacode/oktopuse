import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import clsx from 'clsx';

export function SiteHeader() {
  const dueDate = new Date('2024-09-30');
  const today = new Date();
  const sixMonths = 365 / 2;

  const daysLeft = dueDate.getDate() - today.getDate();

  console.log('daysleft: ', daysLeft);
  return (
    <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mx-2 data-[orientation=vertical]:h-4' />
        <h1 className='text-base font-medium'>Welcome Dayo</h1>
        <div className='ml-auto flex items-center gap-2'>
          <Button
            variant={daysLeft <= 3 ? 'default' : 'destructive'}
            asChild
            size='sm'
            className='hidden sm:flex'
          >
            <a href='/' rel='noopener noreferrer' className='dark:text-foreground'>
              {/* {daysLeft => 3 ?  "Pay Rent" : `Rent due in ${daysLeft} days Renew now`} */}

              {daysLeft <= 3 ? 'Pay Rent' : `Rent due in ${daysLeft} days! Renew now`}
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

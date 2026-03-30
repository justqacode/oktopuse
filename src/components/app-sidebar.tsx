import * as React from 'react';
import {
  IconDashboard,
  IconListDetails,
  IconUsers,
  IconSettings,
  IconHelp,
  IconSearch,
  IconDatabase,
  IconReport,
  IconFileWord,
  IconPigMoney,
  IconMoneybagPlus,
} from '@tabler/icons-react';

import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SidebarInfo } from './sidebar-info-card';
import { NavLink } from 'react-router-dom';
import type { Role } from '@/types';
import { useAuthStore, type User } from '@/auth/authStore';
import { AchPayment } from './ach-payment';

type NavItem = {
  title: string;
  url: string;
  icon: any;
  roles?: Role[];
};
type NavItemDoc = {
  name: string;
  url: string;
  icon?: any;
  roles?: Role[];
};

const data = {
  user: {
    name: 'Dayo',
    email: 'dayo@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard,
      roles: ['tenant', 'manager', 'landlord'],
    },
    {
      title: 'Payments',
      url: '/dashboard/payments',
      icon: IconPigMoney,
      roles: ['manager'],
    },
    {
      title: 'Associate Accounts',
      url: '/dashboard/associate-accounts',
      icon: IconUsers,
      roles: ['manager'],
    },
    {
      title: 'Messages',
      url: '/dashboard/messages',
      icon: IconListDetails,
      roles: ['tenant', 'manager', 'landlord'],
    },
    {
      title: 'Tenants',
      url: '/dashboard/manager/tenants',
      icon: IconUsers,
      roles: ['manager'],
    },
    {
      title: 'Landlords',
      url: '/dashboard/manager/landlords',
      icon: IconUsers,
      roles: ['manager'],
    },
    {
      title: 'Users',
      url: '/dashboard/admin/users',
      icon: IconUsers,
      roles: ['admin'],
    },
    {
      title: 'Settings',
      url: '/dashboard/settings',
      icon: IconSettings,
      roles: ['tenant', 'manager', 'landlord', 'admin'],
    },
    {
      title: 'Pay Rent',
      url: '#',
      icon: IconMoneybagPlus,
      roles: ['tenant'],
    },
  ] as NavItem[],
  navSecondary: [
    // {
    //   title: 'Settings',
    //   url: '/dashboard/settings',
    //   icon: IconSettings,
    //   roles: ['tenant', 'manager', 'landlord'],
    // },
    // {
    //   title: 'Get Help',
    //   url: '#',
    //   icon: IconHelp,
    //   roles: ['tenant', 'manager', 'landlord'],
    // },
    // {
    //   title: 'Search',
    //   url: '#',
    //   icon: IconSearch,
    //   roles: ['tenant', 'manager', 'landlord'],
    // },
  ] as NavItem[],
  documents: [
    {
      name: 'Data Library',
      url: '#',
      icon: IconDatabase,
      roles: ['manager'],
    },
    {
      name: 'Reports',
      url: '#',
      icon: IconReport,
      roles: ['landlord', 'manager'],
    },
    {
      name: 'Word Assistant',
      url: '#',
      icon: IconFileWord,
      roles: ['tenant', 'manager'],
    },
  ] as NavItemDoc[],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isPayRentModalOpen, setIsPayRentModalOpen] = React.useState(false);

  const { user: userData } = useAuthStore();
  if (!userData) return null;
  const user = {
    firstName: `${userData.firstName}`,
    email: userData.email,
    profilePhoto: '/avatars/shadcn.jpg',
    role: userData.role,
  };

  const filterByRole = <T extends { roles?: Role[] }>(items: T[]): T[] => {
    const role = user.role;

    return items.filter((item) => {
      if (!item.roles) return true;

      if (Array.isArray(role)) {
        return role.some((r) => item.roles!.includes(r));
      }

      return item.roles.includes(role);
    });
  };

  const handleNavItemClick = (item: { title: string; url: string }) => {
    if (item.title === 'Pay Rent') {
      setIsPayRentModalOpen(true);
    }
  };

  return (
    <>
      <Sidebar collapsible='icon' {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:p-1.5!'>
                <div className='w-full'>
                  <NavLink to='/'>
                    <div className='flex items-center justify-between w-full space-x-2'>
                      <div className='flex items-center'>
                        <img
                          // src='/oktopuse-logo-cropped.png'
                          src='/oktopuse-logo-no-bk.png'
                          alt='Oktopuse Logo'
                          // className='h-8 w-auto group-data-[state=collapsed]:hidden  block'
                          className='h-8 w-auto hidden md:block md:group-data-[state=collapsed]:hidden'
                        />
                        <img
                          src='/vite.svg'
                          alt='Oktopuse Logo'
                          className='h-4 w-auto hidden group-data-[state=collapsed]:block'
                        />
                      </div>
                    </div>
                  </NavLink>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={filterByRole(data.navMain)} onItemClick={handleNavItemClick} />
          {/* <NavDocuments items={filterByRole(data.documents)} /> */}
          <NavSecondary items={filterByRole(data.navSecondary)} className='mt-auto' />
          {/* <SidebarInfo /> */}
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
      <AchPayment open={isPayRentModalOpen} onOpenChange={setIsPayRentModalOpen} />
    </>
  );
}

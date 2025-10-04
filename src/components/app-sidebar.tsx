import * as React from 'react';
import {
  IconCamera,
  IconDashboard,
  IconListDetails,
  IconUsers,
  IconSettings,
  IconHelp,
  IconSearch,
  IconDatabase,
  IconReport,
  IconFileWord,
  IconFileAi,
  IconFileDescription,
  IconFolder,
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
      roles: ['tenant', 'admin', 'landlord'],
    },
    {
      title: 'Messages',
      url: '#',
      icon: IconListDetails,
      roles: ['admin', 'landlord'],
    },
    {
      title: 'Test Page',
      url: '/dashboard/test-page',
      icon: IconUsers,
      roles: ['tenant'],
    },
  ] as NavItem[],
  navSecondary: [
    {
      title: 'Settings',
      url: '/dashboard/settings',
      icon: IconSettings,
      roles: ['tenant', 'admin', 'landlord'],
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
      roles: ['tenant', 'admin', 'landlord'],
    },
    {
      title: 'Search',
      url: '#',
      icon: IconSearch,
      roles: ['tenant', 'admin', 'landlord'],
    },
  ] as NavItem[],
  documents: [
    {
      name: 'Data Library',
      url: '#',
      icon: IconDatabase,
      roles: ['admin'],
    },
    {
      name: 'Reports',
      url: '#',
      icon: IconReport,
      roles: ['landlord', 'admin'],
    },
    {
      name: 'Word Assistant',
      url: '#',
      icon: IconFileWord,
      roles: ['tenant', 'admin'],
    },
  ] as NavItemDoc[],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5'>
              <NavLink to='/'>
                <div className='flex items-center space-x-2'>
                  <div className='w-8 h-8 bg-primary rounded-md flex items-center justify-center'>
                    <span className='text-primary-foreground font-bold text-sm'>OP</span>
                  </div>
                  <span className='font-semibold text-lg'>Octopuse</span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filterByRole(data.navMain)} />
        {/* <NavDocuments items={filterByRole(data.documents)} /> */}
        <NavSecondary items={filterByRole(data.navSecondary)} className='mt-auto' />
        <SidebarInfo />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from '@tabler/icons-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/auth/authStore';
import { LogOutIcon } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

export function NavUser({
  user,
}: {
  user: {
    firstName: string;
    email: string;
    profilePhoto: string;
  };
}) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* <DropdownMenuTrigger asChild> */}
          <SidebarMenuButton
            size='lg'
            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
          >
            <Avatar className='h-8 w-8 rounded-lg grayscale'>
              <AvatarImage src={user.profilePhoto} alt={user.firstName} />
              <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-medium'>{user.firstName}</span>
              <span className='text-muted-foreground truncate text-xs'>{user.email}</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => logout(navigate)} className='ml-auto'>
                  <LogOutIcon className='size-4' />
                </button>
              </TooltipTrigger>
              <TooltipContent>Log out</TooltipContent>
            </Tooltip>
          </SidebarMenuButton>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

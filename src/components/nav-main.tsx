import { IconCirclePlusFilled, IconMail, type Icon } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';

export function NavMain({
  items,
  onItemClick,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
  onItemClick?: (item: { title: string; url: string; icon?: Icon }) => void;
}) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupContent className='flex flex-col gap-2'>
        {/* A more suffisticated menu */}
        {/* <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu> */}
        <SidebarMenu>
          {items.map((item) => {
            const isActive = location.pathname === item.url;
            const isHash = item.url.startsWith('#');

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={clsx(
                    'min-w-8 duration-200 ease-linear',
                    isActive &&
                      'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground',
                  )}
                  asChild={!isHash}
                  onClick={(e) => {
                    if (isHash) {
                      e.preventDefault();
                      onItemClick?.(item);
                    }
                  }}
                >
                  {/* <NavLink to={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </NavLink> */}
                  {isHash ? (
                    <div className='flex sm:hidden text-sm [&_svg]:size-4 gap-2 items-center justify-center'>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </div>
                  ) : (
                    <NavLink to={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </NavLink>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

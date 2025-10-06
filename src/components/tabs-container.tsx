import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface TabConfig {
  value: string;
  label: string;
  badge?: number | string;
  content?: React.ReactNode;
}

export interface TabContainerProps {
  tabs: TabConfig[];
  defaultTab?: string;
  children?: React.ReactNode;
  // Header content and actions
  title?: React.ReactNode;
  headerActions?: React.ReactNode;
  className?: string;
  // Control which tab gets the main content (children)
  mainContentTab?: string; // defaults to first tab
}

export function TabContainer({
  tabs,
  defaultTab,
  children,
  title,
  headerActions,
  className = '',
  mainContentTab,
}: TabContainerProps) {
  const activeDefaultTab = defaultTab || tabs[0]?.value;
  const contentTab = mainContentTab || tabs[0]?.value;

  if (!tabs || tabs.length === 0) {
    // No tabs mode - just render with header
    return (
      <div className={`w-full flex-col justify-start gap-6 ${className}`}>
        {(title || headerActions) && (
          <div className='flex items-center justify-between px-4 lg:px-6'>
            {title && <div>{title}</div>}
            {headerActions && <div className='flex items-center gap-2'>{headerActions}</div>}
          </div>
        )}
        <div className='px-4 lg:px-6'>{children}</div>
      </div>
    );
  }

  return (
    <Tabs
      defaultValue={activeDefaultTab}
      className={`w-full flex-col justify-start gap-6 ${className}`}
    >
      <div className='flex items-center justify-between px-4 lg:px-6'>
        {/* Mobile Select Dropdown */}
        <Label htmlFor='view-selector' className='sr-only'>
          View
        </Label>
        <Select defaultValue={activeDefaultTab}>
          <SelectTrigger className='flex w-fit @4xl/main:hidden' size='sm' id='view-selector'>
            <SelectValue placeholder='Select a view' />
          </SelectTrigger>
          <SelectContent>
            {tabs.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Desktop Tabs */}
        <TabsList className='**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex'>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              {tab.badge && <Badge variant='secondary'>{tab.badge}</Badge>}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Title and Actions */}
        <div className='flex items-center gap-4'>
          {title && <div className='hidden @4xl/main:block'>{title}</div>}
          {headerActions && <div className='flex items-center gap-2'>{headerActions}</div>}
        </div>
      </div>

      {/* Tab Content */}
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className='px-4 lg:px-6'>
          {tab.value === contentTab ? (
            children
          ) : tab.content ? (
            tab.content
          ) : (
            <div className='aspect-video w-full flex-1 rounded-lg border border-dashed flex items-center justify-center'>
              <p className='text-muted-foreground'>Content for {tab.label} tab</p>
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}

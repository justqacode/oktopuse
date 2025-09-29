import * as React from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent as ShadcnTabsContent,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Tab {
  value: string;
  label: string;
  badge?: number;
}

interface TabsLayoutProps {
  tabs: Tab[];
  defaultValue?: string;
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function TabsLayout({ tabs, defaultValue, header, children, className }: TabsLayoutProps) {
  return (
    <Tabs
      defaultValue={defaultValue || tabs[0]?.value}
      className={`flex flex-col gap-4 ${className || ''}`}
    >
      {/* Top row: tabs + header actions */}
      <div className='flex items-center justify-between'>
        <TabsList className='bg-muted/50'>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className='flex items-center gap-2'>
              {tab.label}
              {tab.badge ? (
                <Badge variant='secondary' className='ml-1 text-xs'>
                  {tab.badge}
                </Badge>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>
        {header && <div>{header}</div>}
      </div>

      {/* Tab panels */}
      <div>{children}</div>
    </Tabs>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ShadcnTabsContent value={value} className={className}>
      {children}
    </ShadcnTabsContent>
  );
}

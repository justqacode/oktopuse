import { SectionCards } from '@/components/section-cards';
import { TabsContent, TabsLayout } from '@/components/tab-layout';
import RentHistory from '@/components/dashboard-main/rent-history';
import MaintenanceRequests from '@/components/dashboard-main/maintenance-requests';
import LeaseDoc from '@/components/dashboard-main/lease-doc';
import { useState } from 'react';
import { DashCard } from '@/components/dashboard-card';
import ExpensesHistory from '@/components/dashboard-main/expenses';

const tabs = [
  { value: 'expenses', label: 'Expenses' },
  { value: 'maintenance-requests', label: 'Maintenance Request' },
  { value: 'lease-documents', label: 'Lease Documents', badge: 2 },
];

export default function DashboardHomeLandlord() {
  const [activeTab, setActiveTab] = useState('expenses');

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
            <DashCard cardDescription='Total Properties' cardMainContent='50' />
            <DashCard cardDescription='Total Units' cardMainContent='120' />
            <DashCard cardDescription='Occupied Units' cardMainContent='85' />
            <DashCard cardDescription='Total monthly rent collected' cardMainContent='$90,000' />
          </div>
          <div className='py-4 lg:py-6 px-8'>
            <TabsLayout
              tabs={tabs}
              defaultValue='expenses'
              onValueChange={setActiveTab}
              header={activeTab === 'expenses' ? <ExpensesHistory.HeaderButton /> : null}
            >
              <TabsContent value='expenses'>
                <ExpensesHistory />
              </TabsContent>

              <TabsContent value='maintenance-requests'>
                <MaintenanceRequests />
              </TabsContent>

              <TabsContent value='lease-documents'>
                <LeaseDoc />
              </TabsContent>
            </TabsLayout>
          </div>
        </div>
      </div>
    </div>
  );
}

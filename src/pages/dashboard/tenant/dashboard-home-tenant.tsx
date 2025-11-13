import { TabsContent, TabsLayout } from '@/components/tab-layout';
import RentHistory from '@/components/dashboard-main/rent-history';
import MaintenanceRequests from '@/components/dashboard-main/maintenance-requests';
import LeaseDoc from '@/components/dashboard-main/lease-doc';
import { useState } from 'react';
import { DashCard } from '@/components/dashboard-card';

const tabs = [
  { value: 'rent-history', label: 'Rent History' },
  { value: 'maintenance-requests', label: 'Maintenance Request' },
  { value: 'lease-documents', label: 'Lease Documents', badge: 2 },
];

export default function DashboardHomeTenant() {
  const [activeTab, setActiveTab] = useState('rent-history');

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
            <DashCard
              cardDescription='Unit'
              cardMainContent='12B'
              footerTop='Marple Apt.'
              footerBottom='12 Mario Street, Invict drive.'
            />
            <DashCard
              cardDescription='Lease End'
              cardMainContent='31st'
              footerTop='December'
              footerBottom='2025'
            />
            <DashCard cardDescription='Montly rent' cardMainContent='$0' />
          </div>
          <div className='py-4 lg:py-6 px-8'>
            <TabsLayout
              tabs={tabs}
              defaultValue='rent-history'
              onValueChange={setActiveTab}
              header={
                activeTab === 'maintenance-requests' ? <MaintenanceRequests.HeaderButton /> : null
              }
            >
              <TabsContent value='rent-history'>
                <RentHistory />
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

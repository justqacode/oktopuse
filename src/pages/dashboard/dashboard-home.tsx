import { SectionCards } from '@/components/section-cards';
import { TabsContent, TabsLayout } from '@/components/tab-layout';
import RentHistory from '@/components/dashboard-main/rent-history';
import MaintenanceRequests from '@/components/dashboard-main/maintenance-requests';
import LeaseDoc from '@/components/dashboard-main/lease-doc';
import { useState } from 'react';

const tabs = [
  { value: 'rent-history', label: 'Rent History' },
  { value: 'maintenance-requests', label: 'Maintenance Request' },
  { value: 'lease-documents', label: 'Lease Documents', badge: 2 },
];

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState('rent-history');

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <SectionCards />

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

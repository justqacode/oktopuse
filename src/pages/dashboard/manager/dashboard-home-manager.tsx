import { TabsContent, TabsLayout } from '@/components/tab-layout';
import MaintenanceRequests from '@/components/dashboard-main/maintenance-requests';
import Messages from '@/components/dashboard-main/messages';
import { DashCard } from '@/components/dashboard-card';
import Properties from '@/components/dashboard-main/properties';
import MaintenanceRequestsManager from '@/components/dashboard-main/maintenance-requests-manager';

const tabs = [
  { value: 'properties', label: 'Properties' },
  { value: 'maintenance-requests', label: 'Maintenance Request' },
  { value: 'messages', label: 'Messages', badge: 2 },
];

export default function DashboardHomeManager() {
  // const [activeTab, setActiveTab] = useState('expenses');

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
              defaultValue='properties'
              // onValueChange={setActiveTab}
              // header={activeTab === 'properties' ? <ExpensesHistory.HeaderButton /> : null}
            >
              <TabsContent value='properties'>
                <Properties />
              </TabsContent>

              <TabsContent value='maintenance-requests'>
                <MaintenanceRequestsManager />
              </TabsContent>

              <TabsContent value='messages'>
                <Messages />
              </TabsContent>
            </TabsLayout>
          </div>
        </div>
      </div>
    </div>
  );
}

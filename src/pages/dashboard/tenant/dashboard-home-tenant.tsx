import { TabsContent, TabsLayout } from '@/components/tab-layout';
import RentHistory from '@/components/dashboard-main/rent-history';
import MaintenanceRequests from '@/components/dashboard-main/maintenance-requests';
import LeaseDoc from '@/components/dashboard-main/lease-doc';
import { useState } from 'react';
import { DashCard } from '@/components/dashboard-card';
import { useAuthStore } from '@/auth/authStore';
import { formatCurrency } from '@/utils/format-currency';
import formatDate, { monthNames } from '@/utils/format-date';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const tabs = [
  { value: 'rent-history', label: 'Rent History' },
  { value: 'maintenance-requests', label: 'Maintenance Request' },
  // { value: 'lease-documents', label: 'Lease Documents', badge: 2 },
  { value: 'lease-documents', label: 'Documents' },
];

export default function DashboardHomeTenant() {
  const [activeTab, setActiveTab] = useState('rent-history');
  const { user } = useAuthStore();

  const TD = user?.tenantInfo;
  const leaseDate = formatDate(TD?.leaseEndDate);

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
            <DashCard
              cardDescription='Address'
              cardMainContent={TD?.rentalAddress || 'Pending Assignment'}
              footerTop={TD?.rentalZip || ''}
              footerBottom={`${TD?.rentalCity || ''}, ${TD?.rentalState || ''}`}
            />

            {/* Highlight lease end if within 90 days */}
            {(() => {
              const leaseRaw = TD?.leaseEndDate;
              const now = new Date();
              const leaseDateObj = leaseRaw ? new Date(leaseRaw) : null;
              const isSoon = leaseDateObj && (leaseDateObj.getTime() - now.getTime()) <= 90 * 24 * 60 * 60 * 1000;
              return (
                <DashCard
                  cardDescription='Lease End'
                  cardMainContent={leaseDate?.day ?? 'No Active Lease'}
                  footerTop={leaseDate?.month != null ? monthNames[leaseDate.month] : ''}
                  footerBottom={leaseDate?.year ?? ''}
                  bgClass={isSoon ? 'bg-red-200' : undefined}
                />
              );
            })()}


            <DashCard
              cardDescription='Montly rent'
              cardMainContent={formatCurrency(TD?.rentAmount || 0)}
            />

            <Card className='@container/card'>
              <CardHeader>
                <CardDescription>Manager info</CardDescription>
                {/* {footerTop || footerBottom ? (
                  <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                    {cardMainContent}
                  </CardTitle>
                ) : ( */}
                {/* <CardTitle className='pt-8 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                  {'cardMainContent'}
                </CardTitle> */}

                {/* <CardAction>
                  <Badge variant='default'>Message</Badge>
                </CardAction> */}
              </CardHeader>

              <CardFooter className='flex-col items-start gap-1.5 text-sm w-full min-w-0'>
                <div className='flex flex-wrap gap-x-2 gap-y-0.5 font-medium [word-break:break-word] break-all'>
                  Name:{' '}
                  <span className='text-muted-foreground'>
                    {user?.managerInfo?.propertyManagerName || 'N/A'}
                  </span>{' '}
                </div>
                <div className='flex flex-wrap gap-x-2 gap-y-0.5 font-medium [word-break:break-word] break-all'>
                  Email:{' '}
                  <span className='text-muted-foreground '>
                    {user?.managerInfo?.propertyManagerEmail || 'N/A'}
                  </span>
                </div>
                <div className='flex flex-wrap gap-x-2 gap-y-0.5 font-medium [word-break:break-word] break-all'>
                  Phone:{' '}
                  <span className='text-muted-foreground'>
                    {user?.managerInfo?.propertyManagerPhone || 'N/A'}
                  </span>
                </div>
              </CardFooter>
            </Card>
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

import { TabsContent, TabsLayout } from '@/components/tab-layout';
import LeaseDoc from '@/components/dashboard-main/lease-doc';
import { useState } from 'react';
import { DashCard } from '@/components/dashboard-card';
import ExpensesHistory from '@/components/dashboard-main/expenses';
import MaintenanceRequestsLandlord from '@/components/dashboard-main/maintenance-requests-landlord';
import PaymentHistoryLandlord from '@/components/dashboard-main/payment-history-landlord';
import Properties from '@/components/dashboard-main/properties';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { formatCurrency } from '@/utils/format-currency';

const GET_LANDLORD_RENT_PAYMENT_HISTORY = gql`
  query GetPaymentHistoryByLandLord {
    getPayHistoryByLandLord {
      totalAmountReceived
      records {
        _id
        status
        date
        amountReceived
        note
        paymentRef
        docLink
      }
    }
  }
`;

const tabs = [
  { value: 'payment-history', label: 'Payment History' },
  { value: 'properties', label: 'Properties' },
  { value: 'expenses', label: 'Expenses' },
  { value: 'maintenance-requests', label: 'Maintenance Request' },
  // { value: 'lease-documents', label: 'Lease Documents', badge: 2 },
  { value: 'lease-documents', label: 'Documents' },
];

export default function DashboardHomeLandlord() {
  const [activeTab, setActiveTab] = useState('payment-history');

  const { data, loading } = useQuery<any>(GET_LANDLORD_RENT_PAYMENT_HISTORY, {
    fetchPolicy: 'cache-and-network',
  });

  const totalAmountReceived = data?.getPayHistoryByLandLord?.totalAmountReceived ?? 0;
  const records = data?.getPayHistoryByLandLord?.records ?? [];

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
            <DashCard cardDescription='Total Properties' cardMainContent='1' />
            <DashCard cardDescription='Total Units' cardMainContent='1' />
            <DashCard cardDescription='Occupied Units' cardMainContent='1' />
            <DashCard cardDescription='Total Rent Remitted' cardMainContent={formatCurrency(totalAmountReceived)} />
          </div>
          <div className='py-4 lg:py-6 px-8'>
            <TabsLayout
              tabs={tabs}
              defaultValue='payment-history'
              onValueChange={setActiveTab}
              header={activeTab === 'expenses' ? <ExpensesHistory.HeaderButton /> : null}
            >
              <TabsContent value='payment-history'>
                <PaymentHistoryLandlord records={records} loading={loading} />
              </TabsContent>

              <TabsContent value='properties'>
                <Properties />
              </TabsContent>

              <TabsContent value='expenses'>
                <ExpensesHistory />
              </TabsContent>

              <TabsContent value='maintenance-requests'>
                <MaintenanceRequestsLandlord />
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

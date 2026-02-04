import { DataTable } from '@/components/data-table';
import { rentHistoryColumn } from './columns';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { useEffect, useState } from 'react';
import formatDate from '@/utils/format-date';
import { formatCurrency } from '@/utils/format-currency';
import MaintenanceRequestPreviewModal from './modals/maintenance-preview-modal';
import MaintenanceRequestModal from './modals/maintenance-modal';
import RentHistoryPreviewModal from './modals/rent-history-modal';

interface PaymentHistoryItem {
  _id: string;
  propertyID?: string;
  tenantID?: string;
  amountReceived?: number;
  date?: string;
  rentForMonth?: string;
  note?: string;
  status?: string;
  paymentMethod?: string;
  purpose?: string;
}

interface GetPaymentHistoryResult {
  getPaymentHistoryByTenantID: PaymentHistoryItem[];
}

const GET_PAYMENT_HISTORY = gql`
  query GetPaymentHistoryByTenant {
    getPaymentHistoryByTenantID {
      _id
      propertyID
      tenantID
      amountReceived
      date
      rentForMonth
      note
      status
      paymentMethod
      purpose
    }
  }
`;

export default function RentHistory() {
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { data, refetch, loading } = useQuery<GetPaymentHistoryResult>(GET_PAYMENT_HISTORY, {
    fetchPolicy: 'cache-and-network',
  });

  // console.log({ data });

  const { shouldRefetch, resetRefetch } = usePaymentStore();

  useEffect(() => {
    if (shouldRefetch) {
      refetch().then(() => {
        resetRefetch();
      });
    }
  }, [shouldRefetch, refetch, resetRefetch]);

  // if (loading) console.log('Loading property...');
  // if (error) console.error('GraphQL Error:', error);
  // if (data) console.log('GraphQL result:', data.getPaymentHistoryByTenantID);

  const rentHistoryData = data?.getPaymentHistoryByTenantID || [];
  const rentHistoryFormatted = rentHistoryData
    .slice()
    // .reverse()
    .map((item) => ({
      id: '...' + item._id.slice(-6),
      date: formatDate(item.date),
      amount: formatCurrency(Number(item.amountReceived)) || 0,
      // rentForMonth: item.rentForMonth,
      status: item.status || 'pending',
      tenantId: item.tenantID,
      propertyId: item.propertyID,
      note: item.note,
      paymentMethod: item.paymentMethod,
      purpose: item.purpose,
    }));

  // const rentda = rentHistoryFormatted.slice().reverse();

  const viewPayment = (payId: {}) => {
    setSelectedRequest(payId);
    setPreviewOpen(true);
  };

  return (
    <>
      <DataTable
        columns={rentHistoryColumn(viewPayment)}
        data={rentHistoryFormatted}
        enablePagination
        enableSorting
        enableFiltering
        pageSize={10}
        loading={loading}
      />

      <RentHistoryPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        requests={selectedRequest}
      />
    </>
  );
}

import { DataTable } from '@/components/data-table';
import { paymentHistoryLandlordColumn } from './columns';
import type { LandlordRentHistory } from './types';
import formatDate from '@/utils/format-date';
import { formatCurrency } from '@/utils/format-currency';

type PaymentRecord = {
  _id: string;
  status: string;
  date: string;
  amountReceived: number;
  note: string;
  paymentRef: string;
  docLink: string[];
};

type Props = {
  records: PaymentRecord[];
  loading: boolean;
};

export default function PaymentHistoryLandlord({ records, loading }: Props) {
  const paymentHistoryFormatted: LandlordRentHistory[] = records.map((item) => ({
    id: '...' + item._id.slice(-6),
    date: String(formatDate(item.date) || 'N/A'),
    amount: formatCurrency(Number(item.amountReceived)) || 'N/A',
    note: item.note || 'N/A',
    paymentRef: item.paymentRef || 'N/A',
    status: item.status || 'N/A',
    statement: item.docLink?.length ? item.docLink[0] : 'N/A',
  }));

  return (
    <DataTable
      columns={paymentHistoryLandlordColumn}
      data={paymentHistoryFormatted}
      enablePagination
      enableColumnVisibility
      enableSorting
      enableFiltering
      pageSize={10}
      loading={loading}
    />
  );
}

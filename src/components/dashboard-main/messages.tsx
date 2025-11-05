import { DataTable } from '@/components/data-table';
import { messagesColumn } from './columns';
import type { Messages } from './types';

const sampleData: Messages[] = [
  {
    id: 1,
    from: 'Mario Bliss',
    subject: 'Richard Price',
    date: '15-12-2025',
    status: 'sent',
  },
  {
    id: 2,
    from: 'Mario Bliss',
    subject: 'Richard Price',
    date: '15-12-2025',
    status: 'sent',
  },
  {
    id: 3,
    from: 'Mario Bliss',
    subject: 'Richard Price',
    date: '15-12-2025',
    status: 'sent',
  },
];

export default function Messages() {
  return (
    <DataTable
      columns={messagesColumn}
      data={sampleData}
      enablePagination
      enableSorting
      enableFiltering
      pageSize={5}
    />
  );
}

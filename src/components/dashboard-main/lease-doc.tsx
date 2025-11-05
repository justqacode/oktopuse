import { DataTable } from '@/components/data-table';
import { leaseDocColumn } from './columns';

const sampleData = [
  {
    id: 1,
    docName: 'Lease Agreement.pdf',
    type: 'PDF',
    date: '20-09-2024',
  },
  {
    id: 2,
    docName: 'Payment REceipt Aug 2025.pdf',
    type: 'PDF',
    date: '20-09-2024',
  },
  {
    id: 3,
    docName: 'Move-in checklist.pdf',
    type: 'PDF',
    date: '20-09-2024',
  },
  {
    id: 4,
    docName: 'Notice of Entry.pdf',
    type: 'PDF',
    date: '20-09-2024',
  },
];

export default function LeaseDoc() {
  return (
    <DataTable
      columns={leaseDocColumn}
      data={sampleData}
      enablePagination
      enableColumnVisibility
      enableSorting
      enableFiltering
      pageSize={5}
    />
  );
}

import { DataTable } from '@/components/data-table';
import { propertiesColumn } from './columns';
import type { Properties } from './types';

const sampleData: Properties[] = [
  {
    id: 1,
    propertyName: 'Mario Bliss',
    tenant: 'Richard Price',
    status: 'paid',
  },
  {
    id: 1,
    propertyName: 'Mario Bliss',
    tenant: 'Richard Price',
    status: 'paid',
  },
  {
    id: 1,
    propertyName: 'Mario Bliss',
    tenant: 'Richard Price',
    status: 'paid',
  },
];

export default function Properties() {
  return (
    <DataTable
      columns={propertiesColumn}
      data={sampleData}
      enablePagination
      enableSorting
      enableFiltering
      pageSize={5}
    />
  );
}

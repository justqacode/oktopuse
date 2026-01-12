import { DataTable } from '@/components/data-table';
import { expensesColumn } from './columns';
import type { Expenses } from './types';
import { useState } from 'react';
import { Button } from '../ui/button';
import { IconDownload, IconPlus } from '@tabler/icons-react';
import { CreditCard, DownloadCloud, DownloadIcon } from 'lucide-react';

const sampleData: Expenses[] = [
  {
    id: 1,
    date: '20-09-2024',
    category: 'Repairs',
    amount: '$250',
    status: 'paid',
  },
  {
    id: 2,
    date: '20-09-2024',
    category: 'Maintentance',
    amount: '$250',
    status: 'pending',
  },
  {
    id: 3,
    date: '20-09-2024',
    category: 'Fees',
    amount: '$2500',
    status: 'paid',
  },
];

export default function ExpensesHistory() {
  return (
    <DataTable
      columns={expensesColumn}
      data={sampleData}
      enablePagination
      enableSorting
      enableFiltering
      pageSize={10}
    />
  );
}

ExpensesHistory.HeaderButton = function HeaderButton() {
  // const [open, setOpen] = useState(false);
  const handleDownloadStatement = () => {
    console.log('Download triggered from header!');
    // setOpen(true);
  };

  return (
    <div className='flex gap-2'>
      <Button variant='outline' size='sm' onClick={handleDownloadStatement}>
        <DownloadCloud className='mr-1' /> Download statement
      </Button>

      {/* <MaintenanceRequestModal open={open} onOpenChange={setOpen} /> */}
    </div>
  );
};

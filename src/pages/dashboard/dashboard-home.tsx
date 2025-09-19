// import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';
import { SectionCards } from '@/components/section-cards';

import data from '../../mockData/dashboard-data.json';

export default function DashboardHome() {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <SectionCards />
          {/* <div className='px-4 lg:px-6'>
            <ChartAreaInteractive />
            <div>Here is the body section</div>
          </div> */}
          <div className='py-4 lg:py-6'>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

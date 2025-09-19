import { SectionCards } from '@/components/section-cards';

export default function Settings() {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <div>I'm here for the settings</div>
          </div>

          <SectionCards />
        </div>
      </div>
    </div>
  );
}

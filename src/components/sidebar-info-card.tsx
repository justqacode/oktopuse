import { InfoIcon } from 'lucide-react';

export const SidebarInfo = () => {
  return (
    <div className='border border-gray-200 my-2 mx-4 p-4 rounded-sm bg-gradient-to-br from-green-100 via-green-50 to-purple-50'>
      <div className='flex justify-center mb-6'>
        <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md'>
          <InfoIcon className='w-6 h-6 text-green-800' strokeWidth={2} />
        </div>
      </div>

      <div className='text-center'>
        <h2 className='text-md font-bold text-gray-900 mb-3'>Notices from Manager</h2>
        <p className='text-gray-600 leading-relaxed text-sm'>
          A section for manager issued notices, building updates, reminders, and important
          announcements.
        </p>
      </div>
    </div>
  );
};

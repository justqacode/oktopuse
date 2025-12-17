import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className='mt-12 min-h-screen bg-linear-to-br bg-[#BDDEF0]'>
      <div className='max-w-4xl mx-auto px-6 pt-48'>
        {/* Header */}
        <div className='bg-white/20  rounded-lg shadowlg p-8 mb-1'>
          <div className='flex flex-col gap-6 text-sm text-center text-slate-600'>
            <h1 className='text-4xl sm:text-6xl font-bold text-[#ffffff]'>404</h1>
            <p>
              We&apos;re sorry. It looks like something went wrong on our end. We&apos;ll work on
              getting that fixed before octopuses come through the pipe. Please continue to our
              <Link to='/' className='px-1 text-blue-400 hover:underline'>
                homepage
              </Link>{' '}
              to keep surfing.
            </p>
          </div>

          <div className='flex sm:hidden gap-2 text-sm text-slate-600 mt-6'>
            <img src='/404-guy.svg' alt='404' aria-label='404 not found' />
          </div>
        </div>
      </div>

      <div className='hidden sm:block max-w-6xl mx-auto px-6 py-'>
        <div className='flex gap-2 text-sm text-slate-600 mt-6'>
          <img src='/404-guy.svg' alt='404' aria-label='404 not found' />
        </div>
      </div>
    </div>
  );
}

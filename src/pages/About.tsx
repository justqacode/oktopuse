export default function AboutUs() {
  return (
    <div className='mt-12 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      {/* Hero Section */}
      <div className='relative w-full h-[420px] overflow-hidden'>
        <img
          src='https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt='Neighborhood aerial view'
          className='absolute inset-0 w-full h-full object-cover'
        />
        {/* Dark overlay */}
        <div className='absolute inset-0 bg-black/55' />
        {/* Centered text */}
        <div className='relative z-10 flex flex-col items-center justify-center h-full text-center px-6'>
          <h1 className='text-5xl font-bold text-white mb-4'>About Us</h1>
          <p className='text-white text-lg font-medium max-w-xl leading-relaxed'>
            Connecting Tenants, Landlords, and Property Managers Seamlessly.
          </p>
          <p className='text-white/80 text-base mt-3'>
            Discover our story and the mission that drives us.
          </p>
        </div>
      </div>

      {/* Our Mission */}
      <div className='max-w-5xl mx-auto px-6 py-16'>
        <div className='flex flex-col md:flex-row items-center gap-10'>
          <div className='flex-1'>
            <h2 className='text-4xl font-bold text-slate-900 mb-4'>Our Mission</h2>
            <p className='text-slate-600 text-lg leading-relaxed'>
              Our mission is to simplify property management for everyone — bridging the gap between
              tenants, landlords, and property managers through transparency, trust, and technology.
            </p>
          </div>
          <div className='flex-shrink-0 w-64 h-48 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center overflow-hidden'>
            {/* Illustration placeholder — replace with your actual illustration */}
            <svg
              viewBox='0 0 260 180'
              className='w-full h-full p-4'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              {/* Browser window */}
              <rect
                x='100'
                y='10'
                width='150'
                height='110'
                rx='8'
                fill='#DBEAFE'
                stroke='#93C5FD'
                strokeWidth='2'
              />
              <circle cx='114' cy='24' r='4' fill='#93C5FD' />
              <circle cx='126' cy='24' r='4' fill='#93C5FD' />
              <circle cx='138' cy='24' r='4' fill='#93C5FD' />
              <rect x='110' y='38' width='50' height='40' rx='6' fill='#BFDBFE' />
              <path
                d='M125 52 l10-10 l10 10'
                stroke='#3B82F6'
                strokeWidth='2.5'
                fill='none'
                strokeLinecap='round'
              />
              <circle cx='135' cy='60' r='5' fill='#3B82F6' />
              <rect x='170' y='44' width='60' height='8' rx='4' fill='#93C5FD' />
              <rect x='170' y='58' width='45' height='8' rx='4' fill='#BFDBFE' />
              <rect x='170' y='72' width='52' height='8' rx='4' fill='#BFDBFE' />
              {/* Person 1 */}
              <ellipse cx='55' cy='70' rx='18' ry='22' fill='#34D399' />
              <circle cx='55' cy='42' r='14' fill='#1E293B' />
              <path
                d='M30 130 Q55 100 80 130'
                stroke='#34D399'
                strokeWidth='12'
                fill='none'
                strokeLinecap='round'
              />
              {/* Person 2 */}
              <ellipse cx='155' cy='145' rx='18' ry='22' fill='#60A5FA' />
              <circle cx='155' cy='118' r='14' fill='#92400E' />
              <path
                d='M130 175 Q155 148 180 175'
                stroke='#60A5FA'
                strokeWidth='12'
                fill='none'
                strokeLinecap='round'
              />
            </svg>
          </div>
        </div>
      </div>

      {/* What We Do */}
      <div className='bg-white py-16'>
        <div className='max-w-5xl mx-auto px-6'>
          <h2 className='text-4xl font-bold text-slate-900 text-center mb-12'>What We Do</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Card 1 */}
            <div className='border border-slate-200 rounded-xl p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow'>
              <div className='w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-5'>
                <svg className='w-9 h-9 text-blue-400' viewBox='0 0 36 36' fill='none'>
                  <path
                    d='M18 6 L4 17 h4 v13 h8 v-8 h4 v8 h8 V17 h4 Z'
                    fill='currentColor'
                    opacity='0.3'
                  />
                  <path
                    d='M18 6 L4 17 h4 v13 h8 v-8 h4 v8 h8 V17 h4 Z'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    fill='none'
                  />
                  <rect
                    x='14'
                    y='22'
                    width='8'
                    height='8'
                    rx='1'
                    fill='currentColor'
                    opacity='0.6'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-bold text-slate-900 mb-3'>Property Listings</h3>
              <p className='text-slate-500 text-sm leading-relaxed'>
                Browse verified rental and sale listings in real time.
              </p>
            </div>
            {/* Card 2 */}
            <div className='border border-slate-200 rounded-xl p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow'>
              <div className='w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-5'>
                <svg className='w-9 h-9 text-blue-400' viewBox='0 0 36 36' fill='none'>
                  <rect
                    x='4'
                    y='8'
                    width='28'
                    height='20'
                    rx='3'
                    fill='currentColor'
                    opacity='0.2'
                  />
                  <rect
                    x='4'
                    y='8'
                    width='28'
                    height='20'
                    rx='3'
                    stroke='currentColor'
                    strokeWidth='1.5'
                  />
                  <rect
                    x='8'
                    y='14'
                    width='20'
                    height='3'
                    rx='1.5'
                    fill='currentColor'
                    opacity='0.5'
                  />
                  <rect
                    x='8'
                    y='20'
                    width='14'
                    height='3'
                    rx='1.5'
                    fill='currentColor'
                    opacity='0.5'
                  />
                  <circle cx='27' cy='21.5' r='3' fill='currentColor' opacity='0.7' />
                </svg>
              </div>
              <h3 className='text-lg font-bold text-slate-900 mb-3'>
                Tenant & Landlord Dashboards
              </h3>
              <p className='text-slate-500 text-sm leading-relaxed'>
                List, manage, and monitor property performance.
              </p>
            </div>
            {/* Card 3 */}
            <div className='border border-slate-200 rounded-xl p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow'>
              <div className='w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-5'>
                <svg className='w-9 h-9 text-blue-400' viewBox='0 0 36 36' fill='none'>
                  <rect
                    x='4'
                    y='10'
                    width='28'
                    height='18'
                    rx='3'
                    fill='currentColor'
                    opacity='0.2'
                  />
                  <rect
                    x='4'
                    y='10'
                    width='28'
                    height='18'
                    rx='3'
                    stroke='currentColor'
                    strokeWidth='1.5'
                  />
                  <rect
                    x='8'
                    y='15'
                    width='12'
                    height='3'
                    rx='1.5'
                    fill='currentColor'
                    opacity='0.5'
                  />
                  <circle
                    cx='26'
                    cy='19'
                    r='5'
                    fill='currentColor'
                    opacity='0.3'
                    stroke='currentColor'
                    strokeWidth='1.5'
                  />
                  <path
                    d='M23.5 19 h5'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                  />
                  <path
                    d='M26 16.5 v5'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-bold text-slate-900 mb-3'>Payment Management</h3>
              <p className='text-slate-500 text-sm leading-relaxed'>
                Secure, automated rent collection and tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Who We Serve */}
      <div className='py-16'>
        <div className='max-w-5xl mx-auto px-6'>
          <h2 className='text-4xl font-bold text-slate-900 text-center mb-12'>Who We Serve</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Tenants */}
            <div className='flex flex-col items-center text-center px-6'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                <svg className='w-9 h-9 text-blue-500' viewBox='0 0 36 36' fill='currentColor'>
                  <circle cx='18' cy='12' r='7' opacity='0.8' />
                  <path d='M4 30 c0-8 28-8 28 0' opacity='0.6' />
                </svg>
              </div>
              <h3 className='text-lg font-bold text-slate-900 mb-3'>Tenants</h3>
              <p className='text-slate-500 text-sm leading-relaxed'>
                Pay rent, request maintenance, and live stress-free.
              </p>
            </div>
            {/* Landlords */}
            <div className='flex flex-col items-center text-center px-6'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                <svg className='w-9 h-9 text-blue-600' viewBox='0 0 36 36' fill='currentColor'>
                  <circle cx='18' cy='11' r='7' opacity='0.8' />
                  <rect x='13' y='6' width='10' height='3' rx='1.5' fill='white' opacity='0.6' />
                  <path d='M4 30 c0-8 28-8 28 0' opacity='0.6' />
                </svg>
              </div>
              <h3 className='text-lg font-bold text-slate-900 mb-3'>Landlords</h3>
              <p className='text-slate-500 text-sm leading-relaxed'>
                List, manage, and monitor property performance.
              </p>
            </div>
            {/* Property Managers */}
            <div className='flex flex-col items-center text-center px-6'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                <svg className='w-9 h-9 text-blue-700' viewBox='0 0 36 36' fill='currentColor'>
                  <circle cx='18' cy='11' r='7' opacity='0.8' />
                  <path d='M4 30 c0-8 28-8 28 0' opacity='0.6' />
                  <circle cx='27' cy='9' r='4' fill='white' opacity='0.0' />
                  <path
                    d='M24 9 l2 2 l4-4'
                    stroke='white'
                    strokeWidth='1.5'
                    fill='none'
                    strokeLinecap='round'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-bold text-slate-900 mb-3'>Property Managers</h3>
              <p className='text-slate-500 text-sm leading-relaxed'>
                Oversee operations, streamline communication, and grow portfolios.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

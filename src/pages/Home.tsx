export function Home() {
  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 relative overflow-hidden'>
      {/* Decorative elements */}
      <div className='absolute top-10 right-20 w-32 h-32 bg-pink-300 rounded-full opacity-40 blur-2xl'></div>
      <div className='absolute bottom-20 left-10 w-40 h-40 bg-blue-300 rounded-full opacity-30 blur-2xl'></div>

      <div className='max-w-7xl mx-auto px-12 py-40 flex flex-col lg:flex-row items-center justify-between gap-12'>
        {/* Left Content */}
        <div className='flex-1 space-y-8'>
          <div className='space-y-6'>
            <h1 className='text-5xl lg:text-6xl font-bold text-slate-900 leading-tight'>
              Join the hundreds simplifying
            </h1>
            <p className='text-2xl lg:text-3xl text-slate-700 font-light'>
              their property management with Oktopuse
            </p>
          </div>

          <button className='group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
              />
            </svg>
            Get Oktopuse
          </button>
        </div>

        {/* Right Content - Mock Video Interface */}
        <div className='flex-1 relative'>
          <div className='bg-white rounded-2xl shadow-2xl overflow-hidden'>
            {/* Browser-like header */}
            <div className='bg-gray-100 px-4 py-3 flex items-center gap-2 border-b'>
              <div className='flex gap-1.5'>
                <div className='w-3 h-3 rounded-full bg-red-400'></div>
                <div className='w-3 h-3 rounded-full bg-yellow-400'></div>
                <div className='w-3 h-3 rounded-full bg-green-400'></div>
              </div>
              <div className='flex-1 flex justify-center'>
                <div className='bg-white rounded px-4 py-1 text-xs text-gray-500 flex items-center gap-2'>
                  <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Coordinating responses...
                </div>
              </div>
            </div>

            {/* Video call toolbar */}
            <div className='bg-white px-4 py-2 flex items-center justify-between border-b'>
              <div className='flex items-center gap-3'>
                <span className='text-sm text-gray-600'>12:45</span>
              </div>
              <div className='flex items-center gap-2'>
                <button className='p-2 hover:bg-gray-100 rounded-full'>
                  <svg
                    className='w-5 h-5 text-gray-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 19l-7-7 7-7'
                    />
                  </svg>
                </button>
                <button className='p-2 hover:bg-gray-100 rounded-full'>
                  <svg
                    className='w-5 h-5 text-gray-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 4v16m8-8H4'
                    />
                  </svg>
                </button>
                <button className='bg-red-500 text-white px-4 py-1.5 rounded text-sm font-medium'>
                  End call
                </button>
              </div>
            </div>

            {/* Video Grid */}
            <div className='grid grid-cols-2 gap-1 bg-gray-200 p-1'>
              {/* Participant 1 */}
              <div className='aspect-video bg-gradient-to-br from-pink-200 to-pink-300 rounded-lg relative overflow-hidden'>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='w-24 h-24 bg-pink-400 rounded-full opacity-50'></div>
                </div>
                <div className='absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded'>
                  Property Manager
                </div>
              </div>

              {/* Participant 2 */}
              <div className='aspect-video bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg relative overflow-hidden'>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='w-24 h-24 bg-amber-400 rounded-full opacity-50'></div>
                </div>
                <div className='absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded'>
                  Leslie Rowe
                </div>
              </div>

              {/* Participant 3 */}
              <div className='aspect-video bg-gradient-to-br from-rose-200 to-rose-300 rounded-lg relative overflow-hidden'>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='w-24 h-24 bg-rose-400 rounded-full opacity-50'></div>
                </div>
                <div className='absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded'>
                  Tim Sullivan
                </div>
              </div>

              {/* Participant 4 */}
              <div className='aspect-video bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg relative overflow-hidden'>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='w-24 h-24 bg-pink-300 rounded-full opacity-50'></div>
                </div>
                <div className='absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded'>
                  Carole Barber
                </div>
              </div>
            </div>
          </div>

          {/* Chat sidebar mockup */}
          <div className='absolute -right-4 top-20 w-64 bg-white rounded-lg shadow-xl p-4 space-y-3'>
            <div className='flex items-start gap-2'>
              <div className='w-8 h-8 bg-blue-400 rounded-full flex-shrink-0'></div>
              <div className='flex-1'>
                <div className='bg-gray-100 rounded-lg p-2 text-xs text-gray-700'>
                  Good morning! Nice to see everyone today
                </div>
              </div>
            </div>

            <div className='flex items-start gap-2'>
              <div className='w-8 h-8 bg-green-400 rounded-full flex-shrink-0'></div>
              <div className='flex-1'>
                <div className='bg-gray-100 rounded-lg p-2 text-xs text-gray-700'>
                  Yes, tables have been really amazing this month
                </div>
              </div>
            </div>

            <div className='flex items-start gap-2'>
              <div className='w-8 h-8 bg-purple-400 rounded-full flex-shrink-0'></div>
              <div className='flex-1'>
                <div className='bg-indigo-500 text-white rounded-lg p-2 text-xs'>
                  Thanks! I've noticed a lot of positive sign-ups since we updated
                </div>
              </div>
            </div>

            <div className='flex items-start gap-2'>
              <div className='w-8 h-8 bg-pink-400 rounded-full flex-shrink-0'></div>
              <div className='flex-1'>
                <div className='bg-indigo-500 text-white rounded-lg p-2 text-xs'>
                  Update: It is in way this, got a lot of things in total
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2 pt-2 border-t'>
              <div className='w-6 h-6 bg-green-400 rounded-full'></div>
              <div className='text-xs font-medium text-gray-700'>Enter collaborator</div>
            </div>

            <div className='flex items-center gap-2 bg-gray-50 rounded-lg p-2'>
              <input
                type='text'
                placeholder='Type a message...'
                className='flex-1 bg-transparent text-xs outline-none'
              />
              <button className='text-gray-400 hover:text-gray-600'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Decorative 3D elements */}
          <div className='absolute -bottom-10 -left-10 w-32 h-32 opacity-60'>
            <div className='w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg transform rotate-12'></div>
          </div>
        </div>
      </div>

      {/* Decorative bottom elements */}
      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 opacity-40'>
        <div className='relative'>
          <div className='absolute bottom-0 left-1/4 w-20 h-40 bg-coral-400 rounded-t-full'></div>
          <div className='absolute bottom-0 left-1/2 w-16 h-32 bg-pink-400 rounded-t-full transform -translate-x-1/2'></div>
          <div className='absolute bottom-0 right-1/4 w-24 h-36 bg-green-400 rounded-t-full'></div>
        </div>
      </div>

      {/* Made by property managers section */}
      <div className='max-w-7xl mx-auto px-6 pt-20 pb-10'>
        <h2 className='text-4xl lg:text-5xl font-light text-slate-700 text-center mb-16'>
          Made by property manager for other property managers
        </h2>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Card 1 - Landlords */}
          <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
            <div className='h-64 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden'>
              <img
                src='https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop'
                alt='Landlords reviewing documents'
                className='w-full h-full object-cover'
              />
            </div>
            <div className='p-8 space-y-4'>
              <h3 className='text-2xl font-semibold text-slate-800'>
                Perfect for landlords who manage their own properties
              </h3>
              <p className='text-slate-600 leading-relaxed'>
                Owner manage can be a hassle in the absence of processes and tools. With the
                Oktopuse, manage your own property becomes easier.
              </p>
              <a
                href='#'
                className='inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group'
              >
                Create an Account
                <svg
                  className='w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Card 2 - Property Managers */}
          <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
            <div className='h-64 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden'>
              <img
                src='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop'
                alt='Property manager at business'
                className='w-full h-full object-cover'
              />
            </div>
            <div className='p-8 space-y-4'>
              <h3 className='text-2xl font-semibold text-slate-800'>
                The best tool for PM who values peace and effectiveness
              </h3>
              <p className='text-slate-600 leading-relaxed'>
                Expanding requires innovation to minimize the stress and maximize results. Cordinate
                tenant and maintainance in one place.
              </p>
              <a
                href='#'
                className='inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group'
              >
                Start a Optimizing your process
                <svg
                  className='w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Don't Let a Cost Ruin Your Growth Plan section */}
      <div className='max-w-7xl mx-auto px-6 pt-10 pb-20'>
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
          <div className='grid lg:grid-cols-2 gap-0'>
            {/* Left Content */}
            <div className='p-12 lg:p-16 flex flex-col justify-center space-y-8'>
              <h2 className='text-4xl lg:text-5xl font-light text-slate-700 leading-tight'>
                Don't Let a Cost Ruin Your Growth Plan
              </h2>

              <p className='text-slate-600 text-lg leading-relaxed'>
                Simplify your rental operations and focus on growing your doors. Try Oktopuse free —
                no credit card, no questions asked.
              </p>

              <button className='self-start border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded text-lg font-semibold transition-all duration-300 flex items-center gap-2 group'>
                Get Started with a 60-Day Trial
                <svg
                  className='w-5 h-5 group-hover:translate-x-1 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </button>
            </div>

            {/* Right Content */}
            <div className='p-12 lg:p-16 bg-gray-50 flex flex-col justify-center space-y-6'>
              <h3 className='text-2xl font-semibold text-slate-800 mb-4'>Learn More About It</h3>

              <div className='space-y-4'>
                <a
                  href='#'
                  className='flex items-center text-blue-600 hover:text-blue-700 text-lg group'
                >
                  <svg
                    className='w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                  Rent Collection
                </a>

                <a
                  href='#'
                  className='flex items-center text-blue-600 hover:text-blue-700 text-lg group'
                >
                  <svg
                    className='w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                  Maintenance Management
                </a>

                <a
                  href='#'
                  className='flex items-center text-blue-600 hover:text-blue-700 text-lg group'
                >
                  <svg
                    className='w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                  Communication with Renters and Landlords
                </a>
              </div>

              {/* Image */}
              <div className='mt-8 rounded-lg overflow-hidden'>
                <img
                  src='https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800&h=400&fit=crop'
                  alt='Person walking in work boots'
                  className='w-full h-64 object-cover'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

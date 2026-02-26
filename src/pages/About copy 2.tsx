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

      {/* Content */}
      <div className='max-w-4xl mx-auto px-6 py-12'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <div className='flex items-center gap-3 mb-4'>
            <h2 className='text-3xl font-bold text-slate-900'>Who We Are</h2>
          </div>
          <p className='text-slate-700 leading-relaxed'>
            Oktopuse is a modern property management platform built by property managers, for
            property managers. We understand the daily challenges of managing rentals because
            we&apos;ve lived them—and we&apos;ve designed Oktopuse to solve them.
          </p>
        </div>

        {/* Section 1 */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <h2 className='text-2xl font-bold text-slate-900 mb-6'>
            Whether you're a renter, landlord, or property manager, Oktopuse streamlines your
            experience with powerful, intuitive tools:
          </h2>
          <ul className='space-y-4'>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <div>
                <span className='font-semibold text-slate-900'>Renters: </span>
                <span className='text-slate-700'>
                  can pay rent online, submit maintenance requests, download lease documents, and
                  stay connected—all from one secure dashboard.
                </span>
              </div>
            </li>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <div>
                <span className='font-semibold text-slate-900'>
                  Landlords and Property Managers:{' '}
                </span>
                <span className='text-slate-700'>
                  can manage leases, track payments, handle maintenance workflows, communicate with
                  tenants, and much more.
                </span>
              </div>
            </li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <h2 className='text-2xl font-bold text-slate-900 mb-6'>Our mission is simple:</h2>
          <p className='text-slate-700 mb-6 leading-relaxed'>
            to make property management effortless, transparent, and human-centered. With deep
            industry insight and a passion for innovation, we&apos;ve built a platform that empowers
            everyone involved in the rental lifecycle.
          </p>
          <p className='text-slate-700 leading-relaxed'>
            At Oktopuse, we&apos;re not just software developers—we&apos;re property professionals
            who believe in better systems, better service, and better living. Register today to
            start simplifying your real estate journey.
          </p>
        </div>
      </div>
    </div>
  );
}

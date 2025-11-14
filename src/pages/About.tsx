import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className='mt-12 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      <div className='max-w-4xl mx-auto px-6 py-12'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <div className='flex items-center gap-3 mb-4'>
            <h1 className='text-4xl font-bold text-slate-900'>About Us</h1>
          </div>

          <p className='text-slate-700 leading-relaxed'>
            Oktopuse is a modern property management platform built by property managers, for
            property managers. We understand the daily challenges of managing rentals because
            we&apos;ve lived them—and we&apos;ve designed Oktopuse to solve them.
          </p>
        </div>

        {/* Section 1: General Terms */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <div className='flex items-center gap-3 mb-6'>
            <h2 className='text-2xl font-bold text-slate-900'>
              Whether you're a renter, landlord, or property manager, Oktopuse streamlines your
              experience with powerful, intuitive tools:
            </h2>
          </div>
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

        {/* Section 2: Property Managers */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <div className='flex items-center gap-3 mb-6'>
            <h2 className='text-2xl font-bold text-slate-900'>Our mission is simple:</h2>
          </div>
          <p className='text-slate-700 mb-6 leading-relaxed'>
            to make property management effortless, transparent, and human-centered. With deep
            industry insight and a passion for innovation, we&apos;ve built a platform that empowers
            everyone involved in the rental lifecycle.
          </p>

          <p className='text-slate-700 mb-6 leading-relaxed'>
            At Oktopuse, we&apos;re not just software developers—we&apos;re property professionals
            who believe in better systems, better service, and better living. Register today to
            start simplifying your real estate journey
          </p>
        </div>
      </div>
    </div>
  );
}

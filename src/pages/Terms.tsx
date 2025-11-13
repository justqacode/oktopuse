import { Link } from 'react-router-dom';

export default function OktopuseTerms() {
  return (
    <div className='mt-12 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      <div className='max-w-4xl mx-auto px-6 py-12'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <div className='flex items-center gap-3 mb-4'>
            <h1 className='text-4xl font-bold text-slate-900'>Oktopuse Terms and Conditions</h1>
          </div>
          <div className='flex gap-6 text-sm text-slate-600'>
            <p>
              <span className='font-semibold'>Effective Date:</span> July 1, 2025
            </p>
            <p>
              <span className='font-semibold'>Last Updated:</span> November 1, 2025
            </p>
          </div>

          <div className='flex gap-2 text-sm text-slate-600 mt-6'>
            See our privacy policy:{' '}
            <Link to='/privacy-policy' className='underline text-blue-600 hover:text-blue-800'>
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Introduction */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <p className='text-slate-700 leading-relaxed'>
            Welcome to Oktopuse, a property management platform designed to streamline
            communication, operations, and documentation between property managers, landlords, and
            tenants. By using Oktopuse, you agree to the following terms and conditions.
          </p>
        </div>

        {/* Section 1: General Terms */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <div className='flex items-center gap-3 mb-6'>
            <h2 className='text-2xl font-bold text-slate-900'>
              1. General Terms (Applicable to All Users)
            </h2>
          </div>
          <ul className='space-y-4'>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <div>
                <span className='font-semibold text-slate-900'>Eligibility:</span>
                <span className='text-slate-700'>
                  {' '}
                  You must be at least 18 years old to use Oktopuse.
                </span>
              </div>
            </li>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <div>
                <span className='font-semibold text-slate-900'>Account Security:</span>
                <span className='text-slate-700'>
                  {' '}
                  You are responsible for maintaining the confidentiality of your login credentials.
                </span>
              </div>
            </li>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <div>
                <span className='font-semibold text-slate-900'>Data Accuracy:</span>
                <span className='text-slate-700'>
                  {' '}
                  You agree to provide accurate and up-to-date information.
                </span>
              </div>
            </li>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <div>
                <span className='font-semibold text-slate-900'>Prohibited Use:</span>
                <span className='text-slate-700'>
                  {' '}
                  You may not use Oktopuse for illegal activities, harassment, or fraud.
                </span>
              </div>
            </li>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <div>
                <span className='font-semibold text-slate-900'>Termination:</span>
                <span className='text-slate-700'>
                  {' '}
                  Oktopuse reserves the right to suspend or terminate accounts for violations of
                  these terms.
                </span>
              </div>
            </li>
          </ul>
        </div>

        {/* Section 2: Property Managers */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <div className='flex items-center gap-3 mb-6'>
            <h2 className='text-2xl font-bold text-slate-900'>2. Property Managers</h2>
          </div>
          <p className='text-slate-700 mb-6 leading-relaxed'>
            As a Property Manager, you may use Oktopuse to manage properties, communicate with
            tenants and landlords, and oversee maintenance and financial operations.
          </p>

          <h3 className='text-xl font-semibold text-slate-900 mb-4'>Responsibilities:</h3>
          <ul className='space-y-3 mb-6'>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <span className='text-slate-700'>
                Ensure all property listings and tenant records are accurate and lawful.
              </span>
            </li>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <span className='text-slate-700'>
                Respond to tenant inquiries and maintenance requests in a timely manner.
              </span>
            </li>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <span className='text-slate-700'>
                Maintain compliance with local housing laws and regulations.
              </span>
            </li>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <span className='text-slate-700'>
                Use Oktopuse tools (e.g., rent collection, maintenance scheduling) responsibly and
                transparently.
              </span>
            </li>
          </ul>

          <h3 className='text-xl font-semibold text-slate-900 mb-4'>Restrictions:</h3>
          <ul className='space-y-3'>
            <li className='flex gap-3'>
              <span className='text-red-600 font-bold'>•</span>
              <span className='text-slate-700'>You may not impersonate landlords or tenants.</span>
            </li>
            <li className='flex gap-3'>
              <span className='text-red-600 font-bold'>•</span>
              <span className='text-slate-700'>
                You may not use tenant data for purposes outside of property management.
              </span>
            </li>
          </ul>
        </div>

        {/* Section 3: Landlords */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <div className='flex items-center gap-3 mb-6'>
            <h2 className='text-2xl font-bold text-slate-900'>3. Landlords</h2>
          </div>
          <p className='text-slate-700 mb-6 leading-relaxed'>
            As a Landlord, you may use Oktopuse to monitor property performance, communicate with
            property managers, and access financial reports.
          </p>

          <h3 className='text-xl font-semibold text-slate-900 mb-4'>Responsibilities:</h3>
          <ul className='space-y-3 mb-6'>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <span className='text-slate-700'>
                Provide accurate ownership and property details.
              </span>
            </li>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <span className='text-slate-700'>
                Collaborate with property managers to ensure tenant satisfaction.
              </span>
            </li>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <span className='text-slate-700'>
                Comply with all applicable housing laws and tax obligations.
              </span>
            </li>
          </ul>

          <h3 className='text-xl font-semibold text-slate-900 mb-4'>Restrictions:</h3>
          <ul className='space-y-3'>
            <li className='flex gap-3'>
              <span className='text-red-600 font-bold'>•</span>
              <span className='text-slate-700'>
                When an agreement with property manager is in place, you may not bypass property
                manager to directly manage tenants unless explicitly agreed upon.
              </span>
            </li>
            <li className='flex gap-3'>
              <span className='text-red-600 font-bold'>•</span>
              <span className='text-slate-700'>
                You may not use the platform to evict tenants without proper legal process.
              </span>
            </li>
          </ul>
        </div>

        {/* Section 4: Tenants */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <div className='flex items-center gap-3 mb-6'>
            <h2 className='text-2xl font-bold text-slate-900'>4. Tenants</h2>
          </div>
          <p className='text-slate-700 mb-6 leading-relaxed'>
            As a Tenant, you may use Oktopuse to pay rent, submit maintenance requests, and
            communicate with property managers or landlords.
          </p>

          <h3 className='text-xl font-semibold text-slate-900 mb-4'>Responsibilities:</h3>
          <ul className='space-y-3 mb-6'>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <span className='text-slate-700'>
                Pay rent and fees on time through the platform.
              </span>
            </li>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <span className='text-slate-700'>
                Report maintenance issues promptly and accurately.
              </span>
            </li>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <span className='text-slate-700'>
                Maintain respectful communication with property managers and landlords.
              </span>
            </li>
          </ul>

          <h3 className='text-xl font-semibold text-slate-900 mb-4'>Restrictions:</h3>
          <ul className='space-y-3'>
            <li className='flex gap-3'>
              <span className='text-red-600 font-bold'>•</span>
              <span className='text-slate-700'>
                You may not use the platform to submit false claims or harass other users.
              </span>
            </li>
            <li className='flex gap-3'>
              <span className='text-red-600 font-bold'>•</span>
              <span className='text-slate-700'>
                You may not share access credentials with others.
              </span>
            </li>
          </ul>
        </div>

        {/* Section 5: Privacy and Data Use */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <div className='flex items-center gap-3 mb-6'>
            <h2 className='text-2xl font-bold text-slate-900'>5. Privacy and Data Use</h2>
          </div>
          <ul className='space-y-4'>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <span className='text-slate-700'>
                Oktopuse collects and stores user data in accordance with its Privacy Policy.
              </span>
            </li>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <span className='text-slate-700'>
                Data may be shared with relevant parties (e.g., landlords, property managers) for
                operational purposes.
              </span>
            </li>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <span className='text-slate-700'>
                Users may request data deletion or account termination at any time.
              </span>
            </li>
          </ul>
        </div>

        {/* Section 6: Liability and Disclaimers */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <div className='flex items-center gap-3 mb-6'>
            <h2 className='text-2xl font-bold text-slate-900'>6. Liability and Disclaimers</h2>
          </div>
          <ul className='space-y-4'>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <span className='text-slate-700'>
                Oktopuse is not liable for disputes between users (e.g., tenant-landlord conflicts).
              </span>
            </li>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <span className='text-slate-700'>
                The platform is provided "as is" without warranties of any kind.
              </span>
            </li>
            <li className='flex gap-3'>
              <span className='text-blue-600 font-bold'>•</span>
              <span className='text-slate-700'>
                Oktopuse is not responsible for third-party integrations or payment processing
                errors.
              </span>
            </li>
          </ul>
        </div>

        {/* Section 7: Changes to Terms */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <div className='flex items-center gap-3 mb-6'>
            <h2 className='text-2xl font-bold text-slate-900'>7. Changes to Terms</h2>
          </div>
          <p className='text-slate-700 leading-relaxed'>
            Oktopuse may update these terms from time to time. Continued use of the platform after
            changes constitutes acceptance of the new terms.
          </p>
        </div>
      </div>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/pricing') {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className='w-full min-h-screen bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden transition-colors duration-500'>
      {/* Decorative background glows */}
      <div className='absolute top-[-10%] right-[-5%] w-[45rem] h-[45rem] rounded-full bg-primary/10 opacity-20 blur-[130px] pointer-events-none'></div>
      <div className='absolute bottom-[15%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-primary/5 opacity-15 blur-[110px] pointer-events-none'></div>

      <div className='max-w-7xl mx-auto px-6 lg:px-12 py-32 lg:py-44 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10'>
        {/* Left Content */}
        <div className='flex-1 space-y-8 text-center lg:text-left'>
          <div className='space-y-6'>
            <h1 className='text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight bg-gradient-to-r from-foreground via-foreground to-foreground/75 bg-clip-text'>
              Simplify Your <br />
              <span className='text-primary bg-gradient-to-r from-primary to-primary-hover bg-clip-text'>Property Management</span>
            </h1>
            <p className='text-xl lg:text-2xl text-muted-foreground font-light max-w-xl mx-auto lg:mx-0'>
              The intuitive platform built by property managers, designed for landlords and tenants who value efficiency and clarity.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row justify-center lg:justify-start gap-4 items-center'>
            <Link to='/register' className='sams-btn w-full sm:w-auto px-8 py-3 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all'>
              Get Oktopuse Free
            </Link>
            <a href='#pricing' className='w-full sm:w-auto flex justify-center items-center py-2.5 px-6 border border-border hover:bg-accent text-foreground rounded-lg font-medium transition-colors duration-200'>
              View Pricing
            </a>
          </div>
        </div>

        {/* Right Content - Mock Video Interface */}
        <div className='flex-1 w-full max-w-xl lg:max-w-none relative mt-8 lg:mt-0'>
          <div className='bg-card border border-border/70 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-primary/5'>
            {/* Browser-like header */}
            <div className='bg-muted/50 px-4 py-3 flex items-center gap-2 border-b border-border/50'>
              <div className='flex gap-1.5'>
                <div className='w-3 h-3 rounded-full bg-destructive/80'></div>
                <div className='w-3 h-3 rounded-full bg-amber-400'></div>
                <div className='w-3 h-3 rounded-full bg-green-400'></div>
              </div>
              <div className='flex-1 flex justify-center'>
                <div className='bg-card border border-border/40 rounded px-4 py-1 text-[11px] text-muted-foreground flex items-center gap-2 shadow-xs'>
                  <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse'></span>
                  oktopuse.com/dashboard
                </div>
              </div>
            </div>

            {/* Video call toolbar */}
            <div className='bg-card px-4 py-3 flex items-center justify-between border-b border-border/50'>
              <div className='flex items-center gap-3'>
                <span className='text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded'>12:45 PM</span>
              </div>
              <div className='flex items-center gap-2'>
                <button className='p-1.5 hover:bg-muted text-muted-foreground rounded-md transition-colors'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                  </svg>
                </button>
                <button className='p-1.5 hover:bg-muted text-muted-foreground rounded-md transition-colors'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                  </svg>
                </button>
                <button className='bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors duration-200'>
                  Send Message
                </button>
              </div>
            </div>

            {/* Video Grid */}
            <div className='grid grid-cols-2 gap-1.5 bg-muted/30 p-2'>
              {/* Participant 1 */}
              <div className='aspect-video bg-gradient-to-br from-indigo-100 to-violet-200 dark:from-slate-800 dark:to-slate-700 rounded-xl relative overflow-hidden border border-border/40 shadow-xs'>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-lg border border-primary/20'>
                    PM
                  </div>
                </div>
                <div className='absolute bottom-2 left-2 bg-background/80 dark:bg-slate-900/90 text-foreground text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs'>
                  Property Manager
                </div>
              </div>

              {/* Participant 2 */}
              <div className='aspect-video bg-gradient-to-br from-pink-100 to-rose-200 dark:from-slate-800 dark:to-slate-700 rounded-xl relative overflow-hidden border border-border/40 shadow-xs'>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 font-bold text-lg border border-rose-500/20'>
                    LR
                  </div>
                </div>
                <div className='absolute bottom-2 left-2 bg-background/80 dark:bg-slate-900/90 text-foreground text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs'>
                  Leslie Rowe (Tenant)
                </div>
              </div>

              {/* Participant 3 */}
              <div className='aspect-video bg-gradient-to-br from-amber-100 to-orange-200 dark:from-slate-800 dark:to-slate-700 rounded-xl relative overflow-hidden border border-border/40 shadow-xs'>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-600 font-bold text-lg border border-amber-500/20'>
                    TS
                  </div>
                </div>
                <div className='absolute bottom-2 left-2 bg-background/80 dark:bg-slate-900/90 text-foreground text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs'>
                  Tim Sullivan (Landlord)
                </div>
              </div>

              {/* Participant 4 */}
              <div className='aspect-video bg-gradient-to-br from-teal-100 to-emerald-200 dark:from-slate-800 dark:to-slate-700 rounded-xl relative overflow-hidden border border-border/40 shadow-xs'>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg border border-emerald-500/20'>
                    CB
                  </div>
                </div>
                <div className='absolute bottom-2 left-2 bg-background/80 dark:bg-slate-900/90 text-foreground text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs'>
                  Carole Barber (Vendor)
                </div>
              </div>
            </div>
          </div>

          {/* Chat sidebar mockup */}
          <div className='absolute -right-4 top-24 w-60 bg-card/90 backdrop-blur-md rounded-xl border border-border/70 shadow-2xl p-4 space-y-3 hidden sm:block transition-all hover:scale-102 duration-300'>
            <div className='flex items-start gap-2'>
              <div className='w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold'>
                PM
              </div>
              <div className='flex-1'>
                <div className='bg-muted/80 rounded-lg p-2 text-[10px] text-foreground leading-normal'>
                  Reminder: HVAC maintenance is scheduled for Tuesday.
                </div>
              </div>
            </div>

            <div className='flex items-start gap-2 justify-end'>
              <div className='flex-1 text-right'>
                <div className='bg-primary text-primary-foreground rounded-lg p-2 text-[10px] inline-block text-left leading-normal shadow-xs'>
                  Awesome, I will be home. Thanks!
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2 pt-2 border-t border-border/50'>
              <span className='w-1.5 h-1.5 rounded-full bg-emerald-500'></span>
              <span className='text-[10px] font-medium text-muted-foreground'>Ryan is typing...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Made by property managers section */}
      <div className='max-w-7xl mx-auto px-6 py-24 relative z-10'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <h2 className='text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4'>
            Designed by property managers.
          </h2>
          <p className='text-lg lg:text-xl text-muted-foreground font-light'>
            We know the stress of coordination. That's why we created a centralized space to manage listings, leases, maintenance, and messages seamlessly.
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Card 1 - Landlords */}
          <div className='bg-card rounded-2xl border border-border/70 shadow-lg overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col'>
            <div className='h-64 overflow-hidden relative'>
              <div className='absolute inset-0 bg-primary/5 z-10 transition-colors group-hover:bg-transparent'></div>
              <img
                src='/home-landlord-manage.jpg'
                alt='Landlords reviewing documents'
                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
              />
            </div>
            <div className='p-8 space-y-4 flex-1 flex flex-col justify-between'>
              <div className='space-y-2'>
                <h3 className='text-2xl font-bold text-foreground'>
                  For Independent Landlords
                </h3>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  Managing properties on your own shouldn't feel like a full-time stress loop. Oktopuse equips you with automated rent collections, digital leases, and tenant chats.
                </p>
              </div>
              <Link
                to='/register'
                className='inline-flex items-center text-primary hover:text-primary-hover font-semibold text-sm pt-4 group/link'
              >
                Create a Landlord Account
                <svg
                  className='w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </Link>
            </div>
          </div>

          {/* Card 2 - Property Managers */}
          <div className='bg-card rounded-2xl border border-border/70 shadow-lg overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col'>
            <div className='h-64 overflow-hidden relative'>
              <div className='absolute inset-0 bg-primary/5 z-10 transition-colors group-hover:bg-transparent'></div>
              <img
                src='/home-manager-manage.jpg'
                alt='Property manager at business'
                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
              />
            </div>
            <div className='p-8 space-y-4 flex-1 flex flex-col justify-between'>
              <div className='space-y-2'>
                <h3 className='text-2xl font-bold text-foreground'>
                  For Property Managers
                </h3>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  Scale your operations and maximize productivity. Coordinate tenants, landlords, maintenance requests, and work orders in a single, robust workspace.
                </p>
              </div>
              <Link
                to='/register'
                className='inline-flex items-center text-primary hover:text-primary-hover font-semibold text-sm pt-4 group/link'
              >
                Optimize Your Operations
                <svg
                  className='w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Don't Let a Cost Ruin Your Growth Plan section */}
      <div className='max-w-7xl mx-auto px-6 py-16 relative z-10'>
        <div className='bg-card rounded-3xl border border-border/70 shadow-xl overflow-hidden'>
          <div className='grid lg:grid-cols-2 gap-0'>
            {/* Left Content */}
            <div className='p-10 lg:p-16 flex flex-col justify-center space-y-6'>
              <h2 className='text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight'>
                Don't let cost ruin your growth plan.
              </h2>
              <p className='text-muted-foreground text-base leading-relaxed'>
                Simplify your rental operations and focus on expanding your portfolio. Test-drive all premium Oktopuse features free for 90 days. No credit card required.
              </p>

              <button
                onClick={() => navigate('/register')}
                className='sams-btn self-start sm:w-auto px-8 py-3 text-base shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all flex items-center gap-2 group/btn'
              >
                Start 90-Day Pro Trial
                <svg
                  className='w-5 h-5 group-hover/btn:translate-x-1 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </button>
            </div>

            {/* Right Content */}
            <div className='p-10 lg:p-16 bg-muted/40 border-t lg:border-t-0 lg:border-l border-border/50 flex flex-col justify-center space-y-6'>
              <h3 className='text-xl font-bold text-foreground'>What We Simplify:</h3>
              <div className='space-y-4'>
                <div className='flex items-center gap-3 text-muted-foreground text-base hover:text-foreground transition-colors duration-200'>
                  <span className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold'>✓</span>
                  Rent Collection & Tracking
                </div>
                <div className='flex items-center gap-3 text-muted-foreground text-base hover:text-foreground transition-colors duration-200'>
                  <span className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold'>✓</span>
                  Maintenance Requests
                </div>
                <div className='flex items-center gap-3 text-muted-foreground text-base hover:text-foreground transition-colors duration-200'>
                  <span className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold'>✓</span>
                  Landlord & Tenant Messaging
                </div>
              </div>

              {/* Image */}
              <div className='rounded-xl overflow-hidden border border-border/50 shadow-sm mt-4'>
                <img
                  src='/home-section-3.jpg'
                  alt='Person walking in work boots'
                  className='w-full h-48 object-cover filter brightness-95'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id='pricing' className='max-w-7xl mx-auto px-6 py-24 relative z-10'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4'>Select a Plan</h2>
          <p className='text-lg text-muted-foreground max-w-lg mx-auto'>
            Choose a tier that matches your property management needs, risk-free.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch'>
          {/* Free Trial */}
          <div className='bg-card rounded-2xl border border-border/70 shadow-lg p-8 flex flex-col justify-between hover:border-primary/30 transition-all duration-300 group hover:shadow-xl'>
            <div className='space-y-6'>
              <div className='text-center'>
                <div className='inline-block p-3 bg-muted rounded-xl mb-4 text-muted-foreground group-hover:text-primary transition-colors'>
                  <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                  </svg>
                </div>
                <h3 className='text-xl font-bold text-foreground'>Free Trial</h3>
                <div className='mt-3 flex items-baseline justify-center'>
                  <span className='text-4xl font-extrabold text-foreground'>$0</span>
                  <span className='text-muted-foreground text-sm ml-2'>forever</span>
                </div>
              </div>

              <div className='border-t border-border/50 pt-6 space-y-4 text-sm text-muted-foreground'>
                <div className='flex items-center gap-3'>
                  <span className='text-emerald-500 font-bold'>✓</span>
                  Manage 1 Property/Unit
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-emerald-500 font-bold'>✓</span>
                  Chat with Landlords/Tenants
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-emerald-500 font-bold'>✓</span>
                  View Payments Only
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-emerald-500 font-bold'>✓</span>
                  Basic Email Support
                </div>
              </div>
            </div>

            <Link to='/register' className='mt-8 block'>
              <div className='sams-btn bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-foreground shadow-xs'>Current Plan</div>
            </Link>
          </div>

          {/* Basic Plan */}
          <div className='bg-card rounded-2xl border-2 border-primary shadow-xl p-8 flex flex-col justify-between relative transform lg:scale-105 group hover:shadow-2xl transition-all duration-300'>
            <div className='absolute -top-3.5 left-1/2 transform -translate-x-1/2 z-25'>
              <span className='bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm'>
                POPULAR
              </span>
            </div>

            <div className='space-y-6'>
              <div className='text-center'>
                <div className='inline-block p-3 bg-primary/10 rounded-xl mb-4 text-primary'>
                  <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                  </svg>
                </div>
                <h3 className='text-xl font-bold text-foreground'>Basic</h3>
                <div className='mt-3 flex items-baseline justify-center'>
                  <span className='text-4xl font-extrabold text-foreground'>$19.99</span>
                  <span className='text-muted-foreground text-sm ml-2'>/mo</span>
                </div>
              </div>

              <div className='border-t border-border/50 pt-6 space-y-4 text-sm text-muted-foreground'>
                <div className='flex items-center gap-3 font-semibold text-foreground'>
                  <span className='text-emerald-500'>✓</span>
                  Manage Up to 5 Properties
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-emerald-500 font-bold'>✓</span>
                  Chat with Landlords/Tenants
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-emerald-500 font-bold'>✓</span>
                  Collect Rent Payments
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-emerald-500 font-bold'>✓</span>
                  Maintenance Requests
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-emerald-500 font-bold'>✓</span>
                  Standard Support
                </div>
              </div>
            </div>

            <Link to='/register' className='mt-8 block'>
              <div className='sams-btn shadow-md shadow-primary/20 hover:shadow-lg'>Upgrade</div>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className='bg-card rounded-2xl border border-border/70 shadow-lg p-8 flex flex-col justify-between hover:border-primary/30 transition-all duration-300 group hover:shadow-xl'>
            <div className='space-y-6'>
              <div className='text-center'>
                <div className='inline-block p-3 bg-muted rounded-xl mb-4 text-muted-foreground group-hover:text-primary transition-colors'>
                  <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                  </svg>
                </div>
                <h3 className='text-xl font-bold text-foreground'>Pro</h3>
                <div className='mt-3 flex items-baseline justify-center'>
                  <span className='text-4xl font-extrabold text-foreground'>$49.99</span>
                  <span className='text-muted-foreground text-sm ml-2'>/mo</span>
                </div>
              </div>

              <div className='border-t border-border/50 pt-6 space-y-4 text-sm text-muted-foreground'>
                <div className='flex items-center gap-3 font-semibold text-foreground'>
                  <span className='text-emerald-500'>✓</span>
                  Manage Up to 20 Properties
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-emerald-500 font-bold'>✓</span>
                  Chat with Landlords/Tenants
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-emerald-500 font-bold'>✓</span>
                  Collect Rent & Payments
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-emerald-500 font-bold'>✓</span>
                  Advanced Financial Reports
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-emerald-500 font-bold'>✓</span>
                  Priority Support
                </div>
              </div>
            </div>

            <Link to='/register' className='mt-8 block'>
              <div className='sams-btn bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-foreground shadow-xs'>Upgrade</div>
            </Link>
          </div>
        </div>

        {/* Contact Section */}
        <div className='text-center mt-16 relative z-10'>
          <p className='text-muted-foreground text-base'>
            Need an enterprise plan?{' '}
            <Link
              to='/contact'
              className='text-primary hover:text-primary-hover font-semibold underline underline-offset-4 transition-colors'
            >
              Contact Us
            </Link>{' '}
            for a custom-tailored solution.
          </p>
        </div>
      </div>
    </div>
  );
}

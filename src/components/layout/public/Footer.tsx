import {
  IconBrandFacebookFilled,
  IconBrandLinkedinFilled,
  IconBrandTwitterFilled,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTwitter,
} from '@tabler/icons-react';
// import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className='bg-card text-muted-foreground border-t border-border/60 py-16 px-8 transition-colors duration-300'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 mb-12'>
          {/* Logo and Social */}
          <div className='flex flex-col space-y-6'>
            <Link to='/' className='flex items-center space-x-2 transition-opacity hover:opacity-90'>
              <img src='/oktopuse-logo-no-bk.png' alt='Oktopuse Logo' className='h-8 w-auto filter drop-shadow-sm' />
            </Link>
            <p className='text-sm text-muted-foreground/80 max-w-xs leading-relaxed'>
              Built by Property Managers. Designed for Everyone. Experience the next generation of property management.
            </p>

          </div>

          {/* Pages Column */}
          <div>
            <h3 className='text-foreground text-sm font-semibold mb-6 uppercase tracking-wider'>
              Pages
            </h3>
            <ul className='space-y-4 text-sm'>
              <li>
                <Link to='/register' className='hover:text-primary transition-colors duration-200'>
                  Register
                </Link>
              </li>
              <li>
                <Link to='/about' className='hover:text-primary transition-colors duration-200'>
                  About Us
                </Link>
              </li>
              <li>
                <Link to='/pricing' className='hover:text-primary transition-colors duration-200'>
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className='text-foreground text-sm font-semibold mb-6 uppercase tracking-wider'>
              Support
            </h3>
            <ul className='space-y-4 text-sm'>
              <li>
                <Link to='/contact' className='hover:text-primary transition-colors duration-200'>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to='/terms' className='hover:text-primary transition-colors duration-200'>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to='/privacy-policy' className='hover:text-primary transition-colors duration-200'>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className='pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-xs text-muted-foreground/60'>
            &copy; {new Date().getFullYear()} Oktopuse. All rights reserved.
          </p>
          <div className='flex space-x-6 text-xs text-muted-foreground/60'>
            <Link to='/terms' className='hover:text-primary transition-colors'>Terms</Link>
            <Link to='/privacy-policy' className='hover:text-primary transition-colors'>Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

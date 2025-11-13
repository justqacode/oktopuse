import {
  IconBrandFacebookFilled,
  IconBrandLinkedinFilled,
  IconBrandTwitterFilled,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className='bg-black text-gray-400 py-16 px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 mb-16'>
          {/* Logo and Social */}
          <div>
            {/* Logo */}
            <div className='flex items-center space-x-2 mb-6'>
              <Link to='/'>
                <div className='flex items-center space-x-2'>
                  <div className='w-8 h-8 bg-primary rounded-md flex items-center justify-center'>
                    <span className='text-primary-foreground font-bold text-sm'>OP</span>
                  </div>
                  <span className='font-semibold text-lg'>
                    {/* White<span className='text-primary'>Gloves</span> */}
                    Oktopuse
                  </span>
                </div>
              </Link>
            </div>
            <div className='flex gap-3'>
              {/* <a href="#" className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center hover:bg-zinc-800 transition">
                <Github className="w-5 h-5" />
              </a> */}
              <a
                href='#'
                className='w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center hover:bg-zinc-800 transition'
              >
                <IconBrandLinkedinFilled className='w-5 h-5' />
              </a>
              <a
                href='#'
                className='w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center hover:bg-zinc-800 transition'
              >
                <IconBrandFacebookFilled className='w-5 h-5' />
              </a>
              <a
                href='#'
                className='w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center hover:bg-zinc-800 transition'
              >
                <IconBrandTwitterFilled className='w-5 h-5' />
              </a>
            </div>
          </div>

          {/* Tools Column */}
          <div>
            <h3 className='text-white text-sm font-semibold mb-6 uppercase tracking-wider'>Home</h3>
            <ul className='space-y-4'>
              <li>
                <a href='#' className='hover:text-white transition'>
                  Listing
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white transition'>
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className='text-white text-sm font-semibold mb-6 uppercase tracking-wider'>
              Support
            </h3>
            <ul className='space-y-4'>
              <li>
                <a href='#' className='hover:text-white transition'>
                  Contact Us
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white transition'>
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Large Background Text */}
        <div className='relative overflow-hidden'>
          {/* <div className='text-[180px] font-bold text-zinc-900 leading-none select-none'>
            Shadcnblocks.com
          </div> */}
          <p className='relative text-sm text-gray-500 text-center'>
            &copy; {new Date().getFullYear()} Oktopuse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
// import AnimatedButton from '../ui/AnimatedButton';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/auth/authStore';
import AnimatedButton from '../ui/AnimatedButton';
import { toast } from 'sonner';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: 'about' },
  { name: 'Services', href: '/services' },
  { name: 'Mentors', href: '/mentors' },
  { name: 'Tutors', href: '/tutors' },
  { name: 'FAQ', href: '/faq' },
  // { name: 'Testimonials', href: '/#testimonials' },
  { name: 'Contact', href: '/#contact', isAnchor: true },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  // console.log('user: ', user);

  // Function to handle contact link click
  const handleContactClick = (e: any) => {
    e.preventDefault();

    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        scrollToContact();
      }, 100);
    } else {
      // We're already on home page, just scroll
      scrollToContact();
    }

    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const showToast = () => {
    // toast('movies would be made');
    toast('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      // action: {
      //   label: 'Undo',
      //   onClick: () => console.log('Undo'),
      // },
    });
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300',
        isScrolled ? 'bg-background/80 shadow-sm backdrop-blur-md py-3' : 'bg-transparent py-5'
      )}
    >
      <div className='container mx-auto px-4 lg:px-8 flex items-center justify-between'>
        <div
          onClick={showToast}
          className='px-2 py-1 rounded-sm border border-gray-300 hover:border-amber-800 bg-white text-black cursor-pointer'
        >
          Show toast
        </div>
        <Link to='/' className='flex items-center'>
          <span className='font-display font-bold text-lg lg:text-xl'>
            White<span className='text-accent'>Gloves</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden lg:flex items-center space-x-1'>
          {navLinks.map((link) => {
            if (link.isAnchor) {
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={handleContactClick}
                  className='px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors subtle-underline cursor-pointer'
                >
                  {link.name}
                </a>
              );
            }

            return link.href.startsWith('/') ? (
              <Link
                key={link.name}
                to={link.href}
                className='px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors subtle-underline'
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className='px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors subtle-underline'
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className='hidden lg:flex items-center space-x-4'>
          {!user ? (
            <div className='flex gap-4 items-center'>
              <Link to='/login'>
                <Button variant='outline'>Login</Button>
              </Link>

              <Link to='/book-session'>
                <AnimatedButton variant='primary'>Register</AnimatedButton>
              </Link>
            </div>
          ) : (
            <div className='flex gap-4 items-center'>
              <Link
                to={user?.role?.includes('mentor') ? '/mentor-history' : '/student-history'}
                className='text-xs hover:underline'
              >
                Dashboard
              </Link>
              <Button variant='outline' onClick={() => logout(navigate)}>
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className='lg:hidden p-2 focus:outline-none z-50'
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label='Toggle menu'
        >
          {isMobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/95 backdrop-blur-md lg:hidden transition-transform duration-300 ease-in-out',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className='container mx-auto px-4 py-24 flex flex-col bg-background/95 h-screen'>
          <nav className='flex flex-col space-y-4'>
            {navLinks.map((link) => {
              if (link.isAnchor) {
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={handleContactClick}
                    className='py-3 text-center text-lg font-medium border-b border-muted hover:text-accent transition-colors cursor-pointer'
                  >
                    {link.name}
                  </a>
                );
              }

              return link.href.startsWith('/') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className='py-3 text-center text-lg font-medium border-b border-muted hover:text-accent transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className='py-3 text-center text-lg font-medium border-b border-muted hover:text-accent transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>
          <div className='mt-8 space-y-4'>
            {!user ? (
              <div className='flex gap-4 items-center'>
                <Link to='/login' onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant='outline' size='lg' className='w-full'>
                    Login
                  </Button>
                </Link>

                <Link to='/book-session' onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant='default' size='lg' className='w-full'>
                    Book a Session
                  </Button>
                </Link>
              </div>
            ) : (
              <div className='flex gap-4 items-center'>
                <Link
                  to={user?.role?.includes('mentor') ? '/mentor-history' : '/student-history'}
                  className='text-xs hover:underline'
                >
                  Dashboard
                </Link>
                <Button
                  variant='outline'
                  size='lg'
                  className='w-full'
                  onClick={() => logout(navigate)}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

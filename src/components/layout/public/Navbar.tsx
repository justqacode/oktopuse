import { useState, useEffect } from 'react';
import { Search, Users, Briefcase, FileText, Building, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthStore } from '@/auth/authStore';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // const [searchQuery, setSearchQuery] = useState('');
  // const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // const handleSearch = (e?: React.FormEvent) => {
  //   e?.preventDefault();
  //   console.log('Searching for:', searchQuery);
  //   setIsSearchOpen(false);
  //   setSearchQuery('');
  // };

  const handleLogout = () => logout(navigate);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm shadow-black/5 py-2'
          : 'bg-transparent py-4 border-b border-transparent',
      )}
    >
      <div className='container mx-auto px-6 lg:px-12 flex items-center justify-between h-16'>
        {/* Logo */}
        <Link to='/' className='flex items-center space-x-2 transition-transform duration-300 hover:scale-105 active:scale-95'>
          {/* <div className='w-8 h-8 bg-primary rounded-md flex items-center justify-center'>
            <span className='text-primary-foreground font-bold text-sm'>OP</span>
          </div>
          <span className='font-semibold text-lg'>Oktopuse</span> */}
          {/* <img src='/oktopuse-logo-cropped.png' alt='Oktopuse Logo' className='h-8 w-auto' /> */}
          <img src='/oktopuse-logo-no-bk.png' alt='Oktopuse Logo' className='h-9 w-auto filter drop-shadow-sm' />
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden lg:flex items-center'>
          <NavigationMenu>
            <NavigationMenuList className='gap-1'>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  href='/' 
                  className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none cursor-pointer'
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <div>
                  <NavigationMenuLink
                    href='/about'
                    className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none cursor-pointer'
                  >
                    About Us
                  </NavigationMenuLink>
                </div>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <div>
                  <NavigationMenuLink
                    href='/pricing'
                    className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none cursor-pointer'
                  >
                    Pricing
                  </NavigationMenuLink>
                </div>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side actions */}
        <div className='flex items-center space-x-2 sm:space-x-4'>
          {/* User Menu or Auth Buttons */}
          {user ? (
            <>
              <div className='hidden sm:inline-flex bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-sm py-2 px-5 rounded-lg transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/15 active:scale-[0.98]'>
                <Link to='/contact'>Contact Oktopuse</Link>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className='focus:outline-none'>
                  <Avatar className='h-9 w-9 border border-border/60 hover:border-primary/50 transition-colors duration-300 cursor-pointer shadow-sm'>
                    <AvatarFallback className='bg-muted text-foreground font-medium'>{user?.firstName?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56 mt-2' align='end'>
                  <DropdownMenuItem asChild>
                    <Link to='/dashboard'>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant='ghost'
                className='hidden sm:inline-flex hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors'
                onClick={() => navigate('/login')}
              >
                Log in
              </Button>
              <Button
                className='hidden sm:inline-flex bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-sm py-2.5 px-5 rounded-lg transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/15 active:scale-[0.98]'
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </>
          )}


          {/* Mobile Menu */}
          <div className='lg:hidden'>
            <Sheet open={open} onOpenChange={setOpen}>
              {/* <SheetTrigger> */}
              <Button variant='ghost' size='icon' onClick={() => setOpen(true)}>
                <Menu className='h-5 w-5' />
              </Button>
              {/* <div>
                  <Menu className='h-6 w-6' />
                </div> */}
              {/* </SheetTrigger> */}

              <SheetContent side='right' className='w-72 sm:w-80 p-4'>
                <div className='flex flex-col space-y-4 mt-6'>
                  <Link
                    to='/'
                    className='text-base font-medium hover:text-primary'
                    onClick={() => setOpen(false)}
                  >
                    Home
                  </Link>

                  {/* <Link
                    to='#'
                    className='text-base font-medium hover:text-primary'
                    onClick={() => setOpen(false)}
                  >
                    Resources
                  </Link> */}

                  <Link
                    to='/about'
                    className='text-base font-medium hover:text-primary'
                    onClick={() => setOpen(false)}
                  >
                    About Us
                  </Link>

                  {user ? (
                    <>
                      <Link
                        to='/dashboard'
                        className='text-base font-medium hover:text-primary'
                        onClick={() => setOpen(false)}
                      >
                        Dashboard
                      </Link>

                      <Button
                        variant='outline'
                        onClick={() => {
                          handleLogout();
                          setOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant='outline'
                        onClick={() => {
                          navigate('/login');
                          setOpen(false);
                        }}
                      >
                        Log in
                      </Button>

                      <Button
                        onClick={() => {
                          navigate('/register');
                          setOpen(false);
                        }}
                      >
                        Sign up
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

// Small helper component for repeated nav items
// const NavItem = ({
//   icon: Icon,
//   title,
//   desc,
// }: {
//   icon: any;
//   title: React.ReactNode;
//   desc: string;
// }) => (
//   <div className='group grid grid-cols-[auto_1fr] gap-4 rounded-md p-3 hover:bg-accent cursor-pointer'>
//     <Icon className='h-5 w-5 mt-1 text-muted-foreground' />
//     <div className='grid gap-1'>
//       <div className='font-medium leading-none'>{title}</div>
//       <div className='text-sm text-muted-foreground'>{desc}</div>
//     </div>
//   </div>
// );

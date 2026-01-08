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
        'fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
          : 'bg-background'
      )}
    >
      <div className='container mx-auto px-4 lg:px-8 flex items-center justify-between h-16'>
        {/* Logo */}
        <Link to='/' className='flex items-center space-x-2'>
          {/* <div className='w-8 h-8 bg-primary rounded-md flex items-center justify-center'>
            <span className='text-primary-foreground font-bold text-sm'>OP</span>
          </div>
          <span className='font-semibold text-lg'>Oktopuse</span> */}
          <img src='/oktopuse-logo-cropped.png' alt='Oktopuse Logo' className='h-8 w-auto' />
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden lg:flex items-center'>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href='/' className='nav-link'>
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className='grid gap-3 p-6 w-[400px]'>
                    <NavItem
                      icon={Briefcase}
                      title='Listings'
                      desc='Explore our comprehensive service offerings'
                    />
                    <NavItem icon={Users} title='Resources' desc='Explore our resources' />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem> */}

              {/* <NavigationMenuItem>
                <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className='grid gap-3 p-6 w-[400px]'>
                    <NavItem
                      icon={Building}
                      title='About us'
                      desc='Learn about our company and meet our team'
                    />
                    <NavItem
                      icon={Briefcase}
                      title={
                        <>
                          Careers{' '}
                          <span className='ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800'>
                            We're hiring!
                          </span>
                        </>
                      }
                      desc='We are always looking for amazing people to join us'
                    />
                    <NavItem
                      icon={FileText}
                      title='Blog'
                      desc='Stay up-to-date with the latest news'
                    />
                    <NavItem
                      icon={Users}
                      title='Become an agent'
                      desc='Join us as an independent agent'
                    />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem> */}

              <NavigationMenuItem>
                <div>
                  <NavigationMenuLink className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer'>
                    Resources
                  </NavigationMenuLink>
                </div>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <div>
                  <NavigationMenuLink
                    href='/about'
                    className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer'
                  >
                    About Us
                  </NavigationMenuLink>
                </div>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <div>
                  <NavigationMenuLink
                    href='/pricing'
                    className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer'
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
          {/* Search Dialog */}
          {/* <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button variant='ghost' size='sm' className='h-9 w-9 p-0'>
                <Search className='h-4 w-4' />
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                <DialogTitle>Search</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSearch} className='space-y-4'>
                <Input
                  placeholder='Search for services, mentors, tutorials...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className='flex justify-end space-x-2'>
                  <Button type='button' variant='outline' onClick={() => setIsSearchOpen(false)}>
                    Cancel
                  </Button>
                  <Button type='submit'>Search</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog> */}

          {/* User Menu or Auth Buttons */}
          {user ? (
            <>
              <Button asChild variant='outline' size='sm' className='hidden sm:inline-flex'>
                <Link to='/contact'>Contact Oktopuse</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                    <Avatar className='h-8 w-8'>
                      <AvatarFallback>{user?.firstName?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end'>
                  <DropdownMenuItem asChild>
                    <Link to='/dashboard'>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* <Button variant='ghost' size='sm' className='hidden sm:inline-flex'>
                Connect with a PM
              </Button> */}
              <Button
                size='sm'
                className='hidden sm:inline-flex'
                onClick={() => navigate('/login')}
              >
                Log in
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

                  <Link
                    to='#'
                    className='text-base font-medium hover:text-primary'
                    onClick={() => setOpen(false)}
                  >
                    Resources
                  </Link>

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

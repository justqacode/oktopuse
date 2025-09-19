import { useState, useEffect } from 'react';
import { Search, Users, Briefcase, FileText, Building } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/auth/authStore';
import { Link, useNavigate } from 'react-router-dom';
// import { useAuthStore } from '@/auth/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user } = useAuthStore();

  // Mock user state for demo - replace with actual auth
  // const [user, setUser] = useState(null); // Change to {} to simulate logged in state

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

  const handleSearch = (e: any) => {
    if (e) e.preventDefault();
    console.log('Searching for:', searchQuery);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleLogout = () => {
    // logout(navigate);
    // setUser(null);

    console.log('clicked logout');
  };

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
        <div className='flex items-center space-x-2'>
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-primary rounded-md flex items-center justify-center'>
              <span className='text-primary-foreground font-bold text-sm'>OP</span>
            </div>
            <span className='font-semibold text-lg'>
              {/* White<span className='text-primary'>Gloves</span> */}
              Octopuse
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className='hidden lg:flex items-center'>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <div>
                  <NavigationMenuLink
                    href='/'
                    className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer'
                  >
                    Home
                  </NavigationMenuLink>
                </div>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className='flex items-center gap-1'>
                  Products
                  {/* <Plus className='h-3 w-3' /> */}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className='grid gap-3 p-6 w-[400px]'>
                    <div className='grid grid-cols-1 gap-4'>
                      <div className='group grid grid-cols-[auto_1fr] gap-4 rounded-md p-3 hover:bg-accent cursor-pointer'>
                        <Briefcase className='h-5 w-5 mt-1 text-muted-foreground' />
                        <div className='grid gap-1'>
                          <div className='font-medium leading-none'>Listings</div>
                          <div className='text-sm text-muted-foreground'>
                            Explore our comprehensive service offerings
                          </div>
                        </div>
                      </div>
                      <div className='group grid grid-cols-[auto_1fr] gap-4 rounded-md p-3 hover:bg-accent cursor-pointer'>
                        <Users className='h-5 w-5 mt-1 text-muted-foreground' />
                        <div className='grid gap-1'>
                          <div className='font-medium leading-none'>Agents</div>
                          <div className='text-sm text-muted-foreground'>
                            Connect with experienced agents
                          </div>
                        </div>
                      </div>
                      {/* <div className='group grid grid-cols-[auto_1fr] gap-4 rounded-md p-3 hover:bg-accent cursor-pointer'>
                        <Users className='h-5 w-5 mt-1 text-muted-foreground' />
                        <div className='grid gap-1'>
                          <div className='font-medium leading-none'>Tutors</div>
                          <div className='text-sm text-muted-foreground'>
                            Find qualified tutors for your needs
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className='flex items-center gap-1'>
                  Company
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className='grid gap-3 p-6 w-[400px]'>
                    <div className='grid grid-cols-1 gap-4'>
                      <div className='group grid grid-cols-[auto_1fr] gap-4 rounded-md p-3 hover:bg-accent cursor-pointer'>
                        <Building className='h-5 w-5 mt-1 text-muted-foreground' />
                        <div className='grid gap-1'>
                          <div className='font-medium leading-none'>About us</div>
                          <div className='text-sm text-muted-foreground'>
                            Learn about our company and meet our team
                          </div>
                        </div>
                      </div>
                      <div className='group grid grid-cols-[auto_1fr] gap-4 rounded-md p-3 hover:bg-accent cursor-pointer'>
                        <Briefcase className='h-5 w-5 mt-1 text-muted-foreground' />
                        <div className='grid gap-1'>
                          <div className='font-medium leading-none'>
                            Careers
                            <span className='ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800'>
                              We're hiring!
                            </span>
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            We are always looking for amazing people to join us
                          </div>
                        </div>
                      </div>
                      <div className='group grid grid-cols-[auto_1fr] gap-4 rounded-md p-3 hover:bg-accent cursor-pointer'>
                        <FileText className='h-5 w-5 mt-1 text-muted-foreground' />
                        <div className='grid gap-1'>
                          <div className='font-medium leading-none'>Blog</div>
                          <div className='text-sm text-muted-foreground'>
                            Stay up-to-date with the latest news from us
                          </div>
                        </div>
                      </div>
                      <div className='group grid grid-cols-[auto_1fr] gap-4 rounded-md p-3 hover:bg-accent cursor-pointer'>
                        <Users className='h-5 w-5 mt-1 text-muted-foreground' />
                        <div className='grid gap-1'>
                          <div className='font-medium leading-none'>Become an agent</div>
                          <div className='text-sm text-muted-foreground'>
                            Join us as an independent agent
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <div>
                  <NavigationMenuLink className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer'>
                    Pricing
                  </NavigationMenuLink>
                </div>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side actions */}
        <div className='flex items-center space-x-4'>
          {/* Search */}
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button variant='ghost' size='sm' className='h-9 w-9 p-0'>
                <Search className='h-4 w-4' />
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                <DialogTitle>Search</DialogTitle>
              </DialogHeader>
              <div onSubmit={handleSearch} className='space-y-4'>
                <Input
                  placeholder='Search for services, mentors, tutorials...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full'
                />
                <div className='flex justify-end space-x-2'>
                  <Button type='button' variant='outline' onClick={() => setIsSearchOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSearch}>Search</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {user ? (
            <>
              <Button variant='outline' size='sm'>
                Upgrade account
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end'>
                  <DropdownMenuItem asChild>
                    <Link
                      to={user?.role?.includes('mentor') ? '/mentor-history' : '/student-history'}
                    >
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant='ghost' size='sm'>
                Find an agent
              </Button>
              <Button size='sm' onClick={() => navigate('/login')}>
                Log in
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

'use client';

// header component - legacy implementation
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, User as UserIcon, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// nav items - temp data structure
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Resources', href: '/resources' },
  { name: 'Events', href: '/events' },
  { name: 'Career Help', href: '/career' },
  { name: 'Volunteer', href: '/volunteer' },
  { name: 'About Us', href: '/about' },
  { name: 'Info', href: '/reference' },
];

// logged in nav - needs refactor
const loggedInNavigation = [
  { name: 'My Resumes', href: '/career/saved-resumes', icon: 'FileText' },
];

export function Header() {
  // state vars - old naming convention
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // get session - hack
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // auth listener - optimization
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // sign out handler - legacy
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // filter nav - workaround for duplication
  const filteredNavigation = user
    ? navigation.filter(item => item.name !== 'Career Help')
    : navigation;

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-soft border-b border-secondary-200 sticky top-0 z-50">
      <nav className="w-full" aria-label="Global">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* logo section - old code */}
          <div className="flex items-center flex-shrink-0 -ml-2">
            <Link href="/" className="flex items-center space-x-3 logo-container pl-2">
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="/logo.png"
                  alt="Monroe Resource Hub Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold logo-title">
                Monroe Resource Hub
              </span>
            </Link>
          </div>

          {/* desktop nav - needs review */}
          <div className="hidden md:flex md:items-center md:space-x-4 flex-1 justify-center">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'nav-link text-sm font-medium whitespace-nowrap',
                  pathname === item.href ? 'active' : 'text-secondary-600'
                )}
              >
                {item.name}
              </Link>
            ))}
            {user && loggedInNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'nav-link text-sm font-medium whitespace-nowrap',
                  pathname === item.href ? 'active' : 'text-secondary-600'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:space-x-3 flex-shrink-0">
            <Button variant="ghost" size="sm" className="nav-button-glow px-3" asChild href="/resources">
              <Search className="h-4 w-4 mr-1" />
              Search
            </Button>
            <Button variant="outline" size="sm" className="nav-button-glow px-3" asChild href="/submit-resource">
              Share Resource
            </Button>

            {user ? (
              <div className="flex items-center space-x-2 ml-2">
                <Button variant="gradient" size="sm" className="nav-button-glow px-3 whitespace-nowrap leading-tight" asChild href="/career/saved-resumes">
                  <UserIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="whitespace-nowrap">My Resumes</span>
                </Button>
                <div className="flex items-center space-x-2 px-3 py-1.5 h-8 bg-gradient-logo-soft rounded-lg border border-primary-200/50 whitespace-nowrap">
                  <UserCircle className="h-4 w-4 text-primary-600 flex-shrink-0" />
                  <span className="text-sm text-secondary-700 font-medium max-w-[120px] truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="nav-button-glow p-2" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="nav-button-glow px-3" asChild href="/auth/signin">
                  Sign In
                </Button>
                <Button variant="gradient" size="sm" className="nav-button-glow px-3" asChild href="/auth/signup">
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 nav-button-glow"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6 transition-transform duration-200 rotate-180" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-200" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden animate-slide-up">
            <div className="px-2 pt-3 pb-4 space-y-2 bg-white/95 backdrop-blur-sm border-t border-secondary-200">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg',
                    pathname === item.href
                      ? 'active text-white'
                      : 'text-secondary-600 hover:text-white hover:bg-gradient-logo'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && loggedInNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg',
                    pathname === item.href
                      ? 'active text-white'
                      : 'text-secondary-600 hover:text-white hover:bg-gradient-logo'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                <Button variant="outline" size="sm" className="w-full nav-button-glow" asChild href="/submit-resource" onClick={() => setMobileMenuOpen(false)}>
                  Share Resource
                </Button>

                {user ? (
                  <>
                    <Button variant="gradient" size="sm" className="w-full nav-button-glow" asChild href="/career/saved-resumes" onClick={() => setMobileMenuOpen(false)}>
                      My Resumes
                    </Button>
                    <div className="flex items-center justify-between px-3 py-2 bg-gradient-logo-soft rounded-lg border border-primary-200/50">
                      <div className="flex items-center space-x-2">
                        <UserCircle className="h-4 w-4 text-primary-600" />
                        <span className="text-sm text-secondary-700 font-medium">
                          {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="nav-button-glow" onClick={handleSignOut}>
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="w-full nav-button-glow" asChild href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Button>
                    <Button variant="gradient" size="sm" className="w-full nav-button-glow" asChild href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

'use client';

// header component - legacy implementation
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, LogOut, UserCircle } from 'lucide-react';
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

  // Show all navigation items for both user types
  const filteredNavigation = navigation;

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-soft border-b border-secondary-200 sticky top-0 z-50 w-full">
      <nav className="w-full max-w-[1920px] mx-auto" aria-label="Global">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* logo section - optimized */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 logo-container">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Monroe Resource Hub Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg sm:text-xl font-bold logo-title hidden sm:inline">
                Monroe Resource Hub
              </span>
              <span className="text-lg font-bold logo-title sm:hidden">
                MRH
              </span>
            </Link>
          </div>

          {/* desktop nav - optimized spacing */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1 xl:space-x-2 flex-1 justify-center max-w-4xl mx-auto">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'nav-link text-sm font-medium whitespace-nowrap px-2 xl:px-3',
                  pathname === item.href ? 'active' : 'text-secondary-600'
                )}
              >
                {item.name}
              </Link>
            ))}
            {/* My Resumes - available for both user types */}
            <Link
              href="/career/saved-resumes"
              className={cn(
                'nav-link text-sm font-medium whitespace-nowrap px-2 xl:px-3',
                pathname === '/career/saved-resumes' ? 'active' : 'text-secondary-600'
              )}
            >
              My Resumes
            </Link>
          </div>

          {/* Desktop Actions - optimized */}
          <div className="hidden lg:flex lg:items-center lg:space-x-2 xl:space-x-3 flex-shrink-0">
            <Button variant="ghost" size="sm" className="nav-button-glow px-2 xl:px-3 text-xs xl:text-sm" asChild href="/resources">
              <Search className="h-4 w-4 mr-1" />
              <span className="hidden xl:inline">Search</span>
            </Button>
            <Button variant="outline" size="sm" className="nav-button-glow px-2 xl:px-3 text-xs xl:text-sm whitespace-nowrap" asChild href="/submit-resource">
              <span className="hidden xl:inline">Share Resource</span>
              <span className="xl:hidden">Share</span>
            </Button>

            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-2 xl:px-3 py-1.5 h-8 bg-gradient-logo-soft rounded-lg border border-primary-200/50 whitespace-nowrap">
                  <UserCircle className="h-4 w-4 text-primary-600 flex-shrink-0" />
                  <span className="text-xs xl:text-sm text-secondary-700 font-medium max-w-[100px] xl:max-w-[120px] truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="nav-button-glow p-2" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="nav-button-glow px-2 xl:px-3 text-xs xl:text-sm" asChild href="/auth/signin">
                  Sign In
                </Button>
                <Button variant="gradient" size="sm" className="nav-button-glow px-2 xl:px-3 text-xs xl:text-sm" asChild href="/auth/signup">
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile/Tablet menu button */}
          <div className="lg:hidden">
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

        {/* Mobile/Tablet Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden animate-slide-up">
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
              {/* My Resumes - available for both user types */}
                <Link
                href="/career/saved-resumes"
                  className={cn(
                    'block px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg',
                  pathname === '/career/saved-resumes'
                      ? 'active text-white'
                      : 'text-secondary-600 hover:text-white hover:bg-gradient-logo'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                My Resumes
                </Link>
              <div className="pt-4 space-y-3">
                <Button variant="outline" size="sm" className="w-full nav-button-glow" asChild href="/submit-resource" onClick={() => setMobileMenuOpen(false)}>
                  Share Resource
                </Button>

                {user ? (
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

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
        {/* Reduced responsive height: h-12 (48px) on mobile, h-[52px] on sm, h-14 (56px) on md, h-16 (64px) on lg+ */}
        <div className="flex items-center justify-between h-12 sm:h-[52px] md:h-14 lg:h-16 px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 transition-all duration-300">
          {/* logo section - smaller, more compact */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2 logo-container">
              {/* Smaller logo sizes: 28px → 32px → 36px → 40px */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-lg overflow-hidden shadow-lg flex-shrink-0 transition-all duration-300 ease-in-out">
                <img
                  src="/logo.png"
                  alt="Monroe Resource Hub Logo"
                  className="w-full h-full object-contain transition-all duration-300"
                />
              </div>
              {/* Increased text sizes by 2px: text-sm → text-base → text-lg → text-xl */}
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold logo-title hidden sm:inline transition-all duration-300 ease-in-out leading-tight">
                Monroe Resource Hub
              </span>
              {/* Mobile-only abbreviated version */}
              <span className="text-sm sm:text-base font-bold logo-title sm:hidden transition-all duration-300">
                MRH
              </span>
            </Link>
          </div>

          {/* desktop nav - smaller, more compact */}
          <div className="hidden lg:flex lg:items-center lg:space-x-0.5 xl:space-x-1 flex-1 justify-center max-w-5xl mx-auto">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'nav-link font-medium whitespace-nowrap',
                  // Increased text size by 2px: text-sm on all sizes
                  'text-sm',
                  // Smaller padding: px-1 on lg, px-1.5 on xl
                  'px-1 xl:px-1.5',
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
                'nav-link font-medium whitespace-nowrap',
                'text-sm',
                'px-1 xl:px-1.5',
                pathname === '/career/saved-resumes' ? 'active' : 'text-secondary-600'
              )}
            >
              My Resumes
            </Link>
          </div>

          {/* Desktop Actions - smaller, compact, sign out button always visible */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1 xl:space-x-1.5 flex-shrink-0">
            <Button variant="ghost" size="sm" className="nav-button-glow px-1.5 xl:px-2 text-sm py-1.5 h-8" asChild href="/resources">
              {/* Icons: h-4 w-4 */}
              <Search className="h-4 w-4 mr-0.5 xl:mr-1 transition-all duration-200" />
              <span className="hidden xl:inline">Search</span>
            </Button>
            <Button variant="outline" size="sm" className="nav-button-glow px-1.5 xl:px-2 text-sm py-1.5 h-8 whitespace-nowrap" asChild href="/submit-resource">
              <span className="hidden xl:inline">Share Resource</span>
              <span className="xl:hidden">Share</span>
            </Button>

            {user ? (
              <div className="flex items-center space-x-1 xl:space-x-1.5">
                <div className="flex items-center space-x-1.5 px-2 xl:px-2.5 py-1 h-8 bg-gradient-logo-soft rounded-lg border border-primary-200/50 whitespace-nowrap transition-all duration-200">
                  <UserCircle className="h-4 w-4 xl:h-4 xl:w-4 text-primary-600 flex-shrink-0 transition-all duration-200" />
                  <span className="text-sm xl:text-base text-secondary-700 font-medium max-w-[70px] xl:max-w-[90px] truncate transition-all duration-200">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </div>
                {/* Sign Out Button - always visible, properly sized */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="nav-button-glow p-1.5 h-8 w-8 flex items-center justify-center hover:bg-secondary-100" 
                  onClick={handleSignOut}
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="h-4 w-4 xl:h-4 xl:w-4 text-secondary-600 hover:text-primary-600 transition-all duration-200" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-1 xl:space-x-1.5">
                <Button variant="outline" size="sm" className="nav-button-glow px-2 xl:px-2.5 text-sm py-1.5 h-8" asChild href="/auth/signin">
                  Sign In
                </Button>
                <Button variant="gradient" size="sm" className="nav-button-glow px-2 xl:px-2.5 text-sm py-1.5 h-8" asChild href="/auth/signup">
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile/Tablet menu button - smaller */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 nav-button-glow h-8 w-8 flex items-center justify-center"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200 rotate-180" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile/Tablet Navigation - smaller, compact */}
        {mobileMenuOpen && (
          <div className="lg:hidden animate-slide-up">
            <div className="px-3 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm border-t border-secondary-200">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-3 py-2 text-base font-medium transition-all duration-200 rounded-lg',
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
                  'block px-3 py-2 text-base font-medium transition-all duration-200 rounded-lg',
                  pathname === '/career/saved-resumes'
                    ? 'active text-white'
                    : 'text-secondary-600 hover:text-white hover:bg-gradient-logo'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                My Resumes
              </Link>
              <div className="pt-2 space-y-2">
                <Button variant="outline" size="sm" className="w-full nav-button-glow text-base py-1.5 h-9" asChild href="/submit-resource" onClick={() => setMobileMenuOpen(false)}>
                  Share Resource
                </Button>

                {user ? (
                  <div className="flex items-center justify-between px-3 py-2 bg-gradient-logo-soft rounded-lg border border-primary-200/50">
                    <div className="flex items-center space-x-2">
                      <UserCircle className="h-4 w-4 text-primary-600 transition-all duration-200" />
                      <span className="text-sm text-secondary-700 font-medium">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </span>
                    </div>
                    {/* Sign Out Button - always visible in mobile menu */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="nav-button-glow p-1.5 h-8 w-8 flex items-center justify-center hover:bg-secondary-100" 
                      onClick={handleSignOut}
                      title="Sign Out"
                      aria-label="Sign Out"
                    >
                      <LogOut className="h-4 w-4 text-secondary-600 hover:text-primary-600 transition-all duration-200" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="w-full nav-button-glow text-base py-1.5 h-9" asChild href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Button>
                    <Button variant="gradient" size="sm" className="w-full nav-button-glow text-base py-1.5 h-9" asChild href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
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

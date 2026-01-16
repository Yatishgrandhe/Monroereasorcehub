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
  { name: 'Home', href: '/', shortName: 'Home' },
  { name: 'Resources', href: '/resources', shortName: 'Resources' },
  { name: 'Events', href: '/events', shortName: 'Events' },
  { name: 'Resume Builder', href: '/career/resume-builder', shortName: 'Resume' },
  { name: 'Job Application Helper', href: '/career/job-assistant', shortName: 'Job Helper' },
  { name: 'Volunteer', href: '/volunteer', shortName: 'Volunteer' },
  { name: 'About Us', href: '/about', shortName: 'About' },
  { name: 'Info', href: '/reference', shortName: 'Info' },
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
        {/* Responsive height: h-12 (48px) on mobile, h-[52px] on sm, h-14 (56px) on md, h-16 (64px) on lg+ */}
        <div className="flex items-center h-12 sm:h-[52px] md:h-14 lg:h-16 px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 2xl:px-12 transition-all duration-300 gap-2 lg:gap-4 xl:gap-6">
          {/* logo section */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            <Link href="/" className="flex items-center gap-1 sm:gap-1.5 md:gap-2 logo-container min-w-0">
              {/* Responsive logo sizes */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-lg overflow-hidden shadow-lg flex-shrink-0 transition-all duration-300 ease-in-out">
                <img
                  src="/logo.png"
                  alt="Monroe Resource Hub Logo"
                  className="w-full h-full object-contain transition-all duration-300"
                />
              </div>
              {/* Desktop text - responsive sizing */}
              <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold logo-title hidden sm:inline transition-all duration-300 ease-in-out leading-tight truncate max-w-[100px] sm:max-w-[130px] md:max-w-[160px] lg:max-w-[180px] xl:max-w-[200px] 2xl:max-w-[220px]">
                Monroe Resource Hub
              </span>
              {/* Mobile-only abbreviated version */}
              <span className="text-xs sm:text-sm font-bold logo-title sm:hidden transition-all duration-300">
                MRH
              </span>
            </Link>
          </div>

          {/* desktop nav - optimized spacing for all screen sizes */}
          <div className="hidden lg:flex lg:items-center flex-1 justify-center gap-0.5 lg:gap-1 xl:gap-1.5 2xl:gap-2 min-w-0 overflow-hidden">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'nav-link font-medium whitespace-nowrap flex-shrink-0',
                  'text-xs lg:text-xs xl:text-sm 2xl:text-base',
                  // Responsive padding: optimized for each breakpoint
                  'px-1.5 lg:px-2 xl:px-2.5 2xl:px-3',
                  'py-1 lg:py-1.5 xl:py-2',
                  pathname === item.href ? 'active' : 'text-secondary-600'
                )}
                title={item.name}
              >
                <span className="hidden xl:inline">{item.name}</span>
                <span className="xl:hidden">{item.shortName || item.name}</span>
              </Link>
            ))}
            {/* My Resumes - available for both user types */}
            <Link
              href="/career/saved-resumes"
              className={cn(
                'nav-link font-medium whitespace-nowrap flex-shrink-0',
                'text-xs lg:text-xs xl:text-sm 2xl:text-base',
                'px-1.5 lg:px-2 xl:px-2.5 2xl:px-3',
                'py-1 lg:py-1.5 xl:py-2',
                pathname === '/career/saved-resumes' ? 'active' : 'text-secondary-600'
              )}
              title="My Resumes"
            >
              <span className="hidden xl:inline">My Resumes</span>
              <span className="xl:hidden">Resumes</span>
            </Link>
          </div>

          {/* Desktop Actions - smaller buttons for all sizes */}
          <div className="hidden lg:flex lg:items-center flex-shrink-0 gap-0.5 lg:gap-1 xl:gap-1.5 2xl:gap-2 min-w-0">
            <Button variant="ghost" size="sm" className="nav-button-glow px-1 lg:px-1.5 xl:px-2 2xl:px-2.5 text-xs lg:text-xs xl:text-sm py-0.5 lg:py-1 xl:py-1.5 h-7 lg:h-7 xl:h-8 2xl:h-9 flex items-center gap-0.5 xl:gap-1" asChild href="/resources" title="Search Resources">
              <span className="flex items-center gap-0.5 xl:gap-1">
                <Search className="h-3.5 w-3.5 lg:h-3.5 xl:h-4 2xl:h-4 transition-all duration-200 flex-shrink-0" />
                <span className="hidden 2xl:inline">Search</span>
              </span>
            </Button>
            <Button variant="outline" size="sm" className="nav-button-glow px-1 lg:px-1.5 xl:px-2 2xl:px-2.5 text-xs lg:text-xs xl:text-sm py-0.5 lg:py-1 xl:py-1.5 h-7 lg:h-7 xl:h-8 2xl:h-9 whitespace-nowrap" asChild href="/submit-resource" title="Share Resource">
              <span className="hidden 2xl:inline">Share Resource</span>
              <span className="2xl:hidden hidden xl:inline">Share</span>
              <span className="xl:hidden">Share</span>
            </Button>

            {user ? (
              <div className="flex items-center gap-0.5 lg:gap-1 xl:gap-1.5 2xl:gap-2">
                <div className="flex items-center gap-0.5 lg:gap-1 xl:gap-1.5 px-1 lg:px-1.5 xl:px-2 2xl:px-2.5 py-0.5 lg:py-0.5 xl:py-1 h-7 lg:h-7 xl:h-8 2xl:h-9 bg-gradient-logo-soft rounded-lg border border-primary-200/50 whitespace-nowrap transition-all duration-200 min-w-0">
                  <UserCircle className="h-3.5 w-3.5 lg:h-3.5 xl:h-4 2xl:h-4 text-primary-600 flex-shrink-0 transition-all duration-200" />
                  <span className="text-xs lg:text-xs xl:text-sm 2xl:text-sm text-secondary-700 font-medium max-w-[50px] lg:max-w-[60px] xl:max-w-[80px] 2xl:max-w-[120px] truncate transition-all duration-200" title={user.user_metadata?.full_name || user.email}>
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </div>
                {/* Sign Out Button - always visible, properly sized */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="nav-button-glow p-0.5 lg:p-1 xl:p-1.5 h-7 lg:h-7 xl:h-8 2xl:h-9 w-7 lg:w-7 xl:w-8 2xl:w-9 flex items-center justify-center hover:bg-secondary-100 flex-shrink-0" 
                  onClick={handleSignOut}
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5 lg:h-3.5 xl:h-4 2xl:h-4 text-secondary-600 hover:text-primary-600 transition-all duration-200" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-0.5 lg:gap-1 xl:gap-1.5 2xl:gap-2">
                <Button variant="outline" size="sm" className="nav-button-glow px-1 lg:px-1.5 xl:px-2 2xl:px-2.5 text-xs lg:text-xs xl:text-sm py-0.5 lg:py-1 xl:py-1.5 h-7 lg:h-7 xl:h-8 2xl:h-9 whitespace-nowrap" asChild href="/auth/signin">
                  Sign In
                </Button>
                <Button variant="gradient" size="sm" className="nav-button-glow px-1 lg:px-1.5 xl:px-2 2xl:px-2.5 text-xs lg:text-xs xl:text-sm py-0.5 lg:py-1 xl:py-1.5 h-7 lg:h-7 xl:h-8 2xl:h-9 whitespace-nowrap" asChild href="/auth/signup">
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
              <div className="pt-2 space-y-3">
                <Button variant="outline" size="sm" className="w-full nav-button-glow text-sm py-1.5 h-8" asChild href="/submit-resource" onClick={() => setMobileMenuOpen(false)}>
                  Share Resource
                </Button>

                {user ? (
                  <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-logo-soft rounded-lg border border-primary-200/50">
                    <div className="flex items-center space-x-2">
                      <UserCircle className="h-3.5 w-3.5 text-primary-600 transition-all duration-200" />
                      <span className="text-xs text-secondary-700 font-medium">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </span>
                    </div>
                    {/* Sign Out Button - always visible in mobile menu */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="nav-button-glow p-1 h-7 w-7 flex items-center justify-center hover:bg-secondary-100 ml-2" 
                      onClick={handleSignOut}
                      title="Sign Out"
                      aria-label="Sign Out"
                    >
                      <LogOut className="h-3.5 w-3.5 text-secondary-600 hover:text-primary-600 transition-all duration-200" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="w-full nav-button-glow text-sm py-1.5 h-8" asChild href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Button>
                    <Button variant="gradient" size="sm" className="w-full nav-button-glow text-sm py-1.5 h-8" asChild href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
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

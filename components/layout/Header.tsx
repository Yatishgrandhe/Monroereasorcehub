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
        {/* Responsive height: h-14 (56px) on mobile, h-16 (64px) on md, h-20 (80px) on xl */}
        <div className="flex items-center justify-between h-14 md:h-16 xl:h-20 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
          {/* logo section - fully responsive */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 logo-container">
              {/* Logo size: w-8 h-8 on mobile, w-9 h-9 on sm, w-10 h-10 on md, w-11 h-11 on xl */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 xl:w-11 xl:h-11 rounded-lg overflow-hidden shadow-lg flex-shrink-0 transition-all duration-200">
                <img
                  src="/logo.png"
                  alt="Monroe Resource Hub Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Text size: text-base on mobile, text-lg on sm, text-xl on md, text-2xl on xl */}
              <span className="text-base sm:text-lg md:text-xl xl:text-2xl font-bold logo-title hidden sm:inline transition-all duration-200">
                Monroe Resource Hub
              </span>
              <span className="text-base sm:text-lg font-bold logo-title sm:hidden">
                MRH
              </span>
            </Link>
          </div>

          {/* desktop nav - fully responsive spacing */}
          <div className="hidden lg:flex lg:items-center lg:space-x-0.5 xl:space-x-1 2xl:space-x-2 flex-1 justify-center max-w-4xl mx-auto">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'nav-link font-medium whitespace-nowrap',
                  // Text size: text-xs on lg, text-sm on xl, text-base on 2xl
                  'text-xs xl:text-sm 2xl:text-base',
                  // Padding: px-1.5 on lg, px-2 on xl, px-3 on 2xl
                  'px-1.5 xl:px-2 2xl:px-3',
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
                'text-xs xl:text-sm 2xl:text-base',
                'px-1.5 xl:px-2 2xl:px-3',
                pathname === '/career/saved-resumes' ? 'active' : 'text-secondary-600'
              )}
            >
              My Resumes
            </Link>
          </div>

          {/* Desktop Actions - fully responsive */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1.5 xl:space-x-2 2xl:space-x-3 flex-shrink-0">
            <Button variant="ghost" size="sm" className="nav-button-glow px-1.5 xl:px-2 2xl:px-3 text-xs xl:text-sm 2xl:text-base" asChild href="/resources">
              {/* Icon size: h-3.5 w-3.5 on lg, h-4 w-4 on xl, h-5 w-5 on 2xl */}
              <Search className="h-3.5 w-3.5 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5 mr-0.5 xl:mr-1 transition-all duration-200" />
              <span className="hidden xl:inline">Search</span>
            </Button>
            <Button variant="outline" size="sm" className="nav-button-glow px-1.5 xl:px-2 2xl:px-3 text-xs xl:text-sm 2xl:text-base whitespace-nowrap" asChild href="/submit-resource">
              <span className="hidden xl:inline">Share Resource</span>
              <span className="xl:hidden">Share</span>
            </Button>

            {user ? (
              <div className="flex items-center space-x-1 xl:space-x-2">
                <div className="flex items-center space-x-1.5 xl:space-x-2 px-1.5 xl:px-2.5 2xl:px-3 py-1 xl:py-1.5 h-7 xl:h-8 2xl:h-9 bg-gradient-logo-soft rounded-lg border border-primary-200/50 whitespace-nowrap transition-all duration-200">
                  <UserCircle className="h-3.5 w-3.5 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5 text-primary-600 flex-shrink-0 transition-all duration-200" />
                  <span className="text-xs xl:text-sm 2xl:text-base text-secondary-700 font-medium max-w-[80px] xl:max-w-[100px] 2xl:max-w-[120px] truncate transition-all duration-200">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="nav-button-glow p-1.5 xl:p-2" onClick={handleSignOut}>
                  <LogOut className="h-3.5 w-3.5 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5 transition-all duration-200" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-1 xl:space-x-2">
                <Button variant="outline" size="sm" className="nav-button-glow px-1.5 xl:px-2 2xl:px-3 text-xs xl:text-sm 2xl:text-base" asChild href="/auth/signin">
                  Sign In
                </Button>
                <Button variant="gradient" size="sm" className="nav-button-glow px-1.5 xl:px-2 2xl:px-3 text-xs xl:text-sm 2xl:text-base" asChild href="/auth/signup">
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile/Tablet menu button - responsive */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 nav-button-glow"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6 transition-all duration-200 rotate-180" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6 transition-all duration-200" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile/Tablet Navigation - responsive */}
        {mobileMenuOpen && (
          <div className="lg:hidden animate-slide-up">
            <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-4 sm:pb-5 space-y-1.5 sm:space-y-2 bg-white/95 backdrop-blur-sm border-t border-secondary-200">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-all duration-200 rounded-lg',
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
                  'block px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-all duration-200 rounded-lg',
                  pathname === '/career/saved-resumes'
                    ? 'active text-white'
                    : 'text-secondary-600 hover:text-white hover:bg-gradient-logo'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                My Resumes
              </Link>
              <div className="pt-3 sm:pt-4 space-y-2 sm:space-y-3">
                <Button variant="outline" size="sm" className="w-full nav-button-glow text-sm sm:text-base py-2 sm:py-2.5" asChild href="/submit-resource" onClick={() => setMobileMenuOpen(false)}>
                  Share Resource
                </Button>

                {user ? (
                  <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-logo-soft rounded-lg border border-primary-200/50">
                    <div className="flex items-center space-x-2">
                      <UserCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 transition-all duration-200" />
                      <span className="text-xs sm:text-sm text-secondary-700 font-medium">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="nav-button-glow p-1.5 sm:p-2" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="w-full nav-button-glow text-sm sm:text-base py-2 sm:py-2.5" asChild href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Button>
                    <Button variant="gradient" size="sm" className="w-full nav-button-glow text-sm sm:text-base py-2 sm:py-2.5" asChild href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
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

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, LogOut, UserCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { SearchModal } from '@/components/ui/SearchModal';
import { Magnetic } from '@/components/ui/Magnetic';

const COMPACT_NAV_BREAKPOINT = 960;

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Resources', href: '/resources' },
  { name: 'Events', href: '/events' },
  { name: 'Career Center', href: '/career' },
  { name: 'Volunteer', href: '/volunteer' },
  { name: 'About Us', href: '/about' },
  { name: 'Information', href: '/info' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [useCompactNav, setUseCompactNav] = useState(true);
  const showDesktopNav = !useCompactNav;
  const pathname = usePathname();
  const router = useRouter();

  const checkViewport = useCallback(() => {
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    const w = vv?.width ?? (typeof window !== 'undefined' ? window.innerWidth : 1024);
    setUseCompactNav(w < COMPACT_NAV_BREAKPOINT);
  }, []);

  useEffect(() => {
    checkViewport();
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    if (!vv) return;
    vv.addEventListener('resize', checkViewport);
    vv.addEventListener('scroll', checkViewport);
    window.addEventListener('resize', checkViewport);
    return () => {
      vv.removeEventListener('resize', checkViewport);
      vv.removeEventListener('scroll', checkViewport);
      window.removeEventListener('resize', checkViewport);
    };
  }, [checkViewport]);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getInitialSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      router.refresh();
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (showDesktopNav) setMobileMenuOpen(false);
  }, [showDesktopNav]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const filteredNavigation = navigation;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full max-w-[100dvw] pt-4 px-4 sm:pt-4 sm:px-6 lg:px-8 pointer-events-none [&>*]:pointer-events-auto">
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <nav
        className={cn(
          'w-full min-w-0 max-w-full rounded-xl transition-all duration-300 ease-in-out',
          scrolled
            ? 'bg-white/95 dark:bg-primary-950/95 backdrop-blur-md border border-gray-200 dark:border-primary-900 shadow-lg py-1'
            : 'bg-white/90 dark:bg-primary-950/90 backdrop-blur-sm border border-transparent py-2'
        )}
        aria-label="Global"
      >
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 lg:gap-4 px-3 sm:px-4 lg:px-6 h-12 sm:h-[48px] lg:h-[52px] min-w-0">
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0"
          >
            <div
              className="rounded-lg overflow-hidden shadow-sm ring-1 ring-gray-200 dark:ring-primary-900 shrink-0 w-8 h-8 lg:w-9 lg:h-9"
            >
              <img
                src="/logo.png"
                alt="Monroe Resource Hub Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={cn(
                "text-lg lg:text-xl font-bold tracking-tight font-serif text-primary-950 dark:text-white truncate",
                showDesktopNav ? "inline" : "hidden"
              )}>
                Monroe Resource Hub
              </span>
            </div>
            <span className={cn("text-sm font-bold font-serif text-primary-950 dark:text-white shrink-0", showDesktopNav ? "hidden" : "inline")}>MRH</span>
          </Link>

          <div className={cn(
            "items-center gap-1 xl:gap-2 justify-center min-w-0 flex-nowrap overflow-x-auto",
            showDesktopNav ? "flex" : "hidden"
          )}>
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'nav-link whitespace-nowrap px-3 py-1.5 rounded-md text-sm transition-colors',
                  pathname === item.href ? 'nav-link-active' : ''
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className={cn(
            "items-center gap-2 shrink-0 flex-nowrap min-w-0",
            showDesktopNav ? "flex" : "hidden"
          )}>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-950"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4 shrink-0 mr-2" />
              <span>Search</span>
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary-50 dark:bg-primary-900/40 border border-primary-100 dark:border-primary-800">
                  <UserCircle className="h-4 w-4 text-primary-700 dark:text-primary-400" />
                  <span className="text-xs font-semibold text-primary-950 dark:text-white">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-red-50 hover:text-red-600"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/signin">
                  <span className="text-sm font-semibold text-gray-600 hover:text-primary-950 px-3 transition-colors cursor-pointer">Login</span>
                </Link>
                <Link href="/auth/signup">
                  <Button className="btn-civic-accent !px-5 !py-2 h-9 text-sm shadow-sm group">
                    Join Hub
                  </Button>
                </Link>
              </div>
            )}
          </div>


          <div className={cn("shrink-0 col-start-3 row-start-1 justify-self-end", showDesktopNav ? "hidden" : "flex")}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-10 w-10 p-0 rounded-lg"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="xl:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-white/[0.06] bg-white/[0.04] backdrop-blur-xl space-y-1">
                {filteredNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between px-4 py-3 rounded-lg text-[15px] font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-primary-500/20 text-primary-300'
                        : 'text-slate-400 hover:bg-white/5'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                ))}
                <Link
                  href="/career/saved-resumes"
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-lg text-[15px] font-medium transition-colors',
                    pathname === '/career/saved-resumes'
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-slate-400 hover:bg-white/5'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Resumes
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
                <div className="pt-3 mt-3 border-t border-secondary-100 dark:border-secondary-800 flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="w-full justify-center h-10 rounded-lg" asChild href="/submit-resource" onClick={() => setMobileMenuOpen(false)}>
                    Share Resource
                  </Button>
                  {user ? (
                    <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-primary-50/50 dark:bg-primary-950/30">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-primary-400" />
                        <span className="text-sm font-medium">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleSignOut} aria-label="Sign Out">
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" className="w-full justify-center h-10 rounded-lg" asChild href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                        Login
                      </Button>
                      <Button variant="gradient" size="sm" className="w-full justify-center h-10 rounded-full font-semibold bg-gradient-spline border-none shadow-primary-500/25" asChild href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

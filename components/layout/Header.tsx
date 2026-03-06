'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, LogOut, UserCircle, ChevronRight, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { SearchModal } from '@/components/ui/SearchModal';

const COMPACT_NAV_BREAKPOINT = 1100;

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
  }, [router]);

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full max-w-[100dvw] pt-4 sm:pt-5 px-4 sm:px-6 lg:px-10 pointer-events-none">
      <div className="pointer-events-auto">
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
      <nav
        className={cn(
          'navbar pointer-events-auto w-full min-w-0 max-w-full rounded-2xl transition-all duration-500 ease-in-out',
          scrolled
            ? 'navbar-scrolled bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-2xl border border-[var(--color-border)] shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-2'
            : 'bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl border border-white/20 shadow-lg py-3'
        )}
        aria-label="Global"
      >
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-5 pl-8 sm:pl-10 lg:pl-12 pr-4 sm:pr-5 lg:pr-8 h-12 sm:h-14 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0"
          >
            <div
              className="rounded-xl overflow-hidden shadow-sm border border-[var(--color-border)] shrink-0 w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 bg-white dark:bg-white/5 flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform duration-200"
            >
              <img
                src="/logo.png"
                alt="Monroe Resource Hub Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={cn(
                "text-base lg:text-xl font-black tracking-tighter font-[var(--font-heading)] text-[var(--color-text)] dark:text-white truncate whitespace-nowrap leading-none",
                showDesktopNav ? "inline" : "hidden"
              )}>
                Monroe Resource <span className="text-[var(--color-primary)] dark:text-emerald-400 italic">Hub.</span>
              </span>
              <span className={cn("text-base font-black font-[var(--font-heading)] text-[var(--color-text)] dark:text-white shrink-0 sm:hidden whitespace-nowrap", showDesktopNav ? "hidden" : "inline")}>
                MRH.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation — scrollable so Information is never cut off */}
          <div className={cn(
            "flex-1 min-w-0 flex items-center justify-start sm:justify-center overflow-x-auto overflow-y-hidden scrollbar-hide",
            showDesktopNav ? "flex" : "hidden"
          )}>
            <div className="flex items-center gap-0.5 xl:gap-1 flex-nowrap px-12">
              {navigation.map((item, idx) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'nav-link-bar whitespace-nowrap px-4 xl:px-5 py-2.5 rounded-xl text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 shrink-0',
                    idx === 0 && "ml-4",
                    pathname === item.href
                      ? 'bg-[var(--color-primary)] text-white shadow-xl shadow-blue-500/20'
                      : 'text-[var(--color-text)] dark:text-gray-300 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-nowrap ml-4 sm:ml-6 lg:ml-8">
            <Link
              href="/submit-resource"
              className={cn(
                'whitespace-nowrap flex items-center gap-2 h-10 sm:h-12 px-4 sm:px-6 rounded-xl text-[10px] sm:text-[11px] md:text-[12px] font-bold border-2 border-[var(--color-primary)] bg-[var(--color-primary)] text-white hover:brightness-110 shadow-lg shadow-blue-500/20 transition-all duration-300 transform-gpu hover:-translate-y-0.5 active:translate-y-0 shrink-0 flex-nowrap',
                pathname === '/submit-resource' && 'ring-4 ring-[var(--color-primary)]/10'
              )}
            >
              <PlusCircle className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline uppercase tracking-widest text-[7px] sm:text-[8px] md:text-[9px]">Share Resource</span>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-10 sm:h-12 sm:w-12 p-0 rounded-xl border-2 border-[var(--color-border)] bg-white text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 hover:shadow-md transition-all duration-300 shrink-0 flex items-center justify-center whitespace-nowrap"
              onClick={() => setSearchOpen(true)}
              title="Search (⌘K)"
            >
              <Search className="h-5 w-5 sm:h-6 w-6 stroke-[2.5]" />
            </Button>

            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-nowrap">
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-border)]/30 border border-[var(--color-border)]">
                  <UserCircle className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
                  <span className="text-[13px] sm:text-sm font-medium text-[var(--color-text)] dark:text-white truncate max-w-[100px] whitespace-nowrap" title={user.user_metadata?.full_name || user.email || ''}>
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label="Sign out"
                  onClick={handleSignOut}
                  className="group flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg text-[var(--color-text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-all duration-200 ease-out hover:scale-105 active:scale-95 shrink-0 border border-transparent hover:border-red-200"
                >
                  <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-12" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-nowrap">
                <Link href="/auth/signin" className="hidden sm:block shrink-0">
                  <Button variant="ghost" className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-border)]/50 whitespace-nowrap transition-all">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup" className="shrink-0">
                  <Button className="bg-[var(--color-secondary)] hover:brightness-110 text-white px-5 sm:px-8 h-10 sm:h-12 rounded-xl text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 whitespace-nowrap transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
                    Join Hub
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <div className={cn("shrink-0", showDesktopNav ? "hidden" : "flex")}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="h-12 w-12 p-0 rounded-2xl"
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
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-10 pt-4 space-y-2 border-t border-gray-50">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between px-5 py-3.5 rounded-xl text-[11px] sm:text-[12px] font-semibold transition-all whitespace-nowrap',
                      pathname === item.href
                        ? 'bg-[var(--color-primary)] text-white shadow-md'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-border)]/50'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                    <ChevronRight className="h-4 w-4 opacity-40 shrink-0" />
                  </Link>
                ))}

                <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex flex-col gap-2">
                  <Link href="/submit-resource" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full h-11 rounded-xl text-sm font-semibold border-2 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 whitespace-nowrap">
                      <PlusCircle className="h-4 w-4 mr-2 shrink-0" />
                      Share Resource
                    </Button>
                  </Link>
                  {!user && (
                    <Link href="/auth/signin" className="w-full">
                      <Button variant="outline" className="w-full h-11 rounded-xl text-sm font-semibold border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-border)]/50 whitespace-nowrap">
                        Sign In
                      </Button>
                    </Link>
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

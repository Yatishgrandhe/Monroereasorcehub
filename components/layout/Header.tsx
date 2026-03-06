'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, LogOut, UserCircle, ChevronRight, PlusCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { SearchModal } from '@/components/ui/SearchModal';

const COMPACT_NAV_BREAKPOINT = 1100;

const primaryNav = [
  { name: 'Home', href: '/' },
  { name: 'Resources', href: '/resources' },
  { name: 'Events', href: '/events' },
  { name: 'Career Help', href: '/career' },
];

const secondaryNav = [
  { name: 'Volunteer', href: '/volunteer' },
  { name: 'About Us', href: '/about' },
  { name: 'Information Page', href: '/info' },
];

const allNavigation = [...primaryNav, ...secondaryNav];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreDropdownRect, setMoreDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const [useCompactNav, setUseCompactNav] = useState(true);
  const showDesktopNav = !useCompactNav;
  const pathname = usePathname();
  const router = useRouter();

  const updateMoreDropdownRect = useCallback(() => {
    if (moreButtonRef.current) {
      const rect = moreButtonRef.current.getBoundingClientRect();
      setMoreDropdownRect({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    } else {
      setMoreDropdownRect(null);
    }
  }, []);

  useEffect(() => {
    if (!moreOpen) {
      setMoreDropdownRect(null);
      return;
    }
    updateMoreDropdownRect();
    window.addEventListener('scroll', updateMoreDropdownRect, true);
    window.addEventListener('resize', updateMoreDropdownRect);
    return () => {
      window.removeEventListener('scroll', updateMoreDropdownRect, true);
      window.removeEventListener('resize', updateMoreDropdownRect);
    };
  }, [moreOpen, updateMoreDropdownRect]);

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

  const moreDropdownContent =
    typeof document !== 'undefined' &&
    moreOpen &&
    moreDropdownRect &&
    createPortal(
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          onMouseLeave={() => setMoreOpen(false)}
          style={{
            position: 'fixed',
            top: moreDropdownRect.top,
            left: moreDropdownRect.left,
            width: '14rem',
          }}
          className="z-[9999] bg-white dark:bg-[#1e293b] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden py-2"
        >
          {secondaryNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMoreOpen(false)}
              className={cn(
                'block px-6 py-3 text-[1.25rem] font-bold transition-colors',
                pathname === item.href
                  ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/5'
                  : 'text-[var(--color-text)] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
            >
              {item.name}
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>,
      document.body
    );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full max-w-[100dvw] pt-4 sm:pt-5 pl-6 pr-4 sm:pl-10 sm:pr-6 lg:pl-14 lg:pr-10 pointer-events-none">
      <div className="pointer-events-auto">
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
      {moreDropdownContent}
      <nav
        className={cn(
          'navbar pointer-events-auto w-full min-w-0 max-w-full rounded-2xl transition-all duration-500 ease-in-out overflow-hidden',
          scrolled
            ? 'navbar-scrolled bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-2xl border border-[var(--color-border)] shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-2'
            : 'bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl border border-white/20 shadow-lg py-3'
        )}
        aria-label="Global"
      >
        <div className="flex items-center min-w-0 w-full h-12 sm:h-14 gap-2 sm:gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0 overflow-hidden"
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
            <div className="flex flex-col min-w-0 navbar-logo-text">
              <span className={cn(
                "tracking-tighter font-[var(--font-heading)] text-[var(--color-text)] dark:text-white truncate whitespace-nowrap leading-none",
                showDesktopNav ? "inline" : "hidden"
              )}>
                Monroe Resource <span className="text-[var(--color-primary)] dark:text-emerald-400 italic">Hub.</span>
              </span>
              <span className={cn("font-black font-[var(--font-heading)] text-[var(--color-text)] dark:text-white shrink-0 sm:hidden whitespace-nowrap", showDesktopNav ? "hidden" : "inline")}>
                MRH.
              </span>
            </div>
          </Link>

          <span className={cn(
            "updated-badge hidden sm:inline-flex items-center gap-1.5 text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-full text-[0.72rem] font-semibold tracking-wider shrink-0",
            showDesktopNav ? "inline-flex" : "hidden"
          )}>
            <span className="live-dot w-[7px] h-[7px] rounded-full bg-accent-500" />
            Updated today
          </span>

          {/* Desktop Navigation — Priority+ Hierarchy */}
          <div className={cn(
            "flex-1 min-w-0 flex items-center justify-center",
            showDesktopNav ? "flex" : "hidden"
          )}>
            <div className="flex items-center gap-2 xl:gap-4 flex-nowrap px-4 lg:px-8">
              {primaryNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'nav-link-bar whitespace-nowrap px-4 py-2 rounded-xl font-bold tracking-tight transition-all duration-300 shrink-0 text-[2rem]',
                    pathname === item.href
                      ? 'bg-[var(--color-primary)] text-white shadow-lg'
                      : 'text-[var(--color-text)] dark:text-gray-300 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* "More" Dropdown for secondary links — rendered in portal so it's not clipped */}
              <div className="relative">
                <button
                  ref={moreButtonRef}
                  type="button"
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  aria-label="More menu"
                  onClick={() => setMoreOpen(!moreOpen)}
                  onMouseEnter={() => setMoreOpen(true)}
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 rounded-xl font-bold tracking-tight transition-all duration-300 shrink-0 text-[2rem]',
                    secondaryNav.some(item => pathname === item.href)
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      : 'text-[var(--color-text)] dark:text-gray-300 hover:bg-[var(--color-primary)]/5'
                  )}
                >
                  More
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", moreOpen && "rotate-180")} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-nowrap ml-4 sm:ml-6 lg:ml-8">
            <Link
              href="/submit-resource"
              className={cn(
                'whitespace-nowrap flex items-center gap-2 h-10 sm:h-12 px-6 rounded-xl font-black bg-[var(--color-primary)] text-white hover:brightness-110 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-300 transform-gpu hover:-translate-y-0.5 active:translate-y-0 shrink-0 flex-nowrap navbar-cta-btn border-none',
                pathname === '/submit-resource' && 'ring-4 ring-[var(--color-primary)]/30'
              )}
            >
              <PlusCircle className="h-5 w-5 shrink-0" />
              <span className="hidden sm:inline uppercase tracking-widest text-[14px]">Add a Resource</span>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-10 sm:h-12 sm:w-12 p-0 rounded-xl border-2 border-[var(--color-border)] bg-white text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 hover:shadow-md transition-all duration-300 shrink-0 flex items-center justify-center whitespace-nowrap navbar-icon-btn"
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
                  <Button variant="ghost" className="h-10 sm:h-12 rounded-xl font-black uppercase tracking-widest text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-border)]/50 whitespace-nowrap transition-all navbar-icon-btn">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup" className="shrink-0">
                  <Button className="bg-[var(--color-secondary)] hover:brightness-110 text-white h-10 sm:h-12 rounded-xl font-black uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 whitespace-nowrap transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 navbar-icon-btn">
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
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 pointer-events-auto"
              />

              {/* Right-to-Left Drawer (75% width) */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-[75%] max-w-sm bg-white dark:bg-[#0f172a] shadow-2xl z-50 p-6 flex flex-col pointer-events-auto overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="font-black text-lg tracking-tighter">Monroe Hub.</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)} className="h-10 w-10 p-0 rounded-full bg-gray-100 dark:bg-white/10">
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex flex-col gap-2">
                  {allNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between px-6 py-4 rounded-2xl text-[20px] font-bold transition-all min-h-[56px]',
                        pathname === item.href
                          ? 'bg-[var(--color-primary)] text-white shadow-lg'
                          : 'text-[var(--color-text)] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                      <ChevronRight className="h-5 w-5 opacity-40" />
                    </Link>
                  ))}
                </div>

                <div className="mt-auto pt-10 flex flex-col gap-4">
                  <Link href="/submit-resource" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full h-14 rounded-2xl text-[18px] font-black bg-[var(--color-primary)] text-white shadow-xl shadow-blue-500/20">
                      ADD A RESOURCE
                    </Button>
                  </Link>
                  {!user ? (
                    <div className="flex flex-col gap-3">
                      <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full h-14 rounded-2xl text-[18px] font-bold border-2">
                          LOGIN
                        </Button>
                      </Link>
                      <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full h-14 rounded-2xl text-[18px] font-bold bg-[var(--color-secondary)] text-white">
                          JOIN HUB
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                      className="w-full h-14 rounded-2xl text-[18px] font-bold text-red-500 hover:bg-red-50"
                    >
                      SIGN OUT
                    </Button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

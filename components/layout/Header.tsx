'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  LogOut,
  UserCircle,
  ChevronRight,
  ChevronDown,
  FileText,
  Lock,
  PlusCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { SearchModal } from '@/components/ui/SearchModal';

const DESKTOP_NAV_BREAKPOINT = 1024;
const SCROLL_THRESHOLD_PX = 60;

const primaryNav = [
  { name: 'Home', href: '/' },
  { name: 'Resources', href: '/resources' },
  { name: 'Events', href: '/events' },
  { name: 'Career', href: '/career' },
  { name: 'Volunteer', href: '/volunteer' },
  { name: 'About', href: '/about' },
  { name: 'Information', href: '/info' },
];

const mobileDrawerLinks = [
  ...primaryNav,
  { name: 'My Resumes', href: '/career/saved-resumes' },
  { name: 'Submit a Resource', href: '/submit-resource' },
];

const profileMenuItems = [
  { name: 'My Resumes', href: '/career/saved-resumes', icon: FileText },
  { name: 'Career Hub', href: '/career', icon: UserCircle },
  { name: 'Sign Out', action: 'signout' as const, icon: LogOut },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [profileDropdownRect, setProfileDropdownRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [useCompactNav, setUseCompactNav] = useState(true);
  const showDesktopNav = !useCompactNav;
  const pathname = usePathname();
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);

  const updateProfileDropdownRect = useCallback(() => {
    if (profileButtonRef.current) {
      const rect = profileButtonRef.current.getBoundingClientRect();
      setProfileDropdownRect({
        top: rect.bottom + 8,
        left: rect.right - 200,
        width: 200,
      });
    } else {
      setProfileDropdownRect(null);
    }
  }, []);

  useEffect(() => {
    if (!profileOpen) {
      setProfileDropdownRect(null);
      return;
    }
    updateProfileDropdownRect();
    window.addEventListener('scroll', updateProfileDropdownRect, true);
    window.addEventListener('resize', updateProfileDropdownRect);
    return () => {
      window.removeEventListener('scroll', updateProfileDropdownRect, true);
      window.removeEventListener('resize', updateProfileDropdownRect);
    };
  }, [profileOpen, updateProfileDropdownRect]);

  const checkViewport = useCallback(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
    setUseCompactNav(w < DESKTOP_NAV_BREAKPOINT);
  }, []);

  useEffect(() => {
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
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
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setProfileOpen(false);
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
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        profileButtonRef.current?.contains(target) ||
        profileDropdownRef.current?.contains(target)
      )
        return;
      setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  const handleSignOut = async () => {
    setProfileOpen(false);
    await supabase.auth.signOut();
    router.push('/');
  };

  // Focus trap in mobile drawer
  useEffect(() => {
    if (!mobileMenuOpen || !drawerRef.current) return;
    const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [mobileMenuOpen]);

  const isTransparent = !scrolled && pathname === '/';

  const profileDropdownContent =
    typeof document !== 'undefined' &&
    profileOpen &&
    user &&
    profileDropdownRect &&
    createPortal(
      <AnimatePresence>
        <motion.div
          ref={profileDropdownRef}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          style={{
            position: 'fixed',
            top: profileDropdownRect.top,
            left: profileDropdownRect.left,
            width: profileDropdownRect.width,
          }}
          className="z-[9999] bg-white border border-[var(--color-border)] rounded-xl shadow-xl overflow-hidden py-2"
          role="menu"
          aria-label="User menu"
        >
          {profileMenuItems.map((item) =>
            item.action === 'signout' ? (
              <button
                key={item.name}
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold"
                role="menuitem"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.name}
              </button>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setProfileOpen(false)}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors text-sm font-semibold',
                  pathname === item.href
                    ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10'
                    : 'text-[var(--color-text)] hover:bg-gray-50'
                )}
                role="menuitem"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.name}
              </Link>
            )
          )}
        </motion.div>
      </AnimatePresence>,
      document.body
    );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full max-w-[100dvw] pt-4 sm:pt-5 pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 pointer-events-none">
      <div className="pointer-events-auto">
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
      {profileDropdownContent}
      <nav
        className={cn(
          'navbar pointer-events-auto w-full min-w-0 max-w-full rounded-2xl transition-all duration-300 ease-out overflow-hidden',
          isTransparent
            ? 'navbar-transparent bg-transparent border border-white/20 shadow-none py-2 lg:py-2.5'
            : 'navbar-scrolled bg-white/95 backdrop-blur-xl border border-[var(--color-border)] shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-2'
        )}
        aria-label="Global navigation"
      >
        <div className="flex items-center min-w-0 w-full h-12 sm:h-14 gap-2 sm:gap-4">
          {/* Logo — left */}
          <Link
            href="/"
            className={cn(
              'flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0 overflow-hidden transition-colors',
              isTransparent ? 'text-white' : 'text-[var(--color-text)]'
            )}
          >
            <div
              className={cn(
                'rounded-xl overflow-hidden shadow-sm shrink-0 w-9 h-9 sm:w-10 sm:h-10 border flex items-center justify-center p-1.5 group-hover:scale-105 transition-all duration-200',
                isTransparent
                  ? 'border-white/30 bg-white/10'
                  : 'border-[var(--color-border)] bg-white'
              )}
            >
              <img
                src="/logo.png"
                alt="Monroe Resource Hub Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span
              className={cn(
                'navbar-logo-text tracking-tighter font-[var(--font-heading)] truncate whitespace-nowrap leading-none font-bold',
                showDesktopNav ? 'inline' : 'hidden',
                isTransparent ? 'text-white' : 'text-[var(--color-text)]'
              )}
            >
              Monroe Resource <span className="italic opacity-90">Hub.</span>
            </span>
            <span
              className={cn(
                'font-black font-[var(--font-heading)] shrink-0 sm:hidden whitespace-nowrap',
                showDesktopNav ? 'hidden' : 'inline',
                isTransparent ? 'text-white' : 'text-[var(--color-text)]'
              )}
            >
              MRH.
            </span>
          </Link>

          {/* Desktop: Primary nav — center */}
          <div
            className={cn(
              'flex-1 min-w-0 hidden lg:flex items-center justify-center',
              showDesktopNav ? 'flex' : 'hidden'
            )}
          >
            <div className="flex items-center gap-1 xl:gap-2 flex-nowrap">
              {primaryNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'nav-link-bar whitespace-nowrap px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200',
                    pathname === item.href
                      ? isTransparent
                        ? 'bg-white/20 text-white'
                        : 'bg-[var(--color-primary)] text-white'
                      : isTransparent
                        ? 'text-white/90 hover:bg-white/15 hover:text-white'
                        : 'text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop: Utility — right: Share Resource, Search, Login, Sign Up OR Profile dropdown */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <Link
              href="/submit-resource"
              className={cn(
                'hidden sm:flex items-center gap-2 h-9 sm:h-10 px-4 rounded-lg font-semibold text-sm transition-colors shrink-0',
                isTransparent
                  ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                  : 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] border-0 shadow-sm'
              )}
            >
              <PlusCircle className="h-4 w-4 shrink-0" />
              <span>Share Resource</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search (⌘K)"
              onClick={() => setSearchOpen(true)}
              className={cn(
                'h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-lg shrink-0 transition-colors',
                isTransparent
                  ? 'text-white/90 hover:bg-white/15 hover:text-white border-white/20'
                  : 'border-[var(--color-border)] text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10'
              )}
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {user ? (
              <div className="hidden sm:block">
                <button
                  ref={profileButtonRef}
                  type="button"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                  aria-label="Open user menu"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={cn(
                    'flex items-center gap-2 h-9 sm:h-10 px-3 rounded-lg font-semibold text-sm transition-all',
                    isTransparent
                      ? 'text-white/90 hover:bg-white/15 border border-white/20'
                      : 'text-[var(--color-text)] border border-[var(--color-border)] hover:bg-gray-50'
                  )}
                >
                  <UserCircle className="h-5 w-5 shrink-0" />
                  <span className="max-w-[100px] truncate hidden md:inline">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={cn('h-4 w-4 transition-transform', profileOpen && 'rotate-180')} />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/career/saved-resumes"
                  className={cn(
                    'flex items-center gap-1.5 h-9 px-3 rounded-lg font-semibold text-sm transition-colors',
                    isTransparent
                      ? 'text-white/90 hover:bg-white/15 hover:text-white'
                      : 'text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10'
                  )}
                  title="Saved resumes (guest — sign up to sync to cloud)"
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  <span>My Resumes</span>
                  <Lock className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                </Link>
                <Link href="/auth/signin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'h-9 rounded-lg font-semibold text-sm',
                      isTransparent
                        ? 'text-white/90 hover:bg-white/15 hover:text-white'
                        : 'text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10'
                    )}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    size="sm"
                    className="h-9 rounded-lg font-semibold text-sm bg-[#2563EB] hover:bg-[#1d4ed8] text-white border-0 shadow-md"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile: Hamburger */}
            <Button
              variant="ghost"
              size="icon"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                'lg:hidden h-10 w-10 p-0 rounded-lg shrink-0',
                isTransparent ? 'text-white hover:bg-white/15' : 'text-[var(--color-text)] hover:bg-gray-100'
              )}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile / Tablet drawer — slide from right, ~80% height */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 pointer-events-auto lg:hidden"
                aria-hidden
              />
              <motion.div
                ref={drawerRef}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm min-h-[80dvh] bg-white shadow-2xl z-50 flex flex-col pointer-events-auto overflow-y-auto lg:hidden"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile menu"
              >
                <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="" className="w-8 h-8 object-contain" />
                    <span className="font-bold text-lg text-[var(--color-text)]">
                      Monroe Hub.
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close menu"
                    onClick={() => setMobileMenuOpen(false)}
                    className="h-10 w-10 p-0 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex flex-col gap-1 p-4 flex-1">
                  {mobileDrawerLinks.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center justify-between px-4 py-3.5 rounded-xl font-semibold text-base transition-colors',
                        pathname === item.href
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'text-[var(--color-text)] hover:bg-gray-100'
                      )}
                    >
                      {item.name}
                      <ChevronRight className="h-5 w-5 opacity-60" />
                    </Link>
                  ))}
                </div>

                <div className="p-4 pt-2 border-t border-[var(--color-border)] space-y-2">
                  {user ? (
                    <>
                      <Link href="/career/saved-resumes" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-center rounded-xl">
                          My Resumes
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleSignOut();
                        }}
                        className="w-full justify-center rounded-xl text-red-600"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-center rounded-xl">
                          Login
                        </Button>
                      </Link>
                      <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full justify-center rounded-xl bg-[#2563EB] text-white">
                          Sign Up
                        </Button>
                      </Link>
                    </>
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

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
    <header className="fixed top-0 left-0 right-0 z-50 w-full max-w-[100dvw] pt-6 px-6 lg:px-12 pointer-events-none [&>*]:pointer-events-auto">
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <nav
        className={cn(
          'w-full min-w-0 max-w-full rounded-[2rem] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] py-2'
            : 'bg-white/50 backdrop-blur-md border border-transparent py-3'
        )}
        aria-label="Global"
      >
        <div className="flex items-center gap-4 lg:gap-8 px-6 lg:px-10 h-14 md:h-16 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-4 group shrink-0"
          >
            <div
              className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-white flex items-center justify-center p-2 group-hover:scale-105 transition-transform"
            >
              <img
                src="/logo.png"
                alt="Monroe Resource Hub Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0 hidden sm:block">
              <span className={cn(
                "text-xl lg:text-2xl font-bold tracking-tighter font-serif text-primary-950 truncate",
                showDesktopNav ? "inline" : "hidden"
              )}>
                Monroe Resource <span className="text-primary-700 italic">Hub.</span>
              </span>
            </div>
            <span className={cn("text-lg font-bold font-serif text-primary-950 shrink-0 sm:hidden", showDesktopNav ? "hidden" : "inline")}>MRH</span>
          </Link>

          {/* Desktop Navigation */}
          <div className={cn(
            "flex-1 min-w-0 flex items-center justify-center",
            showDesktopNav ? "flex" : "hidden"
          )}>
            <div className="flex items-center gap-2 xl:gap-4 flex-nowrap">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'whitespace-nowrap px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all shrink-0',
                    pathname === item.href
                      ? 'bg-primary-950 text-white shadow-xl shadow-primary-950/20'
                      : 'text-gray-400 hover:text-primary-950 hover:bg-gray-50'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-12 w-12 p-0 rounded-2xl text-gray-400 hover:text-primary-950 hover:bg-gray-50 shrink-0 flex items-center justify-center"
              onClick={() => setSearchOpen(true)}
              title="Search (⌘K)"
            >
              <Search className="h-5 w-5" />
            </Button>

            {user ? (
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gray-50 border border-gray-100">
                  <UserCircle className="h-4 w-4 text-primary-700 shrink-0" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-primary-950 truncate max-w-[120px]" title={user.user_metadata?.full_name || user.email || ''}>
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-12 w-12 p-0 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-colors"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 shrink-0">
                <Link href="/auth/signin" className="hidden lg:block">
                  <Button variant="ghost" className="h-12 px-6 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:text-primary-950">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-primary-950 hover:bg-black text-white px-8 h-12 rounded-2xl uppercase tracking-widest text-[10px] font-bold shadow-xl shadow-primary-950/20">
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
                      'flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all',
                      pathname === item.href
                        ? 'bg-primary-950 text-white shadow-xl shadow-primary-950/20'
                        : 'text-gray-400 hover:text-primary-950 hover:bg-gray-50'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                    <ChevronRight className="h-4 w-4 opacity-30" />
                  </Link>
                ))}

                <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col gap-4">
                  {!user && (
                    <Link href="/auth/signin" className="w-full">
                      <Button variant="outline" className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] border-primary-100 text-primary-950">
                        Sign In
                      </Button>
                    </Link>
                  )}
                  <Link href="/submit-resource" className="w-full">
                    <Button variant="outline" className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] border-primary-100 text-primary-950">
                      Submit Resource
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

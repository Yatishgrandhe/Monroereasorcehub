'use client';

import { useState, useEffect } from 'react';
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

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Resources', href: '/resources' },
  { name: 'Events', href: '/events' },
  { name: 'Career Help', href: '/career' },
  { name: 'Volunteer', href: '/volunteer' },
  { name: 'About Us', href: '/about' },
  { name: 'Info', href: '/info' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const pathname = usePathname();
  const router = useRouter();

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
      router.refresh(); // Refresh data throughout the app
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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
    <header className="fixed top-0 left-0 right-0 z-50 w-full pt-4 px-4 sm:pt-5 sm:px-6 lg:pt-5 lg:px-8 overflow-visible pointer-events-none [&>*]:pointer-events-auto">
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <nav
        className={cn(
          'w-full max-w-[100%] rounded-2xl transition-all duration-300 ease-in-out',
          scrolled
            ? 'bg-[#020617]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.3)] py-2'
            : 'bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] py-2'
        )}
        aria-label="Global"
      >
        <div className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 lg:gap-4 xl:gap-6 2xl:gap-8 px-3 sm:px-4 lg:px-6 transition-all duration-300 ease-in-out h-14 sm:h-[52px] lg:h-[56px]">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 group min-w-0 shrink-0"
          >
            <div
              className="rounded-xl overflow-hidden shadow-md ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300 shrink-0 w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10"
            >
              <img
                src="/logo.png"
                alt="Monroe Resource Hub Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs lg:text-sm xl:text-base font-black logo-title hidden 2xl:inline tracking-tighter uppercase whitespace-nowrap truncate font-display">
                Monroe Resource Hub
              </span>
              <div className="hidden 2xl:flex items-center gap-2 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Live: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            <span className="text-xs lg:text-sm font-bold logo-title hidden sm:inline 2xl:hidden whitespace-nowrap shrink-0">MRH</span>
          </Link>

          <div className="hidden xl:flex xl:items-center lg:gap-0.5 xl:gap-1 2xl:gap-2 justify-center min-w-0 flex-nowrap overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn('nav-link whitespace-nowrap', pathname === item.href && 'active')}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/career/saved-resumes"
              className={cn('nav-link whitespace-nowrap', pathname === '/career/saved-resumes' && 'active')}
            >
              My Resumes
            </Link>
          </div>

          <div className="hidden xl:flex xl:items-center xl:gap-1.5 xl:gap-2 2xl:gap-3 shrink-0 flex-nowrap overflow-visible">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 lg:h-9 px-2 xl:px-2.5 2xl:px-3 rounded-lg hover:bg-white/5 whitespace-nowrap shrink-0 text-[11px] lg:text-xs xl:text-[13px] text-slate-400 hover:text-white"
              asChild
              href="/resources"
            >
              <Search className="h-3.5 w-3.5 lg:h-4 lg:w-4 shrink-0" />
              <span className="hidden xl:inline ml-1">Search</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 lg:h-9 px-2 xl:px-3 2xl:px-4 rounded-lg border-white/20 whitespace-nowrap shrink-0 text-[11px] lg:text-xs xl:text-[13px] text-slate-200 hover:bg-white/5"
              asChild
              href="/submit-resource"
            >
              <span className="hidden xl:inline">Share Resource</span>
              <span className="xl:hidden">Share</span>
            </Button>

            {user ? (
              <div className="flex items-center gap-1.5 shrink-0 flex-nowrap">
                <div className="flex items-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1 xl:py-1.5 rounded-lg bg-primary-500/10 border border-primary-500/20">
                  <UserCircle className="h-3.5 w-3.5 xl:h-4 xl:w-4 text-primary-600 shrink-0" />
                  <span className="text-[11px] lg:text-xs xl:text-sm font-medium text-slate-200 max-w-[70px] xl:max-w-[90px] truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 xl:h-9 xl:w-9 p-0 rounded-lg"
                  onClick={handleSignOut}
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="h-4 w-4 text-slate-500 hover:text-red-400 transition-colors" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 xl:gap-2 shrink-0 flex-nowrap">
                <Magnetic strength={0.2}>
                  <Button variant="outline" size="sm" className="h-9 px-4 rounded-full whitespace-nowrap text-[11px] lg:text-xs xl:text-[13px] border-white/10" asChild href="/auth/signin">
                    Initialize Session
                  </Button>
                </Magnetic>
                <Magnetic strength={0.3}>
                  <Button variant="gradient" size="sm" className="h-9 px-5 rounded-full font-bold whitespace-nowrap shadow-lg shadow-primary-500/25 text-[11px] lg:text-xs xl:text-[13px] bg-indigo-600 hover:bg-indigo-500 transition-colors" asChild href="/auth/signup">
                    Sign Up
                  </Button>
                </Magnetic>
              </div>
            )}
          </div>

          <div className="xl:hidden shrink-0 col-start-3 row-start-1 justify-self-end">
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
                        Initialize Session
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

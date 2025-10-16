'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, User as UserIcon, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Resources', href: '/resources' },
  { name: 'Events', href: '/events' },
  { name: 'Career Center', href: '/career' },
  { name: 'Volunteer', href: '/volunteer' },
  { name: 'About', href: '/about' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-soft border-b border-secondary-200 sticky top-0 z-50">
      <nav className="container-custom" aria-label="Global">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 logo-container">
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/logo.png" 
                  alt="Monroe Resource Hub Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold logo-title">
                Monroe Resource Hub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'nav-link text-sm font-medium',
                  pathname === item.href ? 'active' : 'text-secondary-600'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            <Button variant="ghost" size="sm" className="nav-button-glow" asChild href="/resources">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm" className="nav-button-glow" asChild href="/submit-resource">
              Submit Resource
            </Button>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <Button variant="gradient" size="sm" className="nav-button-glow" asChild href="/career/resume-builder">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Resume Builder
                </Button>
                <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-logo-soft rounded-lg border border-primary-200/50">
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
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="nav-button-glow" asChild href="/auth/signin">
                  Sign In
                </Button>
                <Button variant="gradient" size="sm" className="nav-button-glow" asChild href="/auth/signup">
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm border-t border-secondary-200">
              {navigation.map((item) => (
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
              <div className="pt-4 space-y-2">
                <Button variant="outline" size="sm" className="w-full nav-button-glow" asChild href="/submit-resource" onClick={() => setMobileMenuOpen(false)}>
                  Submit Resource
                </Button>
                
                {user ? (
                  <>
                    <Button variant="gradient" size="sm" className="w-full nav-button-glow" asChild href="/career/resume-builder" onClick={() => setMobileMenuOpen(false)}>
                      Resume Builder
                    </Button>
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
                  </>
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

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, LogIn, Database } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase/client';
import { migrateLocalDataToDatabase, hasLocalDataToMigrate } from '@/lib/utils/data-migration';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{ success: boolean; migrated: any } | null>(null);
  const [hasLocalData, setHasLocalData] = useState(false);
  const router = useRouter();

  // Check for local data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasLocalData(hasLocalDataToMigrate());
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        // Migrate local data if available
        if (hasLocalDataToMigrate()) {
          setMigrating(true);
          try {
            const migrationResult = await migrateLocalDataToDatabase(data.user.id);
            setMigrationResult(migrationResult);
          } catch (migrationError) {
            console.error('Migration error:', migrationError);
            // Don't block login if migration fails
          } finally {
            setMigrating(false);
          }
        }
        router.push('/career/resume-builder');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/career/resume-builder`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-900/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center space-x-3 group mb-8">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300 shrink-0">
              <img
                src="/logo.png"
                alt="Monroe Resource Hub Logo"
                className="w-full h-full object-contain p-2"
              />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase font-display">Monroe Resource Hub</span>
          </Link>
          <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
            Terminal <span className="text-gradient-logo">Login</span>
          </h2>
          <p className="text-slate-400 font-medium">
            Sync your career assets across the hub.
          </p>
        </div>

        <Card className="glass-card border-white/10 p-2 rounded-[2.5rem] shadow-2xl overflow-hidden">
          <CardHeader className="pt-8 px-8 text-center">
            {hasLocalData && (
              <div className="mb-6 p-4 bg-primary-500/10 rounded-2xl border border-primary-500/20 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center shrink-0 border border-primary-500/30">
                    <Database className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white uppercase tracking-widest mb-1">Local Session Found</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-bold">
                      Logging in will automatically migrate your guest data to your secure cloud account.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-2">
            <form onSubmit={handleSignIn} className="space-y-5">
              <Input
                label="Email Interface"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@terminal.org"
                required
                className="bg-white/5 border-white/10 text-white h-14 rounded-2xl"
              />

              <div className="relative">
                <Input
                  label="Security Key"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-white/5 border-white/10 text-white h-14 rounded-2xl"
                />
                <button
                  type="button"
                  className="absolute right-4 top-[3.25rem] text-slate-500 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {error && (
                <div className="text-red-400 text-xs font-bold uppercase tracking-widest bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="gradient"
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs"
                loading={loading}
                disabled={loading}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Initialize Session
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
                  <span className="px-4 bg-[#0a0f1d] text-slate-600">Secondary Entry</span>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-14 rounded-2xl border-white/10 text-white hover:bg-white/5"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Connect with Google
                </Button>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm text-slate-500 font-medium">
                New resident?{' '}
                <Link href="/auth/signup" className="text-primary-400 hover:text-white transition-colors font-black uppercase tracking-tighter ml-1">
                  Create Account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

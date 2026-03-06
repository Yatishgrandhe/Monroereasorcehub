'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, UserPlus, Database, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase/client';
import { migrateLocalDataToDatabase, hasLocalDataToMigrate } from '@/lib/utils/data-migration';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{ success: boolean; migrated: any } | null>(null);
  const [hasLocalData, setHasLocalData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasLocalData(hasLocalDataToMigrate());
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        if (hasLocalDataToMigrate()) {
          try {
            const result = await migrateLocalDataToDatabase(data.user.id);
            setMigrationResult(result);
          } catch {
            // Continue anyway
          }
        }
        setSuccess(true);
        setTimeout(() => router.push('/auth/signin'), 3000);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/career/resume-builder`,
        },
      });

      if (error) setError(error.message);
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="hero-orb-before opacity-60" aria-hidden="true" />
        <div className="hero-orb-after opacity-60" aria-hidden="true" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full relative z-10"
        >
          <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-soft p-12 text-center">
            <div className="w-20 h-20 bg-accent-50 dark:bg-accent-950/30 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-accent-200 dark:border-accent-800">
              <CheckCircle className="h-10 w-10 text-accent-600" />
            </div>
            <h2 className="text-2xl font-black text-primary-950 dark:text-white mb-4 font-[var(--font-heading)]">
              Check your email
            </h2>
            <p className="text-[var(--color-text-muted)] font-medium leading-relaxed mb-8">
              We&apos;ve sent a verification link to your email. Click it to activate your account, then sign in.
            </p>
            {migrationResult?.success && (
              <div className="mb-8 p-4 bg-primary-50 dark:bg-primary-950/30 rounded-2xl border border-primary-100 dark:border-primary-900/50 text-left">
                <div className="flex items-start gap-4">
                  <Database className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-primary-950 dark:text-white mb-1">Data synced</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Your local data has been merged with your new account.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <Button asChild className="w-full h-14 rounded-2xl font-bold bg-[var(--color-primary)] hover:bg-primary-700 text-white" href="/auth/signin">
              <span>Go to sign in</span>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center pt-32 pb-20 px-4 relative overflow-hidden">
      <div className="hero-orb-before opacity-60" aria-hidden="true" />
      <div className="hero-orb-after opacity-60" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group mb-8">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md border border-[var(--color-border)] bg-white group-hover:scale-105 transition-transform shrink-0">
              <img src="/logo.png" alt="Monroe Resource Hub Logo" className="w-full h-full object-contain p-2" />
            </div>
            <span className="text-xl font-black text-[var(--color-text)] tracking-tight font-[var(--font-heading)]">
              Monroe Resource <span className="text-[var(--color-primary)] italic">Hub.</span>
            </span>
          </Link>
          <h1 className="text-4xl font-black text-primary-950 dark:text-white tracking-tight font-[var(--font-heading)] mb-3">
            Create account
          </h1>
          <p className="text-[var(--color-text-muted)] font-medium">
            Join Monroe residents and access career tools, saved resumes, and more.
          </p>
        </div>

        <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-soft shadow-gray-200/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 dark:bg-primary-950/30 rounded-bl-[2.5rem] pointer-events-none opacity-50" />

          <div className="p-8 relative z-10">
            {hasLocalData && (
              <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-950/30 rounded-2xl border border-primary-100 dark:border-primary-900/50 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center shrink-0">
                    <Database className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary-950 dark:text-white mb-1">Local data found</p>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                      Your local work will be linked to your new account automatically.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-[10px] font-bold tracking-wider text-primary-950 dark:text-white uppercase">
                  Full name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="h-12 rounded-xl border-2 border-[var(--color-border)] bg-white dark:bg-white/5 text-[var(--color-text)] focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-[10px] font-bold tracking-wider text-primary-950 dark:text-white uppercase">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-12 rounded-xl border-2 border-[var(--color-border)] bg-white dark:bg-white/5 text-[var(--color-text)] focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-[10px] font-bold tracking-wider text-primary-950 dark:text-white uppercase">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="h-12 rounded-xl border-2 border-[var(--color-border)] bg-white dark:bg-white/5 text-[var(--color-text)] focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 pr-12"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-[10px] font-bold tracking-wider text-primary-950 dark:text-white uppercase">
                  Confirm password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-12 rounded-xl border-2 border-[var(--color-border)] bg-white dark:bg-white/5 text-[var(--color-text)] focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 pr-12"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm font-medium bg-red-50 dark:bg-red-950/30 p-4 rounded-xl border border-red-200 dark:border-red-900/50">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 rounded-2xl font-bold bg-[var(--color-secondary)] hover:brightness-110 text-white mt-2"
                loading={loading}
                disabled={loading}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create account
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--color-border)]" />
                </div>
                <div className="relative flex justify-center text-xs font-semibold text-[var(--color-text-muted)]">
                  <span className="px-4 bg-white dark:bg-white/5">or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-14 rounded-2xl mt-6 border-2 border-[var(--color-border)] text-[var(--color-text)] hover:bg-gray-50 dark:hover:bg-white/5"
                onClick={handleGoogleSignUp}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
            </div>

            <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
              Already have an account?{' '}
              <Link href="/auth/signin" className="font-semibold text-[var(--color-primary)] hover:text-primary-700 transition-colors">
                Sign in
              </Link>
            </p>

            <p className="mt-6 text-center text-xs text-[var(--color-text-muted)] leading-relaxed px-2">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="underline underline-offset-2 hover:text-[var(--color-primary)]">Terms</Link> and{' '}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-[var(--color-primary)]">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

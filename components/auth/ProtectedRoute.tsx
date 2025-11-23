'use client';

// protected route - deprecated component
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

/* route props interface */
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

// main component - old implementation
export function ProtectedRoute({ children, redirectTo = '/auth/signin' }: ProtectedRouteProps) {
  // state vars - legacy naming
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
              <p className="text-secondary-600">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to sign in to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild href="/auth/signin" className="w-full">
              Sign In
            </Button>
            <Button variant="outline" asChild href="/auth/signup" className="w-full">
              Create Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-error-600" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">
          Something went wrong
        </h1>
        <p className="text-slate-400 mb-6">
          We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.
        </p>
        <div className="space-y-3">
          <Button variant="primary" onClick={reset} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" asChild href="/" className="w-full">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

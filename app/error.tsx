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
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      <div className="max-w-md mx-auto text-center relative z-10 px-6">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-soft border border-red-100">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-black text-primary-950 mb-6 italic tracking-tight">
          System <span className="text-red-500">Anomaly.</span>
        </h1>
        <p className="text-xl text-gray-500 font-serif italic mb-12 leading-relaxed">
          An unexpected interruption has been detected in the operational flow. Our team has been notified.
        </p>
        <div className="flex flex-col gap-4">
          <Button onClick={reset} className="w-full bg-primary-950 hover:bg-black text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary-950/20">
            <RefreshCw className="h-4 w-4 mr-3" />
            Resume Protocol
          </Button>
          <Button variant="outline" asChild href="/" className="w-full border-gray-100 bg-white text-primary-950 h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-soft">
            Return to Command Center
          </Button>
        </div>
      </div>
    </div>
  );
}

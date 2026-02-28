'use client';

import React, { Suspense, Component, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Use Next.js import for SSR support per Spline Skill
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-primary-50/50 via-secondary-50 to-accent-50/50 dark:from-secondary-900 dark:via-secondary-950 dark:to-secondary-900 animate-pulse" />
  ),
});

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-primary-100/30 to-accent-100/30 dark:from-secondary-900 dark:to-secondary-950 flex items-center justify-center" />
      );
    }
    return this.props.children;
  }
}

interface SplineSceneProps {
  scene: string;
  className?: string;
  /** Skip 3D on mobile for performance (per Spline Skill) */
  disableOnMobile?: boolean;
}

export default function SplineScene({ scene, className, disableOnMobile = true }: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (disableOnMobile && window.innerWidth < 768) {
      setShouldLoad(false);
    }
  }, [disableOnMobile]);

  if (!shouldLoad) {
    return (
      <div className={className}>
        <div className="w-full h-full bg-gradient-to-br from-primary-50/50 via-secondary-50 to-accent-50/50 dark:from-primary-950/20 dark:via-secondary-950 dark:to-accent-950/20" />
      </div>
    );
  }

  return (
    <div className={`relative ${className ?? ''}`}>
      {/* Fallback background - hidden once Spline loads */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-primary-50/50 via-secondary-50 to-accent-50/50 dark:from-primary-950/20 dark:via-secondary-950 dark:to-accent-950/20 transition-opacity duration-500 ${loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      />
      <ErrorBoundary>
        <Suspense fallback={<div className="w-full h-full bg-mesh opacity-30 animate-pulse" />}>
          <Spline scene={scene} onLoad={() => setLoaded(true)} className="w-full h-full" />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

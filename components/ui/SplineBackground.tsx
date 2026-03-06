'use client';

/**
 * Production-ready Spline background per Spline Skill.
 * Features: lazy loading, mobile detection, GPU check, 8s timeout fallback, fade-in on load.
 * Usage: <SplineBackground sceneUrl="https://prod.spline.design/XXXXX/scene.splinecode" />
 */

import { Suspense, useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => null,
});

function shouldLoadSpline(mobileBreakpoint: number): boolean {
  if (typeof window === 'undefined') return false;
  const isMobile = window.innerWidth < mobileBreakpoint;
  const isLowEnd = navigator.hardwareConcurrency <= 2;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  return !isMobile && !isLowEnd && !!gl;
}

export interface SplineBackgroundProps {
  sceneUrl: string;
  fallbackColor?: string;
  fallbackImageUrl?: string;
  mobileBreakpoint?: number;
  className?: string;
  /** Default 100vh; use e.g. "50vh" or "400px" for section backgrounds */
  height?: string;
  children?: React.ReactNode;
}

export function SplineBackground({
  sceneUrl,
  fallbackColor = '#0f172a',
  fallbackImageUrl,
  mobileBreakpoint = 768,
  className = '',
  height = '100vh',
  children,
}: SplineBackgroundProps) {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineFailed, setSplineFailed] = useState(false);
  const [canLoad, setCanLoad] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCanLoad(shouldLoadSpline(mobileBreakpoint));
  }, [mobileBreakpoint]);

  useEffect(() => {
    if (!canLoad) return;
    timeoutRef.current = setTimeout(() => {
      if (!splineLoaded) setSplineFailed(true);
    }, 8000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [canLoad, splineLoaded]);

  const onLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setSplineLoaded(true);
  };

  const showFallback = !canLoad || splineFailed;

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ minHeight: height, height: height }}
    >
      {/* Fallback — always underneath */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          background: fallbackImageUrl
            ? `url(${fallbackImageUrl}) center/cover no-repeat`
            : fallbackColor,
          opacity: splineLoaded && !showFallback ? 0 : 1,
        }}
      />

      {/* Spline scene — capable devices only */}
      {canLoad && !splineFailed && (
        <Suspense fallback={null}>
          <div
            className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500 [&_canvas]:!pointer-events-none"
            style={{ opacity: splineLoaded ? 1 : 0 }}
          >
            <Spline
              scene={sceneUrl}
              onLoad={onLoad}
              className="w-full h-full min-h-full"
            />
          </div>
        </Suspense>
      )}

      {children && (
        <div className="relative z-10 h-full min-h-0 flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
}

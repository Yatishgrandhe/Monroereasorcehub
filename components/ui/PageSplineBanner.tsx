'use client';

/**
 * Optional Spline background banner for inner pages (About, Resources, Events, etc.).
 * Renders when sceneUrl is set; otherwise renders only the children with a simple gradient.
 * Per Spline Skill: lazy load, mobile/GPU check, 8s timeout, fallback.
 */

import { SplineBackground } from '@/components/ui/SplineBackground';

export interface PageSplineBannerProps {
  /** Spline scene URL (e.g. from NEXT_PUBLIC_SPLINE_PAGES_URL). Omit to skip Spline. */
  sceneUrl?: string;
  /** Gradient overlay so content stays readable */
  overlayClassName?: string;
  /** Min height of the banner (default 40vh) */
  height?: string;
  children: React.ReactNode;
}

export function PageSplineBanner({
  sceneUrl,
  overlayClassName = 'bg-gradient-to-b from-primary-950/80 via-primary-950/50 to-transparent',
  height = '40vh',
  children,
}: PageSplineBannerProps) {
  if (sceneUrl) {
    return (
      <section className="relative w-full overflow-hidden" style={{ minHeight: height }}>
        <SplineBackground
          sceneUrl={sceneUrl}
          height={height}
          fallbackColor="#0f172a"
          mobileBreakpoint={768}
          className="absolute inset-0"
        >
          <div className={`absolute inset-0 pointer-events-none ${overlayClassName}`} />
          <div className="relative z-10 flex items-end pb-8 pt-28 md:pt-32">
            {children}
          </div>
        </SplineBackground>
      </section>
    );
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-b from-primary-950/95 to-primary-950/50 dark:from-primary-950"
      style={{ minHeight: height }}
    >
      <div className={`absolute inset-0 pointer-events-none ${overlayClassName}`} />
      <div className="relative z-10 flex items-end pb-8 pt-28 md:pt-32">
        {children}
      </div>
    </section>
  );
}

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
  overlayClassName = 'bg-gradient-to-br from-primary-950/95 via-primary-950/60 to-transparent',
  height = '42vh',
  children,
}: PageSplineBannerProps) {
  if (sceneUrl) {
    return (
      <section className="relative w-full overflow-hidden" style={{ minHeight: height }}>
        <SplineBackground
          sceneUrl={sceneUrl}
          height={height}
          fallbackColor="#000d1a"
          mobileBreakpoint={1024}
          className="absolute inset-0"
        >
          <div className={`absolute inset-0 pointer-events-none ${overlayClassName}`} />
          <div className="absolute inset-0 bg-primary-950/20 backdrop-blur-[2px] pointer-events-none" />
          <div className="relative z-10 flex items-center h-full min-h-[inherit] pt-32 pb-16">
            {children}
          </div>
        </SplineBackground>
      </section>
    );
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-primary-950"
      style={{ minHeight: height }}
    >
      <div className={`absolute inset-0 pointer-events-none ${overlayClassName}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(52,97,173,0.15),transparent_50%)]" />
      <div className="relative z-10 flex items-center h-full min-h-[inherit] pt-32 pb-16">
        {children}
      </div>
    </section>
  );
}

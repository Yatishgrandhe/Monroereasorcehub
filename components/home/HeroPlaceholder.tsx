'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

const SplineScene = dynamic(() => import('@/components/ui/SplineScene').then((m) => m.default), { ssr: false });

interface HeroPlaceholderProps {
  className?: string;
  /** Optional: pass a Spline scene URL when ready. Renders blank gradient placeholder if omitted. */
  splineSceneUrl?: string | null;
}

/**
 * Blank hero section ready for 3D asset.
 * Pass splineSceneUrl when you have your Spline scene URL from Export → Code Export.
 * Per Spline Skill: Use prod.spline.design/xxx/scene.splinecode URL.
 */
export function HeroPlaceholder({ className, splineSceneUrl }: HeroPlaceholderProps) {
  return (
    <section
      className={cn(
        'relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-screen overflow-hidden',
        className
      )}
    >
      {splineSceneUrl ? (
        <>
          <div className="absolute inset-0 z-0">
            <SplineScene scene={splineSceneUrl} className="w-full h-full" disableOnMobile />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/95 z-[1] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.15),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_80%,rgba(13,148,136,0.08),transparent)]" />
        </>
      )}
    </section>
  );
}

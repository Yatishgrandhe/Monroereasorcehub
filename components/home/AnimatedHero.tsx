'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => null,
});

interface AnimatedHeroProps {
  splineSceneUrl?: string | null;
  className?: string;
}

/** Dark slate backgrounds - no black */
const BG_START = '#020617';
const BG_MID = '#0f172a';
const BG_END = '#1e293b';

export function AnimatedHero({ splineSceneUrl, className }: AnimatedHeroProps) {
  const [shouldLoadSpline, setShouldLoadSpline] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(useTransform(mouseX, [-0.5, 0.5], [-30, 30]), springConfig);
  const y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-30, 30]), springConfig);

  const x2 = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, -20]), springConfig);
  const y2 = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), springConfig);

  const x3 = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  const y3 = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency <= 2;
    setShouldLoadSpline(!!splineSceneUrl && !isMobile && !isLowEnd);
  }, [splineSceneUrl]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    mouseX.set(dx);
    mouseY.set(dy);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative min-h-[85vh] sm:min-h-[90vh] flex items-end overflow-hidden',
        className
      )}
      style={{ background: `linear-gradient(180deg, ${BG_START} 0%, ${BG_MID} 40%, ${BG_END} 100%)` }}
    >
      {/* Spline 3D scene - optional, pointer-events: none so content is clickable */}
      {shouldLoadSpline && splineSceneUrl && (
        <div className="absolute inset-0 pointer-events-none z-0 [&_canvas]:!pointer-events-none">
          <Spline
            scene={splineSceneUrl}
            onLoad={() => { }}
            className="w-full h-full opacity-80"
          />
        </div>
      )}

      {/* Fallback / overlay: 3D-reactive gradient orbs in logo colors (royal blue, teal, coral) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f172a]/80" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37, 99, 235, 0.25), transparent 50%),
              radial-gradient(ellipse 60% 40% at 90% 60%, rgba(13, 148, 136, 0.15), transparent 50%),
              radial-gradient(ellipse 60% 40% at 10% 80%, rgba(249, 115, 22, 0.12), transparent 50%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Mouse-reactive floating orbs - logo colors */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{
            x,
            y,
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{
            x: x2,
            y: y2,
            background: 'radial-gradient(circle, rgba(13, 148, 136, 0.2) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1.15, 1, 1.15],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"
          style={{
            x: x3,
            y: y3,
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-28">
        <div className="container-custom">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                variant="outline"
                className="mb-6 px-4 py-2 glass-spline border-primary-500/30 text-primary-300 inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-primary-400" />
                Community Connection Refined
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-6 text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]"
            >
              Empowering <span className="text-gradient">Monroe</span>
              <br />
              Together.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl mb-10 text-slate-300 max-w-2xl leading-relaxed"
            >
              We&apos;ve gathered every essential resource Monroe has to offer.
              Find help, discover opportunities, and stay connected with your community—all in one platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                variant="gradient"
                className="min-w-[200px] h-12 sm:h-14 text-base sm:text-lg rounded-full bg-gradient-spline border-none shadow-lg shadow-primary-500/25 hover:shadow-primary-500/30"
                asChild
                href="/resources"
              >
                <>Explore Resources <ArrowRight className="ml-2 h-4 w-4 inline-block" /></>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="min-w-[200px] h-12 sm:h-14 text-base sm:text-lg glass-spline border-white/20 text-white hover:bg-white/10"
                asChild
                href="/career"
              >
                <>Career Center</>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

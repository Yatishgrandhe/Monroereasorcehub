'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SplineBackground } from '@/components/ui/SplineBackground';
import { SPLINE_HERO_URL } from '@/lib/spline';

export function CivicHero() {
  const heroContent = (
    <div className="container-custom w-full pt-32 pb-24 flex items-center min-h-[85vh]">
      <div className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-1 bg-gradient-to-r from-accent-500 to-transparent rounded-full" />
            <span className="text-accent-400 font-black uppercase tracking-[0.4em] text-[10px]">Monroe, North Carolina</span>
          </div>
          <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black leading-[1.05] mb-8 tracking-tighter italic drop-shadow-2xl">
            Your community.<br />
            <span className="text-accent-500 not-italic">All in one place.</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-50/80 mb-12 leading-relaxed max-w-2xl font-medium">
            Free access to food, healthcare, housing, jobs, and more — built for every resident of Union County.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 flex-nowrap">
            <Link href="/resources" className="w-full sm:w-auto shrink-0">
              <Button className="bg-[var(--color-secondary)] hover:brightness-110 text-white !h-16 sm:!h-20 px-8 sm:px-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] w-full sm:w-auto shadow-2xl shadow-red-500/20 whitespace-nowrap group transition-all duration-300 transform-gpu hover:-translate-y-1 active:translate-y-0">
                <span className="flex items-center justify-center gap-4">
                  <span>Find Resources</span>
                  <ArrowRight className="h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link href="/submit-resource" className="w-full sm:w-auto shrink-0">
              <Button variant="outline" className="!h-16 sm:!h-20 px-8 sm:px-12 rounded-2xl border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 w-full sm:w-auto font-black uppercase tracking-[0.2em] text-[10px] whitespace-nowrap transition-all duration-300">
                Add an Organization
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );

  if (SPLINE_HERO_URL) {
    return (
      <section className="relative w-full min-h-[85vh] overflow-hidden">
        <div className="hero-orb-before" aria-hidden="true" />
        <div className="hero-orb-after" aria-hidden="true" />
        <SplineBackground
          sceneUrl={SPLINE_HERO_URL}
          height="85vh"
          fallbackColor="#143628"
          fallbackImageUrl="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=2000"
          className="min-h-[85vh]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/95 via-primary-950/80 to-primary-950/50 pointer-events-none" />
          {heroContent}
        </SplineBackground>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-white">
      <div className="hero-orb-before" aria-hidden="true" />
      <div className="hero-orb-after" aria-hidden="true" />
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=2000"
          alt="Monroe Civic Architecture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/95 via-primary-950/80 to-primary-950/50" />
      </div>

      <div className="container-custom relative z-10 w-full pt-28 pb-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6 drop-shadow-lg">
              Your community. All in one place.
            </h1>
            <p className="text-lg md:text-xl text-primary-100/90 mb-10 leading-relaxed max-w-2xl">
              Free access to food, healthcare, housing, jobs, and more — built for every resident of Union County.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 flex-nowrap">
              <Link href="/resources" className="w-full sm:w-auto shrink-0">
                <Button className="bg-[var(--color-accent)] text-[var(--color-text)] hover:opacity-90 h-12 sm:h-14 px-6 sm:px-10 rounded-xl font-bold text-base w-full sm:w-auto shadow-[0_4px_14px_var(--color-shadow)] whitespace-nowrap group transition-all duration-200 active:scale-[0.98]">
                  <span className="flex items-center justify-center gap-2">
                    <span>Find Resources</span>
                    <ArrowRight className="h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link href="/submit-resource" className="w-full sm:w-auto shrink-0">
                <Button variant="outline" className="h-12 sm:h-14 px-6 sm:px-10 rounded-xl border-2 border-white/50 text-white hover:bg-white/10 w-full sm:w-auto font-semibold whitespace-nowrap">
                  Add an Organization
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}

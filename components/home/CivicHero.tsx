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
      <div className="max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-[3px] w-[60px] rounded-full bg-gradient-to-r from-primary-500 to-accent-500 origin-left"
            />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-white font-bold uppercase tracking-[0.2em] text-xs font-sans"
            >
              Monroe, North Carolina
            </motion.span>
          </div>

          <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif font-bold leading-[1.05] mb-8 drop-shadow-2xl">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              Your community.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              All in one place<span className="text-secondary-500">.</span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.30, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-2xl font-sans"
          >
            Free access to food, healthcare, housing, jobs, and more — built for every resident of Union County.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-6 flex-nowrap"
          >
            <Link href="/resources" className="w-full sm:w-auto shrink-0">
              <Button className="bg-primary-500 text-white hover:bg-primary-600 !h-16 sm:!h-20 px-8 sm:px-14 rounded-2xl font-bold text-base w-full sm:w-auto shadow-[0_4px_24px_#3461ad73] whitespace-nowrap group transition-all duration-300 transform-gpu hover:-translate-y-1 active:translate-y-0 active:scale-[0.97]">
                <span className="flex items-center justify-center gap-4">
                  <span>Find Resources</span>
                  <ArrowRight className="h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link href="/submit-resource" className="w-full sm:w-auto shrink-0">
              <Button variant="outline" className="!h-16 sm:!h-20 px-8 sm:px-12 rounded-2xl border border-white/30 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:-translate-y-1 w-full sm:w-auto font-bold text-base whitespace-nowrap transition-all duration-300 active:translate-y-0 active:scale-[0.97]">
                Add an Organization
              </Button>
            </Link>
          </motion.div>
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          {heroContent}
        </SplineBackground>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-civic-gradient">
      <div className="hero-orb-before" aria-hidden="true" />
      <div className="hero-orb-after" aria-hidden="true" />
      <div className="svg-grain-overlay" />
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=2000"
          alt="Monroe Civic Architecture"
          className="w-full h-full object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {heroContent}

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}

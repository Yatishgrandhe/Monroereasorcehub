'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SplineBackground } from '@/components/ui/SplineBackground';
import { SPLINE_HERO_URL } from '@/lib/spline';

export function CivicHero() {
  const heroContent = (
    <div className="container-custom w-full pt-28 pb-20 flex items-center min-h-[85vh]">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6 drop-shadow-lg">
            Monroe&apos;s most complete guide to local help and opportunity.
          </h1>
          <p className="text-lg md:text-xl text-primary-100/90 mb-10 leading-relaxed max-w-2xl">
            From food assistance to job training — find what you need, fast and free, right here in Union County.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 flex-nowrap">
            <Link href="/resources" className="w-full sm:w-auto shrink-0">
              <Button className="bg-[var(--color-accent)] text-[var(--color-text)] hover:opacity-90 h-12 sm:h-14 px-6 sm:px-10 rounded-xl font-bold text-base w-full sm:w-auto shadow-[0_4px_14px_var(--color-shadow)] whitespace-nowrap group transition-all duration-200 active:scale-[0.98]">
                <span className="flex items-center justify-center gap-2">
                  <span>Find resources</span>
                  <ArrowRight className="h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link href="/submit-resource" className="w-full sm:w-auto shrink-0">
              <Button variant="outline" className="h-12 sm:h-14 px-6 sm:px-10 rounded-xl border-2 border-white/50 text-white hover:bg-white/10 w-full sm:w-auto font-semibold whitespace-nowrap">
                List your organization
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
        <SplineBackground
          sceneUrl={SPLINE_HERO_URL}
          height="85vh"
          fallbackColor="#0f172a"
          fallbackImageUrl="https://upload.wikimedia.org/wikipedia/commons/e/ee/Union_County_Courthouse%2C_Monroe%2C_NC_September_2017%2C_front_view.jpg"
          className="min-h-[85vh]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/95 via-primary-950/80 to-primary-950/50 pointer-events-none" />
          {heroContent}
        </SplineBackground>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-[#000d1a] to-transparent pointer-events-none z-10" />
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-white dark:bg-[#000d1a]">
      <div className="absolute inset-0 z-0">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Union_County_Courthouse%2C_Monroe%2C_NC_September_2017%2C_front_view.jpg"
          alt="Union County Courthouse, Monroe NC"
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
              Monroe&apos;s most complete guide to local help and opportunity.
            </h1>
            <p className="text-lg md:text-xl text-primary-100/90 mb-10 leading-relaxed max-w-2xl">
              From food assistance to job training — find what you need, fast and free, right here in Union County.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 flex-nowrap">
              <Link href="/resources" className="w-full sm:w-auto shrink-0">
                <Button className="bg-[var(--color-accent)] text-[var(--color-text)] hover:opacity-90 h-12 sm:h-14 px-6 sm:px-10 rounded-xl font-bold text-base w-full sm:w-auto shadow-[0_4px_14px_var(--color-shadow)] whitespace-nowrap group transition-all duration-200 active:scale-[0.98]">
                  <span className="flex items-center justify-center gap-2">
                    <span>Find resources</span>
                    <ArrowRight className="h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link href="/submit-resource" className="w-full sm:w-auto shrink-0">
                <Button variant="outline" className="h-12 sm:h-14 px-6 sm:px-10 rounded-xl border-2 border-white/50 text-white hover:bg-white/10 w-full sm:w-auto font-semibold whitespace-nowrap">
                  List your organization
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-[#000d1a] to-transparent pointer-events-none" />
    </section>
  );
}

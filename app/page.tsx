'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { ResourceMap } from '@/components/resources/ResourceMap';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { CivicHero } from '@/components/home/CivicHero';
import { ValueProposition } from '@/components/home/ValueProposition';
import { SpotlightBento } from '@/components/home/SpotlightBento';
import { Testimonials } from '@/components/home/Testimonials';
import { ContactForm } from '@/components/home/ContactForm';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#000d1a]">
      {/* 1. HERO — Civic Professionalism */}
      <CivicHero />

      {/* 2. CATEGORY GRID — Key navigation */}
      <CategoryGrid />

      {/* 3. VALUE PROPOSITION — Why Monroe Resource Hub */}
      <ValueProposition />

      {/* 4. MAP — Resource localization */}
      <ResourceMap />

      {/* 5. SPOTLIGHT — Featured partners */}
      <section className="py-32 bg-white dark:bg-[#000d1a] relative">
        <div className="container-custom relative z-10">
          <Reveal width="100%">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8 text-center md:text-left">
              <div className="max-w-2xl">
                <span className="text-accent-600 font-bold uppercase tracking-[0.2em] text-xs">Direct Support</span>
                <h2 className="text-5xl md:text-6xl font-serif font-black text-primary-950 dark:text-white mt-4 mb-6 leading-tight">
                  Featured Community <span className="text-secondary-600">Partners</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  We verify every organization to ensure Monroe residents receive the most reliable local support.
                </p>
              </div>
              <Button className="btn-civic-primary shrink-0 !px-10 h-14 uppercase tracking-widest font-bold text-xs" asChild>
                <Link href="/resources">
                  All Resources <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
          <Reveal width="100%" delay={0.2}>
            <SpotlightBento />
          </Reveal>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <Testimonials />

      {/* 7. CONTACT */}
      <ContactForm />

      {/* 8. CTA — Final conversion */}
      <section className="py-32 relative overflow-hidden bg-primary-950 text-white border-t border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-accent-500/10 blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-secondary-500/10 blur-[150px]" />
        </div>

        <div className="container-custom relative z-10 text-center">
          <Reveal width="100%">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-serif font-black mb-10 leading-tight">
                Empowering Monroe <br /><span className="text-accent-500 italic">together.</span>
              </h2>
              <p className="text-xl md:text-2xl mb-14 text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                Whether you're looking for help or looking to help others, our hub is the central point for community growth in Union County.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/resources" className="w-full sm:w-auto">
                  <Button className="btn-civic-accent !h-16 !px-12 text-sm font-bold uppercase tracking-[0.2em] w-full">
                    Find Support Now
                  </Button>
                </Link>
                <Link href="/career" className="w-full sm:w-auto">
                  <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/20 backdrop-blur-xl !h-16 !px-12 text-sm font-bold uppercase tracking-[0.2em] w-full transition-all">
                    Career Center
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

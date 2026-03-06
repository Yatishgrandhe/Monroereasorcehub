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

import { LogoCloud } from '@/components/home/LogoCloud';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO — Civic Professionalism */}
      <CivicHero />

      {/* 1.5 LOGOS — Trust Signals */}
      <LogoCloud />

      {/* 2. CATEGORY GRID — Key navigation */}
      <CategoryGrid />

      {/* 3. VALUE PROPOSITION — Why Monroe Resource Hub */}
      <ValueProposition />

      {/* 4. MAP — Resource localization */}
      <ResourceMap />

      {/* 5. SPOTLIGHT — Featured partners */}
      <section className="py-20 md:py-28 bg-white dark:bg-[#000d1a] relative">
        <div className="container-custom relative z-10">
          <Reveal width="100%">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8 text-center md:text-left">
              <div className="max-w-2xl">
                <span className="text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-wider text-xs">Featured</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-950 dark:text-white mt-3 mb-4 leading-tight">
                  Featured community partners
                </h2>
                <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                  Real Monroe and Union County organizations we verify and list. Contact them directly or view full details on our resources page.
                </p>
              </div>
              <Button className="mt-4 md:mt-0 shrink-0" asChild>
                <Link href="/resources">
                  All resources <ArrowRight className="ml-2 h-4 w-4" />
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

      <section className="py-12 px-6 lg:px-12 pb-24 bg-white dark:bg-[#000d1a] relative">
        <div className="container-custom mx-auto bg-primary-950 rounded-[4rem] relative overflow-hidden py-32 px-10 md:px-20 text-center shadow-[0_32px_128px_-16px_rgba(52,97,173,0.3)]">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1.5px,transparent_1.5px)] [background-size:48px_48px] opacity-40" />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-accent-500/15 blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-secondary-500/15 blur-[140px]" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <Reveal width="100%">
              <h2 className="text-5xl md:text-7xl font-serif font-black text-white mb-8 leading-tight tracking-tighter italic">
                Empowering Monroe <span className="text-accent-400 not-italic">together.</span>
              </h2>
              <p className="text-xl md:text-2xl mb-16 text-blue-50/70 leading-relaxed max-w-2xl mx-auto font-medium">
                Whether you need help or want to help others, the Hub is your central place for community resources in Union County.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <Link href="/resources" className="w-full sm:w-auto">
                  <Button className="bg-[var(--color-secondary)] hover:brightness-110 text-white !h-20 !px-16 text-[10px] font-black uppercase tracking-[0.3em] w-full rounded-2xl shadow-2xl shadow-red-900/40 transform-gpu hover:-translate-y-1 transition-all">
                    Find Support Now
                  </Button>
                </Link>
                <Link href="/about" className="w-full sm:w-auto">
                  <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-3xl !h-20 !px-14 text-[10px] font-black uppercase tracking-[0.2em] w-full rounded-2xl transition-all">
                    Our Mission
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

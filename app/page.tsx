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
      <section className="py-32 bg-white relative">
        <div className="container-custom relative z-10">
          <Reveal width="100%">
            <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-20 gap-12 text-center lg:text-left">
              <div className="max-w-2xl">
                <span className="text-primary-700 font-bold uppercase tracking-[0.4em] text-[10px]">Verified Operations</span>
                <h2 className="text-5xl md:text-7xl font-serif font-black text-primary-950 mt-6 mb-8 tracking-tighter leading-tight italic">
                  Featured Community <span className="text-primary-700 not-italic">Partners.</span>
                </h2>
                <p className="text-xl text-gray-500 font-serif italic leading-relaxed">
                  Every organization listed below is an integral pillar of our local infrastructure. We coordinate with them directly to ensure operational transparency.
                </p>
              </div>
              <Button className="bg-primary-950 hover:bg-black text-white px-10 h-16 rounded-2xl uppercase tracking-widest text-[10px] font-bold shadow-xl shadow-primary-950/20 shrink-0" asChild>
                <Link href="/resources">
                  All Resources <ArrowRight className="ml-3 h-4 w-4" />
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
      <section className="py-12 px-6 lg:px-12 pb-24 bg-white relative">
        <div className="max-w-[1400px] mx-auto bg-primary-950 rounded-[4rem] relative overflow-hidden py-32 px-10 text-center">
          {/* Subtle civic texture */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] opacity-30" />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-accent-500/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-primary-700/10 blur-[120px]" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <Reveal width="100%">
              <h2 className="text-5xl md:text-8xl font-serif font-black text-white mb-10 tracking-tighter leading-[0.9]">
                Empowering Monroe <br /><span className="text-accent-500 italic">Together.</span>
              </h2>
              <p className="text-xl md:text-2xl mb-16 text-gray-400 font-serif italic leading-relaxed max-w-2xl mx-auto">
                Whether you're seeking essential support or looking to contribute to our unified civic infrastructure, the Hub is your central coordination point.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/resources" className="w-full sm:w-auto">
                  <Button className="bg-accent-500 hover:bg-accent-400 text-primary-950 !h-16 !px-12 text-[10px] font-black uppercase tracking-[0.2em] w-full rounded-2xl shadow-xl shadow-accent-500/20">
                    Find Support Now
                  </Button>
                </Link>
                <Link href="/career" className="w-full sm:w-auto">
                  <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md !h-16 !px-12 text-[10px] font-black uppercase tracking-[0.2em] w-full rounded-2xl transition-all">
                    Career Operations
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

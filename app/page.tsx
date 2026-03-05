'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Utensils, Stethoscope, GraduationCap, Home, Baby, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SpotlightBento } from '@/components/home/SpotlightBento';
import { Hero3D } from '@/components/home/Hero3D';
import { LogoCloud } from '@/components/home/LogoCloud';
import { ValueProposition } from '@/components/home/ValueProposition';
import { Testimonials } from '@/components/home/Testimonials';
import { ContactForm } from '@/components/home/ContactForm';
import { Reveal } from '@/components/ui/Reveal';
import { ResourceMap } from '@/components/resources/ResourceMap';
import { Magnetic } from '@/components/ui/Magnetic';

import { CategoryGrid } from '@/components/home/CategoryGrid';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#020617]">
      {/* 1. HERO — Interactive 3D Experience */}
      <Hero3D />

      {/* 2. LOGO CLOUD — Compact trust bar */}
      <LogoCloud className="pt-4 pb-4 md:pt-6 md:pb-6 border-y border-white/[0.06]" />

      <CategoryGrid />

      {/* 4. VALUE PROPOSITION — Why Monroe Resource Hub */}
      <Reveal width="100%">
        <ValueProposition className="section-padding-sm" />
      </Reveal>

      {/* 4.5 MAP — Resource localization */}
      <ResourceMap />

      {/* 5. SPOTLIGHT — Featured partners */}
      <section className="section-padding-md bg-[#020617] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-40" />
        <div className="container-custom relative z-10">
          <Reveal width="100%">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 md:mb-10 gap-6 text-center md:text-left">
              <div className="max-w-2xl">
                <Badge variant="glass" className="mb-6 bg-primary-500/10 text-primary-400 border-none font-black tracking-widest uppercase text-[10px] px-5 py-2">
                  Featured Partner
                </Badge>
                <h2 className="text-white mb-4 text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none">
                  Impact <span className="text-gradient-logo">Spotlight</span>
                </h2>
                <p className="text-base md:text-lg text-slate-400 font-medium">
                  Showcase of organizations going above and beyond for our community.
                </p>
              </div>
              <Button variant="outline" className="text-white border-white/10 hover:bg-white/5 shrink-0 rounded-[1.5rem] h-14 px-10 font-black text-xs uppercase tracking-widest" asChild href="/resources?featured=true">
                <Link href="/resources?featured=true" className="flex items-center">
                  View All <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
          <Reveal width="100%" delay={0.3}>
            <SpotlightBento resources={[]} />
          </Reveal>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <Reveal width="100%">
        <Testimonials className="section-padding" />
      </Reveal>

      {/* 7. CONTACT */}
      <Reveal width="100%">
        <ContactForm className="section-padding-md" />
      </Reveal>

      {/* 8. CTA — Final conversion */}
      <section className="section-padding relative overflow-hidden bg-[#020617]">
        <div className="absolute inset-0 bg-primary-500/[0.02] pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <Reveal width="100%">
            <div className="max-w-4xl mx-auto p-8 md:p-16 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl transition-all duration-500 hover:border-primary-500/30 hover:bg-white/[0.03] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)]">
              <Badge variant="glass" className="mb-6 md:mb-8 bg-white/5 text-white border-none font-black tracking-[0.4em] uppercase text-[10px] px-6 py-2">
                Join the Network
              </Badge>
              <h2 className="mb-6 md:mb-8 text-white text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none">
                Ready to find <br /><span className="text-gradient-logo">what you need?</span>
              </h2>
              <p className="text-lg md:text-xl mb-10 md:mb-12 text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                Join thousands of Monroe residents finding help and opportunity every single day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center">
                <Magnetic strength={0.3}>
                  <Button size="lg" variant="gradient" className="w-full sm:w-auto px-12 h-16 rounded-3xl bg-primary-600 hover:bg-primary-500 border-none shadow-2xl shadow-primary-500/30 text-sm font-black uppercase tracking-[0.1em] text-white" asChild href="/resources">
                    <Link href="/resources">Get Started</Link>
                  </Button>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-12 h-16 rounded-3xl border-white/30 text-white hover:bg-white/10 font-black text-sm uppercase tracking-[0.1em]" asChild href="/career/resume-builder">
                    <Link href="/career/resume-builder">Build Resume</Link>
                  </Button>
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

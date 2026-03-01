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
      <LogoCloud className="pt-2 pb-6 md:pt-4 md:pb-8 border-y border-white/[0.06]" />

      <CategoryGrid />

      {/* 4. VALUE PROPOSITION — Why Monroe Resource Hub */}
      <Reveal width="100%">
        <ValueProposition className="section-padding-sm" />
      </Reveal>

      {/* 4.5 MAP — Resource localization */}
      <ResourceMap />

      {/* 5. SPOTLIGHT — Featured partners */}
      <section className="section-padding-md bg-[#020617] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
        <div className="container-custom relative z-10">
          <Reveal width="100%">
            <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-6 text-white text-left">
              <div className="max-w-2xl">
                <Badge className="mb-6 bg-white/10 text-primary-400 border-white/10 font-black tracking-widest uppercase text-[10px] px-4 py-1.5 backdrop-blur-md">Handpicked</Badge>
                <h2 className="text-white mb-4">Spotlight: Local Impact</h2>
                <p className="text-xl text-slate-400">
                  Showcasing the organizations that go above and beyond for our community.
                </p>
              </div>
              <Button variant="outline" className="text-white border-white/10 hover:bg-white/5 shrink-0 rounded-full h-12 px-8 font-bold text-sm" asChild href="/resources?featured=true">
                <>View All Featured <ArrowRight className="ml-2 h-4 w-4" /></>
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
        <Testimonials className="section-padding-sm" />
      </Reveal>

      {/* 7. CONTACT */}
      <Reveal width="100%">
        <ContactForm className="section-padding-md" />
      </Reveal>

      {/* 8. CTA — Final conversion */}
      <section className="section-padding-sm relative overflow-hidden bg-[#020617]">
        <div className="container-custom relative z-10 text-center">
          <Reveal width="100%">
            <div className="max-w-4xl mx-auto p-8 md:p-12 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl transition-all duration-500 hover:border-primary-500/30">
              <h2 className="mb-6 text-white">Ready to find what you need?</h2>
              <p className="text-xl mb-10 text-slate-400 max-w-2xl mx-auto">
                Join thousands of Monroe residents finding help and opportunity every single day.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Magnetic strength={0.3}>
                  <Button size="lg" variant="gradient" className="px-12 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 border-none shadow-2xl shadow-indigo-500/20 font-bold" asChild href="/resources">
                    <>Get Started</>
                  </Button>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <Button size="lg" variant="outline" className="px-12 h-14 rounded-full border-white/10 text-white hover:bg-white/5 font-bold" asChild href="/career/resume-builder">
                    <>Build Resume</>
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

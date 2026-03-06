'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Heart, CheckCircle, GraduationCap, MapPin } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const team = [
  { name: 'Yatish Grandhe', role: 'Platform Architect' },
  { name: 'Dhyan Kanna', role: 'Interface Designer' },
  { name: 'Aman Gandhi', role: 'Resource Verification' },
  { name: 'Tanishq Juneja', role: 'Community Outreach' },
  { name: 'Saahil Mehta', role: 'Systems Management' },
  { name: 'Vihaan Kotagiri', role: 'Content Strategy' },
];

const values = [
  {
    icon: Shield,
    title: 'Accuracy',
    description: 'We verify every listing manually. No outdated phone numbers or expired addresses.'
  },
  {
    icon: Users,
    title: 'Accessibility',
    description: 'Our site is built to be fast even on weak cellular data, ensuring anyone can use it.'
  },
  {
    icon: Heart,
    title: 'Community',
    description: "Built in Monroe, for Monroe. We're your neighbors, students, and community members."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#000d1a]">
      {/* Hero Header */}
      <section className="bg-primary-950 text-white pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="container-custom text-center">
          <Reveal width="100%">
            <span className="text-accent-500 font-bold uppercase tracking-[0.2em] text-xs">Our Story</span>
            <h1 className="text-5xl md:text-7xl font-serif font-black mt-6 mb-8 drop-shadow-md">
              Manually verified, <br /><span className="text-accent-500">locally managed.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Monroe Resource Hub is a student-led project dedicated to connecting
              Union County residents with the help they need.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal width="100%">
              <h2 className="text-4xl font-serif font-black text-primary-950 dark:text-white mb-8">
                Born out of a simple need: <br /><span className="text-accent-600 underline">clarity.</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                <p>
                  We are a team of 10th-grade students at the Central Academy of Technology and Arts (CATA).
                  Last year, we realized that while Monroe has amazing resources — from food banks to career support
                  — the information lived in ten different places, many of which were outdated.
                </p>
                <p>
                  We decided to build one place where every piece of information is checked by a human being.
                  No algorithms, no expired data, just humans helping humans find what they need, fast and free.
                </p>
              </div>
            </Reveal>
            <Reveal width="100%" delay={0.2}>
              <div className="p-8 bg-primary-50 dark:bg-primary-950/20 rounded-3xl border border-primary-100 dark:border-primary-900">
                <blockquote className="text-2xl font-serif italic text-primary-900 dark:text-primary-300 mb-6">
                  &ldquo;Monroe really needed this central resource. It wasn&apos;t just about technology; it was about community trust.&rdquo;
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-accent-500 flex items-center justify-center text-white font-bold">YG</div>
                  <div className="ml-4">
                    <p className="font-bold text-primary-950 dark:text-white font-serif">Yatish Grandhe</p>
                    <p className="text-sm text-gray-500 font-medium">Platform Architect</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats Board */}
      <section className="py-20 bg-primary-950 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <Reveal width="100%">
              <div className="text-5xl font-serif font-black text-accent-500 mb-2">200+</div>
              <div className="text-sm uppercase tracking-widest font-bold opacity-70">Verified Resources</div>
            </Reveal>
            <Reveal width="100%" delay={0.1}>
              <div className="text-5xl font-serif font-black text-accent-500 mb-2">1,000+</div>
              <div className="text-sm uppercase tracking-widest font-bold opacity-70">Monthly Visitors</div>
            </Reveal>
            <Reveal width="100%" delay={0.2}>
              <div className="text-5xl font-serif font-black text-accent-500 mb-2">100%</div>
              <div className="text-sm uppercase tracking-widest font-bold opacity-70">Free Forever</div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Community Gallery */}
      <section className="py-24 overflow-hidden">
        <div className="container-custom">
          <div className="text-center mb-16">
            <Reveal width="100%">
              <span className="text-accent-600 font-bold uppercase tracking-[0.2em] text-xs">Our Historic Roots</span>
              <h2 className="text-4xl md:text-5xl font-serif font-black text-primary-950 dark:text-white mt-4">Local Landmarks</h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <Reveal width="100%">
              <div className="relative group rounded-3xl overflow-hidden h-80 sm:h-[500px] shadow-2xl border border-gray-100 dark:border-primary-900">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Union_County_Courthouse%2C_Monroe%2C_NC_September_2017%2C_front_view.jpg"
                  alt="Historic Union County Courthouse Front"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-transparent to-transparent flex items-end p-8 sm:p-12">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">Union County Courthouse</h3>
                    <p className="text-gray-300 text-sm font-medium">The architectural centerpiece of downtown Monroe since 1886.</p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal width="100%" delay={0.2}>
              <div className="relative group rounded-3xl overflow-hidden h-80 sm:h-[500px] shadow-2xl border border-gray-100 dark:border-primary-900">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/23/Union_County_Courthouse%2C_Monroe%2C_NC_September_2017%2C_side_view.jpg"
                  alt="Union County Courthouse Side Entrance"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-transparent to-transparent flex items-end p-8 sm:p-12">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">Preserving History</h3>
                    <p className="text-gray-300 text-sm font-medium">Restored heritage buildings reflecting our community's enduring spirit.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50 dark:bg-primary-950/40">
        <div className="container-custom">
          <div className="text-center mb-16">
            <Reveal width="100%">
              <h2 className="text-4xl font-serif font-black text-primary-950 dark:text-white">Our Values</h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1} width="100%">
                <div className="bg-white dark:bg-[#000d1a] p-8 rounded-2xl border border-gray-100 dark:border-primary-900 shadow-sm h-full">
                  <div className="w-12 h-12 rounded-lg bg-accent-500/10 flex items-center justify-center text-accent-600 mb-6">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-primary-950 dark:text-white mb-4">{v.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container-custom">
          <div className="text-center mb-16">
            <Reveal width="100%">
              <h2 className="text-4xl font-serif font-black text-primary-950 dark:text-white mb-4 italic">The Team</h2>
              <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
                We are a dedicated group of 10th-grade students at Central Academy of Technology and Arts,
                working together to build something that lasts.
              </p>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.05} width="100%">
                <div className="civic-card flex flex-col items-center text-center p-8 bg-white dark:bg-primary-950/40">
                  <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-900 dark:text-primary-300 font-bold mb-6 text-xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-primary-950 dark:text-white mb-2">{member.name}</h3>
                  <p className="text-accent-600 font-bold text-sm uppercase tracking-widest mb-4">{member.role}</p>
                  <div className="flex items-center text-gray-400 text-xs font-medium uppercase tracking-widest gap-2">
                    <GraduationCap className="h-3.5 w-3.5" /> Grade 10 • CATA
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Note */}
      <section className="py-24 bg-primary-950 text-white border-t border-primary-900">
        <div className="container-custom text-center">
          <Reveal width="100%">
            <div className="max-w-3xl mx-auto py-12 px-8 rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-3xl">
              <h2 className="text-3xl font-serif font-bold mb-6 text-accent-500 italic">Transparency Note</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light mb-10">
                Plain talk: we&apos;re students, but we take this seriously. Every resource is manually checked.
                We don&apos;t use scraping bots or "AI" for our listings — just humans helping humans find real help.
              </p>
              <Button asChild className="btn-civic-accent !px-10 h-12 uppercase tracking-widest font-bold">
                <Link href="/contact">Ask Us Anything</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

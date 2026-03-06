'use client';

import { Shield, Users, Heart, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { PageSplineBanner } from '@/components/ui/PageSplineBanner';
import Link from 'next/link';
import { SPLINE_PAGES_URL } from '@/lib/spline';

const team = [
  { name: 'Yatish Grandhe', role: 'Platform Architect' },
  { name: 'Dhyan Kanna', role: 'Interface Designer' },
  { name: 'Aman Gandhi', role: 'Resource Verification' },
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
    <div className="min-h-screen bg-[var(--color-bg)] dark:bg-[#0f172a] relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      {/* Hero with optional Spline background */}
      <PageSplineBanner sceneUrl={SPLINE_PAGES_URL || undefined} height="42vh">
        <div className="container-custom w-full">
          <Reveal width="100%">
            <div className="flex flex-col items-start gap-4">
              <span className="px-5 py-2 rounded-full bg-accent-500/10 border border-accent-400/20 text-accent-400 font-black uppercase tracking-[0.3em] text-[10px] backdrop-blur-md">
                Our Mission & Foundation
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white tracking-tighter leading-none italic mb-4">
                About Us<span className="text-secondary-500 not-italic">.</span>
              </h1>
              <div className="w-24 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mb-6" />
              <p className="text-xl md:text-2xl text-blue-50/70 max-w-3xl leading-relaxed italic font-medium">
                Monroe Resource Hub is a student-led initiative dedicated to rebuilding community trust through verified, high-bandwidth data transparency.
              </p>
            </div>
          </Reveal>
        </div>
      </PageSplineBanner>

      {/* Origin Story Section */}
      <section className="py-12 px-6 lg:px-12 relative z-10">
        <div className="max-w-[1400px] mx-auto bg-primary-50 rounded-[5rem] py-32 px-10 md:px-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/40 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
            <Reveal width="100%">
              <span className="text-primary-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-8 block">Strategic Origin</span>
              <h2 className="text-5xl md:text-7xl font-serif font-black text-primary-950 mb-10 tracking-tighter leading-[0.9] italic">
                Born out of a simple need for <span className="text-primary-700 not-italic">clarity.</span>
              </h2>
              <div className="space-y-8 text-xl text-gray-500 font-serif italic leading-relaxed">
                <p>
                  We are a specialized team of 10th-grade students at the Central Academy of Technology and Arts (CATA).
                  During our initial research, we identified a critical failure in the community's information flow: while Monroe has exceptional resources, the data was fragmented and often obsolete.
                </p>
                <p>
                  Our solution was to architect a central hub where every entry is vetted by a human being.
                  We operate without scraping bots or automated algorithms, ensuring that every phone number and address we list is active and accurate.
                </p>
              </div>
            </Reveal>
            <Reveal width="100%" delay={0.2}>
              <div className="p-16 lg:p-20 bg-white rounded-[4rem] border border-gray-100 shadow-soft relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary-50 rounded-bl-[4rem] pointer-events-none opacity-50" />
                <blockquote className="text-3xl font-serif font-black italic text-primary-900 mb-12 leading-tight tracking-tight">
                  &ldquo;Monroe required a central point of truth. It wasn&apos;t just about building a database; it was about rebuilding community trust in digital information.&rdquo;
                </blockquote>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary-950 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-primary-950/20">YG</div>
                  <div>
                    <p className="font-black text-primary-950 font-serif text-xl tracking-tight">Yatish Grandhe</p>
                    <p className="text-[10px] text-primary-700 font-black uppercase tracking-[0.2em] mt-1">Platform Architect</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats Board */}
      <section className="py-40 relative z-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
            <Reveal width="100%">
              <div className="text-center group">
                <div className="text-8xl md:text-9xl font-serif font-black text-primary-950 mb-6 tracking-tighter italic group-hover:text-primary-700 transition-colors">200+</div>
                <div className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Verified Nodes</div>
              </div>
            </Reveal>
            <Reveal width="100%" delay={0.1}>
              <div className="text-center group">
                <div className="text-8xl md:text-9xl font-serif font-black text-primary-950 mb-6 tracking-tighter italic group-hover:text-primary-700 transition-colors">1.2k</div>
                <div className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Hub Interactions</div>
              </div>
            </Reveal>
            <Reveal width="100%" delay={0.2}>
              <div className="text-center group">
                <div className="text-8xl md:text-9xl font-serif font-black text-primary-950 mb-6 tracking-tighter italic group-hover:text-primary-700 transition-colors">100%</div>
                <div className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Public Access</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Community Gallery */}
      <section className="py-40 bg-white relative z-10">
        <div className="container-custom">
          <div className="text-center mb-24">
            <Reveal width="100%">
              <span className="text-primary-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Regional Identity</span>
              <h2 className="text-5xl md:text-8xl font-serif font-black text-primary-950 italic tracking-tighter leading-[0.9]">
                Community <span className="text-primary-700 not-italic">Anchors.</span>
              </h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <Reveal width="100%">
              <div className="relative group rounded-[4rem] overflow-hidden h-[500px] md:h-[700px] shadow-soft border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=2000"
                  alt="Monroe Civic Heritage"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-12 md:p-20">
                  <div className="max-w-md">
                    <h3 className="text-4xl font-serif font-black text-white mb-4 italic tracking-tight leading-tight">Civic Heritage</h3>
                    <p className="text-gray-300 font-serif italic text-lg leading-relaxed">The architectural and civic foundation of Monroe, preserved for future generations.</p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal width="100%" delay={0.2}>
              <div className="relative group rounded-[4rem] overflow-hidden h-[500px] md:h-[700px] shadow-soft border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
                  alt="Modern Monroe Architecture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-12 md:p-20">
                  <div className="max-w-md">
                    <h3 className="text-4xl font-serif font-black text-white mb-4 italic tracking-tight leading-tight">Future Legacy</h3>
                    <p className="text-gray-300 font-serif italic text-lg leading-relaxed">Looking forward while honoring the architectural spirit that defines Union County.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6 lg:px-12 relative z-10">
        <div className="max-w-[1400px] mx-auto bg-primary-50 rounded-[5rem] py-40 px-10 md:px-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/40 pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center mb-24">
              <Reveal width="100%">
                <span className="text-primary-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Our Directives</span>
                <h2 className="text-5xl md:text-7xl font-serif font-black text-primary-950 italic tracking-tighter leading-[0.9]">
                  Operational <span className="text-primary-700 not-italic">Cornerstones.</span>
                </h2>
              </Reveal>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
              {values.map((v, i) => {
                const IconComponent = v.icon;
                return (
                  <Reveal key={v.title} delay={i * 0.1} width="100%">
                    <div className="bg-white p-14 rounded-[4rem] border border-gray-100 shadow-soft h-full hover:shadow-civic-hover hover:-translate-y-2 transition-all duration-700 group flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-950 mb-10 shadow-sm group-hover:bg-primary-950 group-hover:text-white transition-all duration-500">
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <h3 className="text-3xl font-serif font-black text-primary-950 mb-6 italic tracking-tight leading-tight">{v.title}</h3>
                      <p className="text-gray-500 font-serif italic leading-relaxed text-lg">{v.description}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-40 bg-white relative z-10">
        <div className="container-custom">
          <div className="text-center mb-24">
            <Reveal width="100%">
              <span className="text-primary-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">The Task Force</span>
              <h2 className="text-5xl md:text-8xl font-serif font-black text-primary-950 italic mb-8 tracking-tighter leading-[0.9]">
                Hub <span className="text-primary-700 not-italic">Personnel.</span>
              </h2>
              <p className="text-xl text-gray-500 font-serif italic max-w-2xl mx-auto leading-relaxed">
                A dedicated group of 10th-grade students at CATA, coordinating efforts to build sustainable community infrastructure.
              </p>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.05} width="100%">
                <div className="bg-white border border-gray-50 rounded-[4rem] p-14 flex flex-col items-center text-center hover:shadow-civic-hover hover:-translate-y-2 transition-all duration-700 group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[4rem] pointer-events-none opacity-50" />
                  <div className="w-24 h-24 rounded-3xl bg-primary-50 flex items-center justify-center text-primary-950 font-black mb-10 text-3xl shadow-sm group-hover:scale-110 transition-transform">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-3xl font-serif font-black text-primary-950 mb-3 italic tracking-tight">{member.name}</h3>
                  <p className="text-primary-700 font-black text-[10px] uppercase tracking-[0.3em] mb-8">{member.role}</p>
                  <div className="flex items-center text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] gap-3 pt-6 border-t border-gray-50 w-full justify-center">
                    <GraduationCap className="h-5 w-5 opacity-40" /> Grade 10 • CATA
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol Transparency */}
      <section className="py-40 relative z-10">
        <div className="container-custom text-center">
          <Reveal width="100%">
            <div className="max-w-5xl mx-auto py-32 px-10 md:px-20 rounded-[5rem] bg-primary-950 text-white relative overflow-hidden shadow-2xl">
              {/* Subtle civic texture */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] opacity-30" />
              <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-700/20 blur-[120px]" />

              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-white">
                  Transparency
                </h2>
                <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12 px-4">
                  This platform was created by students passionate about civic tech and is maintained by community volunteers. Every resource is manually verified — we call each organization before adding them, and we remove outdated listings so you never show up somewhere that&apos;s closed.
                </p>
                <Button asChild className="bg-white text-primary-950 hover:bg-gray-100 px-16 h-20 rounded-3xl uppercase tracking-[0.2em] text-[10px] font-black shadow-2xl transition-all group">
                  <Link href="/contact" className="flex items-center">
                    Direct Inquiries
                    <ArrowRight className="ml-4 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

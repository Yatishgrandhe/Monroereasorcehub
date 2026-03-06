'use client';

import { FileText, Briefcase, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { PageSplineBanner } from '@/components/ui/PageSplineBanner';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { SPLINE_PAGES_URL } from '@/lib/spline';

const services = [
  {
    icon: FileText,
    title: 'Free Resume Review',
    description: 'Submit your resume and our team will get back to you with professional feedback within 48 hours. Built for humans, by humans.',
    action: 'Submit Resume',
    href: '/contact'
  },
  {
    icon: Briefcase,
    title: 'Local Job Board',
    description: 'Verified local listings from employers who care about Monroe. No expired ads or generic corporate spam.',
    action: 'Browse Jobs',
    href: '/career/jobs'
  },
  {
    icon: Calendar,
    title: 'Skills Workshops',
    description: 'Upcoming dates for in-person training at the Hub or local Union County libraries. Learn Resume writing, Interview prep, and more.',
    action: 'View Schedule',
    href: '/resources?category=Education'
  }
];

export default function CareerCenterPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      {/* Hero with optional Spline background */}
      <PageSplineBanner sceneUrl={SPLINE_PAGES_URL || undefined} height="42vh">
        <div className="container-custom w-full">
          <Reveal width="100%">
            <div className="flex flex-col items-start gap-4">
              <span className="px-5 py-2 rounded-full bg-accent-500/10 border border-accent-400/20 text-accent-400 font-black uppercase tracking-[0.3em] text-[10px] backdrop-blur-md">
                Operational Schedule
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white tracking-tighter leading-none italic mb-4">
                Career Center<span className="text-secondary-500 not-italic">.</span>
              </h1>
              <div className="w-24 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mb-6" />
              <p className="text-xl md:text-2xl text-blue-50/70 max-w-3xl leading-relaxed italic font-medium">
                Verified professional infrastructure connecting Union County talent with sustainable local opportunity.
              </p>
            </div>
          </Reveal>
        </div>
      </PageSplineBanner>

      {/* Services Grid */}
      <section className="py-32 relative z-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {services.map((service, i) => (
              <Reveal key={service.title} delay={i * 0.1} width="100%">
                <div className="bg-white p-12 lg:p-14 h-full flex flex-col border border-gray-50 rounded-[4rem] shadow-soft hover:shadow-civic-hover hover:-translate-y-2 transition-all duration-700 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[4rem] pointer-events-none opacity-50" />

                  <div className="w-20 h-20 rounded-3xl bg-primary-50 flex items-center justify-center text-primary-950 mb-12 group-hover:bg-primary-950 group-hover:text-white transition-all duration-500 shadow-sm">
                    <service.icon className="h-8 w-8" />
                  </div>

                  <h3 className="text-3xl font-serif font-black text-primary-950 mb-6 italic tracking-tight leading-tight">{service.title}</h3>
                  <p className="text-gray-500 font-serif italic leading-relaxed mb-12 flex-1 text-lg">
                    {service.description}
                  </p>

                  <Button asChild className="bg-primary-950 hover:bg-black text-white w-full !h-16 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all shadow-xl shadow-primary-950/20 translate-z-0">
                    <Link href={service.href}>
                      {service.action}
                      <ArrowRight className="ml-4 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Info Section */}
      <section className="py-24 px-6 lg:px-12 relative z-10">
        <div className="max-w-[1400px] mx-auto bg-primary-50 rounded-[5rem] py-32 px-10 md:px-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/40 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
            <Reveal width="100%">
              <span className="text-primary-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-8 block">Policy & Standards</span>
              <h2 className="text-5xl md:text-7xl font-serif font-black text-primary-950 mb-12 tracking-tighter leading-[0.9] italic">
                Strategic Career <br /><span className="text-primary-700 not-italic">Integration.</span>
              </h2>
              <ul className="space-y-8">
                {[
                  'Every job listing is manually verified for operational accuracy.',
                  'Feedback provided by local professionals, prioritizing human vetting.',
                  'Professional templates optimized for Union County employers.',
                  'Direct pipelines to certified workforce development agencies.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-6 group">
                    <div className="mt-1 w-10 h-10 rounded-2xl bg-white border border-primary-100 flex items-center justify-center shrink-0 shadow-soft group-hover:bg-primary-950 group-hover:text-white transition-all duration-500">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <span className="text-xl text-gray-500 font-serif italic leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal width="100%" delay={0.2}>
              <div className="bg-white p-14 lg:p-20 rounded-[4rem] border border-gray-100 shadow-soft relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary-50 rounded-bl-[4rem] pointer-events-none opacity-50" />
                <h3 className="text-[10px] font-black text-primary-950 uppercase tracking-[0.3em] mb-16 border-b border-gray-50 pb-8 flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-700 mr-4" />
                  Network Impact Ledger
                </h3>
                <div className="space-y-16">
                  <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                    <div className="text-6xl md:text-7xl font-serif font-black text-primary-700 tracking-tighter italic">48h</div>
                    <div className="flex-1">
                      <p className="text-2xl font-black text-primary-950 mb-2 tracking-tight">Human Response</p>
                      <p className="text-gray-400 font-serif italic leading-tight">Standard turnaround for personalized review by local operators.</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                    <div className="text-6xl md:text-7xl font-serif font-black text-primary-700 tracking-tighter italic">100%</div>
                    <div className="flex-1">
                      <p className="text-2xl font-black text-primary-950 mb-2 tracking-tight">Public Access</p>
                      <p className="text-gray-400 font-serif italic leading-tight">Zero-cost infrastructure for all Monroe residents and students.</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                    <div className="text-6xl md:text-7xl font-serif font-black text-primary-700 tracking-tighter italic">50+</div>
                    <div className="flex-1">
                      <p className="text-2xl font-black text-primary-950 mb-2 tracking-tight">Verified Roles</p>
                      <p className="text-gray-400 font-serif italic leading-tight">Active local opportunities vetted within the last 30 days.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative z-10">
        <div className="container-custom text-center">
          <Reveal width="100%">
            <div className="max-w-4xl mx-auto space-y-12">
              <h2 className="text-5xl md:text-7xl font-serif font-black text-primary-950 italic tracking-tighter leading-tight">
                Start your next chapter <span className="text-primary-700 not-italic">today.</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-500 font-serif italic max-w-2xl mx-auto leading-relaxed">
                Whether you're entering the workforce or seeking professional mobility,
                we provide the verified infrastructure you need to succeed in Monroe.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center pt-8">
                <Button asChild className="bg-primary-950 hover:bg-black text-white px-12 h-20 rounded-3xl uppercase tracking-[0.2em] text-[10px] font-black shadow-2xl shadow-primary-950/30 transition-all group">
                  <Link href="/contact" className="flex items-center">
                    Get Career Help
                    <ArrowRight className="ml-4 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="px-12 h-20 border-gray-100 bg-white text-primary-950 font-black uppercase tracking-[0.2em] text-[10px] rounded-3xl hover:bg-gray-50 transition-all shadow-soft">
                  <Link href="/resources?category=Career Support">All Career Resources</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

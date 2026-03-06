'use client';

import { motion } from 'framer-motion';
import { FileText, Briefcase, Calendar, ArrowRight, CheckCircle, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import Link from 'next/link';

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
    <div className="min-h-screen bg-white dark:bg-[#000d1a]">
      {/* Hero Header */}
      <section className="bg-primary-950 text-white pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="container-custom text-center">
          <Reveal width="100%">
            <span className="text-secondary-400 font-bold uppercase tracking-[0.2em] text-xs">Workforce Development</span>
            <h1 className="text-5xl md:text-7xl font-serif font-black mt-6 mb-8 drop-shadow-md">
              Your career, <br /><span className="text-accent-500">locally supported.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Elevate your professional path with verified local tools and human-led support.
              The Monroe Career Center is here to help you land your next opportunity.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {services.map((service, i) => (
              <Reveal key={service.title} delay={i * 0.1} width="100%">
                <div className="civic-card bg-white dark:bg-primary-950/40 p-10 h-full flex flex-col border border-gray-100 dark:border-primary-900 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                  <div className="w-16 h-16 rounded-2xl bg-secondary-500/10 flex items-center justify-center text-secondary-600 mb-10 group-hover:bg-secondary-500 group-hover:text-white transition-all duration-300">
                    <service.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-3xl font-serif font-black text-primary-950 dark:text-white mb-6 italic">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-10 flex-1 text-lg opacity-80">
                    {service.description}
                  </p>
                  <Button asChild className="btn-civic-primary w-full !h-14 font-bold uppercase tracking-[0.2em] text-[10px]">
                    <Link href={service.href}>
                      {service.action}
                      <ArrowRight className="ml-3 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Info Section */}
      <section className="py-32 bg-primary-50 dark:bg-primary-950/20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal width="100%">
              <h2 className="text-5xl md:text-6xl font-serif font-black text-primary-950 dark:text-white mb-10 leading-tight">
                Why use our <br /><span className="text-secondary-600">Career Center?</span>
              </h2>
              <ul className="space-y-8">
                {[
                  'Every job listing is manually verified for accuracy.',
                  'Feedback is provided by local professionals, not bots.',
                  'Free access to resume templates designed for Monroe employers.',
                  'Direct connections to local workforce development agencies.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-6">
                    <div className="mt-1 w-8 h-8 rounded-xl bg-secondary-500 flex items-center justify-center shrink-0 shadow-lg shadow-secondary-500/20">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal width="100%" delay={0.2}>
              <div className="bg-white dark:bg-[#000d1a] p-12 rounded-[3rem] border border-gray-100 dark:border-primary-900 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <h3 className="text-3xl font-serif font-black text-primary-950 dark:text-white mb-10 border-b border-gray-100 dark:border-primary-900 pb-6">Local Impact</h3>
                <div className="space-y-10">
                  <div className="flex gap-8 items-center group">
                    <div className="text-5xl font-serif font-black text-secondary-600 w-24">48h</div>
                    <div className="flex-1">
                      <p className="text-xl font-bold text-primary-950 dark:text-white mb-1">Human Response</p>
                      <p className="text-gray-500 font-medium">Average time for a personalized resume review by our local team.</p>
                    </div>
                  </div>
                  <div className="flex gap-8 items-center group">
                    <div className="text-5xl font-serif font-black text-secondary-600 w-24">100%</div>
                    <div className="flex-1">
                      <p className="text-xl font-bold text-primary-950 dark:text-white mb-1">Zero Cost</p>
                      <p className="text-gray-500 font-medium">Resources are free forever for all Monroe residents and students.</p>
                    </div>
                  </div>
                  <div className="flex gap-8 items-center group">
                    <div className="text-5xl font-serif font-black text-secondary-600 w-24">50+</div>
                    <div className="flex-1">
                      <p className="text-xl font-bold text-primary-950 dark:text-white mb-1">Active Roles</p>
                      <p className="text-gray-500 font-medium">Currently verified local opportunities in Union County.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container-custom text-center">
          <Reveal width="100%">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl font-serif font-black text-primary-950 dark:text-white">
                Start your next chapter <span className="italic">today.</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                Whether you're looking for your first job or a career change,
                we're here to provide the tools you need to succeed in Monroe.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="btn-civic-primary !px-10 h-14 uppercase tracking-widest font-bold text-sm">
                  <Link href="/contact">Get Career Help</Link>
                </Button>
                <Button asChild variant="outline" className="px-10 h-14 border-gray-200 dark:border-primary-800 text-primary-950 dark:text-primary-400 font-bold uppercase tracking-widest text-sm">
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

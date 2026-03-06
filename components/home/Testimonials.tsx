'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/ui/Reveal';

const testimonials = [
  {
    quote: "I didn't know the Community Care Clinic did sliding-scale dental. Found it here in two minutes — saved me over $400.",
    author: 'Darnell W.',
    role: 'Monroe resident, father of three',
    rating: 5,
  },
  {
    quote: "The resume builder actually got me an interview. I hadn't updated my resume in 8 years and didn't know where to start.",
    author: 'Leticia M.',
    role: 'Returning to workforce, Wingate area',
    rating: 5,
  },
  {
    quote: "We list our food pantry hours here and get more visitors than from anywhere else. It's become our most reliable referral.",
    author: 'Pastor Greg H.',
    role: 'New Hope Community Church, Monroe',
    rating: 5,
  },
];

export function Testimonials({ className }: { className?: string }) {
  return (
    <section className={cn('py-40 bg-white relative overflow-hidden', className)}>
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,10,40,0.02),transparent_70%)] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-24">
          <Reveal width="100%">
            <span className="text-primary-600 font-semibold uppercase tracking-widest text-xs mb-4 block">What people say</span>
            <h2 className="text-primary-950 dark:text-white mt-4 mb-6 text-3xl md:text-4xl font-serif font-bold tracking-tight">
              Trusted by Monroe residents
            </h2>
            <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Real stories from people who found the help they needed.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {testimonials.map((item, i) => (
            <Reveal key={item.author} delay={i * 0.1} width="100%">
              <div className="flex flex-col p-16 bg-white border border-gray-100 rounded-[4rem] shadow-soft shadow-gray-200/40 hover:shadow-civic-hover transition-all duration-700 group h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[4rem] pointer-events-none opacity-30" />

                <div className="flex gap-2 mb-10">
                  {[...Array(item.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary-700 text-primary-700 group-hover:scale-110 transition-transform" />
                  ))}
                </div>

                <Quote className="h-12 w-12 text-primary-950 opacity-10 mb-8 group-hover:opacity-20 transition-opacity" />

                <p className="text-primary-950 dark:text-white text-lg md:text-xl leading-relaxed mb-10 font-medium">
                  &ldquo;{item.quote}&rdquo;
                </p>

                <div className="mt-auto pt-10 border-t border-gray-100 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary-950 flex items-center justify-center text-white font-black text-2xl font-serif shadow-xl shadow-primary-950/20">
                    {item.author[0]}
                  </div>
                  <div>
                    <p className="font-serif font-black text-primary-950 text-xl leading-none mb-2 italic tracking-tight">{item.author}</p>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-primary-700">{item.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

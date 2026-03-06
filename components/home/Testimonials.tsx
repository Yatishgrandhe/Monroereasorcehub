'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/ui/Reveal';

const testimonials = [
  {
    quote: "I was looking for a food pantry that was open after 5 PM. Found it here in two clicks. This site is a godsend for working families in Monroe.",
    author: 'Dwayne P.',
    role: 'Union County Logistics',
    rating: 5,
  },
  {
    quote: "Managing specialized care was overwhelming until I found the verified respite care providers here. The human verification makes all the difference.",
    author: 'Sarah T.',
    role: 'Family Care Coordinator',
    rating: 5,
  },
  {
    quote: "Used the career hub and the local job board to transition into a municipal role. Monroe really needed this level of professional infrastructure.",
    author: 'Marcus L.',
    role: 'Public Service Professional',
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
            <span className="text-primary-700 font-black uppercase tracking-[0.5em] text-[10px] mb-8 block">Community Impact</span>
            <h2 className="text-primary-950 mt-6 mb-10 text-6xl md:text-8xl font-serif font-black tracking-tighter leading-[0.9] italic">
              A Culture of <span className="text-primary-700 not-italic">Civic Support.</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-500 font-serif italic max-w-3xl mx-auto">
              "We measure our success through the direct prosperity and stability of our community members."
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

                <p className="text-primary-950 text-2xl leading-relaxed mb-12 font-serif font-light italic opacity-90">
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

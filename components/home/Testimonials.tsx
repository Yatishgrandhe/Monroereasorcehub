'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/ui/Reveal';

const testimonials = [
  {
    quote: "I was looking for a food pantry that was open after 5 PM. Found it here in two clicks. This site is a godsend for working folks.",
    author: 'Dwayne P.',
    role: 'Union County Resident',
    rating: 5,
  },
  {
    quote: "Managing my dad's healthcare was overwhelming until I found the respite care listings on the Hub. Thank you for making this site.",
    author: 'Sarah T.',
    role: 'Local Caregiver',
    rating: 5,
  },
  {
    quote: "Used the resume tool and the local job board. I start my new position on Monday. Monroe really needed a central resource like this.",
    author: 'Marcus L.',
    role: 'Career Seeker',
    rating: 5,
  },
];

export function Testimonials({ className }: { className?: string }) {
  return (
    <section className={cn('py-20 bg-white dark:bg-[#000d1a]', className)}>
      <div className="container-custom relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal width="100%">
            <span className="text-accent-600 font-bold uppercase tracking-[0.2em] text-xs">Community Voices</span>
            <h2 className="text-primary-950 dark:text-white mt-4 mb-6 text-4xl font-serif font-black">
              What our neighbors are saying
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              We're honored to serve the residents of Monroe and Union County.
              Here is how the Hub has helped your neighbors.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <Reveal key={item.author} delay={i * 0.1} width="100%">
              <div className="flex flex-col p-8 bg-primary-50 dark:bg-primary-950/20 rounded-2xl border border-primary-100 dark:border-primary-900 h-full">
                <div className="flex gap-1 mb-6">
                  {[...Array(item.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent-500 text-accent-500" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-primary-200 dark:text-primary-800 mb-4" />
                <p className="text-primary-900 dark:text-gray-200 text-lg leading-relaxed mb-8 font-light italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="mt-auto">
                  <p className="font-bold text-primary-950 dark:text-white font-serif">{item.author}</p>
                  <p className="text-sm text-primary-700 dark:text-primary-400 font-medium">{item.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

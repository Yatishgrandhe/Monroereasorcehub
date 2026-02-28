'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    quote: 'Found food assistance within minutes. This hub is a lifesaver for our family.',
    author: 'Maria S.',
    role: 'Monroe resident',
    rating: 5,
  },
  {
    quote: 'The resume builder helped me land a job. So grateful for this resource.',
    author: 'James T.',
    role: 'Career seeker',
    rating: 5,
  },
  {
    quote: 'As a volunteer, I love how easy it is to find and join local events.',
    author: 'Sarah L.',
    role: 'Community volunteer',
    rating: 5,
  },
];

export function Testimonials({ className }: { className?: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className={cn('section-padding bg-secondary-900 dark:bg-slate-900 text-white', className)}>
      <div className="container-custom relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        <div className="relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary-400 font-semibold uppercase tracking-wider text-sm"
            >
              Testimonials
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-white mt-4 mb-6"
            >
              What our community says
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-secondary-300"
            >
              Real stories from Monroe residents and partners.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative max-w-3xl mx-auto"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 sm:p-10 hover:border-primary-500/30 transition-colors duration-300"
              >
                <Quote className="h-10 w-10 text-primary-500/60 mb-6" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonials[current].rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-secondary-200 text-lg sm:text-xl leading-relaxed mb-8">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-white">{testimonials[current].author}</p>
                  <p className="text-sm text-secondary-400">{testimonials[current].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)}
                className="p-2 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      i === current ? 'w-8 bg-primary-500' : 'w-2 bg-white/30 hover:bg-white/50'
                    )}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
                className="p-2 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

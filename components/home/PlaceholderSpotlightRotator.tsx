'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const ROTATOR_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80', title: 'Community Together' },
  { src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80', title: 'Support & Care' },
  { src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80', title: 'Local Impact' },
];

export function PlaceholderSpotlightRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % ROTATOR_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, scale: 1.05, filter: 'blur(4px)' }),
    center: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: (d: number) => ({ opacity: 0, scale: 0.98, filter: 'blur(4px)' }),
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 min-h-[400px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          custom={1}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <img
            src={ROTATOR_IMAGES[index].src}
            alt={ROTATOR_IMAGES[index].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-950/90 via-secondary-950/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 mb-6"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Coming Soon</span>
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Spotlight: Local Impact
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-secondary-300 max-w-xl"
            >
              Featured community partners will appear here. Check back soon!
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <motion.button
          onClick={() => setIndex((i) => (i - 1 + ROTATOR_IMAGES.length) % ROTATOR_IMAGES.length)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <div className="flex gap-2">
          {ROTATOR_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-primary-500' : 'w-2 bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
        <motion.button
          onClick={() => setIndex((i) => (i + 1) % ROTATOR_IMAGES.length)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

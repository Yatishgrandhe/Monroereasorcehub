'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Phone, Globe, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Database } from '@/types/database';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
];

type Resource = Database['public']['Tables']['resources']['Row'] & {
  categories: Database['public']['Tables']['categories']['Row'];
};

interface SpotlightCarouselProps {
  resources: Resource[];
}

export function SpotlightCarousel({ resources }: SpotlightCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const spotlightedResources = resources.filter(resource => resource.is_spotlighted);

  useEffect(() => {
    if (spotlightedResources.length === 0) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % spotlightedResources.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [spotlightedResources.length]);

  const goTo = (i: number) => {
    setDirection(i > currentIndex ? 1 : -1);
    setCurrentIndex(i);
  };

  if (spotlightedResources.length === 0) {
    return (
      <div className="glass-card p-12 text-center rounded-2xl">
        <p className="text-slate-400 font-medium text-lg">Our spotlight is currently recharging. Check back soon for featured community partners!</p>
      </div>
    );
  }

  const current = spotlightedResources[currentIndex];
  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="relative group/carousel">
      <div className="overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-2xl ring-2 ring-white/5">
              <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[520px]">
                {/* Image Section — 3D Parallax Effect */}
                <div className="lg:col-span-2 relative h-[320px] lg:h-full overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  >
                    <img
                      src={current.spotlight_image_url || FALLBACK_IMAGES[currentIndex % FALLBACK_IMAGES.length]}
                      alt={current.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary-950/30 to-secondary-950/80 lg:to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,transparent_0%,rgba(0,0,0,0.4)_100%)] opacity-60" />
                  </motion.div>
                </div>

                {/* Content Section */}
                <div className="lg:col-span-3 p-8 lg:p-16 flex flex-col justify-center text-left relative">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Badge className="w-fit mb-6 bg-primary-500/90 text-white border-none py-1.5 px-4 rounded-full font-bold uppercase tracking-wider text-[10px] shadow-lg shadow-primary-500/30">
                      {current.categories.name}
                    </Badge>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight tracking-tight"
                  >
                    {current.name}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-xl text-secondary-300 mb-8 leading-relaxed max-w-xl"
                  >
                    {current.spotlight_story || current.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-secondary-400"
                  >
                    {current.address && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-primary-500" />
                        <span className="text-sm font-medium">{current.address}</span>
                      </div>
                    )}
                    {current.website && (
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-primary-500" />
                        <span className="text-sm font-medium">Visit Website</span>
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Button variant="gradient" size="lg" className="h-14 px-8 rounded-full group/btn" asChild href={`/resources/${current.id}`}>
                      <>Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform inline-block" /></>
                    </Button>
                    {current.website && (
                      <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-white border-white/20 hover:bg-white/10" asChild href={current.website}>
                        <>Official Website</>
                      </Button>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls — Stylish Pills */}
      <div className="flex items-center justify-center gap-6 mt-12">
        <motion.button
          onClick={() => {
            setDirection(-1);
            setCurrentIndex((prev) => (prev - 1 + spotlightedResources.length) % spotlightedResources.length);
          }}
          whileHover={{ scale: 1.08, x: -2 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <div className="flex gap-2 items-center">
          {spotlightedResources.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="relative focus:outline-none"
            >
              <span
                className={`block h-2.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-10 bg-primary-500 shadow-lg shadow-primary-500/50'
                    : 'w-2.5 bg-white/30 hover:bg-white/50'
                }`}
              />
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % spotlightedResources.length);
          }}
          whileHover={{ scale: 1.08, x: 2 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SpotlightCarousel } from '@/components/resources/SpotlightCarousel';
import { PlaceholderSpotlightRotator } from '@/components/home/PlaceholderSpotlightRotator';
import type { Database } from '@/types/database';

type Resource = Database['public']['Tables']['resources']['Row'] & {
  categories: Database['public']['Tables']['categories']['Row'];
};

interface SpotlightBentoProps {
  resources: Resource[];
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl bg-white/5 border border-white/10', className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%] animate-shimmer" />
      <div className="relative p-6 space-y-4">
        <div className="h-12 w-12 rounded-xl bg-white/10" />
        <div className="h-4 w-[75%] rounded-lg bg-white/10" />
        <div className="h-3 w-full rounded bg-white/5" />
        <div className="h-3 w-2/3 rounded bg-white/5" />
      </div>
    </div>
  );
}

export function SpotlightBento({ resources }: SpotlightBentoProps) {
  const hasContent = resources.filter((r) => r.is_spotlighted).length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
      {hasContent ? (
        <div className="lg:col-span-4">
          <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm">
            <SpotlightCarousel resources={resources} />
          </div>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-4"
          >
            <PlaceholderSpotlightRotator />
          </motion.div>
        </>
      )}
    </div>
  );
}

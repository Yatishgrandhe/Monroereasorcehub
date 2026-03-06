'use client';

import { Shield, Zap, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/ui/Reveal';

const valueItems = [
  {
    icon: Shield,
    title: 'Manually Verified',
    description: 'Every listing is manually verified by our team — we call each organization before adding them to ensure the information is accurate.'
  },
  {
    icon: Zap,
    title: 'Updated Weekly',
    description: 'Updated weekly. We remove outdated listings so you never show up somewhere that is recently closed or no longer offering a service.'
  },
  {
    icon: Users,
    title: 'Built in Monroe',
    description: "Built in Monroe, for Monroe. We're Union County residents who care about our neighbors, not an outside vendor or corporate entity."
  }
];

export function ValueProposition({ className }: { className?: string }) {
  return (
    <section className={cn('py-32 bg-primary-50 dark:bg-primary-950/20', className)}>
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Reveal width="100%">
            <span className="text-accent-600 font-bold uppercase tracking-[0.2em] text-xs">Our Commitment</span>
            <h2 className="mt-4 mb-6 text-primary-950 dark:text-white text-5xl font-serif font-black tracking-tight">
              A Higher Standard of <span className="text-secondary-600">Trust</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              We started this hub because finding accurate local help shouldn't be difficult.
              Our platform is built on human verification, not algorithms.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {valueItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1} width="100%">
              <div className="flex flex-col items-center text-center p-10 bg-white dark:bg-[#000d1a] rounded-3xl border border-gray-100 dark:border-primary-900 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="w-20 h-20 rounded-2xl bg-secondary-500/10 flex items-center justify-center mb-8 text-secondary-600 rotate-3 group-hover:rotate-0 transition-transform">
                  <item.icon className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4 text-primary-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium lg:px-4">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

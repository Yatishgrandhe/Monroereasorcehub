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
    <section className={cn('py-20 md:py-28 bg-primary-50/50  relative overflow-hidden', className)}>
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)]  [background-size:40px_40px] opacity-30 pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal width="100%">
            <span className="text-primary-600 font-semibold uppercase tracking-widest text-xs mb-4 block">Why use this hub?</span>
            <h2 className="mt-3 mb-6 text-primary-950  text-3xl md:text-4xl font-serif font-bold tracking-tight">
              Built on human verification
            </h2>
            <p className="text-base md:text-lg text-gray-500  leading-relaxed max-w-xl mx-auto">
              We verify every listing by hand so you can trust what you find.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {valueItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1} width="100%">
              <div className="flex flex-col items-center text-center p-8 md:p-10 bg-white  rounded-2xl border border-gray-100 dark:border-primary-800 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className="w-14 h-14 rounded-xl bg-primary-100  flex items-center justify-center mb-6 text-primary-950 ">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-4 text-primary-950  tracking-tight">
                  {item.title}
                </h3>
                <p className="text-gray-600  leading-relaxed text-sm md:text-base">
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

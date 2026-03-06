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
    <section className={cn('py-40 bg-white relative overflow-hidden', className)}>
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-50 skew-x-12 translate-x-1/4 pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-20 pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-24">
          <Reveal width="100%">
            <span className="text-primary-700 font-black uppercase tracking-[0.5em] text-[10px] mb-8 block">Operational Protocol</span>
            <h2 className="mt-4 mb-10 text-primary-950 text-6xl md:text-8xl font-serif font-black tracking-tighter leading-[0.9] italic">
              Built on Human <span className="text-primary-700 not-italic">Verification.</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-serif italic max-w-3xl mx-auto">
              Our infrastructure rejects automation in favor of neighborhood trust. Every operational link is manually verified to ensure community precision.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {valueItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1} width="100%">
              <div className="flex flex-col items-center text-center p-16 bg-white rounded-[4rem] border border-gray-100 shadow-soft hover:shadow-civic-hover hover:-translate-y-2 transition-all duration-700 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[4rem] pointer-events-none opacity-50 transition-all group-hover:bg-primary-950 group-hover:opacity-10" />

                <div className="w-24 h-24 rounded-3xl bg-primary-50 flex items-center justify-center mb-10 text-primary-950 shadow-sm border border-primary-50 group-hover:bg-primary-950 group-hover:text-white transition-all duration-500">
                  <item.icon className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-serif font-black mb-6 text-primary-950 italic tracking-tight">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed font-serif italic text-lg opacity-80">
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

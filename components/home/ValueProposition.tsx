'use client';

import { motion } from 'framer-motion';
import { Search, Heart, Users, Zap, Shield, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const valueItems = [
  {
    icon: Search,
    title: 'Find What You Need',
    description: 'A single, unified hub for food, housing, healthcare, and education. Search by category or specific need with ease.',
    color: 'text-indigo-400',
    className: 'md:col-span-2 md:row-span-2 bg-indigo-500/5',
  },
  {
    icon: Zap,
    title: 'Fast & Free',
    description: 'Immediate access to local resources at zero cost to you.',
    color: 'text-emerald-400',
    className: 'md:col-span-1 md:row-span-1 bg-emerald-500/5',
  },
  {
    icon: Shield,
    title: 'Trusted & Verified',
    description: 'Every organization is vetted by our team for reliability.',
    color: 'text-blue-400',
    className: 'md:col-span-1 md:row-span-1 bg-blue-500/5',
  },
  {
    icon: Heart,
    title: 'Community First',
    description: 'Built by Monroe locals to strengthen our neighborhoods together.',
    color: 'text-rose-400',
    className: 'md:col-span-2 md:row-span-1 bg-rose-500/5',
  },
  {
    icon: Users,
    title: 'Collective Impact',
    description: 'Connect through local events and impactful volunteer opportunities.',
    color: 'text-amber-400',
    className: 'md:col-span-2 md:row-span-1 bg-amber-500/5',
  },
  {
    icon: Sparkles,
    title: 'Career Support',
    description: 'Professional resume building and local job assistance tailored for you.',
    color: 'text-purple-400',
    className: 'md:col-span-2 md:row-span-1 bg-purple-500/5',
  },
];

export function ValueProposition({ className }: { className?: string }) {
  return (
    <section className={cn('section-padding bg-[#020617] relative overflow-hidden', className)}>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="text-left max-w-3xl mb-6 md:mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-[1px] w-12 bg-primary-500/50" />
            <span className="text-xs font-black text-primary-400 uppercase tracking-[0.3em]">
              Why Monroe Resource Hub
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-white text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter"
          >
            Everything you need,<br />in one place
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-slate-400 leading-relaxed font-medium"
          >
            We connect Monroe residents with essential resources, opportunities, and community support.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
          {valueItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "group relative p-8 md:p-10 rounded-[32px] border border-white/10 backdrop-blur-3xl overflow-hidden transition-all duration-700",
                "hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/5",
                item.className
              )}
            >
              {/* Animated Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10 h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-white/5 shadow-inner">
                  <item.icon className={cn('h-7 w-7', item.color)} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-4 text-white tracking-tighter group-hover:text-primary-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-lg text-slate-400 leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                  {item.description}
                </p>
              </div>

              {/* Subtle Corner Ornament */}
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-20 transition-opacity duration-700">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

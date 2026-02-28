'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogoItem {
  name: string;
  text: string;
  src?: string;
  alt?: string;
}

interface LogoCloudProps {
  logos?: LogoItem[];
  className?: string;
  title?: string;
}

// Placeholder logos — display only, not links
const PLACEHOLDER_LOGOS = [
  { name: 'United Way', text: 'United Way' },
  { name: 'Community Foundation', text: 'Community Foundation' },
  { name: 'Local Health', text: 'Local Health' },
  { name: 'Education Partners', text: 'Education' },
  { name: 'Food Bank', text: 'Food Bank' },
  { name: 'Housing Alliance', text: 'Housing' },
];

export function LogoCloud({ logos = PLACEHOLDER_LOGOS, className, title = 'Trusted by our community' }: LogoCloudProps) {
  return (
    <section className={cn('py-12 sm:py-16 overflow-hidden', className)}>
      <div className="container-custom">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6"
        >
          {title}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-10"
        >
          {logos.map((logo, i) => (
            <motion.span
              key={logo.name}
              role="presentation"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-center px-4 py-2 rounded-xl text-slate-400 font-semibold text-sm sm:text-base opacity-80 select-none cursor-default"
            >
              {logo.src ? (
                <img src={logo.src} alt={logo.alt ?? logo.name} className="h-8 sm:h-10 w-auto max-w-[120px] object-contain" />
              ) : (
                <span>{logo.text}</span>
              )}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

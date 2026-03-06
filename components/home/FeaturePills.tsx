'use client';

import Link from 'next/link';
import { FileText, Briefcase, Heart } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const features = [
  {
    icon: FileText,
    title: 'AI Resume Builder',
    desc: 'Free, professional, instant',
    href: '/career/resume-builder',
  },
  {
    icon: Briefcase,
    title: 'Local Job Board',
    desc: 'Monroe & Union County listings',
    href: '/career',
  },
  {
    icon: Heart,
    title: 'Community Resources',
    desc: 'Food, housing, health & more',
    href: '/resources',
  },
];

export function FeaturePills() {
  return (
    <div className="container-custom -mt-8 relative z-20">
      <Reveal width="100%">
        <div className="flex flex-wrap gap-4 justify-center">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.href}
                href={f.href}
                className="feature-pill flex items-center gap-3 bg-white dark:bg-white/5 border border-[var(--color-border)] dark:border-white/10 rounded-xl px-5 py-3.5 text-left no-underline transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-[0_8px_24px_rgba(52,97,173,0.12)] hover:-translate-y-1"
              >
                <span className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center text-primary-700 dark:text-primary-400 shrink-0">
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <strong className="block text-[0.88rem] font-bold text-[var(--color-text)] dark:text-white font-[var(--font-heading)]">
                    {f.title}
                  </strong>
                  <span className="text-[0.75rem] text-[var(--color-text-muted)]">{f.desc}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}

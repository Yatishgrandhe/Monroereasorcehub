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
      <div className="flex flex-wrap gap-4 justify-center">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <Reveal key={f.href} delay={i * 0.15} direction="up">
              <Link
                href={f.href}
                data-tour={f.href === '/career/resume-builder' ? 'resume-builder' : undefined}
                className="feature-pill flex items-center gap-4 bg-white border border-[var(--color-border)] border-l-4 border-l-accent-500 rounded-xl px-6 py-4 text-left no-underline transition-all duration-300 hover:border-l-[var(--color-primary)] hover:border-y-[var(--color-primary)] hover:border-r-[var(--color-primary)] hover:shadow-[0_12px_24px_#3461ad1f] hover:-translate-y-[6px]"
              >
                <span className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 shrink-0">
                  <Icon className="w-6 h-6" />
                </span>
                <div>
                  <strong className="block text-base font-bold text-[var(--color-text)] font-sans">
                    {f.title}
                  </strong>
                  <span className="text-sm text-[var(--color-text-muted)] font-sans">{f.desc}</span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

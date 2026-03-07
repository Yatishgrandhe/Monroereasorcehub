'use client';

import { cn } from '@/lib/utils';

interface LogoCloudProps {
  className?: string;
}

const TRUST_NAMES = [
  'United Way',
  'Community Care Clinic',
  'Second Harvest',
  'Communities In Schools',
  'Union Co. DSS',
  'Wingate University',
];

export function LogoCloud({ className }: LogoCloudProps) {
  const duplicated = [...TRUST_NAMES, ...TRUST_NAMES];

  return (
    <section className={cn('py-16 overflow-hidden', className)}>
      <p className="trust-label text-center text-[0.78rem] font-semibold tracking-[0.1em] uppercase text-[var(--color-text-muted)] mb-6">
        Trusted by organizations across Union County
      </p>
      <div className="trust-track-wrapper overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="trust-track flex gap-6 w-max">
          {duplicated.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="trust-chip shrink-0 bg-white border border-[var(--color-border)] rounded-full px-5 py-2 text-[0.82rem] font-semibold text-primary-950 whitespace-nowrap shadow-sm"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

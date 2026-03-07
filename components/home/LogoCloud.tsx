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
    <section className={cn('py-16 md:py-20 overflow-hidden bg-white', className)}>
      <p className="trust-label text-center text-[0.78rem] font-semibold tracking-[0.1em] uppercase text-slate-400 mb-6 font-sans">
        Trusted by organizations across Union County
      </p>
      <div className="trust-track-wrapper overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="trust-track flex gap-8 md:gap-12 w-max px-4">
          {duplicated.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="trust-chip shrink-0 px-5 py-2 text-[0.9rem] font-bold text-slate-400 whitespace-nowrap grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform-gpu hover:text-primary-950 font-sans cursor-default"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

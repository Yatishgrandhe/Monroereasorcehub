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

const PARTNERS = [
  {
    name: 'United Way',
    description: 'Union County Chapter',
    link: 'https://www.unitedway.org',
    icon: '🤝'
  },
  {
    name: 'Union Co. Foundation',
    description: 'Community Endowments',
    link: 'https://www.fftc.org',
    icon: '🏛️'
  },
  {
    name: 'Atrium Health',
    description: 'Regional Medical Partner',
    link: 'https://atriumhealth.org',
    icon: '🏥'
  },
  {
    name: 'Union County Govt',
    description: 'Municipal Services',
    link: 'https://www.unioncountync.gov',
    icon: '🏢'
  },
  {
    name: 'South Piedmont',
    description: 'Educational Partner',
    link: 'https://spcc.edu',
    icon: '🎓'
  },
];

export function LogoCloud({ className, title = 'Community Alignment' }: LogoCloudProps) {
  return (
    <section className={cn('py-24 bg-white border-y border-gray-50', className)}>
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div>
            <span className="text-primary-700 font-black uppercase tracking-[0.4em] text-[10px] mb-3 block">Civic Network</span>
            <h2 className="text-3xl font-serif font-black text-primary-950 italic tracking-tight">Verified <span className="text-primary-700 not-italic">Partnerships.</span></h2>
          </div>
          <div className="h-px flex-1 bg-gray-100 hidden md:block mx-12" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational Integrity Ledger</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {PARTNERS.map((partner, i) => (
            <motion.a
              key={partner.name}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center text-center p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100/50 hover:bg-white hover:shadow-soft hover:border-primary-100 transition-all duration-500 group"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{partner.icon}</div>
              <p className="font-serif font-black text-primary-950 text-sm mb-1 italic tracking-tight">{partner.name}</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{partner.description}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

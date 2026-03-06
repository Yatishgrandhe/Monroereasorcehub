'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Phone, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import Link from 'next/link';

const FEATURED_ORGS = [
  {
    name: 'Union County Community Care Clinic',
    description: 'Providing affordable primary and dental care to uninsured and underinsured Union County residents since 2007.',
    tag: 'Healthcare',
    phone: '(704) 292-1220',
    address: 'Monroe, NC',
    link: 'https://unionclinic.org'
  },
  {
    name: 'Second Harvest Food Bank',
    description: 'Distributing millions of meals annually across the Charlotte region, with multiple Union County partner sites.',
    tag: 'Food Assistance',
    phone: '(704) 376-1785',
    address: 'Serving Monroe, NC',
    link: 'https://www.secondharvestmetrolina.org'
  },
  {
    name: 'Communities In Schools of Union County',
    description: 'Keeping students in school and on a path to graduation through wraparound support services.',
    tag: 'Education',
    phone: '(704) 296-9430',
    address: 'Monroe, NC',
    link: 'https://cisunion.org'
  },
  {
    name: 'Union County DSS',
    description: 'Connecting families with essential safety nets including SNAP, Medicaid, and emergency aid.',
    tag: 'Government',
    phone: '(704) 296-4300',
    address: '1212 W Roosevelt Blvd, Monroe, NC',
    link: 'https://www.unioncountync.gov'
  }
];

export function SpotlightBento() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
      {FEATURED_ORGS.map((org, i) => (
        <Reveal key={org.name} delay={i * 0.1} width="100%">
          <div className="bg-white dark:bg-white/5 border-l-4 border-l-primary-500 border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-4 shadow-soft hover:shadow-civic-hover transition-all duration-500 group">
            <div className="p-8">
              <span className="inline-block px-3 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 dark:bg-primary-950/30 mb-4">
                {org.tag}
              </span>
              <h3 className="text-2xl font-serif font-black text-primary-950 dark:text-white mb-4 group-hover:text-primary-700 transition-colors leading-tight">
                {org.name}
              </h3>
              <p className="text-gray-500 text-sm mb-10 flex-1 leading-relaxed italic font-medium opacity-80">
                {org.description}
              </p>

              <div className="space-y-6 mb-10">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mr-4 text-primary-700 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary-950 block mb-0.5">Direct Line</span>
                    <span className="font-bold">{org.phone}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mr-4 text-primary-700 shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary-950 block mb-0.5">Primary Site</span>
                    <span className="font-bold">{org.address}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                <a
                  href={org.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-950 flex items-center hover:text-primary-700 transition-colors"
                >
                  Verify Operations <ExternalLink className="ml-3 h-3.5 w-3.5 opacity-50" />
                </a>
                <Button asChild variant="ghost" size="sm" className="h-10 px-5 rounded-xl font-semibold text-gray-500 hover:text-primary-950 hover:bg-gray-50">
                  <Link href={`/resources?q=${encodeURIComponent(org.name)}`}>
                    View details <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

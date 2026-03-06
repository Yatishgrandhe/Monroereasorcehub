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
    description: 'Providing free primary care and dental services for low-income, uninsured residents of Union County.',
    phone: '704-226-0531',
    address: '410 E Franklin St, Monroe, NC',
    link: 'https://unionclinic.org'
  },
  {
    name: 'Second Harvest Food Bank',
    description: 'Leading the fight against hunger in the Monroe area through local food distribution networks.',
    phone: '704-376-1785',
    address: 'Serving all of Union County',
    link: 'https://www.secondharvestmetrolina.org'
  },
  {
    name: 'Communities In Schools',
    description: 'Empowering Monroe students to stay in school and achieve in life through integrated support systems.',
    phone: '704-282-1323',
    address: '1600-A Skyway Dr, Monroe, NC',
    link: 'https://cisunion.org'
  },
  {
    name: 'Union County DSS',
    description: 'Connecting families with essential safety nets including SNAP, Medicaid, and emergency aid.',
    phone: '704-296-4300',
    address: '1212 W Roosevelt Blvd, Monroe, NC',
    link: 'https://www.unioncountync.gov'
  }
];

export function SpotlightBento() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {FEATURED_ORGS.map((org, i) => (
        <Reveal key={org.name} delay={i * 0.1} width="100%">
          <div className="bg-white dark:bg-primary-950/40 border border-gray-200 dark:border-primary-900 rounded-2xl p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-all group">
            <h3 className="text-xl font-serif font-bold text-primary-950 dark:text-white mb-3 group-hover:text-accent-600 transition-colors">
              {org.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1 leading-relaxed">
              {org.description}
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Phone className="h-4 w-4 mr-3 text-accent-500" />
                <span>{org.phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-3 text-accent-500" />
                <span>{org.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-primary-900">
              <a
                href={org.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold uppercase tracking-widest text-primary-950 dark:text-primary-400 flex items-center hover:text-accent-600 transition-colors"
              >
                View Website <ExternalLink className="ml-2 h-3.5 w-3.5" />
              </a>
              <Button asChild variant="ghost" className="h-8 px-4 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-primary-50">
                <Link href={`/resources?search=${encodeURIComponent(org.name)}`}>
                  Details <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

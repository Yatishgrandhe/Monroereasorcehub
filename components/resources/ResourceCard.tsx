'use client';

import Link from 'next/link';
import { MapPin, Phone, Globe, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPhoneNumber, truncateText, cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ResourceCardProps {
  resource: any;
  showCategory?: boolean;
}

export function ResourceCard({ resource, showCategory = true }: ResourceCardProps) {
  const formatHours = (hours: any) => {
    if (!hours) return null;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = hours[today];
    if (!todayHours || todayHours.closed) return 'Closed today';
    return `${todayHours.open} - ${todayHours.close}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <div className="civic-card bg-white dark:bg-primary-950/40 h-full flex flex-col hover:-translate-y-1 transition-all">
        <div className="p-6 sm:p-8 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="text-2xl">
              {resource.categories?.icon || '📍'}
            </div>
            {showCategory && resource.categories?.name && (
              <Badge variant="outline" className="border-accent-500/20 text-accent-600 font-bold uppercase tracking-widest text-[10px]">
                {resource.categories.name}
              </Badge>
            )}
          </div>

          <h3 className="text-2xl font-serif font-black text-primary-950 dark:text-white mb-3 tracking-tight group-hover:text-accent-600 transition-colors">
            {resource.name}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8 flex-1">
            {truncateText(resource.description || '', 120)}
          </p>

          <div className="space-y-4 mb-8">
            {resource.address && (
              <div className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="h-4 w-4 mt-0.5 text-accent-500 shrink-0" />
                <span className="line-clamp-1">{resource.address}</span>
              </div>
            )}
            {resource.contact_info?.phone && (
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <Phone className="h-4 w-4 text-accent-500 shrink-0" />
                <span className="font-bold">{formatPhoneNumber(resource.contact_info.phone)}</span>
              </div>
            )}
            {resource.hours_of_operation && (
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4 text-accent-500 shrink-0" />
                <span>{formatHours(resource.hours_of_operation)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100 dark:border-primary-900">
            <Button asChild className="btn-civic-primary flex-1 !h-12 font-bold uppercase tracking-widest text-xs">
              <Link href={`/resources/${resource.id}`}>
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {resource.website && (
              <Button asChild variant="outline" className="px-5 !h-12 border-gray-200 dark:border-primary-800 text-primary-950 dark:text-primary-400 hover:bg-gray-50">
                <a href={resource.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

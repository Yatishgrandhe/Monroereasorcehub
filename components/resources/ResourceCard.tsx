'use client';

import Link from 'next/link';
import { MapPin, Phone, Globe, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPhoneNumber, truncateText, ensureProtocol } from '@/lib/utils';
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
    return `${todayHours.open} – ${todayHours.close}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <div className="h-full flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-[var(--color-shadow)] hover:border-[var(--color-primary-light)]">
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-4">
            {showCategory && resource.categories?.name && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent-soft)] text-[#92400e]">
                {resource.categories.name}
              </span>
            )}
            {resource.updated_at && (
              <span className="text-[11px] text-[var(--color-text-light)]">
                Verified {new Date(resource.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>

          <h3 className="text-xl font-serif font-bold text-[var(--color-primary)] mb-2 leading-tight">
            {resource.name}
          </h3>

          <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-6 flex-1">
            {truncateText(resource.description || '', 140)}
          </p>

          <div className="space-y-2 mb-6">
            {resource.address && (
              <div className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{resource.address}</span>
              </div>
            )}
            {resource.contact_info?.phone && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{formatPhoneNumber(resource.contact_info.phone)}</span>
              </div>
            )}
            {resource.hours_of_operation && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{formatHours(resource.hours_of_operation)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--color-border)] mt-auto">
            <Button asChild href={`/resources/${resource.id}`} className="rounded-xl font-semibold bg-[var(--color-primary)] hover:opacity-90 text-white h-11 flex-1">
              <span className="flex items-center justify-center">
                View details
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Button>
            {resource.website && (
              <Button asChild variant="outline" href={ensureProtocol(resource.website)} target="_blank" rel="noopener noreferrer" className="rounded-xl h-11 px-4 border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]">
                <Globe className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

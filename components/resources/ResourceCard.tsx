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
      <div className="bg-white border border-gray-50 rounded-[2.5rem] h-full flex flex-col shadow-soft hover:shadow-civic-hover hover:-translate-y-1 transition-all duration-500 group overflow-hidden">
        <div className="p-10 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-primary-100 group-hover:scale-110 transition-transform duration-500">
              {resource.categories?.icon || '📍'}
            </div>
            {showCategory && resource.categories?.name && (
              <Badge variant="outline" className="border-gray-100 bg-white text-primary-700 font-black uppercase tracking-[0.2em] text-[9px] py-1.5 px-5">
                {resource.categories.name}
              </Badge>
            )}
          </div>

          <h3 className="text-2xl font-serif font-black text-primary-950 mb-4 tracking-tight group-hover:text-primary-700 transition-colors leading-tight italic">
            {resource.name}
          </h3>

          <p className="text-gray-500 text-[15px] leading-relaxed mb-10 flex-1 font-serif italic">
            {truncateText(resource.description || '', 130)}
          </p>

          <div className="space-y-5 mb-12">
            {resource.address && (
              <div className="flex items-start gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em]">
                <MapPin className="h-4 w-4 text-primary-950 shrink-0 opacity-20" />
                <span className="line-clamp-1">{resource.address}</span>
              </div>
            )}
            {resource.contact_info?.phone && (
              <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em]">
                <Phone className="h-4 w-4 text-primary-950 shrink-0 opacity-20" />
                <span>{formatPhoneNumber(resource.contact_info.phone)}</span>
              </div>
            )}
            {resource.hours_of_operation && (
              <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em]">
                <Clock className="h-4 w-4 text-primary-950 shrink-0 opacity-20" />
                <span>{formatHours(resource.hours_of_operation)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-gray-50 mt-auto">
            <Button asChild className="bg-primary-950 hover:bg-black text-white flex-1 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] shadow-xl shadow-primary-950/20 translate-z-0">
              <Link href={`/resources/${resource.id}`}>
                Access Profile
                <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            {resource.website && (
              <Button asChild variant="outline" className="px-6 h-14 rounded-2xl border-gray-100 text-primary-950 hover:bg-gray-50 shadow-soft">
                <a href={resource.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 opacity-40" />
                </a>
              </Button>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] pt-4 border-t border-gray-50/50">
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
            {resource.updated_at
              ? `Last verified: ${new Date(resource.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : 'Verified listing'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

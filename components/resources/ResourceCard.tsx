'use client';

import Link from 'next/link';
import { MapPin, Phone, Globe, Clock, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Database } from '@/types/database';
import { formatPhoneNumber, truncateText, cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type Resource = Database['public']['Tables']['resources']['Row'] & {
  categories: Database['public']['Tables']['categories']['Row'];
};

interface ResourceCardProps {
  resource: Resource;
  showCategory?: boolean;
}

export function ResourceCard({ resource, showCategory = true }: ResourceCardProps) {
  const formatHours = (hours: any) => {
    if (!hours) return null;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = hours[today];
    if (!todayHours || todayHours.closed) return 'Closed today';

    const formatTime12Hour = (time24: string): string => {
      if (!time24) return '';
      const [hours, minutes] = time24.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return time24;
      const period = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    return `${formatTime12Hour(todayHours.open)} - ${formatTime12Hour(todayHours.close)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="h-full group"
    >
      <Card className="glass-card h-full flex flex-col border-white/10 overflow-hidden relative">
        {/* Subtle accent — fades on hover so card uses same hover color as all glass-cards */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/5 blur-[80px] rounded-full pointer-events-none transition-opacity duration-300 group-hover:opacity-30" aria-hidden />

        <CardHeader className="pb-4 pt-6 px-6 sm:px-8 relative z-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-2xl shadow-2xl transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 ring-4 ring-transparent group-hover:ring-primary-500/10">
                {resource.categories.icon}
              </div>
              {showCategory && (
                <Badge variant="glass" className="px-3 py-1 bg-primary-500/10 text-primary-400 border-none font-bold uppercase tracking-[0.15em] text-[9px]">
                  {resource.categories.name}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <CardTitle className="text-xl sm:text-2xl font-black text-white leading-tight group-hover:text-primary-300 transition-colors tracking-tight">
                {resource.name}
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                {truncateText(resource.description || '', 100)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col px-6 sm:px-8 pb-8 pt-2 relative z-10">
          {/* Quick Info Badges */}
          {resource.services_offered && resource.services_offered.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {resource.services_offered.slice(0, 3).map((service, index) => (
                <span key={index} className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-[10px] uppercase font-black tracking-widest text-slate-500 group-hover:text-slate-400 group-hover:border-white/10 transition-colors">
                  {service}
                </span>
              ))}
            </div>
          )}

          {/* Contact Details with improved spacing for touch */}
          <div className="space-y-4 mb-8">
            {resource.address && (
              <div className="flex items-start gap-4 text-xs sm:text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary-500/10 group-hover:border-primary-500/20 transition-all">
                  <MapPin className="h-4 w-4 text-primary-400" />
                </div>
                <span className="line-clamp-2 pt-2">{resource.address}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resource.contact_info?.phone && (
                <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary-500/10 group-hover:border-primary-500/20 transition-all">
                    <Phone className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span className="font-bold tracking-tight">{formatPhoneNumber(resource.contact_info.phone)}</span>
                </div>
              )}

              {resource.hours_of_operation && (
                <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary-500/10 group-hover:border-primary-500/20 transition-all">
                    <Clock className="h-4 w-4 text-indigo-400" />
                  </div>
                  <span className="font-bold tracking-tight">{formatHours(resource.hours_of_operation)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Optimized for Mobile */}
          <div className="mt-auto flex flex-col sm:flex-row gap-3">
            <Link
              href={`/resources/${resource.id}`}
              className="btn btn-primary bg-primary-600 hover:bg-primary-500 text-white rounded-2xl h-14 sm:h-12 px-8 text-sm font-black uppercase tracking-widest flex-1 transition-all flex items-center justify-center gap-2 group/btn shadow-xl shadow-primary-500/10 hover:shadow-primary-500/30"
            >
              Details
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            {resource.website && (
              <a
                href={resource.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline h-14 sm:h-12 px-6 rounded-2xl border-white/10 text-white hover:text-white hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2 font-bold"
              >
                <Globe className="h-4 w-4 sm:hidden" />
                <span className="sm:hidden">Website</span>
                <Globe className="h-4 w-4 hidden sm:block" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

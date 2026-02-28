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
      <Card className="glass-card h-full flex flex-col border-white/10 hover:border-primary-500/30 transition-all duration-300 overflow-hidden relative">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />

        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 group-hover:bg-primary-500/10 group-hover:border-primary-500/20 transition-all duration-500">
                  {resource.categories.icon}
                </div>
                {showCategory && (
                  <Badge variant="glass" className="text-[10px] uppercase tracking-widest font-bold text-primary-400 border-none bg-primary-500/5">
                    {resource.categories.name}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary-300 transition-colors">
                {resource.name}
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                {truncateText(resource.description || '', 120)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col pt-0 relative z-10">
          {/* Services Quick View */}
          {resource.services_offered && resource.services_offered.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-1.5">
                {resource.services_offered.slice(0, 2).map((service, index) => (
                  <Badge key={index} variant="outline" size="sm" className="bg-white/5 border-white/5 text-[11px] text-slate-400">
                    {service}
                  </Badge>
                ))}
                {resource.services_offered.length > 2 && (
                  <Badge variant="outline" size="sm" className="bg-white/5 border-white/5 text-[11px] text-slate-500">
                    +{resource.services_offered.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="space-y-3 mb-8">
            {resource.contact_info?.phone && (
              <div className="flex items-center gap-3 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Phone className="h-3.5 w-3.5 text-primary-400" />
                </div>
                <span className="font-medium">{formatPhoneNumber(resource.contact_info.phone)}</span>
              </div>
            )}

            {resource.address && (
              <div className="flex items-start gap-3 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-primary-400" />
                </div>
                <span className="line-clamp-2 mt-1.5">{resource.address}</span>
              </div>
            )}

            {resource.hours_of_operation && (
              <div className="flex items-center gap-3 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Clock className="h-3.5 w-3.5 text-primary-400" />
                </div>
                <span className="font-medium">{formatHours(resource.hours_of_operation)}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-6 border-t border-white/5 flex gap-3">
            <Link
              href={`/resources/${resource.id}`}
              className="btn btn-primary bg-primary-600 hover:bg-primary-500 text-white rounded-xl h-11 px-6 text-sm font-bold flex-1 transition-all flex items-center justify-center gap-2 group/btn"
            >
              Details
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            {resource.website && (
              <Button
                variant="outline"
                size="sm"
                className="h-11 w-11 p-0 rounded-xl border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                asChild
                href={resource.website}
              >
                <Globe className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

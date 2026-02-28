import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Globe, Clock, Users, Share2, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';
import { formatPhoneNumber, formatDate, cn } from '@/lib/utils';

type Resource = Database['public']['Tables']['resources']['Row'] & {
  categories: Database['public']['Tables']['categories']['Row'];
};

interface ResourceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ResourceDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: resource } = await supabase
    .from('resources')
    .select(`
      *,
      categories (
        id,
        name,
        icon
      )
    `)
    .eq('id', id)
    .eq('is_approved', true)
    .single();

  if (!resource) {
    return {
      title: 'Resource Not Found - Monroe Resource Hub',
    };
  }

  return {
    title: `${resource.name} - Monroe Resource Hub`,
    description: resource.description || `Learn more about ${resource.name} and their services in Monroe, North Carolina.`,
    openGraph: {
      title: resource.name,
      description: resource.description || `Learn more about ${resource.name} and their services.`,
      type: 'website',
    },
  };
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: resource, error } = await supabase
    .from('resources')
    .select(`
      *,
      categories (
        id,
        name,
        icon
      )
    `)
    .eq('id', id)
    .eq('is_approved', true)
    .single();

  if (error || !resource) {
    notFound();
  }

  // Get related resources
  const { data: relatedResources } = await supabase
    .from('resources')
    .select(`
      *,
      categories (
        id,
        name,
        icon
      )
    `)
    .eq('is_approved', true)
    .eq('category_id', resource.category_id)
    .neq('id', resource.id)
    .limit(3);

  const formatHours = (hours: any) => {
    if (!hours) return null;

    // Convert 24-hour format to 12-hour AM/PM EST
    const formatTime12Hour = (time24: string): string => {
      if (!time24) return '';
      const [hours, minutes] = time24.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return time24;
      const period = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const minutesStr = minutes.toString().padStart(2, '0');
      return `${hours12}:${minutesStr} ${period} EST`;
    };

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return days.map((day, index) => {
      const dayHours = hours[day];
      if (!dayHours || dayHours.closed) {
        return { day: dayNames[index], hours: 'Closed' };
      }
      return { day: dayNames[index], hours: `${formatTime12Hour(dayHours.open)} - ${formatTime12Hour(dayHours.close)}` };
    });
  };

  const hours = formatHours(resource.hours_of_operation);

  return (
    <div className="min-h-screen bg-[#020617] pt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
      <div className="container-custom section-padding relative z-10">
        {/* Back Button */}
        <div className="mb-10">
          <Button variant="ghost" size="sm" asChild href="/resources" className="text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-xl px-6 py-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Directory
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header Section */}
            <div className="glass-card p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none transition-all duration-700 group-hover:bg-primary-500/10" />

              <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-3xl shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    {resource.categories.icon}
                  </div>
                  <div>
                    <Badge variant="glass" className="mb-4 px-4 py-1.5 border-primary-500/20 text-primary-400 font-black uppercase tracking-[0.2em] text-[10px]">
                      {resource.categories.name}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none tracking-tighter">
                      {resource.name}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Button variant="outline" size="lg" className="flex-1 md:flex-none h-14 rounded-2xl border-white/10 text-white font-bold hover:bg-white/10 transition-all">
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </Button>
                  {resource.website && (
                    <Button variant="primary" size="lg" className="flex-1 md:flex-none h-14 rounded-2xl shadow-xl shadow-primary-500/20 font-black" asChild>
                      <a href={resource.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-5 w-5 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {resource.description && (
                <p className="text-xl text-slate-400 leading-relaxed font-medium">
                  {resource.description}
                </p>
              )}
            </div>

            {/* Services & Population Grid */}
            {(resource.services_offered?.length > 0 || resource.population_served?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {resource.services_offered && resource.services_offered.length > 0 && (
                  <div className="glass-card p-8 group">
                    <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary-500" />
                      Services Offered
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {resource.services_offered.map((service: string, index: number) => (
                        <Badge key={index} variant="glass" className="bg-white/5 border-white/5 text-slate-300 font-bold px-4 py-1.5 rounded-lg">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {resource.population_served && resource.population_served.length > 0 && (
                  <div className="glass-card p-8 group">
                    <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary-400" />
                      Who We Serve
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {resource.population_served.map((population: string, index: number) => (
                        <Badge key={index} variant="glass" className="bg-white/5 border-white/5 text-slate-300 font-bold px-4 py-1.5 rounded-lg">
                          {population}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hours of Operation */}
            {hours && (
              <div className="glass-card p-10">
                <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
                  <Clock className="h-6 w-6 text-primary-400" />
                  Hours of Operation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {hours.map((dayHours, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 md:last:border-b">
                      <span className="font-bold text-slate-200">{dayHours.day}</span>
                      <span className={cn("text-sm font-medium", dayHours.hours === 'Closed' ? "text-slate-500" : "text-primary-400")}>
                        {dayHours.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information Card */}
            <div className="glass-card p-8 bg-primary-500/[0.03] border-primary-500/10">
              <h3 className="text-xl font-black text-white mb-8">Contact Information</h3>
              <div className="space-y-8">
                {resource.contact_info?.phone && (
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-primary-500/10 group-hover:border-primary-500/30">
                      <Phone className="h-5 w-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Phone Number</p>
                      <p className="text-lg font-bold text-white transition-colors group-hover:text-primary-300">
                        {formatPhoneNumber(resource.contact_info.phone)}
                      </p>
                    </div>
                  </div>
                )}

                {resource.contact_info?.email && (
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-primary-500/10 group-hover:border-primary-500/30">
                      <Globe className="h-5 w-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Email Address</p>
                      <p className="text-lg font-bold text-white transition-colors group-hover:text-primary-300 break-all">
                        {resource.contact_info.email}
                      </p>
                    </div>
                  </div>
                )}

                {resource.address && (
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-primary-500/10 group-hover:border-primary-500/30 shrink-0">
                      <MapPin className="h-5 w-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Our Location</p>
                      <p className="text-lg font-bold text-white leading-tight mb-2">
                        {resource.address}
                      </p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(resource.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-black text-primary-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
                      >
                        Navigate on Maps
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {resource.website && (
                <div className="mt-10 pt-8 border-t border-white/5">
                  <Button variant="primary" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs" asChild>
                    <a href={resource.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Site
                    </a>
                  </Button>
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="glass-card p-8">
              <h3 className="text-lg font-black text-white mb-6">Quick Links</h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full h-12 justify-start px-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10" asChild href="/submit-resource">
                  Suggest Changes
                </Button>
                <Button variant="ghost" className="w-full h-12 justify-start px-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10" asChild href="/volunteer">
                  Volunteer Here
                </Button>
                <Button variant="ghost" className="w-full h-12 justify-start px-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10" asChild href="/career">
                  Job Opportunities
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Resources */}
        {relatedResources && relatedResources.length > 0 && (
          <div className="mt-24 pt-20 border-t border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-2 h-10 bg-primary-500 rounded-full" />
              <h2 className="text-4xl font-black text-white tracking-tighter">
                Explore <span className="text-gradient-logo">Similar</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedResources.map((relatedResource) => (
                <ResourceCard
                  key={relatedResource.id}
                  resource={relatedResource}
                  showCategory={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

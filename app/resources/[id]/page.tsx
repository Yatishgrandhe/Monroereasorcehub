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
import { ResourceActions } from '@/components/resources/ResourceActions';

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
      title: 'Resource Not Found',
    };
  }

  return {
    title: resource.name,
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
    <div className="min-h-screen bg-white pt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="container-custom section-padding relative z-10">
        {/* Back Button */}
        <div className="mb-12">
          <Button variant="outline" size="sm" asChild href="/resources" className="rounded-2xl px-8 h-12 font-bold uppercase tracking-widest text-[10px] border-gray-100 text-gray-500 hover:bg-gray-50 bg-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Directory
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Header Section */}
            <div className="bg-white border border-gray-100 rounded-[3rem] p-12 shadow-soft relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />

              <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-12">
                <div className="flex items-start gap-8">
                  <div className="w-20 h-20 bg-primary-50 border border-primary-100 rounded-3xl flex items-center justify-center text-4xl shadow-sm transition-transform duration-500 group-hover:scale-110">
                    {resource.categories.icon}
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-6 px-4 py-1.5 border-primary-200 text-primary-700 font-bold uppercase tracking-widest text-[10px] bg-primary-50/50">
                      {resource.categories.name}
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary-950 leading-tight tracking-tight">
                      {resource.name}
                    </h1>
                  </div>
                </div>

                <ResourceActions resourceName={resource.name} website={resource.website || undefined} />

              </div>

              {resource.description && (
                <p className="text-xl text-gray-600 leading-relaxed font-medium max-w-3xl">
                  {resource.description}
                </p>
              )}
            </div>

            {/* Services & Population Grid */}
            {(resource.services_offered?.length > 0 || resource.population_served?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {resource.services_offered && resource.services_offered.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-soft">
                    <h3 className="text-[10px] font-bold text-primary-950 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary-600" />
                      Operational Capabilities
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {resource.services_offered.map((service: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-gray-50/50 border-gray-100 text-gray-500 font-bold px-5 py-2 rounded-xl text-xs uppercase tracking-tight">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {resource.population_served && resource.population_served.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-soft">
                    <h3 className="text-[10px] font-bold text-primary-950 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary-400" />
                      Focus Population
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {resource.population_served.map((population: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-gray-50/50 border-gray-100 text-gray-500 font-bold px-5 py-2 rounded-xl text-xs uppercase tracking-tight">
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
              <div className="bg-white border border-gray-100 rounded-[3rem] p-12 shadow-soft">
                <h3 className="text-3xl font-serif font-bold text-primary-950 mb-10 flex items-center gap-6">
                  <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center">
                    <Clock className="h-7 w-7 text-primary-600" />
                  </div>
                  Availability Matrix
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
                  {hours.map((dayHours, index) => (
                    <div key={index} className="flex justify-between items-center py-5 border-b border-gray-50 last:border-0">
                      <span className="text-xs font-bold text-primary-950 uppercase tracking-widest">{dayHours.day}</span>
                      <span className={cn("text-xs font-bold uppercase tracking-tight", dayHours.hours === 'Closed' ? "text-gray-300" : "text-primary-700")}>
                        {dayHours.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            {/* Contact Information Card */}
            <div className="bg-primary-950 rounded-[3rem] p-10 text-white shadow-2xl shadow-primary-950/20 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-800/20 blur-[80px] rounded-full -mb-32 -mr-32 pointer-events-none" />

              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-400 mb-10">Communication Channels</h3>

              <div className="space-y-10 relative z-10">
                {resource.contact_info?.phone && (
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-primary-800 group-hover:border-primary-700">
                      <Phone className="h-5 w-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-1">Direct Line</p>
                      <p className="text-xl font-bold text-white transition-colors group-hover:text-primary-300">
                        {formatPhoneNumber(resource.contact_info.phone)}
                      </p>
                    </div>
                  </div>
                )}

                {resource.contact_info?.email && (
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-primary-800 group-hover:border-primary-700">
                      <Globe className="h-5 w-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-1">Official Email</p>
                      <p className="text-lg font-bold text-white transition-colors group-hover:text-primary-300 break-all">
                        {resource.contact_info.email}
                      </p>
                    </div>
                  </div>
                )}

                {resource.address && (
                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-primary-800 group-hover:border-primary-700 shrink-0">
                      <MapPin className="h-5 w-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-1">Tactical Location</p>
                      <p className="text-lg font-bold text-white leading-tight mb-4">
                        {resource.address}
                      </p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(resource.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-primary-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
                      >
                        Launch Directions
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {resource.website && (
                <div className="mt-12 pt-10 border-t border-white/5">
                  <Button
                    asChild
                    href={resource.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-16 rounded-2xl font-bold uppercase tracking-widest text-[10px] bg-white text-primary-950 hover:bg-primary-50 no-underline inline-flex items-center justify-center transition-all shadow-xl shadow-black/20"
                  >
                    <span className="flex items-center justify-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Operational Website
                    </span>
                  </Button>
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-soft">
              <h3 className="text-[10px] font-bold text-primary-950 uppercase tracking-widest mb-8">Intelligence</h3>
              <div className="space-y-3">
                <Button asChild href="/submit-resource" variant="ghost" className="w-full h-14 justify-start px-6 font-bold text-[10px] uppercase tracking-widest text-gray-400 hover:text-primary-950 hover:bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all no-underline inline-flex items-center">
                  <span>Suggest Correction</span>
                </Button>
                <Button asChild href="/volunteer" variant="ghost" className="w-full h-14 justify-start px-6 font-bold text-[10px] uppercase tracking-widest text-gray-400 hover:text-primary-950 hover:bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all no-underline inline-flex items-center">
                  <span>Volunteer Recruitment</span>
                </Button>
                <Button asChild href="/career" variant="ghost" className="w-full h-14 justify-start px-6 font-bold text-[10px] uppercase tracking-widest text-gray-400 hover:text-primary-950 hover:bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all no-underline inline-flex items-center">
                  <span>Career Vacancies</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Resources */}
        {relatedResources && relatedResources.length > 0 && (
          <div className="mt-32 pt-24 border-t border-gray-50">
            <div className="flex items-center gap-6 mb-16">
              <Badge variant="outline" className="px-5 py-2 border-primary-100 bg-primary-50/50 text-primary-700 font-bold uppercase tracking-[0.2em] text-[10px] rounded-full">
                Related Intelligence
              </Badge>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-950 tracking-tight">
                Similar <span className="text-primary-700">Hub</span> Nodes
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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

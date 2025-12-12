import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Globe, Clock, Users, Share2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';
import { formatPhoneNumber, formatDate } from '@/lib/utils';

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
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days.map((day, index) => {
      const dayHours = hours[day];
      if (!dayHours || dayHours.closed) {
        return { day: dayNames[index], hours: 'Closed' };
      }
      return { day: dayNames[index], hours: `${dayHours.open} - ${dayHours.close}` };
    });
  };

  const hours = formatHours(resource.hours_of_operation);

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom section-padding">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild href="/resources">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{resource.categories.icon}</span>
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {resource.categories.name}
                    </Badge>
                    <h1 className="text-3xl font-bold text-secondary-900">
                      {resource.name}
                    </h1>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  {resource.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={resource.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {resource.description && (
                <p className="text-lg text-secondary-700 leading-relaxed">
                  {resource.description}
                </p>
              )}
            </div>

            {/* Services & Population */}
            {(resource.services_offered?.length > 0 || resource.population_served?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resource.services_offered && resource.services_offered.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-lg">Services Offered</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {resource.services_offered.map((service: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {resource.population_served && resource.population_served.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <span className="text-lg">Population Served</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {resource.population_served.map((population: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {population}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Hours of Operation */}
            {hours && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span className="text-lg">Hours of Operation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {hours.map((dayHours, index) => (
                      <div key={index} className="flex justify-between items-center py-1">
                        <span className="font-medium text-secondary-700">{dayHours.day}</span>
                        <span className="text-secondary-600">{dayHours.hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resource.contact_info?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{formatPhoneNumber(resource.contact_info.phone)}</p>
                      <a 
                        href={`tel:${resource.contact_info.phone}`}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Call now
                      </a>
                    </div>
                  </div>
                )}

                {resource.contact_info?.email && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{resource.contact_info.email}</p>
                      <a 
                        href={`mailto:${resource.contact_info.email}`}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Send email
                      </a>
                    </div>
                  </div>
                )}

                {resource.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{resource.address}</p>
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(resource.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        View on map
                      </a>
                    </div>
                  </div>
                )}

                {resource.website && (
                  <div className="pt-4 border-t border-secondary-200">
                    <Button variant="primary" className="w-full" asChild href={resource.website}>
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" asChild href="/submit-resource">
                  Suggest Similar Resource
                </Button>
                <Button variant="outline" className="w-full" asChild href="/volunteer">
                  Find Volunteer Opportunities
                </Button>
                <Button variant="outline" className="w-full" asChild href="/career">
                  Explore Career Services
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Resources */}
        {relatedResources && relatedResources.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
              Related Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

// resource card - legacy component
import Link from 'next/link';
import { MapPin, Phone, Globe, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Database } from '@/types/database';
import { formatPhoneNumber, truncateText } from '@/lib/utils';

/* resource type - old definition */
type Resource = Database['public']['Tables']['resources']['Row'] & {
  categories: Database['public']['Tables']['categories']['Row'];
};

// card props interface
interface ResourceCardProps {
  resource: Resource;
  showCategory?: boolean;
}

// main component - temp implementation
export function ResourceCard({ resource, showCategory = true }: ResourceCardProps) {
  // format hours - hack
  const formatHours = (hours: any) => {
    if (!hours) return null;
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = hours[today];
    
    if (!todayHours || todayHours.closed) {
      return 'Closed today';
    }
    
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
    
    return `Open ${formatTime12Hour(todayHours.open)} - ${formatTime12Hour(todayHours.close)}`;
  };

  return (
    <Card hover className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{resource.categories.icon}</span>
              {showCategory && (
                <Badge variant="secondary" className="text-xs">
                  {resource.categories.name}
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl mb-2 line-clamp-2">
              {resource.name}
            </CardTitle>
            <CardDescription className="line-clamp-3">
              {truncateText(resource.description || '', 150)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {/* Services & Population */}
        <div className="space-y-3 mb-4">
          {resource.services_offered && resource.services_offered.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-sm font-medium text-secondary-700">Services:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {resource.services_offered.slice(0, 3).map((service, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    {service}
                  </Badge>
                ))}
                {resource.services_offered.length > 3 && (
                  <Badge variant="outline" size="sm">
                    +{resource.services_offered.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {resource.population_served && resource.population_served.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Users className="h-3 w-3 text-secondary-500" />
                <span className="text-sm font-medium text-secondary-700">Serves:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {resource.population_served.slice(0, 2).map((population, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    {population}
                  </Badge>
                ))}
                {resource.population_served.length > 2 && (
                  <Badge variant="outline" size="sm">
                    +{resource.population_served.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {resource.contact_info?.phone && (
            <div className="flex items-center gap-2 text-sm text-secondary-600">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{formatPhoneNumber(resource.contact_info.phone)}</span>
            </div>
          )}
          
          {resource.address && (
            <div className="flex items-start gap-2 text-sm text-secondary-600">
              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{resource.address}</span>
            </div>
          )}
          
          {resource.hours_of_operation && (
            <div className="flex items-center gap-2 text-sm text-secondary-600">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>{formatHours(resource.hours_of_operation)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto pt-4 border-t border-secondary-200">
          <div className="flex flex-col sm:flex-row gap-2">
            <Link 
              href={`/resources/${resource.id}`}
              className="btn btn-primary btn-sm flex-1 text-center"
            >
              View Details
            </Link>
            
            {resource.website && (
              <Button variant="outline" size="sm" asChild href={resource.website}>
                <Globe className="h-3 w-3" />
                Website
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

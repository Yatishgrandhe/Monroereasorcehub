'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin, Phone, Globe } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Database } from '@/types/database';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Volunteers
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Hands together
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Group meeting
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Food/Helping
  'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Social services
];

type Resource = Database['public']['Tables']['resources']['Row'] & {
  categories: Database['public']['Tables']['categories']['Row'];
};

interface SpotlightCarouselProps {
  resources: Resource[];
}

export function SpotlightCarousel({ resources }: SpotlightCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const spotlightedResources = resources.filter(resource => resource.is_spotlighted);

  useEffect(() => {
    if (spotlightedResources.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === spotlightedResources.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [spotlightedResources.length]);

  if (spotlightedResources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-500">No featured resources available at this time.</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? spotlightedResources.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === spotlightedResources.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentResource = spotlightedResources[currentIndex];

  return (
    <div className="relative">
      {/* Main Carousel */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {spotlightedResources.map((resource, index) => (
            <div key={resource.id} className="w-full flex-shrink-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
                {/* Content */}
                <div className="flex flex-col justify-center text-white">
                  <Badge variant="outline" className="mb-4 bg-white/20 text-white border-white/30 w-fit">
                    {resource.categories.name}
                  </Badge>
                  <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                    {resource.name}
                  </h3>
                  <p className="text-lg text-white/90 mb-6 leading-relaxed">
                    {resource.spotlight_story || resource.description}
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-6">
                    {resource.contact_info?.phone && (
                      <div className="flex items-center space-x-2 text-white/90">
                        <Phone className="h-4 w-4" />
                        <span>{resource.contact_info.phone}</span>
                      </div>
                    )}
                    {resource.address && (
                      <div className="flex items-center space-x-2 text-white/90">
                        <MapPin className="h-4 w-4" />
                        <span>{resource.address}</span>
                      </div>
                    )}
                    {resource.website && (
                      <div className="flex items-center space-x-2 text-white/90">
                        <Globe className="h-4 w-4" />
                        <span>Visit Website</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href={`/resources/${resource.id}`}
                      className="btn btn-outline bg-white/50 backdrop-blur-sm text-white border-white/50 hover:bg-white/60 shadow-lg font-semibold"
                    >
                      Learn More
                    </Link>
                    {resource.website && (
                      <Button variant="ghost" className="text-white hover:bg-white/30 backdrop-blur-sm font-semibold" asChild href={resource.website}>
                        Visit Website
                      </Button>
                    )}
                  </div>
                </div>

                {/* Image Placeholder */}
                <div className="flex items-center justify-center">
                  <div className="w-full h-64 lg:h-80 bg-white/10 rounded-xl flex items-center justify-center overflow-hidden relative">
                    <img
                      src={resource.spotlight_image_url || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                      alt={resource.name}
                      className="w-full h-full object-cover rounded-xl hover:scale-105 transition-transform duration-500"
                    />
                    {!resource.spotlight_image_url && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                        <div className="flex items-center gap-3 text-white/90">
                          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                            <span className="text-xl">{resource.categories.icon}</span>
                          </div>
                          <span className="font-medium text-sm tracking-wide uppercase">{resource.categories.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        {/* Dots */}
        <div className="flex space-x-2">
          {spotlightedResources.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${index === currentIndex ? 'bg-primary-600' : 'bg-secondary-300'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            className="p-2"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            className="p-2"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

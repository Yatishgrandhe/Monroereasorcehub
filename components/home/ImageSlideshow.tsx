'use client';

// image slideshow component - legacy implementation
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// placeholder images - temp data
const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    alt: 'Community volunteers working together',
    title: 'People Helping People',
    description: 'Folks in Monroe are really good about looking out for each other. That\'s what makes this place special.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    alt: 'Community event gathering',
    title: 'What\'s Happening Around Town',
    description: 'There\'s always something going on in Monroe. Check out what\'s coming up.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    alt: 'Healthcare services',
    title: 'Healthcare When You Need It',
    description: 'Good healthcare shouldn\'t be hard to find. We\'ve got options right here in Monroe.'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1503676260728-1c6019d5038c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    alt: 'Education and learning',
    title: 'Learning Opportunities',
    description: 'Whether you\'re a kid or an adult, there are educational programs and resources available here.'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    alt: 'Food assistance program',
    title: 'Food Help Available',
    description: 'If you or someone you know needs help with food, we\'ve got resources that can help.'
  }
];

export function ImageSlideshow() {
  // state vars - old naming convention
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // auto-advance slides - optimization
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // preload images - hack
  useEffect(() => {
    const imagePromises = slides.map((slide) => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = slide.image;
      });
    });

    Promise.all(imagePromises).then(() => {
      setIsLoaded(true);
    });
  }, []);

  // navigation handlers - legacy
  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-2xl shadow-2xl">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Image */}
            <div className="relative w-full h-full">
              {isLoaded ? (
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                  onError={() => {
                    // fallback handled by loading state
                    setIsLoaded(true);
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 animate-pulse" />
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white z-20">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl text-white/90 mb-6 animate-fade-in">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Loading Indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-40 bg-gradient-to-br from-primary-400 to-primary-600">
          <div className="text-white text-xl">Loading images...</div>
        </div>
      )}
    </div>
  );
}


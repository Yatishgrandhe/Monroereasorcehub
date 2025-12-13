'use client';

import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  title?: string;
  fallbackHospital?: string;
  fallbackDefault?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  title = '',
  fallbackHospital = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90',
  fallbackDefault = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90',
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const titleLower = title.toLowerCase();
      // Use a hospital/medical themed fallback image
      if (titleLower.includes('hospital') || titleLower.includes('health')) {
        setImgSrc(fallbackHospital);
      } else {
        setImgSrc(fallbackDefault);
      }
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleError}
    />
  );
}


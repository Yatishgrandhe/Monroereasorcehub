'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const SCROLL_THRESHOLD_PX = 400;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD_PX);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  );
}

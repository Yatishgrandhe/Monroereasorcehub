'use client';

import { ContactForm } from '@/components/home/ContactForm';
import { Reveal } from '@/components/ui/Reveal';
import { PageSplineBanner } from '@/components/ui/PageSplineBanner';
import { SPLINE_PAGES_URL } from '@/lib/spline';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageSplineBanner sceneUrl={SPLINE_PAGES_URL || undefined} height="36vh">
        <div className="container-custom text-center w-full">
          <Reveal width="100%">
            <span className="section-label block mb-4 text-[var(--color-accent-soft)]">Civic Access Point</span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mt-4 mb-6 tracking-tight leading-tight">
              Connect <span className="text-primary-200">Directly</span>
            </h1>
          </Reveal>
        </div>
      </PageSplineBanner>
      <div className="container-custom pt-12 pb-24">
        <ContactForm className="!bg-white" />
      </div>
    </div>
  );
}

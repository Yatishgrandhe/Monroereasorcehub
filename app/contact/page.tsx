'use client';

import { ContactForm } from '@/components/home/ContactForm';
import { Reveal } from '@/components/ui/Reveal';
import { PageSplineBanner } from '@/components/ui/PageSplineBanner';
import { SPLINE_PAGES_URL } from '@/lib/spline';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageSplineBanner sceneUrl={SPLINE_PAGES_URL || undefined} height="36vh">
        <div className="container-custom w-full">
          <Reveal width="100%">
            <div className="flex flex-col items-start gap-4">
              <span className="px-5 py-2 rounded-full bg-accent-500/10 border border-accent-400/20 text-accent-400 font-black uppercase tracking-[0.3em] text-[10px] backdrop-blur-md">
                Direct Communication
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white tracking-tighter leading-none italic mb-4">
                Connect Hub<span className="text-secondary-500 not-italic">.</span>
              </h1>
              <div className="w-24 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mb-6" />
              <p className="text-xl md:text-2xl text-blue-50/70 max-w-3xl leading-relaxed italic font-medium">
                Submit inquiries, register organizations, or provide direct feedback to our operational team.
              </p>
            </div>
          </Reveal>
        </div>
      </PageSplineBanner>
      <div className="container-custom pt-12 pb-24">
        <ContactForm className="!bg-white" />
      </div>
    </div>
  );
}

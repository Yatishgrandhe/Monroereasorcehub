'use client';

import { ContactForm } from '@/components/home/ContactForm';
import { Reveal } from '@/components/ui/Reveal';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="pt-48">
                <div className="container-custom text-center mb-12">
                    <Reveal width="100%">
                        <span className="text-primary-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-8 block">Civic Access Point</span>
                        <h1 className="text-6xl md:text-9xl font-serif font-black text-primary-950 mt-4 mb-8 tracking-tighter leading-[0.8] italic">
                            Connect <span className="text-primary-700 not-italic">Directly.</span>
                        </h1>
                    </Reveal>
                </div>
                <ContactForm className="!bg-white" />
            </div>
        </div>
    );
}

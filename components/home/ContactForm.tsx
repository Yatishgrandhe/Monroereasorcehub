'use client';

import { useState } from 'react';
import { Send, CheckCircle, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/ui/Reveal';

export function ContactForm({ className }: { className?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className={cn('py-32 bg-primary-50 relative overflow-hidden', className)}>
      {/* Background Decorative Element */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <Reveal width="100%">
              <span className="text-primary-700 font-bold uppercase tracking-[0.4em] text-[10px]">Registry & Support</span>
              <h2 className="text-primary-950 mt-6 mb-8 text-5xl md:text-7xl font-serif font-black tracking-tighter leading-tight">
                Direct <span className="text-primary-700 italic">Civic Channel.</span>
              </h2>
              <p className="text-xl text-gray-500 mb-6 leading-relaxed font-serif italic">
                We coordinate daily expansions of our community registry. If you represent an organization or have discovered a resource gap, utilize this secure channel.
              </p>
              <p className="text-base text-gray-500 mb-12 leading-relaxed">
                Typically responds within <strong>1–2 business days</strong>. For urgent resource needs, call{' '}
                <a href="tel:211" className="text-primary-600 hover:text-primary-700 font-semibold underline underline-offset-2">
                  211
                </a>
                — Union County&apos;s free social services helpline.
              </p>

              <div className="space-y-10">
                <div className="flex items-start">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-soft border border-gray-100 flex items-center justify-center text-primary-700 shrink-0 group hover:bg-primary-950 hover:text-white transition-all duration-500">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div className="ml-6">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-primary-950 mb-1">Operational Support</p>
                    <p className="text-lg text-gray-500 font-medium">hello@monroeresourcehub.us</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-soft border border-gray-100 flex items-center justify-center text-primary-700 shrink-0 group hover:bg-primary-950 hover:text-white transition-all duration-500">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="ml-6">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-primary-950 mb-1">Central Mailing</p>
                    <p className="text-lg text-gray-500 font-medium">PO Box 1234, Monroe, NC 28112</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-soft border border-gray-100 flex items-center justify-center text-primary-700 shrink-0 group hover:bg-primary-950 hover:text-white transition-all duration-500">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="ml-6">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-primary-950 mb-1">Cycle Time</p>
                    <p className="text-lg text-gray-500 font-medium italic">Standard 24-48h response window.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal width="100%" delay={0.2}>
            <div className="bg-white p-10 md:p-14 rounded-[4rem] border border-gray-100 shadow-soft shadow-gray-200/50 relative overflow-hidden">
              {/* Subtle form decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[4rem] pointer-events-none opacity-50" />

              {submitted ? (
                <div className="form-success flex items-center gap-4 bg-accent-50 dark:bg-accent-950/20 border border-accent-200 dark:border-accent-800 rounded-2xl p-6 text-accent-800 dark:text-accent-200">
                  <CheckCircle className="h-10 w-10 shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Message received</h3>
                    <p className="text-sm opacity-90">
                      We&apos;ll get back to you within 1–2 business days.
                    </p>
                  </div>
                  <Button variant="outline" className="ml-auto shrink-0 h-12 px-6 rounded-xl font-semibold border-accent-300 text-accent-800 hover:bg-accent-100" onClick={() => setSubmitted(false)}>
                    Send another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label htmlFor="name" className="block text-[10px] font-black tracking-widest text-primary-950 uppercase">
                        Full Identity
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="contact-input w-full h-14 px-6 rounded-2xl border-2 border-[var(--color-border)] bg-white text-base focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 font-medium transition-all"
                        placeholder="Name..."
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="email" className="block text-[10px] font-black tracking-widest text-primary-950 uppercase">
                        Verified Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="contact-input w-full h-14 px-6 rounded-2xl border-2 border-[var(--color-border)] bg-white text-base focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 font-medium transition-all"
                        placeholder="Email..."
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="message" className="block text-[10px] font-black tracking-widest text-primary-950 uppercase">
                      Inquiry Specifications
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="contact-textarea w-full p-6 rounded-[2rem] border-2 border-[var(--color-border)] bg-white text-base focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 font-medium transition-all resize-y"
                      placeholder="Details of your request or suggestion..."
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary-950 hover:bg-black text-white h-16 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary-950/20 group" loading={loading}>
                    <Send className="h-4 w-4 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Submit Inquiry Channel
                  </Button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

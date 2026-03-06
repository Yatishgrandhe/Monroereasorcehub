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
              <p className="text-xl text-gray-500 mb-12 leading-relaxed font-serif italic">
                We coordinate daily expansions of our community registry. If you represent an organization or have discovered a resource gap, utilize this secure channel.
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
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-primary-50 text-primary-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h3 className="text-3xl font-serif font-black text-primary-950 mb-4 tracking-tight">Transmission Received</h3>
                  <p className="text-gray-500 italic font-medium mb-10 leading-relaxed px-4">
                    Your inquiry has been logged into our operational queue. We will coordinate a response shortly.
                  </p>
                  <Button variant="outline" className="h-14 px-10 rounded-2xl font-bold uppercase tracking-widest text-[10px] border-primary-100 text-primary-950" onClick={() => setSubmitted(false)}>
                    Send Another Transmission
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
                        className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-950 font-medium transition-all"
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
                        className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-950 font-medium transition-all"
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
                      className="w-full p-6 rounded-[2rem] border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-950 font-medium transition-all resize-none"
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

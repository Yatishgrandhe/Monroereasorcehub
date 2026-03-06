'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
    <section className={cn('py-20 bg-primary-50 dark:bg-primary-950/20', className)}>
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <Reveal width="100%">
              <span className="text-accent-600 font-bold uppercase tracking-[0.2em] text-xs">Get in Touch</span>
              <h2 className="text-primary-950 dark:text-white mt-4 mb-6 text-4xl font-serif font-black">
                Have questions or <br /><span className="text-accent-600">resource suggestions?</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-10 text-lg leading-relaxed">
                We are always looking to expand our directory. If you know of an organization that should be listed, or if you have any questions about our platform, please reach out.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg bg-white dark:bg-primary-900 shadow-sm border border-gray-100 dark:border-primary-800 flex items-center justify-center text-accent-600 shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-primary-950 dark:text-white font-serif">Email Us</p>
                    <p className="text-gray-500 dark:text-gray-400">hello@monroeresourcehub.us</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg bg-white dark:bg-primary-900 shadow-sm border border-gray-100 dark:border-primary-800 flex items-center justify-center text-accent-600 shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-primary-950 dark:text-white font-serif">Mailing Address</p>
                    <p className="text-gray-500 dark:text-gray-400">PO Box 1234<br />Monroe, NC 28112</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg bg-white dark:bg-primary-900 shadow-sm border border-gray-100 dark:border-primary-800 flex items-center justify-center text-accent-600 shrink-0">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-primary-950 dark:text-white font-serif">Response Time</p>
                    <p className="text-gray-500 dark:text-gray-400">We typically respond within 1-2 business days.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal width="100%" delay={0.2}>
            <div className="bg-white dark:bg-[#000d1a] p-8 sm:p-10 rounded-2xl border border-gray-200 dark:border-primary-900 shadow-lg">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-accent-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-serif font-bold text-primary-950 dark:text-white mb-2">Message Sent</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Thank you for reaching out. We&apos;ll get back to you soon.
                  </p>
                  <Button variant="outline" className="mt-8 btn-civic-primary" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-primary-950 dark:text-white mb-2 font-serif">
                      Your Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-primary-900 focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50 dark:bg-primary-950/40"
                      placeholder="e.g., Jane Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-primary-950 dark:text-white mb-2 font-serif">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-primary-900 focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50 dark:bg-primary-950/40"
                      placeholder="e.g., jane@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-primary-950 dark:text-white mb-2 font-serif">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-primary-900 focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50 dark:bg-primary-950/40 resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <Button type="submit" className="w-full btn-civic-primary !h-14 font-bold tracking-widest text-sm uppercase" loading={loading}>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Inquiry
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

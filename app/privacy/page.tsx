'use client';

import { Shield } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { PageSplineBanner } from '@/components/ui/PageSplineBanner';
import { SPLINE_PAGES_URL } from '@/lib/spline';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      <PageSplineBanner sceneUrl={SPLINE_PAGES_URL || undefined} height="34vh">
        <div className="container-custom w-full">
          <Reveal width="100%">
            <div className="flex flex-col items-start gap-4 text-left">
              <span className="px-5 py-2 rounded-full bg-accent-500/10 border border-accent-400/20 text-accent-400 font-black uppercase tracking-[0.3em] text-[10px] backdrop-blur-md">
                Your privacy matters
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white tracking-tighter leading-none italic mb-4">
                Privacy<span className="text-secondary-500 not-italic">.</span>
              </h1>
              <div className="w-24 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mb-6" />
              <p className="text-xl md:text-2xl text-blue-50/70 max-w-3xl leading-relaxed italic font-medium">
                How Monroe Resource Hub collects, uses, and protects your information.
              </p>
              <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                <Shield className="h-4 w-4 text-accent-400" />
                <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest">
                  Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </PageSplineBanner>

      <section className="section-padding relative z-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto border border-[var(--color-border)] bg-[var(--color-surface)] rounded-2xl p-8 md:p-12 shadow-soft">
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[var(--color-primary)] prose-p:text-[var(--color-text-muted)] prose-a:text-[var(--color-primary)] hover:prose-a:text-primary-700">
              <h2 className="text-2xl font-black text-[var(--color-text)] mb-6">1. Information We Collect</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                Monroe Resource Hub is a community directory. We collect minimal information to serve you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--color-text-muted)] mb-8">
                <li><strong className="text-[var(--color-text)]">Account data:</strong> If you create an account (email, password, name, optional profile info) for career tools, resume builder, or saved jobs.</li>
                <li><strong className="text-[var(--color-text)]">Resource submissions:</strong> Information you submit when adding a community resource (organization name, address, contact details, hours).</li>
                <li><strong className="text-[var(--color-text)]">Usage data:</strong> Basic analytics (pages visited, features used) to improve the site. No personal data is sold.</li>
              </ul>

              <h2 className="text-2xl font-black text-[var(--color-text)] mb-6">2. How We Use Your Information</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                We use your information only to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--color-text-muted)] mb-8">
                <li>Provide and improve Monroe Resource Hub services</li>
                <li>Display community resources you submit (with your consent)</li>
                <li>Send you account-related updates (e.g., password reset) only when necessary</li>
                <li>Respond to support inquiries</li>
              </ul>

              <h2 className="text-2xl font-black text-[var(--color-text)] mb-6">3. Data Sharing</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                We do not sell, rent, or trade your personal information. We may share data only when required by law or with service providers (e.g., hosting, authentication) who process data on our behalf under strict agreements.
              </p>

              <h2 className="text-2xl font-black text-[var(--color-text)] mb-6">4. Cookies & Storage</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                We use essential cookies for session management and authentication. Optional analytics may use cookies to understand site usage. You can manage cookie preferences in your browser.
              </p>

              <h2 className="text-2xl font-black text-[var(--color-text)] mb-6">5. Data Security</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                We use industry-standard security practices (HTTPS, secure authentication) to protect your data. Passwords are hashed and never stored in plain text.
              </p>

              <h2 className="text-2xl font-black text-[var(--color-text)] mb-6">6. Your Rights</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                You may request access to, correction of, or deletion of your personal data. Contact us at{' '}
                <a href="mailto:hello@monroeresourcehub.us" className="text-[var(--color-primary)] hover:underline">hello@monroeresourcehub.us</a>.
              </p>

              <h2 className="text-2xl font-black text-[var(--color-text)] mb-6">7. Children</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                Monroe Resource Hub is intended for general audiences. We do not knowingly collect personal information from children under 13 without parental consent.
              </p>

              <h2 className="text-2xl font-black text-[var(--color-text)] mb-6">8. Changes</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-8">
                We may update this privacy policy from time to time. The &quot;Last updated&quot; date at the top reflects the latest revision. Continued use of the site after changes constitutes acceptance.
              </p>

              <div className="pt-8 border-t border-[var(--color-border)]">
                <p className="text-sm text-[var(--color-text-muted)]">
                  Questions? Contact us at{' '}
                  <Link href="/contact" className="text-[var(--color-primary)] hover:underline font-semibold">Contact</Link> or{' '}
                  <a href="mailto:hello@monroeresourcehub.us" className="text-[var(--color-primary)] hover:underline">hello@monroeresourcehub.us</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

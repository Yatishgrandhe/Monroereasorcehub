'use client';

import { FileText } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { PageSplineBanner } from '@/components/ui/PageSplineBanner';
import { SPLINE_PAGES_URL } from '@/lib/spline';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] dark:bg-[#0f172a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      <PageSplineBanner sceneUrl={SPLINE_PAGES_URL || undefined} height="34vh">
        <div className="container-custom w-full">
          <Reveal width="100%">
            <div className="flex flex-col items-start gap-4 text-left">
              <span className="px-5 py-2 rounded-full bg-accent-500/10 border border-accent-400/20 text-accent-400 font-black uppercase tracking-[0.3em] text-[10px] backdrop-blur-md">
                Terms of use
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white tracking-tighter leading-none italic mb-4">
                Terms<span className="text-secondary-500 not-italic">.</span>
              </h1>
              <div className="w-24 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mb-6" />
              <p className="text-xl md:text-2xl text-blue-50/70 max-w-3xl leading-relaxed italic font-medium">
                The rules and guidelines for using Monroe Resource Hub.
              </p>
              <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                <FileText className="h-4 w-4 text-accent-400" />
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
          <div className="max-w-3xl mx-auto border border-[var(--color-border)] dark:border-white/10 bg-[var(--color-surface)] dark:bg-[#1e293b] rounded-2xl p-8 md:p-12 shadow-soft">
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[var(--color-primary)] dark:prose-headings:text-white prose-p:text-[var(--color-text-muted)] dark:prose-p:text-gray-300 prose-a:text-[var(--color-primary)] hover:prose-a:text-primary-700 dark:prose-a:text-accent-400">
              <h2 className="text-2xl font-black text-[var(--color-text)] dark:text-white mb-6">1. Acceptance of Terms</h2>
              <p className="text-[var(--color-text-muted)] dark:text-gray-300 leading-relaxed mb-6">
                By accessing or using Monroe Resource Hub (&quot;the Hub&quot;), you agree to these Terms of Use. If you do not agree, please do not use the site.
              </p>

              <h2 className="text-2xl font-black text-[var(--color-text)] dark:text-white mb-6">2. Description of Service</h2>
              <p className="text-[var(--color-text-muted)] dark:text-gray-300 leading-relaxed mb-6">
                Monroe Resource Hub is a free, community-maintained directory of local services in Union County, NC. We provide information about food assistance, healthcare, housing, education, and other community resources. We also offer career tools (resume builder, job assistant) for registered users.
              </p>

              <h2 className="text-2xl font-black text-[var(--color-text)] dark:text-white mb-6">3. Use of the Hub</h2>
              <p className="text-[var(--color-text-muted)] dark:text-gray-300 leading-relaxed mb-6">
                You may use the Hub for lawful purposes only. You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--color-text-muted)] dark:text-gray-300 mb-8">
                <li>Submit false, misleading, or fraudulent information</li>
                <li>Impersonate others or misrepresent your affiliation</li>
                <li>Attempt to gain unauthorized access to the site or user accounts</li>
                <li>Use the site for spam, harassment, or illegal activities</li>
                <li>Scrape or automate data collection without permission</li>
              </ul>

              <h2 className="text-2xl font-black text-[var(--color-text)] dark:text-white mb-6">4. Resource Submissions</h2>
              <p className="text-[var(--color-text-muted)] dark:text-gray-300 leading-relaxed mb-6">
                When you submit a resource to the Hub, you confirm that the information is accurate to the best of your knowledge. Submissions may be approved and displayed publicly. We reserve the right to remove or edit any submission that violates these terms or community standards.
              </p>

              <h2 className="text-2xl font-black text-[var(--color-text)] dark:text-white mb-6">5. Account & Career Tools</h2>
              <p className="text-[var(--color-text-muted)] dark:text-gray-300 leading-relaxed mb-6">
                If you create an account, you are responsible for maintaining the confidentiality of your credentials. You are responsible for all activity under your account. Our AI-powered career tools (resume builder, job assistant) are provided as-is; we do not guarantee employment outcomes.
              </p>

              <h2 className="text-2xl font-black text-[var(--color-text)] dark:text-white mb-6">6. Accuracy of Information</h2>
              <p className="text-[var(--color-text-muted)] dark:text-gray-300 leading-relaxed mb-6">
                We strive to verify resource listings, but we cannot guarantee accuracy. Contact information, hours, and availability may change. Always confirm details directly with organizations before visiting.
              </p>

              <h2 className="text-2xl font-black text-[var(--color-text)] dark:text-white mb-6">7. Intellectual Property</h2>
              <p className="text-[var(--color-text-muted)] dark:text-gray-300 leading-relaxed mb-6">
                The Monroe Resource Hub logo, design, and original content are owned by the project. Third-party resources (images, logos of organizations) remain the property of their respective owners. See our <Link href="/info" className="text-[var(--color-primary)] hover:underline">Information</Link> page for attribution details.
              </p>

              <h2 className="text-2xl font-black text-[var(--color-text)] dark:text-white mb-6">8. Disclaimer</h2>
              <p className="text-[var(--color-text-muted)] dark:text-gray-300 leading-relaxed mb-6">
                Monroe Resource Hub is provided &quot;as is&quot; without warranties of any kind. We are not responsible for the actions of listed organizations, the accuracy of third-party content, or any damages arising from use of the site.
              </p>

              <h2 className="text-2xl font-black text-[var(--color-text)] dark:text-white mb-6">9. Limitation of Liability</h2>
              <p className="text-[var(--color-text-muted)] dark:text-gray-300 leading-relaxed mb-6">
                To the fullest extent permitted by law, Monroe Resource Hub and its contributors shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the site.
              </p>

              <h2 className="text-2xl font-black text-[var(--color-text)] dark:text-white mb-6">10. Changes</h2>
              <p className="text-[var(--color-text-muted)] dark:text-gray-300 leading-relaxed mb-8">
                We may update these terms from time to time. The &quot;Last updated&quot; date reflects the latest revision. Continued use of the site after changes constitutes acceptance.
              </p>

              <div className="pt-8 border-t border-[var(--color-border)] dark:border-white/10">
                <p className="text-sm text-[var(--color-text-muted)] dark:text-gray-400">
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

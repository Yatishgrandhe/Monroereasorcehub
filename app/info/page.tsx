'use client';

import { FileText, Book, Code, Image, Globe, Link as LinkIcon, Download, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { PageSplineBanner } from '@/components/ui/PageSplineBanner';
import { SPLINE_PAGES_URL } from '@/lib/spline';
import { cn } from '@/lib/utils';

const references = [
  {
    category: 'Web Frameworks & Libraries',
    items: [
      {
        name: 'Next.js 16.1.6',
        type: 'Framework',
        description: 'React framework for production with App Router',
        url: 'https://nextjs.org/',
        license: 'MIT License',
        usage: 'Used as the core framework for building the web application'
      },
      {
        name: 'React 19.2.4',
        type: 'Library',
        description: 'JavaScript library for building user interfaces',
        url: 'https://react.dev/',
        license: 'MIT License',
        usage: 'Core UI library for all components'
      },
      {
        name: 'Tailwind CSS 3.4',
        type: 'Framework',
        description: 'Utility-first CSS framework',
        url: 'https://tailwindcss.com/',
        license: 'MIT License',
        usage: 'Used for all styling and responsive design'
      },
      {
        name: 'TypeScript 5.9',
        type: 'Language',
        description: 'JavaScript with syntax for types',
        url: 'https://www.typescriptlang.org/',
        license: 'Apache License 2.0',
        usage: 'Type-safe development across the entire application'
      },
      {
        name: 'Node.js 22 LTS',
        type: 'Runtime',
        description: 'JavaScript runtime built on V8',
        url: 'https://nodejs.org/',
        license: 'MIT License',
        usage: 'Server-side JavaScript execution and build tooling'
      },
      {
        name: 'Supabase',
        type: 'Backend Platform',
        description: 'Open source Firebase alternative',
        url: 'https://supabase.com/',
        license: 'Apache License 2.0',
        usage: 'Database, authentication, and backend services'
      },
      {
        name: 'Lucide React',
        type: 'Icon Library',
        description: 'Beautiful & consistent icon toolkit',
        url: 'https://lucide.dev/',
        license: 'ISC License',
        usage: 'All icons throughout the application'
      },
      {
        name: 'React Hook Form',
        type: 'Library',
        description: 'Performant forms library',
        url: 'https://react-hook-form.com/',
        license: 'MIT License',
        usage: 'Form handling and validation'
      },
      {
        name: 'Zod',
        type: 'Library',
        description: 'TypeScript-first schema validation',
        url: 'https://zod.dev/',
        license: 'MIT License',
        usage: 'Schema validation for forms and API'
      },
      {
        name: 'Google Generative AI (Gemini)',
        type: 'AI Service',
        description: 'AI-powered resume builder and job assistant',
        url: 'https://ai.google.dev/',
        license: 'Terms of Service',
        usage: 'AI features for resume building and job application assistance'
      },
      {
        name: 'React Big Calendar',
        type: 'Library',
        description: 'Calendar component for React',
        url: 'https://github.com/jquense/react-big-calendar',
        license: 'MIT License',
        usage: 'Event calendar display'
      },
      {
        name: 'jspdf & html2canvas',
        type: 'Libraries',
        description: 'PDF generation from HTML',
        url: 'https://github.com/parallax/jsPDF',
        license: 'MIT License',
        usage: 'Resume PDF export functionality'
      }
    ]
  },
  {
    category: 'Design Resources',
    items: [
      {
        name: 'Unsplash Images',
        type: 'Stock Photos',
        description: 'High-quality royalty-free images',
        url: 'https://unsplash.com/',
        license: 'Unsplash License',
        usage: 'Hero section images and featured content',
        permission: 'All images used under Unsplash License (free to use with attribution)'
      },
      {
        name: 'Custom Logo Design',
        type: 'Original Work',
        description: 'Logo designed specifically for Monroe Resource Hub',
        license: 'Original',
        usage: 'Website branding and navigation'
      }
    ]
  },
  {
    category: 'Data Sources',
    items: [
      {
        name: 'Monroe Community Organizations',
        type: 'Local Data',
        description: 'Community resource information',
        license: 'Public Information',
        usage: 'Resource directory listings',
        permission: 'Publicly available information from organizational websites'
      },
      {
        name: 'Monroe City Government',
        type: 'Government Data',
        description: 'Public community services information',
        url: 'https://www.monroenc.org/',
        license: 'Public Domain',
        usage: 'Community services and resource information'
      }
    ]
  },
  {
    category: 'Documentation & Learning Resources',
    items: [
      {
        name: 'Next.js Documentation',
        type: 'Documentation',
        description: 'Official Next.js documentation',
        url: 'https://nextjs.org/docs',
        license: 'MIT License',
        usage: 'Framework implementation reference'
      },
      {
        name: 'React Documentation',
        type: 'Documentation',
        description: 'Official React documentation',
        url: 'https://react.dev/',
        license: 'MIT License',
        usage: 'Component development reference'
      },
      {
        name: 'Supabase Documentation',
        type: 'Documentation',
        description: 'Official Supabase documentation',
        url: 'https://supabase.com/docs',
        license: 'Apache License 2.0',
        usage: 'Database and authentication implementation'
      },
      {
        name: 'Tailwind CSS Documentation',
        type: 'Documentation',
        description: 'Official Tailwind CSS documentation',
        url: 'https://tailwindcss.com/docs',
        license: 'MIT License',
        usage: 'Styling and design system reference'
      }
    ]
  }
];

const documents = [
  {
    name: 'Student Copyright Checklist',
    description: 'Complete documentation of all copyrighted materials used in this project',
    icon: FileText,
    color: 'bg-primary-500/20 text-primary-300',
    href: '/documents/student-copyright-checklist.pdf'
  },
  {
    name: 'Work Log',
    description: 'Detailed log of all work completed during project development',
    icon: FileText,
    color: 'bg-accent-500/20 text-accent-300',
    href: '/documents/work-log.pdf'
  }
];

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] dark:bg-[#0f172a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      <PageSplineBanner sceneUrl={SPLINE_PAGES_URL || undefined} height="34vh">
        <div className="container-custom w-full text-center">
          <Reveal width="100%">
            <span className="section-label block mb-4 text-[var(--color-accent-soft)]">Project transparency</span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight mb-4">
              Information
            </h1>
            <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto">
              Technology stack, data sources, and legal documents for Monroe Resource Hub.
            </p>
            <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-white/10 border border-white/20">
              <Shield className="h-4 w-4 text-[var(--color-accent-soft)]" />
              <span className="text-xs font-medium text-gray-200">
                CATA TSA 2026 Submission
              </span>
            </div>
          </Reveal>
        </div>
      </PageSplineBanner>

      {/* Required Documents */}
      <section className="section-padding relative z-10">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="section-label block mb-3">Documents</span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-[var(--color-primary)] dark:text-white mb-4 tracking-tight">
              Project documents
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
              TSA competition records and development work logs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {documents.map((doc, index) => {
              const IconComponent = doc.icon;
              return (
                <div key={index} className="bg-[var(--color-surface)] dark:bg-[#1e293b] border border-[var(--color-border)] dark:border-white/10 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:shadow-[var(--color-shadow)]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center",
                      index === 0 ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "bg-[var(--color-accent)]/10 text-[var(--color-accent)]")}>
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-bold text-[var(--color-text)] dark:text-white tracking-tight">{doc.name}</h3>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">PDF download</p>
                    </div>
                  </div>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-6">{doc.description}</p>
                  <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-border)]/30" asChild>
                    <a href={doc.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Framework Statement */}
      <section className="section-padding bg-[var(--color-primary)] relative z-10 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="p-8 md:col-span-1 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-white/10">
                <Code className="h-12 w-12 text-white/80 mb-4" />
                <h3 className="text-lg font-serif font-bold text-white tracking-tight">Built from scratch</h3>
                <p className="text-xs text-white/70 mt-1">Student development team</p>
              </div>
              <div className="p-8 md:col-span-2 space-y-4">
                <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Development approach</h4>
                <p className="text-white/90 leading-relaxed text-sm md:text-base">
                  This platform was built by students without pre-made templates or visual builders. Design and logic were implemented directly for a clear, human-centric experience.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-medium">No templates</span>
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-medium">Custom code</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* References Grid */}
      <section className="section-padding relative z-10">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="section-label block mb-3">Technology & references</span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-[var(--color-primary)] dark:text-white mb-4 tracking-tight">
              Stack & sources
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Frameworks, libraries, and data sources used by Monroe Resource Hub.
            </p>
          </div>

          <div className="space-y-16">
            {references.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <div className="flex items-center gap-4 mb-8">
                  <span className="flex items-center gap-2 text-[var(--color-primary)]">
                    {sectionIndex === 0 && <Code className="h-5 w-5" />}
                    {sectionIndex === 1 && <Image className="h-5 w-5" />}
                    {sectionIndex === 2 && <Globe className="h-5 w-5" />}
                    {sectionIndex === 3 && <Book className="h-5 w-5" />}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[var(--color-text)] dark:text-white tracking-tight">
                    {section.category}
                  </h3>
                  <div className="h-px flex-1 bg-[var(--color-border)]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-[var(--color-surface)] dark:bg-[#1e293b] border border-[var(--color-border)] dark:border-white/10 rounded-2xl p-6 flex flex-col h-full transition-all duration-200 hover:shadow-lg hover:shadow-[var(--color-shadow)]">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h4 className="text-base font-serif font-bold text-[var(--color-text)] dark:text-white tracking-tight">
                          {item.name}
                        </h4>
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-border)]/30 transition-colors">
                            <LinkIcon className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-[var(--color-accent-soft)]/50 text-[#92400e] text-xs font-semibold mb-3 w-fit">
                        {item.type}
                      </span>
                      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4 flex-1">{item.description}</p>
                      <div className="pt-4 border-t border-[var(--color-border)] dark:border-white/10 space-y-2">
                        <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                          <span>License</span>
                          <span className="font-medium text-[var(--color-text)] dark:text-white">{item.license}</span>
                        </div>
                        <p className="text-xs text-[var(--color-text-light)] leading-relaxed">{item.usage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Licensing */}
      <section className="section-padding relative z-10">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto border border-[var(--color-border)] dark:border-white/10 bg-[var(--color-surface)] dark:bg-[#1e293b] p-8 md:p-12 rounded-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <span className="section-label block">Legal & compliance</span>
                <h2 className="text-xl font-serif font-bold text-[var(--color-text)] dark:text-white tracking-tight">
                  Licensing & attribution
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-text)] dark:text-white uppercase tracking-wider mb-2">Images</h4>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Photos are from Unsplash under their license. No restricted or royalty-managed content is used.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-text)] dark:text-white uppercase tracking-wider mb-2">Code & design</h4>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Backend, typography, and layout are original work by the CATA student development team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project meta */}
      <section className="section-padding pb-24 relative z-10">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Platform', val: 'Monroe Resource Hub' },
                { label: 'Organization', val: 'CATA Chapter' },
                { label: 'Region', val: 'Union County, NC' },
                { label: 'Release', val: '2026' }
              ].map((meta, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-[var(--color-surface)] dark:bg-white/5 border border-[var(--color-border)] dark:border-white/10">
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">{meta.label}</p>
                  <p className="text-sm font-bold text-[var(--color-text)] dark:text-white font-serif">{meta.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

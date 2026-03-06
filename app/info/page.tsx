'use client';

import { FileText, Book, Code, Image, Globe, Link as LinkIcon, Download, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen bg-white pt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 overflow-hidden bg-primary-50/20">
        <div className="container-custom section-padding relative z-10 text-center">
          <div className="flex justify-center mb-8">
            <Badge variant="outline" className="px-4 py-1.5 border-primary-200 text-primary-700 bg-white/50 backdrop-blur-sm font-bold uppercase tracking-widest text-[10px]">
              <FileText className="h-3.5 w-3.5 mr-2.5" />
              Project Transparency
            </Badge>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl lg:text-9xl font-bold text-primary-950 mb-8 tracking-tighter leading-tight font-serif"
          >
            Information
          </motion.h1>
          <p className="text-lg md:text-xl mb-12 text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A comprehensive overview of the Monroe Resource Hub architecture, human-led data sources, and legal fulfillment documents.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white border border-gray-100 rounded-full shadow-soft">
            <Shield className="h-4 w-4 text-emerald-600" />
            <span className="text-[10px] font-bold text-primary-900 uppercase tracking-widest">
              Central Academy of Technology and Arts • TSA 2026 Submission
            </span>
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="section-padding bg-white relative z-10">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-950 mb-6 tracking-tight font-serif">
              Project <span className="text-primary-700">Artifacts</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mandatory TSA competition records and exhaustive development work logs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {documents.map((doc, index) => {
              const IconComponent = doc.icon;
              return (
                <div key={index} className="bg-white border border-gray-100 rounded-[2.5rem] p-4 shadow-soft hover:shadow-civic-hover transition-all duration-500 group">
                  <div className="p-8">
                    <div className="flex items-center gap-6 mb-6">
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform",
                        index === 0 ? "bg-primary-50 text-primary-700" : "bg-emerald-50 text-emerald-700")}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl text-primary-950 font-bold font-serif tracking-tight">{doc.name}</h3>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Status: Operational</p>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-10 text-sm">{doc.description}</p>
                    <Button variant="outline" className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-xs border-primary-100 text-primary-700 hover:bg-primary-50 transition-all" asChild href={doc.href} target="_blank" rel="noopener noreferrer">
                      <span className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Asset
                      </span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Framework Statement */}
      <section className="section-padding bg-primary-950 relative z-10 text-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,191,0,0.1),transparent)]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-sm">
              <div className="p-12 md:col-span-1 bg-white/5 border-r border-white/10 flex flex-col justify-center items-center text-center">
                <Code className="h-16 w-16 text-primary-300 mb-6 group-hover:rotate-12 transition-transform duration-500" />
                <h3 className="text-2xl font-bold text-white uppercase tracking-tighter mb-2 font-serif">Original Assembly</h3>
                <p className="text-[10px] text-primary-300 font-bold uppercase tracking-widest">Handcrafted Logic</p>
              </div>
              <div className="p-12 md:col-span-2 space-y-8 bg-black/20">
                <div>
                  <h4 className="text-primary-300 font-bold uppercase tracking-widest text-sm mb-4">Development Protocol</h4>
                  <p className="text-white leading-relaxed italic text-lg pr-4 font-serif">
                    "This platform contains zero pre-made templates or third-party visual builders. Every animation sequence, design token, and logic branch was handcrafted by our student development team to ensure a premium, human-centric experience."
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="outline" className="bg-white/10 border-white/20 text-white">Zero Templates</Badge>
                  <Badge variant="outline" className="bg-white/10 border-white/20 text-white">Custom Architecture</Badge>
                  <Badge variant="outline" className="bg-white/10 border-white/20 text-white">Pure Scripting</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* References Grid */}
      <section className="section-padding bg-gray-50 relative z-10">
        <div className="container-custom">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-6xl font-bold text-primary-950 mb-6 font-serif">Technological <span className="text-primary-700">Ecosystem</span></h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">The industry-standard stack powering the Monroe Resource Hub.</p>
          </div>

          <div className="space-y-32">
            {references.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <div className="flex items-center gap-8 mb-12">
                  <h3 className="text-2xl font-bold text-primary-950 uppercase tracking-widest flex items-center gap-4 font-serif">
                    {sectionIndex === 0 && <Code className="h-7 w-7 text-primary-600" />}
                    {sectionIndex === 1 && <Image className="h-7 w-7 text-primary-600" />}
                    {sectionIndex === 2 && <Globe className="h-7 w-7 text-primary-600" />}
                    {sectionIndex === 3 && <Book className="h-7 w-7 text-primary-600" />}
                    {section.category}
                  </h3>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-white border border-gray-100 rounded-[2rem] shadow-soft hover:shadow-civic-hover transition-all duration-300 flex flex-col h-full group">
                      <div className="p-8 flex-grow">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <h4 className="text-xl text-primary-950 font-bold font-serif tracking-tight group-hover:text-primary-700 transition-colors">
                            {item.name}
                          </h4>
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-primary-700 hover:bg-white border border-transparent hover:border-gray-100 transition-all shadow-sm">
                              <LinkIcon className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <Badge variant="outline" className="mb-6 bg-primary-50/50 border-primary-100 text-primary-700 text-[10px] uppercase font-bold tracking-widest">{item.type}</Badge>
                        <p className="text-sm text-gray-500 leading-relaxed mb-8">{item.description}</p>
                      </div>
                      <div className="p-8 pt-0 mt-auto">
                        <div className="pt-6 border-t border-gray-50 space-y-4">
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-gray-400">Governance:</span>
                            <span className="text-primary-900">{item.license}</span>
                          </div>
                          <div className="text-[11px] text-gray-500 leading-relaxed italic bg-primary-50/30 p-3 rounded-xl border border-primary-50/50">
                            {item.usage}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Licensing Card */}
      <section className="section-padding bg-white relative z-10">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto border border-emerald-100 bg-emerald-50/30 p-12 md:p-20 rounded-[4rem] text-center shadow-soft">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-sm border border-emerald-100">
              <Shield className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-primary-950 uppercase tracking-tighter mb-10 font-serif">
              Compliance & <span className="text-emerald-700">Integrity</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left max-w-4xl mx-auto">
              <div className="space-y-4">
                <h4 className="text-primary-900 font-bold uppercase tracking-widest text-xs">Media Protocol</h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  All photographic assets are sourced from verified Unsplash contributors under their standard license. No restricted royalty-managed content is utilized in this production.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-primary-900 font-bold uppercase tracking-widest text-xs">Intellectual Governance</h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  The logic backend, typography hierarchies, and responsive chapter architectures are original implementations by the CATA student development team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Meta Metrics */}
      <section className="section-padding pb-32 relative z-10">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Platform Name', val: 'Monroe Resource Hub' },
                { label: 'Organization', val: 'CATA Chapter' },
                { label: 'Locale', val: 'Union County, NC' },
                { label: 'Release Level', val: 'Public Beta 2026' }
              ].map((meta, i) => (
                <div key={i} className="text-center group p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300">
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 group-hover:text-primary-600 transition-colors">{meta.label}</p>
                  <p className="text-primary-950 font-bold tracking-tight text-lg group-hover:scale-105 transition-transform font-serif">{meta.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

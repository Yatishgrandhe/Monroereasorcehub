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
    <div className="min-h-screen bg-[#020617] pt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden z-10">
        <div className="container-custom section-padding relative z-10 text-center">
          <div className="flex justify-center mb-10">
            <Badge variant="glass" className="px-6 py-2.5 border-primary-500/20 text-primary-400 font-black uppercase tracking-[0.3em] text-[10px]">
              <FileText className="h-3.5 w-3.5 mr-2.5 animate-pulse" />
              Documentation Center
            </Badge>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl lg:text-9xl font-black text-white mb-8 tracking-tighter leading-none"
          >
            Terminal <span className="text-gradient-logo">Info</span>
          </motion.h1>
          <p className="text-xl md:text-2xl mb-12 text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Full technical transparency on our architecture, data sources, and legal documentation.
          </p>
          <Badge variant="glass" className="bg-white/5 backdrop-blur-sm text-primary-400 border-primary-500/20 shadow-lg font-black uppercase tracking-widest text-[10px] px-6 py-2">
            Central Academy of Technology and Arts TSA 2026
          </Badge>
        </div>
      </section>

      {/* Required Documents */}
      <section className="section-padding bg-slate-900/40 relative z-10">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
              Project <span className="text-primary-500">Artifacts</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Mandatory competition records and development work logs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {documents.map((doc, index) => {
              const IconComponent = doc.icon;
              return (
                <Card key={index} className="glass-card border-white/10 group hover:border-primary-500/30 transition-all duration-500 p-2">
                  <CardHeader className="p-8">
                    <div className="flex items-center gap-5 mb-4 font-black">
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform", doc.color)}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-white font-black tracking-tight">{doc.name}</CardTitle>
                        <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Status: Verified</CardDescription>
                      </div>
                    </div>
                    <p className="text-slate-400 leading-relaxed mb-8">{doc.description}</p>
                    <Button variant="gradient" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs" asChild href={doc.href}>
                      <span className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Asset
                      </span>
                    </Button>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Framework Statement */}
      <section className="section-padding bg-[#020617] relative z-10">
        <div className="container-custom">
          <Card className="max-w-5xl mx-auto glass-card border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent pointer-events-none" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="p-12 md:col-span-1 bg-white/[0.02] border-r border-white/5 flex flex-col justify-center items-center text-center">
                <Code className="h-16 w-16 text-primary-500 mb-6 group-hover:rotate-12 transition-transform duration-500" />
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Source Control</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">100% Original Craft</p>
              </div>
              <div className="p-12 md:col-span-2 space-y-8">
                <div>
                  <h4 className="text-white font-black uppercase tracking-widest text-sm mb-4">Originality Protocol</h4>
                  <p className="text-slate-400 leading-relaxed italic text-lg pr-4">
                    "This platform contains zero pre-made templates or third-party visual builders. Every animation, design token, and logic branch was handcrafted by our student team."
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="glass" className="bg-primary-500/10 border-primary-500/20 text-primary-400">Zero Templates</Badge>
                  <Badge variant="glass" className="bg-accent-500/10 border-accent-500/20 text-accent-400">Pure TypeScript</Badge>
                  <Badge variant="glass" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">Custom Architecture</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* References Grid */}
      <section className="section-padding bg-slate-900/20 relative z-10">
        <div className="container-custom">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Integrated <span className="text-gradient-logo">Systems</span></h2>
            <p className="text-xl text-slate-400 mt-4 font-medium">The technological ecosystem powering the hub.</p>
          </div>

          <div className="space-y-32">
            {references.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <div className="flex items-center gap-6 mb-12">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                  <h3 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-4">
                    {sectionIndex === 0 && <Code className="h-6 w-6 text-primary-400" />}
                    {sectionIndex === 1 && <Image className="h-6 w-6 text-primary-400" />}
                    {sectionIndex === 2 && <Globe className="h-6 w-6 text-primary-400" />}
                    {sectionIndex === 3 && <Book className="h-6 w-6 text-primary-400" />}
                    {section.category}
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item, itemIndex) => (
                    <Card key={itemIndex} className="glass-card border-white/5 hover:border-primary-500/30 group transition-all duration-300">
                      <CardHeader className="p-8 pb-0">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <CardTitle className="text-xl text-white font-black tracking-tight group-hover:text-primary-400 transition-colors">
                            {item.name}
                          </CardTitle>
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white hover:bg-primary-500 transition-all">
                              <LinkIcon className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <Badge variant="glass" className="mb-4 bg-white/5 border-white/10 text-[10px] uppercase font-bold tracking-widest">{item.type}</Badge>
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 h-10">{item.description}</p>
                      </CardHeader>
                      <CardContent className="p-8 pt-6 space-y-4 border-t border-white/5 mt-6">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-600">License:</span>
                          <span className="text-slate-300">{item.license}</span>
                        </div>
                        <div className="text-xs text-slate-400 leading-relaxed italic">
                          {item.usage}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Licensing Card */}
      <section className="section-padding bg-[#020617] relative z-10">
        <div className="container-custom">
          <Card className="max-w-5xl mx-auto border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-3xl p-4 rounded-[3rem] overflow-hidden">
            <CardContent className="p-12 md:p-20 text-center">
              <Shield className="h-20 w-20 text-emerald-400 mx-auto mb-10 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8">
                Strict Compliance <span className="text-emerald-400">Protocol</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left max-w-4xl mx-auto">
                <div className="space-y-4">
                  <h4 className="text-white font-black uppercase tracking-widest text-xs">Media Licensing</h4>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    All visual assets are sourced from Unsplash under their standard license. No restricted royalty-managed content is utilized in this production.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white font-black uppercase tracking-widest text-xs">Intellectual Integrity</h4>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    Logic systems, custom shader-like mesh patterns, and responsive architecture are proprietary implementations by the CATA development chapter.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Project Meta Metrics */}
      <section className="section-padding pb-32 relative z-10">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Project Name', val: 'Monroe Hub' },
                { label: 'Organization', val: 'CATA TSA' },
                { label: 'Locale', val: 'North Carolina' },
                { label: 'Build Version', val: '2026.1.0' }
              ].map((meta, i) => (
                <div key={i} className="text-center group">
                  <p className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-600 mb-2 group-hover:text-primary-500 transition-colors">{meta.label}</p>
                  <p className="text-white font-bold tracking-tight text-lg group-hover:scale-105 transition-transform">{meta.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

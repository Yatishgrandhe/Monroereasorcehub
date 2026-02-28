import { FileText, Book, Code, Image, Globe, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Info | Monroe Resource Hub',
  description: 'Project information, credits, and documentation for Monroe Resource Hub.',
};

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
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#020617] z-0">
          <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary-900/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-slate-900/10 rounded-full blur-[100px]" />
        </div>
        <div className="container-custom section-padding relative z-10 text-center">
          <div className="flex justify-center mb-10">
            <Badge variant="glass" className="px-6 py-2.5 bg-white/[0.05] border-white/10 text-primary-400 font-black uppercase tracking-[0.3em] text-[10px] backdrop-blur-xl">
              <FileText className="h-3.5 w-3.5 mr-2.5 animate-pulse" />
              Documentation Center
            </Badge>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none overflow-visible">
            <span className="text-gradient-logo inline-block pr-2">Info</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-slate-400 max-w-3xl mx-auto leading-relaxed">
            We wanted to be transparent about everything we used to build this site. Here's the full list of tools and sources.
          </p>
          <Badge variant="primary" className="bg-white/90 backdrop-blur-sm text-slate-900 border-white/80 shadow-lg font-semibold">
            Central Academy of Technology and Arts TSA Chapter
          </Badge>
        </div>
      </section>

      {/* Required Documents */}
      <section className="section-padding bg-slate-800/20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Competition Docs
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Competition documents and all the project stuff we put together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {documents.map((doc, index) => {
              const IconComponent = doc.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow bg-white/5 border-white/10">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-12 h-12 ${doc.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl text-white">{doc.name}</CardTitle>
                    </div>
                    <CardDescription className="text-slate-400">{doc.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10" asChild href={doc.href}>
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Open PDF
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Framework Statement */}
      <section className="section-padding bg-[#020617]">
        <div className="container-custom">
          <Card className="max-w-4xl mx-auto bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-2xl">
                <Code className="h-6 w-6 text-primary-400" />
                Originality & Frameworks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 text-slate-400 leading-relaxed">
                <p>
                  This platform was architected using Next.js 16, React 19, TypeScript 5, and Tailwind CSS 3.
                </p>
                <div className="space-y-4">
                  <p className="font-bold text-primary-400">
                    Guarantee of Originality:
                  </p>
                  <p>
                    Developed entirely by the CATA TSA Chapter, this project contains zero pre-made themes or templates.
                    Every design token, component intersection, and logic branch was handcrafted by our student team to ensure
                    a truly unique community experience.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* References */}
      <section className="section-padding bg-slate-800/10">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white">Credits & Tools</h2>
          </div>

          <div className="space-y-16">
            {references.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  {sectionIndex === 0 && <Code className="h-6 w-6 text-primary-400" />}
                  {sectionIndex === 1 && <Image className="h-6 w-6 text-primary-400" />}
                  {sectionIndex === 2 && <Globe className="h-6 w-6 text-primary-400" />}
                  {sectionIndex === 3 && <Book className="h-6 w-6 text-primary-400" />}
                  {section.category}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.items.map((item, itemIndex) => (
                    <Card key={itemIndex} className="bg-white/5 border-white/10 hover:border-primary-500/30 transition-colors">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-lg text-white flex items-center gap-2">
                              {item.name}
                              {item.url && (
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-white transition-colors">
                                  <LinkIcon className="h-4 w-4" />
                                </a>
                              )}
                            </CardTitle>
                            <CardDescription className="text-slate-500">{item.description}</CardDescription>
                          </div>
                          <Badge variant="glass" className="bg-white/5 border-white/10">{item.type}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <span className="opacity-60">License:</span>
                          <span className="font-medium text-slate-200">{item.license}</span>
                        </div>
                        <div className="text-sm text-slate-300">
                          <span className="opacity-60">Usage:</span> {item.usage}
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

      {/* Copyright Notice */}
      <section className="section-padding bg-[#020617]">
        <div className="container-custom">
          <Card className="max-w-4xl mx-auto border border-primary-500/30 bg-primary-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-6 w-6 text-primary-400" />
                Copyright & Licensing
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 leading-relaxed space-y-4">
              <p>
                All copyrighted materials used in this website have been properly documented and used in accordance
                with their respective licenses. Documentation is maintained in the Student Copyright Checklist.
              </p>
              <p>
                <strong>Stock Media:</strong> All images from Unsplash are used under the Unsplash License (royalty-free for commercial use).
              </p>
              <p>
                <strong>Original Intellectual Property:</strong> All other content, including the 3D interaction logic and custom design patterns,
                are original works of the Central Academy of Technology and Arts TSA Chapter.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Project Information */}
      <section className="section-padding bg-slate-900/10">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-xl">Project Meta</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-400">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest font-bold opacity-60">Project Name</p>
                  <p className="text-white font-medium">Monroe Resource Hub</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest font-bold opacity-60">Organization</p>
                  <p className="text-white font-medium">CATA TSA Chapter</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest font-bold opacity-60">Location</p>
                  <p className="text-white font-medium">Monroe, NC</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest font-bold opacity-60">Launch Year</p>
                  <p className="text-white font-medium">2026 (Rebuilt)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

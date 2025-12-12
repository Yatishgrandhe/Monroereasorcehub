import { FileText, Book, Code, Image, Globe, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const references = [
  {
    category: 'Web Frameworks & Libraries',
    items: [
      {
        name: 'Next.js 15.5.5',
        type: 'Framework',
        description: 'React framework for production',
        url: 'https://nextjs.org/',
        license: 'MIT License',
        usage: 'Used as the core framework for building the web application'
      },
      {
        name: 'React 19.1.0',
        type: 'Library',
        description: 'JavaScript library for building user interfaces',
        url: 'https://react.dev/',
        license: 'MIT License',
        usage: 'Core UI library for all components'
      },
      {
        name: 'Tailwind CSS 3.4.18',
        type: 'Framework',
        description: 'Utility-first CSS framework',
        url: 'https://tailwindcss.com/',
        license: 'MIT License',
        usage: 'Used for all styling and responsive design'
      },
      {
        name: 'TypeScript 5',
        type: 'Language',
        description: 'JavaScript with syntax for types',
        url: 'https://www.typescriptlang.org/',
        license: 'Apache License 2.0',
        usage: 'Type-safe development across the entire application'
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
    color: 'bg-primary-100 text-primary-800',
    href: '/documents/student-copyright-checklist.pdf'
  },
  {
    name: 'Work Log',
    description: 'Detailed log of all work completed during project development',
    icon: FileText,
    color: 'bg-accent-100 text-accent-800',
    href: '/documents/work-log.pdf'
  }
];

export default function ReferencePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                <FileText className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Project Info & Sources
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              We wanted to be transparent about everything we used to build this site. Here's the full list of tools and sources.
            </p>
            <Badge variant="primary" className="bg-white/50 backdrop-blur-sm text-white border-white/50 shadow-lg font-semibold">
              Central Academy of Technology and Arts TSA Chapter
            </Badge>
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Competition Docs
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Competition documents and all the project stuff we put together
            </p>
            <p className="text-sm text-secondary-500 mt-4 max-w-2xl mx-auto">
              Click "Open PDF" to view the PDF document in a new tab. You can download it from there.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {documents.map((doc, index) => {
              const IconComponent = doc.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-12 h-12 ${doc.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{doc.name}</CardTitle>
                    </div>
                    <CardDescription>{doc.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium rounded-lg border border-secondary-300 bg-white text-secondary-700 hover:bg-secondary-50 transition-colors"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Open PDF
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Framework Statement */}
      <section className="section-padding">
        <div className="container-custom">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-6 w-6 text-primary-600" />
                How it was done
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-secondary-700">
                <p>
                  When this website was built, it used the Next.js framework (15.5.5), React (19.1.0), TypeScript 5, and Tailwind CSS 3.4.18.
                </p>
                <div className="text-secondary-700 space-y-4">
                  <p className="font-semibold text-primary-700">
                    Guarantee of Originality:
                  </p>
                  <p>
                    Just so you know, our team at Central Academy of Technology and Arts TSA Chapter built this whole thing ourselves. We didn't grab any pre-made themes or templates - everything you see, from how it looks to how it works, we put together ourselves. Every single piece of code and design came from our team.
                  </p>
                  <p>
                    Our design and how everything works together are completely unique, even though we use open source libraries (like the ones below) to build on the work of others. There were no pre-made templates used to make this website, so this proves it.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* References */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Credits & Tools
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Complete list of all information sources, libraries, and materials used
            </p>
          </div>

          <div className="space-y-12">
            {references.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
                  {sectionIndex === 0 && <Code className="h-6 w-6 text-primary-600" />}
                  {sectionIndex === 1 && <Image className="h-6 w-6 text-primary-600" />}
                  {sectionIndex === 2 && <Globe className="h-6 w-6 text-primary-600" />}
                  {sectionIndex === 3 && <Book className="h-6 w-6 text-primary-600" />}
                  {section.category}
                </h3>

                <div className="grid grid-cols-1 gap-6">
                  {section.items.map((item, itemIndex) => (
                    <Card key={itemIndex}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                              {item.name}
                              {item.url && (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary-600 hover:text-primary-700"
                                >
                                  <LinkIcon className="h-4 w-4" />
                                </a>
                              )}
                            </CardTitle>
                            <CardDescription className="mt-1">{item.description}</CardDescription>
                          </div>
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-secondary-600">License:</span>
                          <span className="font-medium text-secondary-900">{item.license}</span>
                        </div>
                        <div className="text-sm text-secondary-700">
                          <span className="text-secondary-600">Usage:</span>{' '}
                          {item.usage}
                        </div>
                        {item.permission && (
                          <div className="text-sm bg-accent-50 p-3 rounded-lg border border-accent-200">
                            <span className="font-medium text-secondary-900">Permission:</span>{' '}
                            <span className="text-secondary-700">{item.permission}</span>
                          </div>
                        )}
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
      <section className="section-padding">
        <div className="container-custom">
          <Card className="max-w-4xl mx-auto border-2 border-primary-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary-600" />
                Copyright Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-secondary-700">
              <p>
                All copyrighted materials used in this website have been properly documented and used in accordance
                with their respective licenses. Where necessary, written permission has been obtained and is included
                in the Student Copyright Checklist linked above.
              </p>
              <p>
                <strong>Open Source Libraries:</strong> All open-source libraries used in this project are licensed
                under permissive licenses (MIT, Apache, ISC) that allow commercial use, modification, and distribution.
              </p>
              <p>
                <strong>Stock Images:</strong> All images from Unsplash are used under the Unsplash License, which
                provides free use for commercial and non-commercial purposes without attribution requirements.
              </p>
              <p>
                <strong>Original Content:</strong> All other content, design elements, and code not listed above
                are original works created by the Central Academy of Technology and Arts TSA Chapter team specifically for this project.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Project Information */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-secondary-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-secondary-900">Project Name:</span>
                    <p>Monroe Resource Hub</p>
                  </div>
                  <div>
                    <span className="font-semibold text-secondary-900">Organization:</span>
                    <p>Central Academy of Technology and Arts TSA Chapter</p>
                  </div>
                  <div>
                    <span className="font-semibold text-secondary-900">Location:</span>
                    <p>Monroe, North Carolina</p>
                  </div>
                  <div>
                    <span className="font-semibold text-secondary-900">Project Year:</span>
                    <p>2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}


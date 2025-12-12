// career center page - old implementation
import Link from 'next/link';
import { Briefcase, FileText, Target, Users, Sparkles, ArrowRight, CheckCircle, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// features list - legacy data
const features = [
  {
    icon: FileText,
    title: 'Resume Builder',
    description: 'Put together a professional resume with some help from AI. It\'ll suggest summaries, bullet points, and skills that actually make sense.',
    href: '/career/resume-builder',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Target,
    title: 'Job Application Helper',
    description: 'Get help writing cover letters that actually fit the job you\'re applying for. We\'ll also give you interview questions that match what they\'re looking for.',
    href: '/career/job-assistant',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Briefcase,
    title: 'Local Job Board',
    description: 'Check out what jobs are available right here in Monroe and the surrounding Union County area. No need to look all over the place.',
    href: '/career/jobs',
    color: 'bg-purple-100 text-purple-600'
  }
];

// benefits array - temp fix
const benefits = [
  'Resume help that actually works',
  'Cover letters that fit the job',
  'Interview questions that make sense',
  'Jobs right here in Monroe',
  'Tips and advice from people who know',
  'Templates that look professional',
  'Export your resume as a PDF',
  'Save as many resumes as you need'
];

// testimonials - needs review
const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Developer',
    company: 'Monroe Tech Solutions',
    content: 'The resume builder actually helped me get the job I wanted! The suggestions made sense and the cover letter tool saved me a ton of time.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Registered Nurse',
    company: 'Atrium Health Union',
    content: 'I\'m pretty new to all this job stuff, so the interview questions really helped me out. I actually felt ready when I went in there.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Elementary Teacher',
    company: 'Union County Public Schools',
    content: 'The job board made it way easier to find stuff around here. The application helper thing really made a difference - I think it helped me stand out.',
    rating: 5
  }
];

// main page component - hack
export default function CareerCenterPage() {
  return (
    <div className="min-h-screen">
      {/* hero section - legacy */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                <Briefcase className="h-10 w-10" />
              </div>
            </div>
            <h1 className="title-hero mb-6">
              Career Help
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed font-sans">
              Looking for work in Monroe? We\'ve got tools to help you put together a solid resume, 
              write a cover letter that actually works, and see what jobs are available around here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="bg-white/20 border-white/30 hover:bg-white/30 force-white-text" style={{ color: 'white' }} asChild>
                <Link href="/career/resume-builder" style={{ color: 'white' }}>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Build My Resume
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="hover:bg-white/20 force-white-text" style={{ color: 'white' }} asChild>
                <Link href="/career/jobs" style={{ color: 'white' }}>
                  <Briefcase className="mr-2 h-5 w-5" />
                  See Local Jobs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="title-section mb-4">
              How We Can Help
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto font-sans">
              Free tools to help you take the next step in your career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} hover className="text-center group">
                  <CardHeader>
                    <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-6">
                      {feature.description}
                    </CardDescription>
                    <Button variant="primary" className="w-full force-white-text" style={{ color: 'white' }} asChild>
                      <Link href={feature.href} style={{ color: 'white' }}>
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="title-section mb-6">
                Why Use This?
              </h2>
              <p className="text-lg text-secondary-600 mb-8 font-sans">
                We built these tools specifically for folks in Monroe.
                Whether you\'re starting out or looking for a change, we\'re here to support you.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success-600 flex-shrink-0" />
                    <span className="text-secondary-700 font-sans">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-soft">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-4 font-sans">
                  Success Rate
                </h3>
                <div className="text-4xl font-bold text-primary-600 mb-2 font-sans">85%</div>
                <p className="text-secondary-600 font-sans">
                  of people feel more confident applying for jobs after using our tools
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="title-section mb-4">
              Real Stories
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto font-sans">
              Hear from neighbors who found their next opportunity with a little help from us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} hover>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-secondary-700 mb-4 italic font-sans">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-secondary-900 font-sans">{testimonial.name}</p>
                    <p className="text-sm text-secondary-600 font-sans">{testimonial.role}</p>
                    <p className="text-sm text-primary-600 font-sans">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="title-section mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-white/90 font-sans">
              Join hundreds of Monroe residents who have used these tools to land their dream jobs.
              Let's get to work on your future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="bg-white/20 border-white/30 hover:bg-white/30 force-white-text" style={{ color: 'white' }} asChild>
                <Link href="/career/resume-builder" style={{ color: 'white' }}>
                  <FileText className="mr-2 h-5 w-5" />
                  Build My Resume
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="hover:bg-white/20 force-white-text" style={{ color: 'white' }} asChild>
                <Link href="/career/job-assistant" style={{ color: 'white' }}>
                  <Target className="mr-2 h-5 w-5" />
                  Get Job Help
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

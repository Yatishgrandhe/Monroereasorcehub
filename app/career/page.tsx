// career center page - old implementation
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, FileText, Target, Users, Sparkles, ArrowRight, CheckCircle, Star, TrendingUp, Info, LogIn, Database } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
            <p className="text-xl md:text-2xl mb-6 text-white/90 max-w-3xl mx-auto leading-relaxed font-sans">
              Looking for work in Monroe? We've got tools to help you put together a solid resume, 
              write a cover letter that actually works, and see what jobs are available around here.
            </p>
            
            {/* Login Notice */}
            <div className="mb-8 max-w-2xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-semibold mb-1">No Login Required</p>
                      <p className="text-sm text-white/90">
                        All tools are available to everyone. Creating an account is helpful for saving your work across devices, but you can use everything right away without signing in. Your data will be saved in your browser's local storage.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/career/resume-builder" 
                className="btn btn-outline btn-lg text-white inline-flex items-center justify-center bg-white/20 border-white/30 hover:bg-white/30 force-white-text"
                style={{ color: 'white' }}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Build My Resume
              </Link>
              <Link 
                href="/career/jobs" 
                className="btn btn-ghost btn-lg text-white inline-flex items-center justify-center hover:bg-white/20 force-white-text"
                style={{ color: 'white' }}
              >
                <Briefcase className="mr-2 h-5 w-5" />
                See Local Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How to Access Resources Section */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="title-section mb-4">
                How to Access These Resources
              </h2>
              <p className="text-xl text-secondary-600 max-w-3xl mx-auto font-sans">
                Getting started is simple - no account needed.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Resume Builder</h3>
                    <p className="text-secondary-600 mb-3">
                      Click "Build My Resume" above or use the button below. Your resume data is automatically saved in your browser's local storage, so you can come back anytime.
                    </p>
                    <Link 
                      href="/career/resume-builder"
                      className="btn btn-primary btn-sm text-white inline-flex items-center justify-center"
                    >
                      Start Building
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Job Application Helper</h3>
                    <p className="text-secondary-600 mb-3">
                      {user ? 'Access your saved applications and get personalized help.' : 'Get AI-powered help with cover letters and interview prep. Your data is saved in your browser\'s local storage.'}
                    </p>
                    <Link 
                      href="/career/job-assistant"
                      className="btn btn-primary btn-sm text-white inline-flex items-center justify-center"
                    >
                      {user ? "Go to Helper" : "Get Started"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Local Job Board</h3>
                    <p className="text-secondary-600 mb-3">
                      Browse jobs available in Monroe and Union County. No account needed to view listings.
                    </p>
                    <Link 
                      href="/career/jobs"
                      className="btn btn-primary btn-sm text-white inline-flex items-center justify-center"
                    >
                      View Jobs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-primary-50 border-primary-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Data Storage</h3>
                    <p className="text-secondary-600 mb-3">
                      {user ? (
                        <>Your data is saved securely in your account and synced across all your devices.</>
                      ) : (
                        <>As a guest, your resume data is saved in your browser's local storage. This means your data stays on your device and won't sync across devices. <strong>Consider creating an account</strong> to access your work from anywhere.</>
                      )}
                    </p>
                    {!user && (
                      <Link 
                        href="/auth/signup"
                        className="btn btn-outline btn-sm inline-flex items-center justify-center"
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Create Account
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
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
                    <Link 
                      href={feature.href} 
                      className="btn btn-primary w-full text-white inline-flex items-center justify-center force-white-text"
                      style={{ color: 'white' }}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding">
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
              <Link 
                href="/career/resume-builder" 
                className="btn btn-outline btn-lg text-white inline-flex items-center justify-center bg-white/20 border-white/30 hover:bg-white/30 force-white-text"
                style={{ color: 'white' }}
              >
                <FileText className="mr-2 h-5 w-5" />
                Build My Resume
              </Link>
              <Link 
                href="/career/job-assistant" 
                className="btn btn-ghost btn-lg text-white inline-flex items-center justify-center hover:bg-white/20 force-white-text"
                style={{ color: 'white' }}
              >
                <Target className="mr-2 h-5 w-5" />
                Get Job Help
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

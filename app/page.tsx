// main page component
import Link from 'next/link';
import { Search, Heart, Users, Calendar, Briefcase, BookOpen, Home, Utensils, Stethoscope, GraduationCap, Building, Baby, UserCheck, Brain, Scale, Car, MapPin, Phone, Globe, ArrowRight, Sparkles, Activity, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SpotlightCarousel } from '@/components/resources/SpotlightCarousel';
import { ImageSlideshow } from '@/components/home/ImageSlideshow';
import { createClient } from '@/lib/supabase/server';

// category definitions - legacy data
const categories = [
  {
    name: 'Food Assistance',
    icon: Utensils,
    description: 'Places to get food when you need it - food banks, pantries, and programs that serve meals',
    href: '/resources?category=Food Assistance',
    color: 'bg-coral-100 text-coral-600',
    border: 'border-coral-200',
    gradient: 'from-coral-50 to-white'
  },
  {
    name: 'Healthcare',
    icon: Stethoscope,
    description: 'Healthcare options in Monroe - doctors, clinics, and programs to help you stay healthy',
    href: '/resources?category=Healthcare',
    color: 'bg-primary-100 text-primary-600',
    border: 'border-primary-200',
    gradient: 'from-primary-50 to-white'
  },
  {
    name: 'Education',
    icon: GraduationCap,
    description: 'Schools, tutoring help, and educational stuff for kids and adults',
    href: '/resources?category=Education',
    color: 'bg-accent-100 text-accent-600',
    border: 'border-accent-200',
    gradient: 'from-accent-50 to-white'
  },
  {
    name: 'Housing',
    icon: Home,
    description: 'Help finding a place to live, shelters if you need one, and assistance with rent',
    href: '/resources?category=Housing',
    color: 'bg-teal-100 text-teal-600',
    border: 'border-teal-200',
    gradient: 'from-teal-50 to-white'
  },
  {
    name: 'Family Support',
    icon: Baby,
    description: 'Services for families, help finding childcare, and programs to support parents',
    href: '/resources?category=Family Support',
    color: 'bg-coral-100 text-coral-600',
    border: 'border-coral-200',
    gradient: 'from-coral-50 to-white'
  },
  {
    name: 'Senior Services',
    icon: UserCheck,
    description: 'Programs and services specifically for older adults and seniors',
    href: '/resources?category=Senior Services',
    color: 'bg-primary-100 text-primary-600',
    border: 'border-primary-200',
    gradient: 'from-primary-50 to-white'
  },
  {
    name: 'Mental Health',
    icon: Brain,
    description: 'Counseling, therapy options, and support for mental health and wellness',
    href: '/resources?category=Mental Health',
    color: 'bg-accent-100 text-accent-600',
    border: 'border-accent-200',
    gradient: 'from-accent-50 to-white'
  },
  {
    name: 'Legal Aid',
    icon: Scale,
    description: 'Help with legal stuff and people who can advocate for you',
    href: '/resources?category=Legal Aid',
    color: 'bg-teal-100 text-teal-600',
    border: 'border-teal-200',
    gradient: 'from-teal-50 to-white'
  },
  {
    name: 'Employment',
    icon: Briefcase,
    description: 'Job training programs, help finding work, and career services',
    href: '/resources?category=Employment',
    color: 'bg-coral-100 text-coral-600',
    border: 'border-coral-200',
    gradient: 'from-coral-50 to-white'
  },
  {
    name: 'Transportation',
    icon: Car,
    description: 'Public transportation options and help getting around Monroe',
    href: '/resources?category=Transportation',
    color: 'bg-primary-100 text-primary-600',
    border: 'border-primary-200',
    gradient: 'from-primary-50 to-white'
  }
];

// Icon component for stats to avoid import errors
const DatabaseIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
);

const stats = [
  { label: 'Resources Listed', value: '50+', icon: DatabaseIcon, color: 'text-primary-600', bg: 'bg-primary-100' },
  { label: 'Ways to Help', value: '10', icon: BookOpen, color: 'text-accent-600', bg: 'bg-accent-100' },
  { label: 'Events this Month', value: '15+', icon: Calendar, color: 'text-coral-600', bg: 'bg-coral-100' },
  { label: 'People Helped', value: '1000+', icon: Users, color: 'text-teal-600', bg: 'bg-teal-100' }
];

const features = [
  {
    icon: Search,
    title: 'Find Help',
    description: 'We went ahead and collected all the local resources we could find. Honestly, we tried our best to keep it simple - nobody likes clicking through a million pages just to find one thing, right?',
    color: 'text-primary-600',
    bg: 'bg-primary-50'
  },
  {
    icon: Briefcase,
    title: 'Grow Your Career',
    description: 'We put together some tools that are completely free - no catch, no hidden fees. They\'ll help you build a resume and navigate the whole job application process. Seriously, just try them out.',
    color: 'text-accent-600',
    bg: 'bg-accent-50'
  },
  {
    icon: Calendar,
    title: 'Join In',
    description: 'Want to know what\'s happening around here? We\'ve got a calendar that shows all the local events, workshops, and basically anything interesting going on in Monroe.',
    color: 'text-coral-600',
    bg: 'bg-coral-50'
  },
  {
    icon: Heart,
    title: 'Give Back',
    description: 'Feeling like you want to give back? We\'ve compiled a bunch of volunteer opportunities and other ways you can get involved and actually make a difference for people here in Monroe.',
    color: 'text-teal-600',
    bg: 'bg-teal-50'
  }
];

// fetch spotlight resources - needs optimization
async function getSpotlightedResources() {
  const supabase = await createClient();

  // query spotlight items
  const { data: resources, error } = await supabase
    .from('resources')
    .select(`
      *,
      categories (
        id,
        name,
        icon
      )
    `)
    .eq('is_approved', true)
    .eq('is_spotlighted', true)
    .order('created_at', { ascending: false })
    .limit(3);

  // error handling
  if (error) {
    console.error('Error fetching spotlighted resources:', error);
    return [];
  }

  return resources || [];
}

export default async function HomePage() {
  const spotlightedResources = await getSpotlightedResources();

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 z-0"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary-200/30 to-transparent rounded-bl-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-coral-200/30 to-transparent rounded-tr-full blur-3xl"></div>

        <div className="relative container-custom pt-24 pb-20 md:pt-32 md:pb-24 z-10">
          <div className="max-w-5xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-primary-200 bg-white/50 backdrop-blur-sm text-primary-700 shadow-sm animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2 text-primary-500" />
              Connecting Our Community
            </Badge>

            <h1 className="title-hero mb-6 animate-slide-up">
              Welcome to Monroe's
              <span className="block text-gradient-logo mt-2">Resource Hub</span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-secondary-600 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              So here's the thing - we spent a lot of time gathering up everything Monroe has to offer and putting it all in one place. Need help with something? Looking for opportunities? Or maybe you just want to see what's going on around town? You've come to the right spot, honestly.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 via-accent-400 to-coral-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-xl shadow-xl flex items-center p-2">
                  <Search className="ml-4 h-6 w-6 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    className="w-full px-4 py-3 text-lg bg-transparent border-none focus:ring-0 text-secondary-900 placeholder-secondary-400"
                  />
                  <Button variant="gradient" size="lg" className="rounded-lg px-8">
                    Search
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Button size="lg" variant="primary" className="shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40" asChild href="/resources">
                Browse Resources
              </Button>
              <Button size="lg" variant="outline" className="bg-white hover:bg-secondary-50" asChild href="/submit-resource">
                Add a Resource
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-secondary-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="p-6 rounded-2xl bg-secondary-50 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-secondary-200 group text-center">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl md:text-4xl font-bold mb-1 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-secondary-600 font-medium text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Image Slideshow Section */}
      <section className="section-padding bg-secondary-50 overflow-hidden">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="title-section mb-4">What's Going On Around Town</h2>
              <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Take a look at what's going on in Monroe - there's actually quite a bit happening. Plus, we've rounded up all the different services available for people who live here.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white">
            <ImageSlideshow />
          </div>
        </div>
      </section>

      {/* Community Spotlight */}
      <section className="section-padding bg-white relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-accent-100 text-accent-700 hover:bg-accent-200">Featured</Badge>
              <h2 className="title-section mb-4">
                Local Organizations Making a Difference
              </h2>
              <p className="text-xl text-secondary-600">
                These are the groups and organizations that are actually out there doing the work. They're helping people in Monroe every single day, and honestly, they deserve some recognition.
              </p>
            </div>
            <Button variant="outline" asChild href="/resources?featured=true">
              View All Featured
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <SpotlightCarousel resources={spotlightedResources} />
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section-padding section-gradient">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="title-section mb-4">
              Find What You Need
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              We went ahead and sorted everything into categories. That way you don't have to spend forever searching through stuff - you can just jump right to what you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link key={category.name} href={category.href} className="group">
                  <div className={`h-full bg-gradient-to-br ${category.gradient} p-6 rounded-2xl border ${category.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}>
                    <div className={`w-14 h-14 ${category.color} bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-secondary-600 line-clamp-2">
                      {category.description}
                    </p>

                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary-600">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="bg-white" asChild href="/resources">
              View All Categories
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="title-section mb-4">
              How We're Here to Help
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              We've got tools and resources that cover pretty much everything you might need - from finding help to building your career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group relative p-8 rounded-3xl bg-secondary-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-secondary-100">
                  <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-logo relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-sm">
              Ready to Get Started?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-white/90 font-medium">
              In Monroe, many residents already utilize this resource; as a result, they have located the resources they needed, explored new resource opportunities, and stayed up-to-date with the happenings of their community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-secondary-50 border-none shadow-lg hover:shadow-xl" asChild href="/resources">
                <Search className="mr-2 h-5 w-5" />
                Find Resources
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white/40 hover:bg-white/10 force-white-text" asChild href="/career/resume-builder">
                <Briefcase className="mr-2 h-5 w-5" />
                Build Your Resume
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
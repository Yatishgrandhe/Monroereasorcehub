// main page component
import Link from 'next/link';
import { Search, Heart, Users, Calendar, Briefcase, BookOpen, Home, Utensils, Stethoscope, GraduationCap, Building, Baby, UserCheck, Brain, Scale, Car, MapPin, Phone, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SpotlightCarousel } from '@/components/resources/SpotlightCarousel';
import { createClient } from '@/lib/supabase/server';

// category definitions - legacy data
const categories = [
  {
    name: 'Food Assistance',
    icon: Utensils,
    description: 'Food banks, pantries, and meal programs',
    href: '/resources?category=Food Assistance',
    color: 'bg-coral-100 text-coral-800'
  },
  {
    name: 'Healthcare',
    icon: Stethoscope,
    description: 'Medical services, clinics, and health programs',
    href: '/resources?category=Healthcare',
    color: 'bg-primary-100 text-primary-800'
  },
  {
    name: 'Education',
    icon: GraduationCap,
    description: 'Schools, tutoring, and educational programs',
    href: '/resources?category=Education',
    color: 'bg-accent-100 text-accent-800'
  },
  {
    name: 'Housing',
    icon: Home,
    description: 'Housing assistance, shelters, and rental help',
    href: '/resources?category=Housing',
    color: 'bg-teal-100 text-teal-800'
  },
  {
    name: 'Family Support',
    icon: Baby,
    description: 'Family services, childcare, and support programs',
    href: '/resources?category=Family Support',
    color: 'bg-coral-100 text-coral-800'
  },
  {
    name: 'Senior Services',
    icon: UserCheck,
    description: 'Services for seniors and elderly care',
    href: '/resources?category=Senior Services',
    color: 'bg-primary-100 text-primary-800'
  },
  {
    name: 'Mental Health',
    icon: Brain,
    description: 'Counseling, therapy, and mental health support',
    href: '/resources?category=Mental Health',
    color: 'bg-accent-100 text-accent-800'
  },
  {
    name: 'Legal Aid',
    icon: Scale,
    description: 'Legal assistance and advocacy services',
    href: '/resources?category=Legal Aid',
    color: 'bg-teal-100 text-teal-800'
  },
  {
    name: 'Employment',
    icon: Briefcase,
    description: 'Job training, placement, and career services',
    href: '/resources?category=Employment',
    color: 'bg-coral-100 text-coral-800'
  },
  {
    name: 'Transportation',
    icon: Car,
    description: 'Public transit and transportation assistance',
    href: '/resources?category=Transportation',
    color: 'bg-primary-100 text-primary-800'
  }
];

const stats = [
  { label: 'Community Resources', value: '50+' },
  { label: 'Categories', value: '10' },
  { label: 'Events Monthly', value: '15+' },
  { label: 'Families Served', value: '1000+' }
];

const features = [
  {
    icon: Search,
    title: 'Find Resources',
    description: 'Search and filter through our comprehensive directory of community resources and services.'
  },
  {
    icon: Briefcase,
    title: 'Career Support',
    description: 'AI-powered resume builder and job application assistant to help you advance your career.'
  },
  {
    icon: Calendar,
    title: 'Community Events',
    description: 'Stay connected with local events, workshops, and community gatherings.'
  },
  {
    icon: Heart,
    title: 'Get Involved',
    description: 'Discover volunteer opportunities and ways to give back to your community.',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-logo text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="title-hero mb-6">
              Welcome to Monroe
              <span className="block text-gradient-coral">Resource Hub</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Your one-stop destination for community resources, services, and opportunities in Monroe, North Carolina. 
              Find help, discover events, and connect with your community.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search for resources, services, or organizations..."
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-0 shadow-lg text-secondary-900 placeholder-secondary-500 focus:ring-2 focus:ring-white/50"
                />
                <Button variant="gradient" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  Search
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30" asChild href="/resources">
                Browse All Resources
              </Button>
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/20" asChild href="/submit-resource">
                Submit a Resource
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 section-gradient">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient-logo mb-2">
                  {stat.value}
                </div>
                <div className="text-secondary-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Spotlight */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Community Spotlight
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Discover featured organizations making a difference in our community
            </p>
          </div>
          <SpotlightCarousel resources={spotlightedResources} />
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section-padding section-gradient">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Find the resources you need by exploring our organized categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.name} glow className="text-center group">
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {category.description}
                    </CardDescription>
                    <Button variant="outline" size="sm" asChild href={category.href} className="w-full">
                      Explore
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              How We Help Our Community
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Comprehensive tools and resources to support every aspect of community life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  {feature.image ? (
                    <div className="relative w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-primary-600/20 flex items-center justify-center">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="h-8 w-8" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-logo text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of Monroe residents who are already using our platform to find resources, 
              discover opportunities, and connect with their community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30" asChild href="/resources">
                <Search className="mr-2 h-5 w-5" />
                Find Resources
              </Button>
              <Button size="lg" variant="gradient" asChild href="/career/resume-builder">
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
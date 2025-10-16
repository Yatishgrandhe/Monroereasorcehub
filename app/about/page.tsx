import { Heart, Users, Target, Award, MapPin, Phone, Mail, Globe, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const team = [
  {
    name: 'Monroe High School TSA Chapter',
    role: 'Development Team',
    description: 'Students from Monroe High School\'s Technology Student Association chapter who developed this platform as part of their community service project.',
    image: '/team/tsa-team.jpg'
  }
];

const values = [
  {
    icon: Heart,
    title: 'Community First',
    description: 'Every feature is designed with Monroe residents in mind, ensuring our platform truly serves the community\'s needs.'
  },
  {
    icon: Users,
    title: 'Accessibility',
    description: 'We believe everyone should have access to community resources and career opportunities, regardless of their background.'
  },
  {
    icon: Target,
    title: 'Innovation',
    description: 'Using cutting-edge AI technology to make career development and resource discovery more effective and personalized.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Committed to providing high-quality, reliable information and tools that help our community thrive.'
  }
];

const stats = [
  { label: 'Community Resources', value: '50+' },
  { label: 'Categories', value: '10' },
  { label: 'Events Monthly', value: '15+' },
  { label: 'Students Involved', value: '25+' }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                <Heart className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Monroe Resource Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              A community-driven platform created by Monroe High School students to connect residents with vital resources, 
              career opportunities, and local events. Built with love for our hometown.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary-600" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-700 leading-relaxed">
                  To create a centralized, accessible, and dynamic digital platform that connects residents of Monroe, 
                  North Carolina, with vital community resources, fostering a more informed, supported, and engaged community.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-primary-600" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-700 leading-relaxed">
                  A thriving Monroe where every resident has easy access to the resources they need to succeed, 
                  where community connections are strengthened, and where technology serves as a bridge to opportunity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-secondary-600">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Impact by the Numbers
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              See how we&apos;re making a difference in the Monroe community
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
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

      {/* Team */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Meet the Team
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Proudly developed by Monroe High School students
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    {member.name}
                  </h3>
                  <Badge variant="primary" className="mb-3">
                    {member.role}
                  </Badge>
                  <p className="text-secondary-600">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Leveraging cutting-edge tools to serve our community
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Next.js', description: 'React Framework' },
              { name: 'Supabase', description: 'Database & Auth' },
              { name: 'Tailwind CSS', description: 'Styling' },
              { name: 'Gemini AI', description: 'AI Assistant' },
              { name: 'TypeScript', description: 'Type Safety' },
              { name: 'Vercel', description: 'Deployment' },
              { name: 'React', description: 'UI Library' },
              { name: 'PostgreSQL', description: 'Database' }
            ].map((tech, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-secondary-900 mb-1">
                    {tech.name}
                  </h3>
                  <p className="text-sm text-secondary-600">
                    {tech.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-secondary-600 mb-8">
              Have questions, suggestions, or want to get involved? We'd love to hear from you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-3">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-secondary-900 mb-2">Location</h3>
                <p className="text-secondary-600 text-center">
                  Monroe, North Carolina 28112
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-3">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-secondary-900 mb-2">Phone</h3>
                <p className="text-secondary-600 text-center">
                  (704) 283-0000
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-3">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-secondary-900 mb-2">Email</h3>
                <p className="text-secondary-600 text-center">
                  info@monroeresourcehub.org
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" asChild>
                <a href="mailto:info@monroeresourcehub.org">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Us
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/submit-resource">
                  <Plus className="mr-2 h-5 w-5" />
                  Suggest a Resource
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Help us build a stronger, more connected Monroe community. Whether you're a resident, 
              organization, or volunteer, there's a place for you here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30" asChild>
                <a href="/volunteer">
                  <Users className="mr-2 h-5 w-5" />
                  Volunteer
                </a>
              </Button>
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/20" asChild>
                <a href="/submit-resource">
                  <Plus className="mr-2 h-5 w-5" />
                  Add a Resource
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

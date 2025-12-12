// about page - humanized copy
import { Heart, Users, Target, Award, MapPin, Phone, Mail, Globe, Plus, Code } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// team data
const team = [
  {
    name: 'Monroe High School TSA Chapter',
    role: 'Development Team',
    description: 'We are a group of students from Monroe High School who built this platform to give back to our community.',
    image: '/team/tsa-team.jpg'
  }
];

// values array
const values = [
  {
    icon: Heart,
    title: 'Community at Heart',
    description: 'We built this for our neighbors. Every feature is designed to help the people of Monroe.'
  },
  {
    icon: Users,
    title: 'Open to Everyone',
    description: 'No matter who you are or where you come from, these resources are here for you.'
  },
  {
    icon: Target,
    title: 'Always Improving',
    description: 'We use the latest tech to make finding help easier and faster for everyone.'
  },
  {
    icon: Award,
    title: 'Trustworthy',
    description: 'We care about accuracy. You can count on the information you find here.'
  }
];

// stats
const stats = [
  { label: 'Resources Listed', value: '50+' },
  { label: 'Ways to Help', value: '10' },
  { label: 'Monthly Events', value: '15+' },
  { label: 'Students Helping', value: '25+' }
];

// main page component
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
              Made with Love for Monroe
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              We're a group of local students who wanted to make it easier for our neighbors to find help,
              discover opportunities, and connect with each other.
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
                  What We Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-700 leading-relaxed">
                  We're building a digital bridge for Monroe. Our goal is simple: to bring all the amazing resources
                  our town has to offer into one easy-to-use place, so no one has to struggle to find the help they need.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-primary-600" />
                  Our Dream
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-700 leading-relaxed">
                  We imagine a Monroe where everyone feels supported and connected. A town where help is just a click away,
                  and where technology brings us closer together instead of driving us apart.
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
              What Matters to Us
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              The beliefs that guide our work every day
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
              Our Impact
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              A snapshot of how we're helping the community
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
              Who We Are
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Proudly built by students, for the community
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
              Built with Modern Tech
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              We use the best tools available to serve you better
            </p>
          </div>

          <Card className="max-w-4xl mx-auto mb-8 border-2 border-primary-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-6 w-6 text-primary-600" />
                How it was done
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-700 mb-4">
                When this website was built, it used the Next.js framework (15.5.5), React (19.1.0), TypeScript 5, and Tailwind CSS 3.4.18.
              </p>
              <div className="text-secondary-700 space-y-4">
                <p className="font-semibold text-primary-700">
                  Guarantee of Originality:
                </p>
                <p>
                  We want you to know that the Monroe High School TSA Chapter team changed everything about this website, from the layout and buttons to the text. We don't use any themes or templates that are already made. Every line of code, style, and design element for this project was made from scratch.
                </p>
                <p>
                  Our design and how everything works together are completely unique, even though we use open source libraries (like the ones below) to build on the work of others. There were no pre-made templates used to make this website, so this proves it.
                </p>
              </div>
            </CardContent>
          </Card>

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
              Let's Chat
            </h2>
            <p className="text-xl text-secondary-600 mb-8">
              Have questions, ideas, or just want to say hi? We'd love to hear from you.
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
              <Button variant="primary" size="lg" className="text-white" asChild>
                <a href="mailto:info@monroeresourcehub.org">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Us
                </a>
              </Button>
              <Button variant="outline" size="lg" className="text-white" asChild>
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
              Be Part of the Story
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Help us build a stronger, more connected Monroe. Whether you're a neighbor,
              an organization, or a volunteer, there's a place for you here.
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
                  Share a Resource
                </a>
              </Button>
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/20" asChild>
                <a href="/reference">
                  <Globe className="mr-2 h-5 w-5" />
                  See References
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

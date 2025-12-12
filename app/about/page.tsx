// about page - humanized copy
import { Heart, Users, Target, Award, MapPin, Phone, Mail, Globe, Plus, Code } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// team data
const team = [
  {
    name: 'Central Academy of Technology and Arts High School TSA Chapter',
    role: 'Development Team',
    description: 'We are the students of the Central Academy of Technology and Arts, and we wanted to do something big for our community. The whole thing was our idea of helping our neighbors.',
    image: '/team/tsa-team.jpg'
  }
];

// values array
const values = [
  {
    icon: Heart,
    title: 'Community at Heart',
    description: 'This whole project was built with our neighbors in mind from the start. Every single feature we added? We did it because we genuinely thought it might help someone in Monroe. That\'s it, really.'
  },
  {
    icon: Users,
    title: 'Open to Everyone',
    description: 'It still wouldn\'t matter what kind of person you were or where you came from. If you were in Monroe and needed help, these would be the resources that would be available to you. That\'s it.'
  },
  {
    icon: Target,
    title: 'Always Improving',
    description: 'We don\'t rest from our work to improve things here. We are not shy to admit that we do use modern technology mainly because it just makes things easier and quicker for the people who use the site. Why would you complicate things more than they already are?'
  },
  {
    icon: Award,
    title: 'Trustworthy',
    description: 'We put a lot of effort into the correct doing things correctly. It is always your presumption that we have made our best effort to be accurate if you find information here. We are not perfect, but we make an effort.'
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
              As local students, we have recognized the necessity for improved services in the community. We would like to complete the project to make it easy for our neighbors to have more access to resources and, at the same time, establish a network among the residents.
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
                  We want to create a platform where the citizens of Monroe do not have any difficulty in obtaining the kind of help they need. Our main goal is to take the best from each service provider locally and create a single list that is accessible to everyone. This will allow the people living in our town not to waste their time searching for the right provider when they are in need of help. The fact that it may only be possible for someone to face numerous obstacles before reaching the service they are looking for is really outrageous.
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
                  Constructing a community in which the people of Monroe will feel that their concerns are our top priority. We want everyone to be certain of the fact that help exists without the need to make several phone calls or fill out numerous forms. Moreover, we want to assure that technology is still a medium that unites people instead of giving them a feeling of loneliness.
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
              These are the things that matter to us and guide what we do
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
              Here's a quick look at what we've been able to do so far
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
              Built by students who actually care about this place
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
              We picked tools that actually work well and help us build something useful
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
                We created this platform using Next.js 16.0.10, React 19.2.3, TypeScript 5.8.2, and Tailwind CSS 3.4.18. We picked the latest versions of everything. To be honest, we wanted to be sure that things would actually go smoothly and not fall apart halfway through.
              </p>
              <div className="text-secondary-700 space-y-4">
                <p className="font-semibold text-primary-700">
                  Just So You Know:
                </p>
                <p>
                  Our team at Central Academy of Technology and Arts TSA Chapter built this whole thing ourselves. 
                  We didn't grab any pre-made themes or templates - everything from how it looks to how it works, we put together ourselves. 
                  Every single piece of code and design came from our team, and we're pretty proud of that.
                </p>
                <p>
                  The way everything looks and works together is completely our own thing. Yeah, we use some open source libraries 
                  (you can see them listed below) because that's just how building websites works these days, but we didn't use any pre-made 
                  templates or themes. Everything you see was built from scratch by us, and it took a while, let me tell you.
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
              Got questions? Have ideas? Just want to chat? We'd actually love to hear from you - seriously, reach out anytime.
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
              Want to help make Monroe a better place? Whether you're just a regular person, part of an organization, 
              or looking to volunteer - we've got a spot for you here. No experience needed, just a willingness to help out.
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

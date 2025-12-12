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
    description: 'We\'re students from Central Academy of Technology and Arts who wanted to do something meaningful for our community. This whole project came from us wanting to help out our neighbors.',
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
    description: 'It really doesn\'t matter who you are or where you came from. If you\'re in Monroe and you need help, these resources are here for you. That\'s all there is to it.'
  },
  {
    icon: Target,
    title: 'Always Improving',
    description: 'We\'re constantly trying to make things better around here. We use modern tech because honestly, it just makes everything easier and faster for people who use the site. Why make things harder than they need to be?'
  },
  {
    icon: Award,
    title: 'Trustworthy',
    description: 'We actually care about getting things right. When you find information here, you can trust that we\'ve done our best to make sure it\'s accurate. We\'re not perfect, but we try.'
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
              Honestly, we're just a group of local students who got this idea that maybe we could make things a little easier for people around here. 
              The whole point was to help our neighbors find what they need, maybe discover some opportunities they didn't know about, and actually get people to connect with each other for once.
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
                  Look, we're basically just trying to make it easier for people in Monroe to find help when they need it. The whole idea started with taking all 
                  the great resources our town has and putting them in one spot that people can actually use without getting confused. Seriously, nobody should have 
                  to deal with a bunch of hassle just to find the help they need. That's just ridiculous.
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
                  What we're really hoping for is a Monroe where people actually feel like they belong somewhere. Where if you need help, 
                  you can find it without having to make a million phone calls or fill out a bunch of forms. And honestly, where technology actually does what it's supposed to - bringing people together instead of 
                  making everyone feel like they're on their own.
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
                We built this site using Next.js 16.0.10, React 19.2.3, TypeScript 5.8.2, and Tailwind CSS 3.4.18. 
                We went with the latest versions of everything because honestly, we wanted to make sure things would actually work well and not break on us halfway through.
              </p>
              <div className="text-secondary-700 space-y-4">
                <p className="font-semibold text-primary-700">
                  Just So You Know:
                </p>
                <p>
                  Our team at Central Academy of Technology and Arts TSA Chapter built this whole thing ourselves, no joke. 
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

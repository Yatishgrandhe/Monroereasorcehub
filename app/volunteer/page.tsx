import { Heart, Users, Clock, MapPin, Phone, Mail, Calendar, Award, HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

// Helper function to format time in 12-hour AM/PM EST
const formatTime12Hour = (time24: string): string => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return time24;
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const minutesStr = minutes.toString().padStart(2, '0');
  return `${hours12}:${minutesStr} ${period} EST`;
};

const volunteerOpportunities = [
  {
    title: 'Food Bank Volunteer',
    organization: 'Second Harvest Food Bank of Metrolina',
    description: 'Sort and distribute food donations, help with food drives, and assist families in need with food selection. Volunteers help pack boxes, sort donations, and assist with mobile food pantries.',
    location: '500-B Spratt Street, Charlotte, NC 28206',
    address: '500-B Spratt Street, Charlotte, NC 28206',
    timeCommitment: '3-6 hours per week',
    volunteerHours: {
      monday: { open: '08:00', close: '12:00' },
      tuesday: { open: '08:00', close: '12:00' },
      wednesday: { open: '08:00', close: '12:00' },
      thursday: { open: '08:00', close: '12:00' },
      friday: { open: '08:00', close: '12:00' },
      saturday: { open: '09:00', close: '11:00' },
      sunday: { closed: true }
    },
    skills: ['Organization', 'Customer service', 'Physical activity', 'Teamwork'],
    contact: null, // Email not verified
    phone: '(704) 376-1785',
    website: 'https://www.secondharvestmetrolina.org',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ageRequirement: '16+',
    backgroundCheck: false
  },
  {
    title: 'Tutoring Volunteer',
    organization: 'Union County Public Schools',
    description: 'Provide academic support to students in reading, math, or other subjects. Help students achieve their educational goals. Volunteers work one-on-one or in small groups with students.',
    location: 'Various school locations in Monroe',
    address: '400 N. Church Street, Monroe, NC 28112',
    timeCommitment: '1-3 hours per week',
    volunteerHours: {
      monday: { open: '14:30', close: '16:30' },
      tuesday: { open: '14:30', close: '16:30' },
      wednesday: { open: '14:30', close: '16:30' },
      thursday: { open: '14:30', close: '16:30' },
      friday: { open: '14:30', close: '16:30' },
      saturday: { closed: true },
      sunday: { closed: true }
    },
    skills: ['Teaching', 'Patience', 'Communication', 'Subject expertise'],
    contact: null, // Email not verified
    phone: '(704) 283-4000',
    website: 'https://www.ucpsnc.org',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ageRequirement: '18+',
    backgroundCheck: true
  },
  {
    title: 'Library Volunteer',
    organization: 'Union County Public Library - Monroe Branch',
    description: 'Assist with library programs, help organize books, support children\'s reading programs, and help patrons find resources. Great opportunity for book lovers and those who want to support literacy.',
    location: '316 E. Windsor Street, Monroe, NC 28112',
    address: '316 E. Windsor Street, Monroe, NC 28112',
    timeCommitment: '2-4 hours per week',
    volunteerHours: {
      monday: { open: '10:00', close: '18:00' },
      tuesday: { open: '10:00', close: '18:00' },
      wednesday: { open: '10:00', close: '18:00' },
      thursday: { open: '10:00', close: '18:00' },
      friday: { open: '10:00', close: '17:00' },
      saturday: { open: '10:00', close: '15:00' },
      sunday: { closed: true }
    },
    skills: ['Organization', 'Customer service', 'Reading', 'Patience'],
    contact: null, // Email not verified
    phone: '(704) 283-8184',
    website: 'https://www.unioncountync.gov/departments/library',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ageRequirement: '16+',
    backgroundCheck: true
  },
  {
    title: 'Hospital Volunteer',
    organization: 'Atrium Health Union',
    description: 'Provide support to patients and families, assist with wayfinding, help with administrative tasks, and support hospital events. Volunteers play a crucial role in patient care and comfort.',
    location: '600 Hospital Drive, Monroe, NC 28112',
    address: '600 Hospital Drive, Monroe, NC 28112',
    timeCommitment: '4-8 hours per week',
    volunteerHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '17:00' },
      sunday: { open: '09:00', close: '17:00' }
    },
    skills: ['Compassion', 'Communication', 'Reliability', 'Medical awareness'],
    contact: null, // Email not verified
    phone: '980-993-3100',
    website: 'https://atriumhealth.org/locations/detail/atrium-health-union',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90',
    ageRequirement: '18+',
    backgroundCheck: true
  },
  {
    title: 'Social Services Volunteer',
    organization: 'Union County Department of Social Services',
    description: 'Assist with office tasks, help clients navigate services, support community outreach programs, and help with special events. Volunteers help make social services more accessible to the community.',
    location: '2330 Concord Avenue, Monroe, NC 28110',
    address: '2330 Concord Avenue, Monroe, NC 28110',
    timeCommitment: '2-5 hours per week',
    volunteerHours: {
      monday: { open: '09:00', close: '16:00' },
      tuesday: { open: '09:00', close: '16:00' },
      wednesday: { open: '09:00', close: '16:00' },
      thursday: { open: '09:00', close: '16:00' },
      friday: { open: '09:00', close: '16:00' },
      saturday: { closed: true },
      sunday: { closed: true }
    },
    skills: ['Organization', 'Communication', 'Empathy', 'Confidentiality'],
    contact: null, // Email not verified
    phone: '(704) 296-4300',
    website: 'https://www.unioncountync.gov/departments/social-services',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ageRequirement: '18+',
    backgroundCheck: true
  },
  {
    title: 'Community Event Volunteer',
    organization: 'City of Monroe',
    description: 'Help organize and run community events, festivals, and city programs. Assist with setup, coordination, registration, and cleanup. Great for those who enjoy working with the public and supporting community spirit.',
    location: 'Various locations in Monroe',
    address: '700 N. Hayne Street, Monroe, NC 28112',
    timeCommitment: 'Variable (event-based)',
    volunteerHours: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: '09:00', close: '15:00' },
      sunday: { closed: true }
    },
    skills: ['Organization', 'Event planning', 'Communication', 'Flexibility'],
    contact: null, // Email not verified
    phone: '(704) 282-4700',
    website: 'https://www.monroenc.org',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ageRequirement: '16+',
    backgroundCheck: false
  }
];

const benefits = [
  {
    icon: Heart,
    title: 'Make a Difference',
    description: 'You can actually help people in Monroe. It feels good to know you\'re doing something that matters for your neighbors.'
  },
  {
    icon: Users,
    title: 'Meet People',
    description: 'You\'ll meet new people, make friends, and maybe even find some professional connections along the way.'
  },
  {
    icon: Award,
    title: 'Learn Stuff',
    description: 'Pick up new skills, add something to your resume, and maybe figure out what you want to do with your career.'
  },
  {
    icon: HandHeart,
    title: 'Feel Good',
    description: 'There\'s something pretty satisfying about helping out. Plus, you\'ll probably learn a thing or two about yourself.'
  }
];

const requirements = [
  'You need to be at least 16 (some stuff requires you to be 18)',
  'Some places might need a background check',
  'Show up when you say you will',
  'Go to the orientation and training they offer',
  'Follow their rules and how they do things',
  'Keep things private when they ask you to'
];

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-slate-900 mesh-bg pt-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 z-0">
          <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary-900/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent-950/20 rounded-full blur-[100px]" />
        </div>
        <div className="relative container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-10">
              <Badge variant="glass" className="px-6 py-2.5 bg-white/[0.05] border-white/10 text-primary-400 font-black uppercase tracking-[0.3em] text-[10px] backdrop-blur-xl">
                <Heart className="h-3.5 w-3.5 mr-2.5 animate-pulse" />
                Community Service Hub
              </Badge>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
              Lend a <span className="text-gradient-logo">Hand</span>.
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Want to help make Monroe a better place? There are lots of ways to pitch in, and we can help you find something
              that actually fits with your schedule and what you're interested in.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                variant="gradient"
                className="h-14 px-12 text-lg rounded-full shadow-lg shadow-primary-500/20"
                asChild
                href="#opportunities"
              >
                <>
                  <Users className="mr-2 h-5 w-5" />
                  See What's Needed
                </>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-12 text-lg rounded-full border-white/10 text-white hover:bg-white/10"
                asChild
                href="/events"
              >
                <>
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Events
                </>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-slate-900/50 relative z-10">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Impact of Service
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Volunteering is the cornerstone of our community. Here's why joining the movement matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="glass-card border-white/10 text-center hover:border-primary-500/30 transition-all group">
                  <CardContent className="p-10">
                    <div className="w-16 h-16 bg-primary-500/10 text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary-500/20 transition-all">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Spotlight */}
      <section className="section-padding bg-gradient-to-br from-primary-900 via-slate-900 to-accent-900 text-white relative z-10">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              Community <span className="text-primary-400">Spotlight</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Meet some of the dedicated organizations driving positive change in Monroe right now.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {volunteerOpportunities.slice(0, 3).map((volunteer, index) => (
              <div key={index} className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 hover:border-primary-500/30 group transition-all duration-500">
                <div className="relative h-64 w-full mb-8 rounded-3xl overflow-hidden shadow-2xl">
                  <ImageWithFallback
                    src={volunteer.image}
                    alt={volunteer.title}
                    title={volunteer.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-black text-white mb-1 leading-tight">{volunteer.title}</h3>
                    <p className="text-primary-400 font-bold text-sm tracking-widest uppercase">{volunteer.organization}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {volunteer.description}
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <Clock className="h-4 w-4 text-primary-500" />
                      <span>{volunteer.timeCommitment}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <MapPin className="h-4 w-4 text-primary-500" />
                      <span className="truncate">{volunteer.address || volunteer.location}</span>
                    </div>
                  </div>
                  {volunteer.phone && (
                    <Button
                      variant="gradient"
                      size="sm"
                      className="w-full mt-4 h-12 rounded-2xl shadow-lg shadow-primary-500/20"
                      asChild
                      href={`tel:${volunteer.phone.replace(/\D/g, '')}`}
                    >
                      <span className="flex items-center font-bold">
                        <Phone className="h-4 w-4 mr-2" />
                        Connect: {volunteer.phone}
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section id="opportunities" className="section-padding bg-slate-900/50 relative z-10">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Active Missions
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Find the perfect opportunity that matches your interests and availability.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {volunteerOpportunities.map((opportunity, index) => (
              <Card key={index} className="glass-card border-white/10 overflow-hidden group hover:border-primary-500/30 transition-all duration-300">
                <div className="relative h-64 w-full">
                  <ImageWithFallback
                    src={opportunity.image}
                    alt={opportunity.title}
                    title={opportunity.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <CardTitle className="text-3xl font-black text-white mb-2 tracking-tight group-hover:text-primary-300 transition-colors">{opportunity.title}</CardTitle>
                    <CardDescription className="text-primary-400 font-bold uppercase tracking-widest text-xs">
                      {opportunity.organization}
                    </CardDescription>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    {opportunity.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-start gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <MapPin className="h-4 w-4 text-primary-500 flex-shrink-0" />
                      <span className="leading-5">{opportunity.address || opportunity.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <Clock className="h-4 w-4 text-primary-500" />
                      <span>{opportunity.timeCommitment}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <Users className="h-4 w-4 text-primary-500" />
                      <span>Age: {opportunity.ageRequirement || '16+'}</span>
                    </div>
                    {opportunity.backgroundCheck && (
                      <Badge variant="glass" className="bg-warning-500/10 text-warning-400 border-none font-black text-[10px] tracking-tighter">
                        Vetting Required
                      </Badge>
                    )}
                  </div>

                  <div className="mb-8">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4">Required Competencies</h4>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="glass" className="bg-white/5 border-white/5 text-slate-300 font-bold">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {opportunity.phone && (
                      <Button
                        variant="gradient"
                        className="flex-1 h-12 rounded-2xl font-bold"
                        asChild
                        href={`tel:${opportunity.phone.replace(/\D/g, '')}`}
                      >
                        <span className="flex items-center justify-center">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Office
                        </span>
                      </Button>
                    )}
                    {opportunity.website && (
                      <Button
                        variant="outline"
                        className="flex-1 h-12 rounded-2xl border-white/10 text-white hover:bg-white/5 font-bold"
                        asChild
                        href={opportunity.website}
                      >
                        <span className="flex items-center justify-center">
                          <Mail className="h-4 w-4 mr-2" />
                          Portal
                        </span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section-padding bg-slate-900/50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="title-section mb-4">
                Good to Know
              </h2>
              <p className="text-xl text-slate-400">
                A few things to keep in mind before you start.
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      </div>
                      <p className="text-slate-300">{requirement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="section-padding bg-slate-800/50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="title-section mb-6">
              How to Join In
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              It\'s easy to get started. Here\'s how:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Choose an Opportunity
                </h3>
                <p className="text-slate-400">
                  Browse our list and find something that sparks your interest.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Reach Out
                </h3>
                <p className="text-slate-400">
                  Contact the organization to say you\'d like to help.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Start Helping
                </h3>
                <p className="text-slate-400">
                  Show up, lend a hand, and make a difference!
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                asChild
                href="#opportunities"
              >
                <>
                  <Users className="mr-2 h-5 w-5" />
                  Browse Opportunities
                </>
              </Button>
              <a
                href="mailto:info@monroeresourcehub.org"
                className="btn btn-outline btn-lg inline-flex items-center justify-center"
              >
                <Mail className="mr-2 h-5 w-5" />
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding pb-32 relative z-10">
        <div className="container-custom">
          <Card className="bg-gradient-to-br from-primary-600 to-accent-700 text-white rounded-[2.5rem] border-none shadow-2xl shadow-primary-500/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-mesh opacity-10" />
            <CardContent className="p-12 md:p-20 text-center relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">
                Orchestrate <span className="text-white/80">Positive Change</span>
              </h2>
              <p className="text-xl mb-12 text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
                Every hour you invest ripples through our community. Join the collective efforts making Monroe a model for service.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 px-12 text-lg rounded-full bg-white text-primary-900 border-white hover:bg-slate-100 shadow-xl"
                  asChild
                  href="#opportunities"
                >
                  <span className="flex items-center font-bold">
                    <Heart className="mr-3 h-5 w-5" />
                    Start Your Mission
                  </span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 px-12 text-lg rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md"
                  asChild
                  href="/events"
                >
                  <span className="flex items-center font-bold">
                    <Calendar className="mr-3 h-5 w-5" />
                    Operational Events
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

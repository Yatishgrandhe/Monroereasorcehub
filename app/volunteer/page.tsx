'use client';

import { Heart, Users, Clock, MapPin, Phone, Calendar, ExternalLink, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { Reveal } from '@/components/ui/Reveal';
import Link from 'next/link';

const volunteerOpportunities = [
  {
    title: 'Food Bank Volunteer',
    organization: 'Second Harvest Food Bank of Metrolina',
    description: 'Sort and distribute food donations, help with food drives, and assist families in need with food selection. Volunteers help pack boxes, sort donations, and assist with mobile food pantries.',
    location: '500-B Spratt Street, Charlotte, NC 28206',
    address: '500-B Spratt Street, Charlotte, NC 28206',
    timeCommitment: '3-6 hours per week',
    skills: ['Organization', 'Customer service', 'Physical activity', 'Teamwork'],
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
    skills: ['Teaching', 'Patience', 'Communication', 'Subject expertise'],
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
    skills: ['Organization', 'Customer service', 'Reading', 'Patience'],
    phone: '(704) 283-8184',
    website: 'https://www.unioncountync.gov/departments/library',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ageRequirement: '16+',
    backgroundCheck: true
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

import { Award, HandHeart } from 'lucide-react';

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 z-10">
        <div className="container-custom text-center">
          <Reveal width="100%">
            <span className="text-primary-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-8 block">Community Service Infrastructure</span>
            <h1 className="text-6xl md:text-9xl font-serif font-black text-primary-950 mt-4 mb-12 tracking-tighter leading-[0.8] italic">
              Civic <span className="text-primary-700 not-italic">Coordination.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-serif italic mb-16">
              Find meaningful ways to contribute to the local ecosystem. From vetted food banks to academic tutoring, we coordinate verified local opportunities in Monroe.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Button
                asChild
                className="bg-primary-950 hover:bg-black text-white px-12 h-20 rounded-3xl uppercase tracking-[0.2em] text-[10px] font-black shadow-2xl shadow-primary-950/30 transition-all group"
              >
                <Link href="#opportunities">
                  <Users className="mr-4 h-5 w-5" />
                  Browse Operations
                </Link>
              </Button>
              <Button
                variant="outline"
                className="px-12 h-20 border-gray-100 bg-white text-primary-950 font-black uppercase tracking-[0.2em] text-[10px] rounded-3xl hover:bg-gray-50 transition-all shadow-soft group"
                asChild
              >
                <Link href="/resources">
                  <Calendar className="mr-4 h-5 w-5 opacity-40" />
                  Explore Registry
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-6 lg:px-12 relative z-10">
        <div className="max-w-[1400px] mx-auto bg-primary-50 rounded-[5rem] py-32 px-10 md:px-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/40 pointer-events-none" />

          <div className="relative z-10">
            <div className="mb-24 text-center">
              <span className="text-primary-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">The Value Baseline</span>
              <h2 className="text-5xl md:text-7xl font-serif font-black text-primary-950 mb-8 tracking-tighter italic leading-[0.9]">
                Why Service <span className="text-primary-700 not-italic">Matters.</span>
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-serif italic">
                Civic engagement strengthens the bond of our community and the reliability of our local professional network.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Reveal key={index} delay={index * 0.1}>
                    <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-soft hover:shadow-civic-hover hover:-translate-y-2 transition-all duration-700 group h-full flex flex-col items-center text-center">
                      <div className="w-20 h-20 bg-primary-50 text-primary-950 rounded-2xl flex items-center justify-center mb-10 shadow-sm group-hover:bg-primary-950 group-hover:text-white transition-all duration-500">
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-serif font-black text-primary-950 mb-4 tracking-tight leading-tight italic">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-500 font-serif italic leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Community Spotlight */}
      <section className="py-40 relative z-10 bg-white">
        <div className="container-custom">
          <div className="text-center mb-24">
            <span className="text-primary-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Featured Partners</span>
            <h2 className="text-5xl md:text-7xl font-serif font-black text-primary-950 mb-8 tracking-tighter italic leading-[0.9]">
              Community <span className="text-primary-700 not-italic">Spotlight.</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-serif italic">
              Meet the organizations maintaining the safety net in Union County and Monroe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {volunteerOpportunities.map((volunteer, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="bg-white rounded-[4rem] p-10 border border-gray-50 shadow-soft group hover:shadow-civic-hover hover:-translate-y-2 transition-all duration-700 flex flex-col h-full overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[4rem] pointer-events-none opacity-50" />

                  <div className="relative h-72 w-full mb-10 rounded-[3rem] overflow-hidden shadow-soft">
                    <ImageWithFallback
                      src={volunteer.image}
                      alt={volunteer.title}
                      title={volunteer.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-8 right-8">
                      <Badge className="bg-white/95 backdrop-blur-md text-primary-950 border-none shadow-xl px-5 py-2 font-black text-[9px] tracking-[0.2em] rounded-full uppercase">
                        {volunteer.ageRequirement}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h3 className="text-3xl font-serif font-black text-primary-950 mb-2 leading-tight italic tracking-tighter group-hover:text-primary-700 transition-colors">{volunteer.title}</h3>
                    <p className="text-primary-700 font-black text-[10px] tracking-[0.3em] uppercase mb-8">{volunteer.organization}</p>
                    <p className="text-gray-500 font-serif italic leading-relaxed mb-10 line-clamp-3 text-lg">
                      {volunteer.description}
                    </p>

                    <div className="space-y-5 pt-8 border-t border-gray-50 mt-auto">
                      <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        <Clock className="h-4 w-4 text-primary-950 opacity-20" />
                        <span>{volunteer.timeCommitment}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        <MapPin className="h-4 w-4 text-primary-950 opacity-20" />
                        <span className="truncate">{volunteer.address || volunteer.location}</span>
                      </div>
                    </div>

                    {volunteer.phone && (
                      <Button
                        variant="outline"
                        className="w-full mt-10 h-16 rounded-2xl border-gray-100 bg-white text-primary-950 hover:bg-gray-50 font-black uppercase tracking-[0.2em] text-[10px] shadow-soft group"
                        asChild
                      >
                        <Link href={`tel:${volunteer.phone.replace(/\D/g, '')}`} className="flex items-center justify-center">
                          <Phone className="h-4 w-4 mr-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                          Connect: {volunteer.phone}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities Overview */}
      <section id="opportunities" className="py-24 px-6 lg:px-12 relative z-10">
        <div className="max-w-[1400px] mx-auto bg-primary-950 rounded-[5rem] py-32 px-10 md:px-20 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent)]" />

          <div className="relative z-10">
            <div className="text-center mb-24">
              <span className="text-primary-300 font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Active Registry</span>
              <h2 className="text-5xl md:text-8xl font-serif font-black text-white mb-8 tracking-tighter italic leading-[0.9]">
                Verified <span className="text-primary-300 not-italic">Operations.</span>
              </h2>
              <p className="text-xl text-primary-100/60 max-w-2xl mx-auto leading-relaxed font-serif italic">
                Select a mission vertical that aligns with your specific capacity for community resilience.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {volunteerOpportunities.map((opportunity, index) => (
                <Reveal key={index} delay={index * 0.1} width="100%">
                  <div className="bg-white rounded-[4rem] overflow-hidden flex flex-col lg:flex-row hover:shadow-2xl transition-all duration-700 group">
                    <div className="lg:w-2/5 relative min-h-[400px]">
                      <ImageWithFallback
                        src={opportunity.image}
                        alt={opportunity.title}
                        title={opportunity.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-primary-950/10" />
                    </div>
                    <div className="lg:w-3/5 p-12 lg:p-20 flex flex-col relative">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-primary-50 rounded-bl-[4rem] pointer-events-none opacity-50" />

                      <div className="flex flex-wrap items-center gap-4 mb-8">
                        <Badge className="bg-primary-950 text-white font-black text-[9px] tracking-[0.2em] uppercase px-5 py-2 rounded-full border-none">
                          {opportunity.organization}
                        </Badge>
                        {opportunity.backgroundCheck && (
                          <Badge variant="outline" className="font-black text-[9px] border-emerald-100 text-emerald-700 bg-emerald-50/50 uppercase tracking-[0.2em] px-5 py-2 rounded-full">
                            Vetting Required
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-4xl md:text-5xl font-serif font-black text-primary-950 mb-8 leading-[0.9] italic tracking-tight">{opportunity.title}</h3>
                      <p className="text-gray-500 font-serif italic leading-relaxed mb-12 flex-grow text-xl">
                        {opportunity.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16 pt-10 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                          <Clock className="h-5 w-5 text-primary-950 opacity-20" />
                          <span>{opportunity.timeCommitment}</span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                          <Users className="h-5 w-5 text-primary-950 opacity-20" />
                          <span>Maturity Req: {opportunity.ageRequirement}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-6">
                        {opportunity.phone && (
                          <Button
                            className="bg-primary-950 hover:bg-black text-white h-18 !h-20 px-10 text-[10px] flex-1 uppercase tracking-[0.2em] font-black rounded-3xl shadow-xl shadow-primary-950/20 group/btn"
                            asChild
                          >
                            <Link href={`tel:${opportunity.phone.replace(/\D/g, '')}`} className="flex items-center justify-center">
                              <Phone className="h-5 w-5 mr-4 group-hover/btn:scale-110 transition-transform" />
                              Initiate Contact
                            </Link>
                          </Button>
                        )}
                        {opportunity.website && (
                          <Button
                            variant="outline"
                            className="h-18 !h-20 px-10 text-[10px] flex-1 border-gray-100 bg-white text-primary-950 hover:bg-gray-50 font-black uppercase tracking-[0.2em] rounded-3xl shadow-soft"
                            asChild
                          >
                            <Link href={opportunity.website} target="_blank" className="flex items-center justify-center">
                              <ExternalLink className="h-5 w-5 mr-4 opacity-40" />
                              Organization Hub
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Ledger */}
      <section className="py-40 bg-white relative z-10">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-24">
              <span className="text-primary-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Standard Protocols</span>
              <h2 className="text-5xl md:text-7xl font-serif font-black text-primary-950 mb-8 italic leading-[0.9] tracking-tighter">
                Operational <span className="text-primary-700 not-italic">Standards.</span>
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-serif italic">
                Core guidelines to ensure safety and civic effectiveness across all community initiatives.
              </p>
            </div>

            <div className="bg-primary-50 p-16 lg:p-24 rounded-[5rem] border border-primary-100 shadow-soft relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/40 rounded-bl-[5rem] pointer-events-none" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                {requirements.map((requirement, index) => (
                  <Reveal key={index} delay={index * 0.1}>
                    <div className="flex items-start gap-8 group">
                      <div className="w-12 h-12 bg-white text-primary-950 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-soft group-hover:bg-primary-950 group-hover:text-white transition-all duration-500">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <p className="text-xl text-gray-500 font-serif italic leading-relaxed">{requirement}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 relative z-10">
        <div className="container-custom text-center">
          <Reveal width="100%">
            <div className="max-w-4xl mx-auto space-y-12">
              <h2 className="text-5xl md:text-8xl font-serif font-black text-primary-950 italic tracking-tighter leading-tight">
                Architect <span className="text-primary-700 not-italic">Resilience.</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-500 font-serif italic max-w-2xl mx-auto leading-relaxed">
                Every hour invested ripples through the local network, strengthening the community baseline of Monroe.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center pt-8">
                <Button
                  asChild
                  className="bg-primary-950 hover:bg-black text-white px-12 h-20 rounded-3xl uppercase tracking-[0.2em] text-[10px] font-black shadow-2xl shadow-primary-950/30 transition-all group"
                >
                  <Link href="#opportunities" className="flex items-center">
                    <Heart className="mr-4 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Start Serving
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="px-12 h-20 border-gray-100 bg-white text-primary-950 font-black uppercase tracking-[0.2em] text-[10px] rounded-3xl hover:bg-gray-50 transition-all shadow-soft group"
                  asChild
                >
                  <Link href="/contact" className="flex items-center">
                    Coordinate Partnering
                    <ArrowRight className="ml-4 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

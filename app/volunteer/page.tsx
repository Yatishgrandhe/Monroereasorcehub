import { Heart, Users, Clock, MapPin, Phone, Mail, Calendar, Award, HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const volunteerOpportunities = [
  {
    title: 'Community Garden Volunteer',
    organization: 'Monroe Community Garden',
    description: 'Help maintain our community garden, assist with planting, weeding, and harvesting fresh produce for local families.',
    location: 'Downtown Monroe',
    timeCommitment: '2-4 hours per week',
    skills: ['Gardening', 'Physical activity', 'Teamwork'],
    contact: 'garden@monroenc.org',
    phone: '(704) 283-1234',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Food Bank Assistant',
    organization: 'Second Harvest Food Bank',
    description: 'Sort and distribute food donations, help with food drives, and assist families in need with food selection.',
    location: 'Monroe Distribution Center',
    timeCommitment: '3-6 hours per week',
    skills: ['Organization', 'Customer service', 'Physical activity'],
    contact: 'volunteer@secondharvestmetrolina.org',
    phone: '(704) 376-1785',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Tutoring Volunteer',
    organization: 'Union County Public Schools',
    description: 'Provide academic support to students in reading, math, or other subjects. Help students achieve their educational goals.',
    location: 'Various school locations',
    timeCommitment: '1-3 hours per week',
    skills: ['Teaching', 'Patience', 'Communication'],
    contact: 'volunteer@ucps.k12.nc.us',
    phone: '(704) 283-4000',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Senior Companion',
    organization: 'Monroe Senior Center',
    description: 'Visit with elderly residents, provide companionship, help with errands, and assist with light household tasks.',
    location: 'Monroe Senior Center',
    timeCommitment: '2-4 hours per week',
    skills: ['Compassion', 'Communication', 'Reliability'],
    contact: 'seniors@monroenc.org',
    phone: '(704) 283-5678',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Event Planning Assistant',
    organization: 'Monroe Chamber of Commerce',
    description: 'Help organize community events, festivals, and business networking events. Assist with setup, coordination, and cleanup.',
    location: 'Various locations',
    timeCommitment: 'Variable (event-based)',
    skills: ['Organization', 'Event planning', 'Communication'],
    contact: 'events@unioncountychamber.org',
    phone: '(704) 283-9999',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Animal Shelter Helper',
    organization: 'Union County Animal Services',
    description: 'Care for shelter animals, assist with adoption events, help with cleaning and feeding, and provide socialization for pets.',
    location: 'Union County Animal Shelter',
    timeCommitment: '2-5 hours per week',
    skills: ['Animal care', 'Compassion', 'Physical activity'],
    contact: 'volunteer@unioncountync.gov',
    phone: '(704) 283-1111',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const benefits = [
  {
    icon: Heart,
    title: 'Make a Difference',
    description: 'Directly impact the lives of your neighbors and strengthen the Monroe community.'
  },
  {
    icon: Users,
    title: 'Build Connections',
    description: 'Meet new people, form lasting friendships, and expand your professional network.'
  },
  {
    icon: Award,
    title: 'Gain Experience',
    description: 'Develop new skills, add to your resume, and explore potential career paths.'
  },
  {
    icon: HandHeart,
    title: 'Personal Growth',
    description: 'Experience the satisfaction of giving back and grow as an individual.'
  }
];

const requirements = [
  'Be at least 16 years old (some opportunities require 18+)',
  'Complete a background check (for certain positions)',
  'Commit to the agreed-upon time schedule',
  'Attend orientation and training sessions',
  'Follow organization policies and procedures',
  'Maintain confidentiality when required'
];

export default function VolunteerPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Volunteers working together"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/90 to-primary-800/90"></div>
        <div className="relative container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                <Heart className="h-10 w-10" />
              </div>
            </div>
            <h1 className="title-hero mb-6">
              Volunteer Opportunities
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Join us in making Monroe a better place for everyone. Discover meaningful volunteer opportunities 
              that match your interests, skills, and schedule.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30 force-white-text">
                <Users className="mr-2 h-5 w-5" />
                Find Opportunities
              </Button>
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/20 force-white-text">
                <Calendar className="mr-2 h-5 w-5" />
                Upcoming Events
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="title-section mb-4">
              Why Volunteer in Monroe?
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Volunteering offers countless benefits for both you and the community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-secondary-600">
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
      <section className="section-padding bg-gradient-logo text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Community Spotlight
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Meet some of our amazing volunteers making a difference in Monroe
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {volunteerOpportunities.slice(0, 3).map((volunteer, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={volunteer.image} 
                    alt={volunteer.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-white mb-1">{volunteer.title}</h3>
                    <p className="text-white/90 text-sm">{volunteer.organization}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-white/90 text-sm">
                    {volunteer.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Clock className="h-4 w-4" />
                    <span>{volunteer.timeCommitment}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <MapPin className="h-4 w-4" />
                    <span>{volunteer.location}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4 border-white/30 text-white hover:bg-white/20">
                    <Mail className="h-4 w-4 mr-2" />
                    Get Involved
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="title-section mb-4">
              Current Opportunities
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Find the perfect volunteer opportunity that matches your interests and schedule
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {volunteerOpportunities.map((opportunity, index) => (
              <Card key={index} hover className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <img 
                    src={opportunity.image} 
                    alt={opportunity.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <CardTitle className="text-xl mb-2 text-white">{opportunity.title}</CardTitle>
                    <CardDescription className="text-white/90 font-medium">
                      {opportunity.organization}
                    </CardDescription>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-secondary-700 mb-4">
                    {opportunity.description}
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-secondary-600">
                      <MapPin className="h-4 w-4" />
                      <span>{opportunity.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-secondary-600">
                      <Clock className="h-4 w-4" />
                      <span>{opportunity.timeCommitment}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-secondary-900 mb-2">Helpful Skills:</h4>
                    <div className="flex flex-wrap gap-1">
                      {opportunity.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" size="sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="primary" size="sm" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Organization
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="title-section mb-4">
                Volunteer Requirements
              </h2>
              <p className="text-xl text-secondary-600">
                What you need to know before you start volunteering
              </p>
            </div>
            
            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      </div>
                      <p className="text-secondary-700">{requirement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="title-section mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-secondary-600 mb-8">
              Follow these simple steps to begin your volunteer journey in Monroe
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Choose an Opportunity
                </h3>
                <p className="text-secondary-600">
                  Browse our current volunteer opportunities and find one that matches your interests and schedule.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Contact the Organization
                </h3>
                <p className="text-secondary-600">
                  Reach out to the organization directly to learn more about the opportunity and express your interest.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Start Volunteering
                </h3>
                <p className="text-secondary-600">
                  Complete any required training or orientation, then begin making a difference in your community.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg">
                <Users className="mr-2 h-5 w-5" />
                Browse Opportunities
              </Button>
              <Button variant="outline" size="lg">
                <Mail className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="title-section mb-6">
              Make Monroe Better Together
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Every hour you volunteer makes a real difference in someone's life. 
              Join hundreds of Monroe residents who are already giving back to their community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Heart className="mr-2 h-5 w-5" />
                Start Volunteering Today
              </Button>
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/20">
                <Calendar className="mr-2 h-5 w-5" />
                View Volunteer Events
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

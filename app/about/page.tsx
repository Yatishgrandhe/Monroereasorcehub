'use client';

import { Heart, Users, Target, Award, MapPin, Phone, Mail, Globe, Plus, Code, Sparkles, Rocket, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

const team = [
  {
    name: 'Central Academy of Technology and Arts TSA',
    role: 'Development Team',
    description: 'A dedicated group of student innovators at the Central Academy of Technology and Arts (CATA). We envisioned this project as a way to leverage our technical skills for social good in our hometown of Monroe.',
    image: '/team/cata-tsa.jpg'
  }
];

const values = [
  {
    icon: Heart,
    title: 'Community First',
    description: 'Every interaction and feature is designed with the Monroe resident in mind. We prioritize impact over everything else.'
  },
  {
    icon: Shield,
    title: 'Radical Access',
    description: 'We believe quality resource navigation should be a right, not a privilege. Our platform is open, free, and accessible to all.'
  },
  {
    icon: Rocket,
    title: 'Modern Innovation',
    description: 'We utilize state-of-the-art technology to solve legacy community problems. Efficiency is our benchmark.'
  },
  {
    icon: Award,
    title: 'Integrity',
    description: 'Accuracy and trust are the foundation of our database. We maintain rigorous standards for every listing.'
  }
];

const stats = [
  { label: 'CATA Students', value: '25+' },
  { label: 'Monroe Resources', value: '50+' },
  { label: 'Active Partners', value: '12' },
  { label: 'Community Hours', value: '500+' }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#020617] pt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="glass" className="mb-8 px-4 py-1.5 border-primary-500/20 text-primary-400 font-bold uppercase tracking-widest text-[10px]">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Our Mission
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
              Crafted in <span className="text-gradient-logo">Monroe</span>,<br />
              Built for <span className="text-gradient-logo">Change</span>.
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
              We are student developers at the Central Academy of Technology and Arts, dedicated to bridging the gap between community needs and local services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="section-padding relative">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card h-full border-white/5 group hover:border-primary-500/30 transition-all">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Icon className="h-7 w-7 text-primary-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                      <p className="text-slate-400 leading-relaxed text-sm">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="glass-card border-white/10 p-12 rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/10 to-transparent opacity-50" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Area */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <Badge variant="glass" className="mb-4">Internal Architecture</Badge>
            <h2 className="text-3xl md:text-5xl font-black text-white">Built with Modern Tech</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Next.js 16', desc: 'React Framework' },
              { name: 'React 19', desc: 'UI Library' },
              { name: 'TypeScript 5', desc: 'Type Safety' },
              { name: 'Tailwind CSS 3', desc: 'Premium Styling' },
              { name: 'Supabase', desc: 'Database & Auth' },
              { name: 'Framer Motion', desc: 'Fluid Animations' },
              { name: 'Gemini AI', desc: 'Intelligent Logic' },
              { name: 'Lucide Icons', desc: 'Visual Language' },
              { name: 'Vercel', desc: 'Delivery Network' }
            ].map((tech, i) => (
              <div key={i} className="glass border-white/5 p-6 rounded-2xl flex flex-col items-center text-center">
                <h4 className="font-bold text-white mb-1">{tech.name}</h4>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="bg-gradient-to-br from-primary-600 to-accent-700 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary-500/20">
            <div className="absolute inset-0 bg-mesh opacity-20" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to make an impact?</h2>
              <p className="text-xl text-white/80 mb-12">Whether you're a student, a neighbor, or a provider, there's a place for you in our mission to improve Monroe.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white rounded-full px-12 hover:bg-white/20" asChild href="/volunteer">
                  <span>Volunteer Now</span>
                </Button>
                <Button variant="outline" size="lg" className="bg-white text-primary-900 border-white rounded-full px-12 hover:bg-slate-100" asChild href="/submit-resource">
                  <span>Share Resource</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

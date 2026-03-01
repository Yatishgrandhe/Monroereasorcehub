'use client';

import {
  Heart,
  Users,
  Target,
  Award,
  Globe,
  Code,
  Sparkles,
  Rocket,
  Shield,
  Cpu,
  Palette,
  Zap,
  Database,
  Search,
  CheckCircle,
  MessageSquare,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const team = [
  {
    name: 'Yatish Grandhe',
    grade: '10th Grade',
    school: 'Central Academy of Technology and Arts',
    role: 'Lead Systems Architect',
    description: 'Spearheaded the overall platform architecture, focusing on full-stack integration and the core engine of the Monroe Resource Hub.',
    icon: Cpu,
    color: 'text-primary-400 bg-primary-500/10'
  },
  {
    name: 'Dhyan Kanna',
    grade: '10th Grade',
    school: 'Central Academy of Technology and Arts',
    role: 'UI/UX Design Director',
    description: 'Engineered the premium visual language and interactive design system that powers the hub’s high-end aesthetic.',
    icon: Palette,
    color: 'text-accent-400 bg-accent-500/10'
  },
  {
    name: 'Aman Gandhi',
    grade: '10th Grade',
    school: 'Central Academy of Technology and Arts',
    role: 'Backend Infrastructure Specialist',
    description: 'Managed complex data migrations, database schema optimization, and secure server-to-client communication channels.',
    icon: Database,
    color: 'text-emerald-400 bg-emerald-500/10'
  },
  {
    name: 'Tanishq Juneja',
    grade: '10th Grade',
    school: 'Central Academy of Technology and Arts',
    role: 'AI & Intelligence Lead',
    description: 'Integrated advanced AI logic for resume building, content generation, and intelligent search systems.',
    icon: Zap,
    color: 'text-yellow-400 bg-yellow-500/10'
  },
  {
    name: 'Vihaan Kotagiri',
    grade: '10th Grade',
    school: 'Central Academy of Technology and Arts',
    role: 'Community Strategy Lead',
    description: 'Strategized content reach and resource categorization, ensuring the platform truly serves the residents of Monroe.',
    icon: MessageSquare,
    color: 'text-purple-400 bg-purple-500/10'
  },
  {
    name: 'Saahil Mehta',
    grade: '10th Grade',
    school: 'Central Academy of Technology and Arts',
    role: 'Security & Quality Engineer',
    description: 'Oversaw platform security protocols and rigorous testing to ensure 100% reliability and data integrity.',
    icon: Shield,
    color: 'text-rose-400 bg-rose-500/10'
  }
];

const values = [
  {
    icon: Heart,
    title: 'Community First',
    description: 'Every interaction and feature is designed with the Monroe resident in mind. We prioritize impact.'
  },
  {
    icon: Shield,
    title: 'Radical Access',
    description: 'We believe resource navigation should be a right. Our platform is free and accessible to all.'
  },
  {
    icon: Rocket,
    title: 'Modern Innovation',
    description: 'We utilize state-of-the-art technology to solve legacy community problems.'
  },
  {
    icon: Award,
    title: 'Integrity',
    description: 'Accuracy and trust are the foundation. We maintain rigorous standards for every listing.'
  }
];

const stats = [
  { label: 'CATA Innovators', value: '100%' },
  { label: 'Cloud Architecture', value: 'Serverless' },
  { label: 'UI Precision', value: 'Pixel Perfect' },
  { label: 'Mission Focus', value: 'Local Impact' }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#020617] pt-20 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden z-10">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="flex justify-center mb-8">
              <Badge variant="glass" className="px-6 py-2 border-primary-500/20 text-primary-400 font-black uppercase tracking-[0.3em] text-[10px]">
                <Users className="h-3.5 w-3.5 mr-2.5 animate-pulse" />
                The Development Collective
              </Badge>
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter leading-none">
              Elite <span className="text-gradient-logo">Craft</span>,<br />
              Local <span className="text-gradient-logo">Impact</span>.
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
              A specialized chapter of student innovators from the <span className="text-white">Central Academy of Technology and Arts</span>, rewriting the rules of community resource navigation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section-padding relative z-10">
        <div className="container-custom">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
              Meet the <span className="text-primary-500">Architects</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
              <span className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> CATA Class of 2028</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 10th Grade Excellence</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> TSA 2026 Nationals Ready</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => {
              const Icon = member.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="glass-card border-white/5 h-full group hover:border-primary-500/30 hover:bg-white/[0.05] transition-all duration-500 p-2 overflow-hidden">
                    <CardContent className="p-8 relative">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                        <Icon className="w-32 h-32 rotate-12" />
                      </div>

                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500", member.color)}>
                        <Icon className="h-8 w-8" />
                      </div>

                      <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-primary-400 transition-colors">
                        {member.name}
                      </h3>
                      <div className="flex flex-col gap-1 mb-6">
                        <span className="text-xs font-black text-primary-500 uppercase tracking-widest">
                          {member.role}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Grade 10 • CATA
                        </span>
                      </div>

                      <p className="text-slate-400 leading-relaxed text-sm font-medium">
                        {member.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values & Vision */}
      <section className="section-padding bg-slate-900/40 relative z-10 border-y border-white/[0.03]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="space-y-6 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">{value.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm font-medium">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Board */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 p-16 glass-card border-white/5 bg-white/[0.02]">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tighter group-hover:scale-110 transition-transform duration-500">
                  {stat.value}
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Collaboration */}
      <section className="section-padding pb-32">
        <div className="container-custom">
          <Card className="max-w-6xl mx-auto border border-white/10 bg-gradient-to-br from-primary-600/20 via-slate-950 to-indigo-950/20 backdrop-blur-3xl rounded-[4rem] overflow-hidden p-1 shadow-2xl">
            <CardContent className="p-16 md:p-32 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-mesh opacity-10 pointer-events-none" />
              <div className="relative z-10 max-w-4xl mx-auto">
                <Badge variant="glass" className="mb-10 px-8 py-2 bg-white/5 border-white/10 text-white font-black uppercase tracking-widest text-[10px]">
                  Next Phase Loading
                </Badge>
                <h2 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-[0.9]">
                  Architecting <span className="text-gradient-logo">Better Communities</span>.
                </h2>
                <p className="text-xl text-slate-400 mb-16 font-medium leading-relaxed">
                  Our mission is simple: Combine world-class modern technology with deep local empathy to create digital equity in Monroe, North Carolina.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button variant="gradient" className="h-16 px-12 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-500/20 group" asChild href="/submit-resource">
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                      Expand Hub Network
                    </span>
                  </Button>
                  <Button variant="outline" className="h-16 px-12 rounded-[2rem] font-black uppercase tracking-widest text-xs border-white/10 text-white hover:bg-white/5" asChild href="/resources">
                    <span>Explore Systems</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

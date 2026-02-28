'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, FileText, Target, Sparkles, ArrowRight, CheckCircle, TrendingUp, Info, LogIn, Database, Github, Linkedin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';

const features = [
  {
    icon: FileText,
    title: 'Resume Builder',
    description: 'Create a professional, high-impact resume with AI-driven suggestions for summaries and skills.',
    href: '/career/resume-builder',
    color: 'text-primary-400',
    bg: 'bg-primary-500/10'
  },
  {
    icon: Target,
    title: 'Job Application Helper',
    description: 'Get AI-powered assistance for cover letters and interview preparation tailored to specific roles.',
    href: '/career/job-assistant',
    color: 'text-accent-400',
    bg: 'bg-accent-500/10'
  },
  {
    icon: Briefcase,
    title: 'Local Job Board',
    description: 'Discover curated job opportunities directly within the Monroe and Union County area.',
    href: '/career/jobs',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10'
  }
];

const benefits = [
  'AI-Powered Content Suggestions',
  'Tailored Cover Letter Drafting',
  'Industry-Specific Interview Prep',
  'Direct Access to Local Vacancies',
  'Professional PDF Export Options',
  'Secure Cloud or Local Storage'
];

export default function CareerCenterPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] pt-20">
      <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="glass" className="mb-8 px-5 py-2 border-primary-500/20 text-primary-400 font-bold uppercase tracking-widest text-[10px]">
                <Sparkles className="w-4 h-4 mr-2" />
                Career Advancement Suite
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-[1.1]">
                Your Future, <span className="text-gradient-logo">Accelerated</span>.
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                Elevate your professional presence with our AI-powered career tools.
                Built to help Monroe residents land their next great opportunity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <Card className="bg-white/[0.04] backdrop-blur-xl border border-white/10 text-white max-w-2xl mx-auto rounded-3xl p-2">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-primary-500/20 flex items-center justify-center shrink-0">
                      <Info className="h-6 w-6 text-primary-400" />
                    </div>
                    <div>
                      <p className="font-bold text-lg mb-1">Open Access for Everyone</p>
                      <p className="text-sm text-slate-400">
                        No account required to start. Your progress is saved locally in your browser immediately.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button size="lg" variant="gradient" className="min-w-[220px] h-14 text-lg rounded-full shadow-lg shadow-primary-500/25" asChild href="/career/resume-builder">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Resume Builder
                </span>
              </Button>
              <Button size="lg" variant="outline" className="min-w-[220px] h-14 text-lg rounded-full border-white/10 text-white hover:bg-white/10" asChild href="/career/jobs">
                <span className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Browse Jobs
                </span>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Tools Section */}
      <section className="section-padding relative">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Tools for Every Step</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              From crafting the perfect resume to acing the interview, we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="glass-card p-8 h-full border-white/10 hover:border-primary-500/30 group transition-all duration-300">
                  <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-500/20 transition-all`}>
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-300 transition-colors">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-8">
                    {feature.description}
                  </p>
                  <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 text-white group-hover:bg-white/10" asChild href={feature.href}>
                    <span className="flex items-center gap-2">
                      Access Tool <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Proof Section */}
      <section className="section-padding bg-slate-900/50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">
                Designed for <br /><span className="text-gradient-logo">Real Impact</span>.
              </h2>
              <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-xl">
                We've combined modern recruitment standards with powerful AI
                to give you a competitive edge in today's job market.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-primary-500/10 flex items-center justify-center shrink-0 group-hover:bg-primary-500/20 transition-all">
                      <CheckCircle className="h-4 w-4 text-primary-400" />
                    </div>
                    <span className="text-slate-300 font-medium group-hover:text-white transition-colors">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-primary-500/10 blur-3xl rounded-full" />
              <Card className="relative glass-card p-10 bg-white/[0.04] border-white/10 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <TrendingUp className="w-32 h-32 text-white" />
                </div>
                <div className="text-center relative z-10">
                  <div className="w-16 h-16 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Confidence Level</h3>
                  <div className="text-7xl font-black text-primary-400 mb-4 tracking-tighter">85%</div>
                  <p className="text-slate-400 text-lg max-w-[280px] mx-auto leading-relaxed">
                    of users report significantly higher confidence during applications.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Data Storage Section */}
      <section className="section-padding">
        <div className="container-custom">
          <Card className="bg-gradient-to-br from-primary-900/20 via-slate-900 to-accent-900/10 border-white/10 rounded-[2.5rem] p-8 md:p-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Database className="w-64 h-64 text-white" />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="md:w-1/2">
                <h3 className="text-3xl md:text-4xl font-black text-white mb-6">Secure Your Progress</h3>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                  {user
                    ? "Your career assets are safely synced across all your devices via your secure account."
                    : "As a guest, your work is stored locally in your browser. Create an account to sync your resumes and applications across all your devices."
                  }
                </p>
                {!user && (
                  <div className="flex flex-wrap gap-4">
                    <Button variant="gradient" className="h-12 px-8 rounded-full shadow-lg shadow-primary-500/20" asChild href="/auth/signup">
                      <span className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        Sign Up Now
                      </span>
                    </Button>
                  </div>
                )}
              </div>
              <div className="md:w-1/2 grid grid-cols-2 gap-4">
                <div className="glass-card p-6 rounded-2xl bg-white/5 border-white/5 text-center">
                  <div className="text-3xl font-bold text-white mb-1">Local</div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Storage</div>
                </div>
                <div className="glass-card p-6 rounded-2xl bg-white/5 border-white/5 text-center">
                  <div className="text-3xl font-bold text-primary-400 mb-1">Cloud</div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Sync</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding pb-32">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
              Ready to land your <span className="text-gradient-logo">next great role</span>?
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="gradient" className="h-14 px-12 text-lg rounded-full" asChild href="/career/resume-builder">
                Start Building Free
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-12 text-lg rounded-full border-white/20 text-white hover:bg-white/10" asChild href="/career/job-assistant">
                Get Job Help
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

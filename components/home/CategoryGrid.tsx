'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Utensils, Stethoscope, GraduationCap, Home, Baby, ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Badge } from '@/components/ui/Badge';

const categories = [
    { name: 'Food Assistance', icon: Utensils, description: 'Local food banks and pantries', href: '/resources?category=Food Assistance', color: '#10B981' },
    { name: 'Healthcare', icon: Stethoscope, description: 'Clinics and wellness programs', href: '/resources?category=Healthcare', color: '#4F46E5' },
    { name: 'Education', icon: GraduationCap, description: 'Schools and tutoring aid', href: '/resources?category=Education', color: '#06B6D4' },
    { name: 'Housing', icon: Home, description: 'Shelters and rent assistance', href: '/resources?category=Housing', color: '#F43F5E' },
    { name: 'Family Support', icon: Baby, description: 'Childcare and parent support', href: '/resources?category=Family Support', color: '#F59E0B' },
];

export function CategoryGrid() {
    return (
        <section className="py-16 md:py-24 bg-[#020617] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03),transparent_70%)] pointer-events-none" />

            <div className="container-custom relative z-10">
                <Reveal width="100%">
                    <div className="mb-8 sm:mb-10 md:mb-12 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <div className="h-px w-10 bg-primary-500/50 hidden md:block" />
                            <Badge variant="glass" className="bg-primary-500/10 text-primary-400 border-none font-black uppercase tracking-[0.25em] text-[10px] px-4 py-1.5">
                                Explorer
                            </Badge>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-none">
                            Community <span className="text-gradient-logo">Pillars</span>
                        </h2>
                        <p className="text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed font-medium">
                            Direct access to essential services forming the foundation of our community.
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6 md:gap-6 lg:gap-8">
                    {categories.map((cat, i) => (
                        <Reveal key={cat.name} delay={i * 0.1}>
                            <Link
                                href={cat.href}
                                className="group relative h-full min-h-[200px] sm:min-h-[220px] flex flex-col p-5 sm:p-6 md:p-6 rounded-2xl md:rounded-[1.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl
                                  hover:-translate-y-2 hover:border-primary-500/40 hover:bg-white/[0.06] transition-all duration-500 overflow-hidden shadow-premium hover:shadow-premium-hover"
                            >
                                <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left h-full flex-1">
                                    <div
                                        className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg border border-white/10 relative overflow-hidden group/icon"
                                        style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                                    >
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                                        <cat.icon className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" />
                                    </div>

                                    <h3 className="text-sm sm:text-base lg:text-lg font-black mb-1.5 sm:mb-2 text-white group-hover:text-primary-300 transition-colors uppercase tracking-tight leading-tight">
                                        {cat.name}
                                    </h3>

                                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed mb-3 sm:mb-4 font-medium line-clamp-2 flex-1">
                                        {cat.description}
                                    </p>

                                    <div className="mt-auto pt-2 sm:pt-3 flex items-center justify-center sm:justify-start text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 group-hover:text-white transition-colors">
                                        Explore Hub
                                        <ArrowUpRight className="ml-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 flex-shrink-0" />
                                    </div>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

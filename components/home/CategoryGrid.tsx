'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Utensils, Stethoscope, GraduationCap, Home, Baby, ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const categories = [
    { name: 'Food Assistance', icon: Utensils, description: 'Local food banks and pantries', href: '/resources?category=Food Assistance', color: '#10B981' },
    { name: 'Healthcare', icon: Stethoscope, description: 'Clinics and wellness programs', href: '/resources?category=Healthcare', color: '#4F46E5' },
    { name: 'Education', icon: GraduationCap, description: 'Schools and tutoring aid', href: '/resources?category=Education', color: '#06B6D4' },
    { name: 'Housing', icon: Home, description: 'Shelters and rent assistance', href: '/resources?category=Housing', color: '#F43F5E' },
    { name: 'Family Support', icon: Baby, description: 'Childcare and parent support', href: '/resources?category=Family Support', color: '#F59E0B' },
];

export function CategoryGrid() {
    return (
        <section className="py-24 bg-[#020617] overflow-visible">
            <div className="container-custom">
                <Reveal width="100%">
                    <div className="mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-display uppercase tracking-tight">
                            Community <span className="text-primary-400">Pillars</span>
                        </h2>
                        <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                            Direct access to the essential services that form the foundation of our community.
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {categories.map((cat, i) => (
                        <Reveal key={cat.name} delay={i * 0.1}>
                            <Link
                                href={cat.href}
                                className="group relative h-full flex flex-col p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-xl 
                  hover:-translate-y-2 hover:border-primary-500/30 transition-all duration-500 overflow-hidden"
                            >
                                {/* Hover Gradient Background */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                                    style={{ background: `radial-gradient(circle at center, ${cat.color} 0%, transparent 70%)` }}
                                />

                                <div className="relative z-10">
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 shadow-lg border border-white/10"
                                        style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                                    >
                                        <cat.icon className="h-8 w-8" />
                                    </div>

                                    <h3 className="text-xl font-black mb-4 text-white group-hover:text-primary-300 transition-colors uppercase tracking-tight font-display">
                                        {cat.name}
                                    </h3>

                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        {cat.description}
                                    </p>

                                    <div className="mt-auto flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">
                                        Explore Resources
                                        <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

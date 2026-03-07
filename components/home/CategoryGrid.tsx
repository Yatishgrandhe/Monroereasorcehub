'use client';

import React from 'react';
import Link from 'next/link';
import { Utensils, Stethoscope, GraduationCap, Home, Baby, ArrowUpRight, Briefcase } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';

const categories = [
    { name: 'Food Assistance', icon: Utensils, description: 'Pantries, SNAP help & free meals', href: '/resources?category=Food Assistance', count: 18, accent: 'primary' },
    { name: 'Healthcare', icon: Stethoscope, description: 'Clinics, dental & mental health', href: '/resources?category=Healthcare', count: 24, accent: 'accent' },
    { name: 'Education', icon: GraduationCap, description: 'Schools, tutoring & GED programs', href: '/resources?category=Education', count: 15, accent: 'primary' },
    { name: 'Housing', icon: Home, description: 'Shelters, rental aid & utilities', href: '/resources?category=Housing', count: 11, accent: 'secondary' },
    { name: 'Family Support', icon: Baby, description: 'Childcare, parenting & counseling', href: '/resources?category=Family Support', count: 9, accent: 'accent' },
    { name: 'Career Help', icon: Briefcase, description: 'Jobs, resumes & job training', href: '/career', count: 20, accent: 'primary' },
];

export function CategoryGrid() {
    return (
        <section className="py-32 bg-white relative" data-tour="categories">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

            <div className="container-custom relative z-10">
                <Reveal width="100%">
                    <div className="mb-20 text-center">
                        <span className="text-secondary-500 font-bold uppercase tracking-widest text-xs font-sans">Browse by need</span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary-950 mt-4 mb-6 tracking-tight">
                            What are you looking for<span className="text-secondary-500">.</span>
                        </h2>
                        <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-sans">
                            Every organization below is manually verified so Monroe residents get accurate, up-to-date information.
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((cat, i) => (
                        <Reveal key={cat.name} delay={i * 0.05} width="100%">
                            <Link
                                href={cat.href}
                                className={cn(
                                    "category-card group flex flex-col h-full p-7 bg-white border border-[var(--color-border)] rounded-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_48px_#3461ad1f]",
                                    cat.accent === 'primary' && "hover:border-primary-500 [&_.card-bar]:bg-primary-500 [&_.card-count]:text-primary-600",
                                    cat.accent === 'accent' && "hover:border-accent-500 [&_.card-bar]:bg-accent-500 [&_.card-count]:text-accent-600",
                                    cat.accent === 'secondary' && "hover:border-secondary-500 [&_.card-bar]:bg-secondary-500 [&_.card-count]:text-secondary-600"
                                )}
                            >
                                <div className="card-bar absolute top-0 left-0 right-0 h-1 bg-[var(--color-primary)] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
                                <div className="card-count absolute top-4 right-4 text-[0.7rem] font-bold text-white bg-slate-900 px-3 py-1 rounded-full tracking-wider font-sans group-hover:bg-primary-500 transition-colors">
                                    {cat.count}
                                </div>
                                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-primary-500 mb-4 group-hover:scale-110 group-hover:rotate-[-4deg] transition-transform duration-200">
                                    <cat.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold mb-4 text-primary-950 group-hover:text-primary-600 transition-colors">
                                    {cat.name}
                                </h3>
                                <p className="text-gray-500 text-base leading-relaxed mb-8 flex-1">
                                    {cat.description}
                                </p>
                                <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary-900 group-hover:text-primary-700 transition-colors border-t border-gray-100 pt-6">
                                    Browse resources
                                    <ArrowUpRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}


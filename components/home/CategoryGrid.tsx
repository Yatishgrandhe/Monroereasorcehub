'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Utensils, Stethoscope, GraduationCap, Home, Baby, ArrowUpRight, Briefcase } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const categories = [
    {
        name: 'Food Assistance',
        icon: Utensils,
        description: 'Local food pantries, SNAP enrollment help, and free meal programs across Monroe and Wingate.',
        href: '/resources?category=Food Assistance',
        count: 23
    },
    {
        name: 'Healthcare',
        icon: Stethoscope,
        description: 'Free clinics, mental health support, and sliding-scale healthcare services for Union County residents.',
        href: '/resources?category=Healthcare',
        count: 15
    },
    {
        name: 'Education',
        icon: GraduationCap,
        description: 'Tutoring, adult literacy, GED programs, and after-school support for students of all ages.',
        href: '/resources?category=Education',
        count: 12
    },
    {
        name: 'Housing',
        icon: Home,
        description: 'Emergency shelters, rental assistance programs, and low-income housing resources in Monroe.',
        href: '/resources?category=Housing',
        count: 18
    },
    {
        name: 'Family Support',
        icon: Baby,
        description: 'Childcare subsidies, elder care, and family counseling services to support your loved ones.',
        href: '/resources?category=Family Support',
        count: 20
    },
    {
        name: 'Career Support',
        icon: Briefcase,
        description: 'Job listings, resume assistance, workshops, and career training to help you find your next opportunity.',
        href: '/career',
        count: 14
    },
];

export function CategoryGrid() {
    return (
        <section className="py-32 bg-white relative">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

            <div className="container-custom relative z-10">
                <Reveal width="100%">
                    <div className="mb-20 text-center">
                        <span className="text-primary-600 font-semibold uppercase tracking-widest text-xs">Browse by need</span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary-950 dark:text-white mt-4 mb-6 tracking-tight">
                            What are you looking for?
                        </h2>
                        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Every organization below is manually verified so Monroe residents get accurate, up-to-date information.
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((cat, i) => (
                        <Reveal key={cat.name} delay={i * 0.05} width="100%">
                            <Link
                                href={cat.href}
                                className="group flex flex-col h-full p-10 bg-white border border-gray-100 rounded-[3rem] shadow-soft shadow-gray-200/50 hover:shadow-civic-hover hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <div className="w-16 h-16 rounded-[2rem] bg-primary-50 flex items-center justify-center text-primary-700 shadow-sm border border-primary-100 group-hover:scale-110 group-hover:bg-primary-950 group-hover:text-white transition-all duration-500">
                                        <cat.icon className="h-7 w-7" />
                                    </div>
                                    <div className="px-5 py-2 rounded-full bg-gray-50 border border-gray-100 text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase">
                                        {cat.count} resources
                                    </div>
                                </div>
                                <h3 className="text-3xl font-serif font-black mb-6 text-primary-950 group-hover:text-primary-700 transition-colors">
                                    {cat.name}
                                </h3>
                                <p className="text-gray-500 text-lg leading-relaxed mb-12 flex-1 font-medium italic opacity-80">
                                    {cat.description}
                                </p>
                                <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.3em] text-primary-900 group-hover:text-primary-700 transition-colors border-t border-gray-50 pt-8">
                                    Assess Operations
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


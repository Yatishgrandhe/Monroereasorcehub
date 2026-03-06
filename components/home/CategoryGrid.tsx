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
        <section className="py-32 bg-white dark:bg-[#000d1a] relative">
            <div className="container-custom relative z-10">
                <Reveal width="100%">
                    <div className="mb-24 text-center">
                        <span className="text-secondary-600 font-bold uppercase tracking-[0.4em] text-[10px]">Resource Directory</span>
                        <h2 className="text-5xl md:text-7xl font-serif font-black text-primary-950 dark:text-white mt-6 mb-8 tracking-tight">
                            Find <span className="text-secondary-600">Local Support</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                            Every organization listed below is manually verified to ensure Monroe residents get the most up-to-date information.
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    {categories.map((cat, i) => (
                        <Reveal key={cat.name} delay={i * 0.05} width="100%">
                            <Link
                                href={cat.href}
                                className="civic-card group flex flex-col h-full hover:shadow-2xl hover:border-secondary-500/20 transition-all duration-500 p-12 bg-gray-50/50 dark:bg-primary-900/10 border border-gray-100 dark:border-primary-900"
                            >
                                <div className="flex items-start justify-between mb-10">
                                    <div className="w-16 h-16 rounded-3xl bg-secondary-500/10 flex items-center justify-center text-secondary-600 group-hover:bg-secondary-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                        <cat.icon className="h-8 w-8" />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 tracking-[0.3em] uppercase">
                                        {cat.count} listings
                                    </span>
                                </div>
                                <h3 className="text-3xl font-serif font-black mb-6 text-primary-950 dark:text-white group-hover:text-secondary-600 transition-colors capitalize">
                                    {cat.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-12 flex-1 font-medium opacity-80">
                                    {cat.description}
                                </p>
                                <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.4em] text-primary-900 dark:text-primary-300 group-hover:text-secondary-600 transition-colors">
                                    Explore Directory
                                    <ArrowUpRight className="ml-4 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}


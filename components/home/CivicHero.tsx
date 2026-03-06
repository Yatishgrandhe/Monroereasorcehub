'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CivicHero() {
    return (
        <section className="relative w-full h-[90vh] min-h-[700px] flex items-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Union_County_Courthouse%2C_Monroe%2C_NC_September_2017%2C_front_view.jpg"
                    alt="Historic Union County Courthouse in Monroe, NC"
                    className="w-full h-full object-cover grayscale-[0.3]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-950/70 to-transparent" />
                <div className="absolute inset-0 bg-primary-950/40" />
            </div>

            <div className="container-custom relative z-10 w-full pt-12">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-2 mb-8 text-[11px] font-bold tracking-[0.4em] uppercase text-accent-500 bg-primary-900/60 backdrop-blur-md rounded-lg border border-accent-500/20 shadow-2xl">
                            Official Union County Community Hub
                        </span>
                        <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-serif font-black leading-[0.95] mb-8 drop-shadow-2xl">
                            Real support, <br />
                            <span className="text-accent-500 italic">right next door.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed font-medium max-w-2xl drop-shadow-lg opacity-90">
                            The Monroe Resource Hub connects every resident with verified, human-led community resources—from food pantries to career coaching.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link href="/resources">
                                <Button className="btn-civic-accent !h-16 !px-12 text-sm font-bold uppercase tracking-widest w-full sm:w-auto shadow-[0_20px_50px_rgba(217,119,6,0.3)] transition-all hover:scale-105 active:scale-95">
                                    Browse Resources
                                    <ArrowRight className="ml-3 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button className="bg-white/5 hover:bg-white/10 text-white backdrop-blur-xl border border-white/20 !h-16 !px-12 text-sm font-bold uppercase tracking-widest w-full sm:w-auto transition-all">
                                    Our Local Mission
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative slant */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-white dark:bg-[#000d1a]" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />
        </section>
    );
}

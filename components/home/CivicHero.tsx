'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function CivicHero() {
    return (
        <section className="relative w-full h-[95vh] min-h-[850px] flex items-center overflow-hidden bg-white">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1518173946687-a4c8a9b746f5?auto=format&fit=crop&q=80&w=2000"
                    alt="Union County Architecture"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/80 to-transparent" />
                <div className="absolute inset-0 bg-primary-950/40" />
            </div>

            <div className="container-custom relative z-10 w-full pt-32">
                <div className="max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Badge variant="outline" className="mb-12 px-8 py-3 bg-white/5 backdrop-blur-2xl border-white/20 text-white font-black uppercase tracking-[0.5em] text-[10px] rounded-full shadow-2xl shadow-black/40">
                            The Unified Civic Infrastructure of Monroe, NC
                        </Badge>

                        <h1 className="text-white text-7xl md:text-9xl lg:text-[10rem] mb-12 tracking-tighter leading-[0.8] drop-shadow-2xl">
                            <span className="font-serif italic font-light block mb-4">Unified.</span>
                            <span className="font-sans font-black uppercase tracking-tighter block">Verified. Local.</span>
                        </h1>

                        <p className="text-xl md:text-3xl text-primary-50/70 mb-16 leading-relaxed font-serif italic max-w-3xl drop-shadow-lg">
                            "The Monroe Resource Hub coordinates verified community operations—from essential food security to specialized career development."
                        </p>

                        <div className="flex flex-col sm:flex-row gap-8">
                            <Link href="/resources" className="w-full sm:w-auto">
                                <Button className="bg-white text-primary-950 hover:bg-white/90 h-20 px-16 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-2 group">
                                    Query Directory
                                    <ArrowRight className="ml-4 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/contact" className="w-full sm:w-auto">
                                <Button variant="outline" className="h-20 px-16 rounded-[2rem] border-white/20 text-white hover:bg-white/5 backdrop-blur-md font-black uppercase tracking-[0.3em] text-[10px] w-full transition-all hover:bg-white/10">
                                    Register Organization
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-24 pt-12 border-t border-white/10 flex flex-wrap gap-12 text-white/40 font-black text-[10px] uppercase tracking-[0.4em]">
                            <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 128 Verified Nodes</div>
                            <div>Human-Led Dataset</div>
                            <div>Real-Time Verification</div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </section>
    );
}

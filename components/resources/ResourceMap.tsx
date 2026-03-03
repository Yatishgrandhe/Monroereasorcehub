'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Navigation, Search, Map as MapIcon, Layers } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { Badge } from '@/components/ui/Badge';
import 'leaflet/dist/leaflet.css';

export function ResourceMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !mapRef.current || mapInstanceRef.current) return;

        const initMap = async () => {
            // Import Leaflet dynamically to avoid SSR issues
            const L = (await import('leaflet')).default;

            // Initialize map centered on Monroe, NC
            const map = L.map(mapRef.current!, {
                zoomControl: false, // We'll place it custom if needed, or just hide for cleaner UI
            }).setView([34.9854, -80.5495], 14);

            mapInstanceRef.current = map;

            // Add Tile Layer (OpenStreetMap)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            // Add Zoom Control at the top right
            L.control.zoom({ position: 'topright' }).addTo(map);

            // Load Data from Supabase
            try {
                const { data, error } = await (await import('@/lib/supabase/client')).supabase
                    .from('resources')
                    .select('*, categories(name)')
                    .eq('is_approved', true)
                    .not('latitude', 'is', null)
                    .not('longitude', 'is', null);

                if (error) throw error;

                if (data) {
                    data.forEach((resource: any) => {
                        const latlng = [resource.latitude, resource.longitude] as [number, number];
                        const marker = L.circleMarker(latlng, {
                            radius: 10,
                            fillColor: "#6366f1", // Electric Indigo
                            color: "#ffffff",
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.9,
                        }).addTo(map);

                        const categoryName = resource.categories?.name || 'Resource';

                        marker.bindPopup(`
              <div class="flex flex-col gap-2 min-w-[200px]">
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400">${categoryName}</span>
                <h3 class="text-lg font-black text-white m-0 leading-tight">${resource.name}</h3>
                <p class="text-[13px] text-slate-400 leading-relaxed mt-1 mb-2">${resource.description || ''}</p>
                <div class="mb-2 text-[11px] text-slate-500 italic flex items-center gap-1">
                  <span class="w-1 h-1 rounded-full bg-slate-500"></span>
                  ${resource.address || 'Monroe, NC'}
                </div>
                <a href="/resources/${resource.id}" class="w-full py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all active:scale-[0.97] flex items-center justify-center gap-2 border-none cursor-pointer text-center no-underline">
                  View Full Details
                </a>
              </div>
            `);
                    });
                }
            } catch (error) {
                console.error("Error loading resources from Supabase:", error);
            }
        };

        initMap();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <section className="section-padding-sm overflow-hidden bg-[#020617] relative">
            <div className="container-custom">
                <Reveal width="100%">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-8">
                        <div className="max-w-2xl text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                                <span className="h-[1px] w-8 bg-primary-500/50 hidden md:block" />
                                <Badge variant="glass" className="bg-primary-500/10 text-primary-400 border-none font-black uppercase tracking-[0.3em] text-[10px] px-4 py-1.5">
                                    Geo-Discovery
                                </Badge>
                            </div>
                            <h2 className="text-white mb-6 text-5xl md:text-7xl font-black tracking-tighter leading-none">
                                Explore <span className="text-gradient-logo">Monroe</span>
                            </h2>
                            <p className="text-xl text-slate-400 leading-relaxed font-medium italic">
                                Visualize all community resources in Monroe at a glance. Helping you find support right in your neighborhood.
                            </p>
                        </div>
                        <div className="flex bg-white/[0.03] border border-white/10 rounded-[1.5rem] p-1.5 backdrop-blur-3xl shadow-2xl">
                            <button className="px-6 py-3 rounded-xl bg-primary-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 flex items-center gap-2 transition-all">
                                <MapIcon className="w-4 h-4" />
                                Map
                            </button>
                            <Link href="/resources" className="px-6 py-3 rounded-xl text-slate-500 text-xs font-black uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
                                <Layers className="w-4 h-4" />
                                List
                            </Link>
                        </div>
                    </div>
                </Reveal>

                <Reveal width="100%" delay={0.4}>
                    <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden border border-white/10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] bg-slate-950 group">
                        {/* Real Leaflet Map Container */}
                        <div
                            id="map"
                            ref={mapRef}
                            className="absolute inset-0 z-0"
                        />

                        {/* UI Overlays — Optimized for mobile with higher contrast and better positioning */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none z-10" />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-transparent pointer-events-none z-10" />

                        {/* Top Left Status (Desktop only or very subtle on mobile) */}
                        <div className="absolute top-6 left-6 z-20 hidden sm:flex">
                            <Badge variant="glass" className="bg-emerald-500/20 text-emerald-400 border-none font-black uppercase tracking-widest text-[9px] px-3 py-1 animate-pulse">
                                Live Updates Active
                            </Badge>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pointer-events-none z-20">
                            <Link
                                href="/resources/4d6313bd-c692-4bbf-8cbd-e0097cb2c339"
                                className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-4 sm:p-6 rounded-[2rem] flex items-center gap-4 sm:gap-6 pointer-events-auto shadow-2xl transition-all hover:scale-[1.02] hover:bg-slate-900/60 group/spotlight"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary-500/20 flex items-center justify-center border border-primary-500/20 group-hover/spotlight:scale-110 transition-transform">
                                    <Navigation className="w-6 h-6 sm:w-7 sm:h-7 text-primary-400" />
                                </div>
                                <div className="text-left">
                                    <div className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Regional Spotlight</div>
                                    <div className="text-sm sm:text-lg font-black text-white leading-tight">Union County Crisis Assistance</div>
                                </div>
                            </Link>

                            <div className="flex pointer-events-auto">
                                <Link href="/resources" className="w-full sm:w-auto px-8 sm:px-10 py-5 sm:py-6 bg-white text-black rounded-[1.5rem] sm:rounded-3xl font-black text-xs sm:text-sm shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group/btn uppercase tracking-widest">
                                    <Search className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:scale-125" />
                                    Explore Directory
                                </Link>
                            </div>
                        </div>

                        {/* Decorative vignette */}
                        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.4)] z-10" />
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

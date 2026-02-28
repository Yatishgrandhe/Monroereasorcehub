'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Navigation, Search, Map as MapIcon, Layers } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
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
                    <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-6">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-[1px] w-8 bg-primary-500/50" />
                                <span className="text-xs font-black text-primary-400 uppercase tracking-[0.3em]">Live Resource Discovery</span>
                            </div>
                            <h2 className="text-white mb-4 text-4xl md:text-5xl font-black tracking-tighter">
                                Explore Monroe
                            </h2>
                            <p className="text-xl text-slate-400 leading-relaxed font-medium">
                                Visualize all community resources in Monroe at a glance. Our interactive map connects you to help, right in your neighborhood.
                            </p>
                        </div>
                        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5 self-start md:self-auto backdrop-blur-xl">
                            <button className="px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold shadow-lg shadow-primary-500/20 flex items-center gap-2 transition-all">
                                <MapIcon className="w-4 h-4" />
                                Map View
                            </button>
                            <Link href="/resources" className="px-6 py-2.5 rounded-xl text-slate-400 text-sm font-bold hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
                                <Layers className="w-4 h-4" />
                                Directory
                            </Link>
                        </div>
                    </div>
                </Reveal>

                <Reveal width="100%" delay={0.4}>
                    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-slate-950 group">
                        {/* Real Leaflet Map Container */}
                        <div
                            id="map"
                            ref={mapRef}
                            className="absolute inset-0 z-0"
                        />

                        {/* UI Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none z-10" />

                        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row gap-4 items-center justify-between pointer-events-none z-20">
                            <Link
                                href="/resources/4d6313bd-c692-4bbf-8cbd-e0097cb2c339"
                                className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl flex items-center gap-5 pointer-events-auto shadow-2xl transition-transform hover:scale-[1.02]"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-primary-500/20 flex items-center justify-center border border-primary-500/20">
                                    <Navigation className="w-6 h-6 text-primary-400" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Regional Spotlight</div>
                                    <div className="text-base font-black text-white">Union County Crisis Assistance</div>
                                </div>
                            </Link>

                            <div className="flex gap-3 pointer-events-auto">
                                <Link href="/resources" className="px-8 py-4 bg-white text-black rounded-2xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group/btn">
                                    <Search className="w-4 h-4 transition-transform group-hover/btn:scale-120" />
                                    Explore Full Directory
                                </Link>
                            </div>
                        </div>

                        {/* Decorative vignette */}
                        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.5)] z-10" />
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Map as MapIcon, Layers } from 'lucide-react';
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
            const L = (await import('leaflet')).default;

            const map = L.map(mapRef.current!, {
                zoomControl: false,
            }).setView([34.9854, -80.5495], 14);

            mapInstanceRef.current = map;

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(map);

            L.control.zoom({ position: 'topright' }).addTo(map);

            map.on('click', () => {
                window.open('/resources/map', '_blank', 'noopener,noreferrer');
            });
            map.getContainer().style.cursor = 'pointer';

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
                            fillColor: "#000d1a",
                            color: "#ffffff",
                            weight: 3,
                            opacity: 1,
                            fillOpacity: 1,
                        }).addTo(map);

                        const categoryName = resource.categories?.name || 'Resource';

                        marker.bindPopup(`
                            <div class="flex flex-col gap-4 min-w-[240px] p-4 bg-white rounded-3xl">
                                <span class="text-[9px] font-black uppercase tracking-[0.3em] text-primary-700">${categoryName}</span>
                                <h3 class="text-xl font-serif font-black text-primary-950 m-0 leading-tight italic">${resource.name}</h3>
                                <p class="text-[13px] text-gray-500 leading-relaxed font-medium italic">${resource.description || ''}</p>
                                <div class="flex items-center gap-2 text-[11px] text-gray-400 font-bold uppercase tracking-widest border-t border-gray-50 pt-4">
                                    <span class="w-1.5 h-1.5 rounded-full bg-primary-700 animate-pulse"></span>
                                    ${resource.address || 'Monroe, NC'}
                                </div>
                                <a href="/resources/${resource.id}" class="inline-block mt-2 px-6 py-3 bg-primary-950 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl text-center hover:bg-black transition-all shadow-xl shadow-primary-950/20">
                                    Assess Resource
                                </a>
                            </div>
                        `, {
                            className: 'civic-popup',
                        });
                        marker.on('click', (e: any) => L.DomEvent.stopPropagation(e));
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
        <section className="py-32 bg-white relative overflow-hidden">
            <div className="container-custom relative z-10">
                <Reveal width="100%">
                    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-16 gap-12 text-center lg:text-left">
                        <div className="max-w-2xl">
                            <span className="text-accent-600 font-semibold uppercase tracking-wider text-xs">Map</span>
                            <h2 className="text-primary-950 dark:text-white mt-4 mb-6 text-3xl md:text-4xl font-serif font-bold leading-tight">
                                Resources near you
                            </h2>
                            <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                                See where verified organizations are located across Union County. Click the map to open the full interactive view.
                            </p>
                        </div>
                        <div className="flex bg-primary-50 border border-primary-100 rounded-[2rem] p-2 shadow-sm shrink-0">
                            <button className="px-8 py-4 rounded-[1.5rem] bg-primary-950 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl transition-all">
                                <MapIcon className="w-4 h-4" />
                                Interactive Grid
                            </button>
                            <Link href="/resources" className="px-8 py-4 rounded-[1.5rem] text-primary-950 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center gap-3">
                                <Layers className="w-4 h-4 opacity-50" />
                                List View
                            </Link>
                        </div>
                    </div>
                </Reveal>

                <Reveal width="100%" delay={0.2}>
                    <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] rounded-[4rem] overflow-hidden border border-gray-100 shadow-soft shadow-gray-200/50 bg-gray-50 group">
                        <div id="map" ref={mapRef} className="absolute inset-0 z-0 grayscale transition-all duration-1000 group-hover:grayscale-0" />

                        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/20 via-transparent to-transparent pointer-events-none z-10" />

                        <div className="absolute bottom-10 right-10 flex items-center gap-4 z-20">
                            <Link
                                href="/resources"
                                className="px-10 py-6 bg-primary-950 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-black hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-4 group/btn"
                            >
                                <Search className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                Full Directory Access
                            </Link>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

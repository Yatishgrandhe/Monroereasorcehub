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

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
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
                            radius: 8,
                            fillColor: "#D97706", // Amber
                            color: "#ffffff",
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.9,
                        }).addTo(map);

                        const categoryName = resource.categories?.name || 'Resource';

                        marker.bindPopup(`
                            <div class="flex flex-col gap-2 min-w-[200px] p-2">
                                <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-600">${categoryName}</span>
                                <h3 class="text-lg font-serif font-black text-primary-950 m-0 leading-tight">${resource.name}</h3>
                                <p class="text-[13px] text-gray-600 leading-relaxed mt-1 mb-2 font-medium">${resource.description || ''}</p>
                                <div class="mb-2 text-[11px] text-gray-400 italic flex items-center gap-1">
                                    <span class="w-1 h-1 rounded-full bg-gray-400"></span>
                                    ${resource.address || 'Monroe, NC'}
                                </div>
                                <a href="/resources/${resource.id}" class="inline-block px-4 py-2 bg-primary-950 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg text-center hover:bg-accent-600 transition-colors">
                                    View Details
                                </a>
                            </div>
                        `);
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
        <section className="py-32 bg-white dark:bg-[#000d1a] relative">
            <div className="container-custom">
                <Reveal width="100%">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-10">
                        <div className="max-w-2xl text-center md:text-left">
                            <span className="text-accent-600 font-bold uppercase tracking-[0.2em] text-xs">Resource Localization</span>
                            <h2 className="text-primary-950 dark:text-white mt-4 mb-6 text-5xl md:text-6xl font-serif font-black leading-[1.1]">
                                Explore your <br /><span className="text-secondary-600 italic">local neighborood.</span>
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                                Built in Monroe, for Monroe. Visualize every community resource in Union County at a glance.
                            </p>
                        </div>
                        <div className="flex bg-gray-50 dark:bg-primary-900/30 border border-gray-100 dark:border-primary-800 rounded-2xl p-1.5 shadow-sm shrink-0">
                            <button className="px-6 py-3 rounded-xl bg-primary-950 text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl transition-all">
                                <MapIcon className="w-4 h-4" />
                                Interactive Map
                            </button>
                            <Link href="/resources" className="px-6 py-3 rounded-xl text-primary-950 dark:text-primary-400 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white dark:hover:bg-primary-900/40 transition-all flex items-center gap-2">
                                <Layers className="w-4 h-4" />
                                List View
                            </Link>
                        </div>
                    </div>
                </Reveal>

                <Reveal width="100%" delay={0.2}>
                    <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] rounded-[3rem] overflow-hidden border border-gray-200 dark:border-primary-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] bg-gray-100 dark:bg-primary-950 group">
                        <div
                            id="map"
                            ref={mapRef}
                            className="absolute inset-0 z-0 grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/30 via-transparent to-transparent pointer-events-none z-10" />

                        <div className="absolute bottom-8 right-8 flex items-center gap-4 z-20 pointer-events-none">
                            <Link
                                href="/resources"
                                className="pointer-events-auto px-10 py-5 bg-primary-950 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-accent-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                            >
                                <Search className="w-5 h-5" />
                                Explore Full Directory
                            </Link>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

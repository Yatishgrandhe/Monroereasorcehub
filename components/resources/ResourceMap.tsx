'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Search, Map as MapIcon, Layers, MapPin, RefreshCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { createClient } from '@/lib/supabase/client';
import 'leaflet/dist/leaflet.css';

const MONROE_CENTER: [number, number] = [34.9854, -80.5495];

const FALLBACK_PINS: Array<{ name: string; lat: number; lng: number; category: string; address: string }> = [
  { name: 'Union County DSS', lat: 34.982, lng: -80.553, category: 'Government', address: '1212 W Roosevelt Blvd, Monroe, NC' },
  { name: 'Second Harvest Food Bank (Union)', lat: 34.988, lng: -80.545, category: 'Food', address: 'Serving Monroe, NC' },
  { name: 'Community Care Clinic', lat: 34.981, lng: -80.551, category: 'Healthcare', address: 'Monroe, NC' },
];

type ResourceWithCoords = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  categories?: { name: string } | { name: string }[] | null;
};

export function ResourceMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const [zipQuery, setZipQuery] = useState('');
    const [zipLookupLoading, setZipLookupLoading] = useState(false);
    const [zipLookupError, setZipLookupError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const [resources, setResources] = useState<ResourceWithCoords[]>([]);
    const [loading, setLoading] = useState(true);

    const handleFindNearby = useCallback(async () => {
        if (zipQuery.length !== 5 || !mapInstanceRef.current) return;
        setZipLookupError(null);
        setZipLookupLoading(true);
        try {
            const res = await fetch(`https://api.zippopotam.us/us/${zipQuery}`);
            if (!res.ok) {
                if (res.status === 404) {
                    setZipLookupError('Zip code not found. Try a valid US zip (e.g. 28112).');
                } else {
                    setZipLookupError('Could not look up zip code. Please try again.');
                }
                return;
            }
            const data = await res.json();
            const place = data?.places?.[0];
            if (!place?.latitude || !place?.longitude) {
                setZipLookupError('Could not get location for this zip code.');
                return;
            }
            const lat = parseFloat(place.latitude);
            const lng = parseFloat(place.longitude);
            mapInstanceRef.current.setView([lat, lng], 13);
        } catch {
            setZipLookupError('Could not look up zip code. Please try again.');
        } finally {
            setZipLookupLoading(false);
        }
    }, [zipQuery]);

    const fetchResources = useCallback(async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('resources')
                .select('id, name, description, address, latitude, longitude, categories(name)')
                .eq('is_approved', true);

            if (error) throw error;
            setResources((data as unknown as ResourceWithCoords[]) || []);
        } catch (err) {
            console.error('Error fetching resources:', err);
            setResources([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const pinsToShow = resources.filter(
        (r) => r.latitude != null && r.longitude != null
    );
    const hasDbPins = pinsToShow.length > 0;

    useEffect(() => {
        if (typeof window === 'undefined' || !mapRef.current || viewMode !== 'map') return;

        const initMap = async () => {
            const L = (await import('leaflet')).default;

            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markersRef.current = [];
            }

            const map = L.map(mapRef.current!, { zoomControl: false }).setView(MONROE_CENTER, 14);
            mapInstanceRef.current = map;

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(map);

            L.control.zoom({ position: 'topright' }).addTo(map);

            map.on('click', () => {
                window.open('/resources/map', '_blank', 'noopener,noreferrer');
            });
            map.getContainer().style.cursor = 'pointer';

            const itemsToPin = hasDbPins
                ? pinsToShow
                : FALLBACK_PINS.map((p) => ({
                        id: p.name,
                        name: p.name,
                        description: null,
                        address: p.address,
                        latitude: p.lat,
                        longitude: p.lng,
                        categories: { name: p.category },
                    }));

            itemsToPin.forEach((resource: any) => {
                const lat = resource.latitude ?? resource.lat;
                const lng = resource.longitude ?? resource.lng;
                if (lat == null || lng == null) return;

                const latlng = [lat, lng] as [number, number];
                const marker = L.circleMarker(latlng, {
                    radius: 10,
                    fillColor: "#000d1a",
                    color: "#ffffff",
                    weight: 3,
                    opacity: 1,
                    fillOpacity: 1,
                }).addTo(map);

                markersRef.current.push(marker);

                const cat = resource.categories;
                const categoryName = (Array.isArray(cat) ? cat[0]?.name : cat?.name) || 'Resource';
                const address = resource.address || 'Monroe, NC';
                const detailUrl = /^[0-9a-f-]{36}$/i.test(String(resource.id || ''))
                    ? `/resources/${resource.id}`
                    : '/resources';
                const linkText = /^[0-9a-f-]{36}$/i.test(String(resource.id || '')) ? 'View Details' : 'View Resources';

                marker.bindPopup(`
                    <div class="flex flex-col gap-4 min-w-[240px] p-4 bg-white rounded-3xl">
                        <span class="text-[9px] font-black uppercase tracking-[0.3em] text-primary-700">${categoryName}</span>
                        <h3 class="text-xl font-serif font-black text-primary-950 m-0 leading-tight italic">${resource.name}</h3>
                        <p class="text-[13px] text-gray-500 leading-relaxed font-medium italic">${resource.description || ''}</p>
                        <div class="flex items-center gap-2 text-[11px] text-gray-400 font-bold uppercase tracking-widest border-t border-gray-50 pt-4">
                            <span class="w-1.5 h-1.5 rounded-full bg-primary-700 animate-pulse"></span>
                            ${address}
                        </div>
                        <a href="${detailUrl}" class="inline-block mt-2 px-6 py-3 bg-primary-950 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl text-center hover:bg-black transition-all shadow-xl shadow-primary-950/20">
                            ${linkText}
                        </a>
                    </div>
                `, { className: 'civic-popup' });
                marker.on('click', (e: any) => L.DomEvent.stopPropagation(e));
            });
        };

        initMap();

        return () => {
            markersRef.current.forEach((m) => m?.remove?.());
            markersRef.current = [];
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [viewMode, resources]);

    return (
        <section className="py-32 bg-white dark:bg-[#0f172a] relative overflow-hidden">
            <div className="container-custom relative z-10">
                <Reveal width="100%">
                    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-16 gap-12 text-center lg:text-left">
                        <div className="max-w-2xl">
                            <span className="text-accent-600 font-semibold uppercase tracking-wider text-xs">
                                {viewMode === 'map' ? 'MAP VIEW' : 'LIST VIEW'}
                            </span>
                            <h2 className="text-primary-950 dark:text-white mt-4 mb-6 text-3xl md:text-4xl font-serif font-bold leading-tight">
                                Resources Near You
                            </h2>
                            <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                                {viewMode === 'map'
                                    ? 'See where verified organizations are located across Union County. Click the map to open the full interactive view.'
                                    : 'Browse all verified resources. Data is pulled from our database and refreshed on demand.'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={fetchResources}
                                disabled={loading}
                                className="p-2.5 rounded-xl border border-[var(--color-border)] bg-white dark:bg-white/5 text-[var(--color-text)] hover:bg-gray-50 dark:hover:bg-white/10 transition-all disabled:opacity-50"
                                title="Refresh listings"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                            <div className="flex bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900 rounded-[2rem] p-2 shadow-sm">
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${
                                        viewMode === 'map'
                                            ? 'bg-primary-950 text-white shadow-2xl'
                                            : 'text-primary-950 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10'
                                    }`}
                                >
                                    <MapIcon className="w-4 h-4" />
                                    Map View
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${
                                        viewMode === 'list'
                                            ? 'bg-primary-950 text-white shadow-2xl'
                                            : 'text-primary-950 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10'
                                    }`}
                                >
                                    <Layers className="w-4 h-4" />
                                    List View
                                </button>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {viewMode === 'map' ? (
                    <>
                        <div className="map-search-row flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
                            <div className="flex flex-wrap gap-3 flex-1">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Enter your zip code (e.g. 28112)"
                                    className={`zip-input w-full sm:w-64 px-4 py-3 rounded-xl border bg-white dark:bg-white/5 text-[var(--color-text)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                                        zipLookupError ? 'border-red-500 focus:border-red-500' : 'border-[var(--color-border)] focus:border-primary-500'
                                    }`}
                                    maxLength={5}
                                    value={zipQuery}
                                    onChange={(e) => {
                                        setZipQuery(e.target.value.replace(/\D/g, '').slice(0, 5));
                                        setZipLookupError(null);
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleFindNearby}
                                    disabled={zipQuery.length !== 5 || zipLookupLoading}
                                    className="btn-primary px-6 py-3 rounded-xl bg-primary-950 text-white font-bold text-sm hover:bg-primary-900 transition-all disabled:opacity-50 flex items-center gap-2 shrink-0"
                                >
                                    {zipLookupLoading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Locating…
                                        </>
                                    ) : (
                                        'Find Nearby'
                                    )}
                                </button>
                            </div>
                            {zipLookupError && (
                                <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                                    {zipLookupError}
                                </p>
                            )}
                        </div>

                        <Reveal width="100%" delay={0.2}>
                            <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] rounded-[4rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-soft shadow-gray-200/50 bg-gray-50 dark:bg-white/5 group">
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
                    </>
                ) : (
                    <Reveal width="100%">
                        <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
                            {loading ? (
                                <div className="py-24 text-center">
                                    <RefreshCw className="w-10 h-10 animate-spin mx-auto mb-4 text-primary-500" />
                                    <p className="text-gray-500">Loading resources...</p>
                                </div>
                            ) : resources.length === 0 ? (
                                <div className="py-24 text-center">
                                    <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p className="text-gray-500 mb-6">No resources found in the database yet.</p>
                                    <Link href="/resources" className="text-primary-600 font-semibold hover:underline">
                                        Browse full directory →
                                    </Link>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-100 dark:divide-white/10 max-h-[600px] overflow-y-auto">
                                    {resources.map((r) => (
                                        <li key={r.id}>
                                            <Link
                                                href={`/resources/${r.id}`}
                                                className="flex flex-col sm:flex-row sm:items-center gap-3 p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                                                        {Array.isArray(r.categories) ? r.categories[0]?.name : r.categories?.name || 'Resource'}
                                                    </span>
                                                    <h3 className="text-lg font-serif font-bold text-primary-950 dark:text-white group-hover:text-primary-700 truncate">
                                                        {r.name}
                                                    </h3>
                                                    {r.address && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 shrink-0" />
                                                            {r.address}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="flex items-center gap-2 text-primary-600 font-semibold text-sm shrink-0">
                                                    View details
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {resources.length > 0 && (
                                <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-center">
                                    <Link
                                        href="/resources"
                                        className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
                                    >
                                        View full directory with search & filters
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Reveal>
                )}
            </div>
        </section>
    );
}

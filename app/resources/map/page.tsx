'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export default function ResourceMapPage() {
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
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      try {
        const { data, error } = await (await import('@/lib/supabase/client')).supabase
          .from('resources')
          .select('*, categories(name)')
          .eq('is_approved', true)
          .not('latitude', 'is', null)
          .not('longitude', 'is', null);

        if (!error && data) {
          data.forEach((resource: any) => {
            const latlng = [resource.latitude, resource.longitude] as [number, number];
            const marker = L.circleMarker(latlng, {
              radius: 10,
              fillColor: '#6366f1',
              color: '#ffffff',
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
      } catch (err) {
        console.error('Error loading resources for map:', err);
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
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#020617]">
      <header className="flex-shrink-0 flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 border-b border-white/10 bg-[#020617]/95 backdrop-blur-xl">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-xs sm:text-sm font-semibold transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Directory
        </Link>
        <h1 className="text-sm sm:text-base font-bold text-white truncate">
          Browse Map
        </h1>
        <div className="w-[100px] sm:w-[120px]" aria-hidden />
      </header>
      <div ref={mapRef} className="flex-1 w-full min-h-0" />
    </div>
  );
}

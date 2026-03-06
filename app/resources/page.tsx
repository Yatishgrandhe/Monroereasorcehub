'use client';

import React, { useState } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Dummy data for visual representation - in a real app this comes from Supabase
const DUMMY_RESOURCES = [
  {
    id: '1',
    name: 'Union County Community Care Clinic',
    description: 'Providing free primary care and dental services for low-income, uninsured residents of Union County. A cornerstone of Monroe health equity.',
    address: '410 E Franklin St, Monroe, NC',
    contact_info: { phone: '7042260531' },
    website: 'https://unionclinic.org',
    categories: { name: 'Healthcare', icon: '⚕️' },
    hours_of_operation: { monday: { open: '08:00', close: '17:00' } }
  },
  {
    id: '2',
    name: 'Loaves & Fishes / Friendship Trays',
    description: 'Coordinating emergency food packages and nutritional support for Monroe households facing food insecurity.',
    address: 'Serving all of Monroe, NC',
    contact_info: { phone: '7043773100' },
    website: 'https://loavesandfishes.org',
    categories: { name: 'Food Assistance', icon: '🍎' }
  },
  {
    id: '3',
    name: 'South Piedmont Career Services',
    description: 'Professional development hub offering career coaching, workforce training, and employment networking in Union County.',
    address: '4209 Old Charlotte Hwy, Monroe, NC',
    contact_info: { phone: '7042725300' },
    website: 'https://spcc.edu/career-services',
    categories: { name: 'Career Support', icon: '💼' }
  },
  {
    id: '4',
    name: 'Union County Crisis Assistance',
    description: 'Providing technical and financial aid for essential infrastructure needs, including housing and utility support.',
    address: '1333 W Roosevelt Blvd, Monroe, NC',
    contact_info: { phone: '7042834571' },
    website: 'https://unioncountycrisis.org',
    categories: { name: 'Family Support', icon: '🏠' }
  }
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      {/* Header Section */}
      <section className="pt-48 pb-24 relative z-10">
        <div className="container-custom">
          <Reveal width="100%">
            <div className="max-w-4xl">
              <span className="text-primary-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Community Registry</span>
              <h1 className="text-6xl md:text-8xl font-serif font-black text-primary-950 tracking-tighter leading-[0.9] mb-12 italic">
                Verified Civic <span className="text-primary-700 not-italic">Infrastructure.</span>
              </h1>

              <div className="max-w-3xl">
                <div className="relative group">
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-[2.5rem] px-8 py-3 shadow-soft group-focus-within:bg-white group-focus-within:shadow-civic-hover transition-all duration-500">
                    <Search className="w-5 h-5 text-primary-950/30 mr-6" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Identify community resources in Monroe..."
                      className="bg-transparent border-none text-xl h-16 focus-visible:ring-0 placeholder:text-primary-950/20 text-primary-950 font-serif font-medium"
                    />
                    <Button className="bg-primary-950 hover:bg-black text-white px-10 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hidden md:flex shadow-xl shadow-primary-950/20">
                      Query Registry
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main Directory */}
      <section className="pb-40 relative z-10">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Control Sidebar */}
            <aside className="lg:w-1/4">
              <div className="sticky top-32 space-y-12">
                <div>
                  <h3 className="text-[10px] font-black text-primary-950 uppercase tracking-[0.3em] mb-8 flex items-center border-b border-gray-100 pb-4">
                    <Filter className="w-3.5 h-3.5 mr-3 opacity-30" />
                    Filter Taxonomy
                  </h3>
                  <div className="space-y-4">
                    {['All Resources', 'Food Assistance', 'Healthcare', 'Education', 'Housing', 'Career Support'].map((cat) => (
                      <button
                        key={cat}
                        className={cn(
                          "w-full text-left px-8 py-5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em]",
                          cat === 'All Resources'
                            ? "bg-primary-950 text-white shadow-xl shadow-primary-950/20"
                            : "text-gray-400 hover:text-primary-950 hover:bg-gray-50 bg-white shadow-soft"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-10 bg-primary-50 rounded-[3rem] border border-primary-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-bl-[3rem] pointer-events-none opacity-40" />
                  <h4 className="font-serif font-black text-primary-950 text-xl mb-4 italic leading-tight">Verification Inquiries</h4>
                  <p className="text-sm text-gray-500 leading-relaxed mb-10 font-medium italic">
                    Our human vetting squad ensures all listed resources maintain the highest community standards.
                  </p>
                  <Link href="/contact" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-700 hover:text-primary-950 flex items-center gap-3 group">
                    Request Verification <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Registry Grid */}
            <main className="lg:w-3/4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16 pb-8 border-b border-gray-100">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">
                  Registry Count: <span className="text-primary-950">128 Authenticated Entries</span>
                </p>
                <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sequence:</span>
                  <select className="bg-transparent border-none text-[9px] font-black text-primary-950 focus:ring-0 cursor-pointer uppercase tracking-widest outline-none">
                    <option>Alphabetical (A-Z)</option>
                    <option>Recency Index</option>
                    <option>Operational Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
                {[...DUMMY_RESOURCES, ...DUMMY_RESOURCES].map((resource, i) => (
                  <Reveal key={`${resource.id}-${i}`} delay={(i % 2) * 0.1}>
                    <ResourceCard resource={resource} />
                  </Reveal>
                ))}
              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}

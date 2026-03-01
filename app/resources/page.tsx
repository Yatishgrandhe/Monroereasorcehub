import React from 'react';
import { Hero3D } from '@/components/home/Hero3D';
import { Reveal } from '@/components/ui/Reveal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Filter, MapPin, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Search Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-indigo-950/20 to-transparent">
        <div className="container-custom">
          <Reveal width="100%">
            <div className="max-w-4xl">
              <Badge className="mb-6 bg-primary-500/10 text-primary-400 border-primary-500/20 font-black tracking-widest uppercase text-[10px] px-4 py-1.5 backdrop-blur-md">Directory</Badge>
              <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter">
                Find <span className="text-primary-400 italic font-serif">Support</span> in Monroe.
              </h1>

              <div className="relative group max-w-2xl">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-indigo-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative flex items-center bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-2xl px-6 py-4">
                  <Search className="w-5 h-5 text-slate-500 mr-4" />
                  <Input
                    placeholder="Search by name, category, or service..."
                    className="bg-transparent border-none text-lg h-auto focus-visible:ring-0 placeholder:text-slate-600"
                  />
                  <Button variant="gradient" className="ml-4 rounded-xl px-8 h-12 bg-indigo-600 hover:bg-indigo-500">
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="pb-24">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <aside className="lg:w-1/4">
              <Reveal width="100%">
                <div className="sticky top-24 p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl">
                  <h3 className="text-xl font-black mb-8 uppercase tracking-tight">Refine Results</h3>

                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Urgency</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Low', 'Medium', 'High', 'Immediate'].map((u) => (
                          <button key={u} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-bold hover:bg-primary-500/20 hover:border-primary-500/30 transition-all">
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Distance</h4>
                      <div className="space-y-2">
                        {[5, 10, 25, 50].map((d) => (
                          <label key={d} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-4 h-4 rounded-full border-2 border-white/10 group-hover:border-primary-500 transition-colors" />
                            <span className="text-sm font-medium text-slate-400 group-hover:text-white">Within {d} miles</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </aside>

            {/* Grid */}
            <main className="lg:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Reveal key={i} delay={i * 0.05}>
                    <div className="group relative p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl hover:border-primary-500/30 transition-all duration-500 overflow-hidden">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-indigo-400" />
                        </div>
                        <Badge variant="outline" className="border-white/10 text-slate-400 font-bold">Featured</Badge>
                      </div>

                      <h3 className="text-2xl font-black mb-3 text-white">Monroe Food Bank</h3>
                      <p className="text-slate-400 leading-relaxed font-medium mb-8">
                        Providing nutritional support and essential grocery items to families across the Monroe county area.
                      </p>

                      <div className="space-y-3 mb-8">
                        <div className="flex items-center text-sm font-bold text-slate-500">
                          <MapPin className="w-4 h-4 mr-2 text-indigo-400" />
                          123 Community Pl, Monroe, NC
                        </div>
                        <div className="flex items-center text-sm font-bold text-slate-500">
                          <Clock className="w-4 h-4 mr-2 text-emerald-400" />
                          Open Today: 9:00 AM - 5:00 PM
                        </div>
                      </div>

                      <Button variant="outline" className="w-full rounded-2xl border-white/10 hover:bg-white/5 py-6">
                        View Details
                      </Button>
                    </div>
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

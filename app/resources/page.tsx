'use client';

import React, { useState } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Filter } from 'lucide-react';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Dummy data for visual representation - in a real app this comes from Supabase
const DUMMY_RESOURCES = [
  {
    id: '1',
    name: 'Union County Community Care Clinic',
    description: 'Providing free primary care and dental services for low-income, uninsured residents of Union County.',
    address: '410 E Franklin St, Monroe, NC',
    contact_info: { phone: '7042260531' },
    website: 'https://unionclinic.org',
    categories: { name: 'Healthcare', icon: '⚕️' },
    hours_of_operation: { monday: { open: '08:00', close: '17:00' } }
  },
  {
    id: '2',
    name: 'Second Harvest Food Bank',
    description: 'Leading the fight against hunger in the Monroe area through local food distribution networks.',
    address: 'Serving all of Union County',
    contact_info: { phone: '7043761785' },
    website: 'https://www.secondharvestmetrolina.org',
    categories: { name: 'Food Assistance', icon: '🍎' }
  },
  {
    id: '3',
    name: 'Communities In Schools',
    description: 'Empowering Monroe students to stay in school and achieve in life through integrated support systems.',
    address: '1600-A Skyway Dr, Monroe, NC',
    contact_info: { phone: '7042821323' },
    website: 'https://cisunion.org',
    categories: { name: 'Education', icon: '🎓' }
  },
  {
    id: '4',
    name: 'Union County DSS',
    description: 'Connecting families with essential safety nets including SNAP, Medicaid, and emergency aid.',
    address: '1212 W Roosevelt Blvd, Monroe, NC',
    contact_info: { phone: '7042964300' },
    website: 'https://www.unioncountync.gov',
    categories: { name: 'Family Support', icon: '🏠' }
  }
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white dark:bg-[#000d1a]">
      {/* Search Header */}
      <section className="pt-32 pb-16 bg-primary-950 text-white">
        <div className="container-custom">
          <Reveal width="100%">
            <div className="max-w-4xl">
              <span className="text-accent-500 font-bold uppercase tracking-[0.2em] text-xs">Directory</span>
              <h1 className="text-5xl md:text-7xl font-serif font-black mt-6 mb-8 tracking-tight">
                Community <span className="text-accent-500">Resource Hub</span>
              </h1>

              <div className="relative group max-w-2xl">
                <div className="relative flex items-center bg-white rounded-xl px-6 py-2 shadow-xl">
                  <Search className="w-5 h-5 text-gray-400 mr-4" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resources in Monroe..."
                    className="bg-transparent border-none text-lg h-12 focus-visible:ring-0 placeholder:text-gray-400 text-gray-900 font-serif"
                  />
                  <Button className="btn-civic-primary ml-4 px-8 h-12 font-bold uppercase tracking-widest text-xs hidden sm:flex">
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <aside className="lg:w-1/4">
              <div className="sticky top-24 space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center">
                    <Filter className="w-3.5 h-3.5 mr-2" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {['All Resources', 'Food Assistance', 'Healthcare', 'Education', 'Housing', 'Career Support'].map((cat) => (
                      <button
                        key={cat}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all",
                          cat === 'All Resources'
                            ? "bg-primary-900 text-white shadow-md shadow-primary-900/20"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-primary-900/30"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100 dark:border-primary-900">
                  <div className="p-6 bg-accent-500/5 rounded-2xl border border-accent-500/10">
                    <h4 className="font-serif font-bold text-primary-950 dark:text-white mb-2">Need help?</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      If you can&apos;t find what you&apos;re looking for, our team is here to assist.
                    </p>
                    <Link href="/contact" className="text-xs font-bold uppercase tracking-widest text-accent-600 hover:underline">
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Grid */}
            <main className="lg:w-3/4">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-primary-900">
                <p className="text-sm text-gray-500 font-medium font-serif">
                  Showing <span className="text-primary-950 dark:text-white font-bold">128 verified resources</span> in Union County
                </p>
                <select className="bg-transparent border-none text-sm font-bold text-primary-950 dark:text-white focus:ring-0 cursor-pointer">
                  <option>Sort by: Name (A-Z)</option>
                  <option>Sort by: Recently Updated</option>
                  <option>Sort by: Most Relevant</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {DUMMY_RESOURCES.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
                {/* Repeat for visual density */}
                {DUMMY_RESOURCES.map((resource) => (
                  <ResourceCard key={resource.id + '_2'} resource={resource} />
                ))}
              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}

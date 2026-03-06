'use client';

import React, { useState, useEffect } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { useResourceSearch } from '@/hooks/useResourceSearch';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PageSplineBanner } from '@/components/ui/PageSplineBanner';
import { SPLINE_PAGES_URL } from '@/lib/spline';

const DEFAULT_CATEGORIES = ['Food Assistance', 'Healthcare', 'Education', 'Housing', 'Family Support', 'Career Support'];

export default function ResourcesPage() {
  const { state, results, totalCount, isLoading, updateQuery, updateFilters, updateSort } = useResourceSearch();
  const [categoryOptions, setCategoryOptions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const supabase = createClient();
      const { data } = await supabase.from('categories').select('id, name').order('name');
      if (data) setCategoryOptions(data);
    }
    loadCategories();
  }, []);

  const categoryChips = categoryOptions.length > 0
    ? ['All', ...categoryOptions.map((c) => c.name)]
    : ['All', ...DEFAULT_CATEGORIES];
  const activeCategory = state.filters.category[0] || 'All';

  return (
    <div className="min-h-screen bg-white dark:bg-[#000d1a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      <PageSplineBanner sceneUrl={SPLINE_PAGES_URL || undefined} height="38vh">
        <div className="container-custom w-full">
          <Reveal width="100%">
            <div className="flex flex-col items-start gap-4">
              <span className="px-5 py-2 rounded-full bg-accent-500/10 border border-accent-400/20 text-accent-400 font-black uppercase tracking-[0.3em] text-[10px] backdrop-blur-md">
                Verified Directory
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white tracking-tighter leading-none italic mb-4">
                Resources<span className="text-secondary-500 not-italic">.</span>
              </h1>
              <div className="w-24 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mb-6" />
              <p className="text-xl md:text-2xl text-blue-50/70 max-w-2xl leading-relaxed italic font-medium">
                Find every verified organization, initiative, and resource driving Monroe forward.
              </p>
            </div>
          </Reveal>
        </div>
      </PageSplineBanner>

      <section className="relative z-20 -mt-16 sm:-mt-24 pb-20">
        <div className="container-custom">
          <Reveal width="100%">
            <div className="bg-white/80 dark:bg-primary-950/80 rounded-[3rem] p-6 sm:p-8 shadow-2xl border border-white/20 dark:border-primary-800/50 backdrop-blur-2xl ring-1 ring-black/5">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-1 group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-primary-500 transition-transform group-focus-within:scale-110" />
                  </div>
                  <Input
                    value={state.query}
                    onChange={(e) => updateQuery(e.target.value)}
                    placeholder="Search by mission, zip code, or organization..."
                    className="pl-16 h-16 sm:h-24 rounded-[2rem] border-none bg-primary-50/50 dark:bg-primary-900/30 text-xl sm:text-2xl font-medium placeholder:text-gray-400 focus-visible:ring-4 focus-visible:ring-primary-500/10 transition-all shadow-inner"
                  />
                  {state.query && (
                    <button
                      onClick={() => updateQuery('')}
                      className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-white dark:hover:bg-white/10 rounded-full transition-colors"
                    >
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">Clear</span>
                    </button>
                  )}
                </div>
                <div className="flex gap-4 sm:min-w-[240px]">
                  <div className="relative flex-1">
                    <div className="absolute left-6 top-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 pointer-events-none">Sort By</div>
                    <select
                      value={`${state.sortBy}-${state.sortOrder}`}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split('-');
                        updateSort(sortBy as 'name' | 'created_at' | 'relevance', sortOrder as 'asc' | 'desc');
                      }}
                      className="w-full h-16 sm:h-24 pt-8 pb-3 px-6 sm:px-8 rounded-[2rem] border-none bg-primary-50/50 dark:bg-primary-900/30 text-sm font-bold uppercase tracking-widest text-primary-950 dark:text-white outline-none focus:ring-4 focus:ring-primary-500/10 transition-all cursor-pointer shadow-inner appearance-none"
                    >
                      <option value="relevance-desc">Relevance</option>
                      <option value="name-asc">Alphabetical</option>
                      <option value="created_at-desc">Newest Added</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 relative z-10">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <aside className="lg:w-56 shrink-0">
              <div className="sticky top-28">
                <h3 className="text-xs font-bold text-primary-950 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  Category
                </h3>
                <div className="space-y-1">
                  {categoryChips.map((label) => (
                    <button
                      key={label}
                      onClick={() =>
                        updateFilters({
                          category: label === 'All' ? [] : [label],
                        })
                      }
                      className={cn(
                        'w-full text-left px-5 py-3.5 rounded-2xl text-[13px] font-bold tracking-wide transition-all duration-300',
                        (label === 'All' && activeCategory === 'All') || activeCategory === label
                          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-primary-900/30 hover:text-primary-500 hover:shadow-sm'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        {label}
                        {((label === 'All' && activeCategory === 'All') || activeCategory === label) && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-glow" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-8 p-6 rounded-[2rem] bg-secondary-50 dark:bg-secondary-950/20 border border-secondary-100 dark:border-secondary-900/30 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-secondary-100 dark:bg-secondary-900/20 rounded-bl-[2rem] pointer-events-none transition-transform group-hover:scale-110" />
                  <p className="text-sm text-secondary-900 dark:text-secondary-200 font-bold mb-4 relative z-10">
                    Know an organization we should list?
                  </p>
                  <Link href="/submit-resource" className="relative z-10">
                    <Button variant="secondary" size="sm" className="w-full rounded-xl text-[10px] font-black uppercase tracking-[0.2em] h-11">
                      Share a resource
                      <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <p className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    {isLoading ? (
                      "Scanning Database..."
                    ) : (
                      <>
                        <span className="text-primary-950 dark:text-white">{totalCount}</span> Results Found
                      </>
                    )}
                  </p>
                </div>
              </div>

              {!isLoading && results.length === 0 && (
                <div className="rounded-2xl border border-gray-200 dark:border-primary-800 bg-gray-50 dark:bg-primary-950/30 p-12 text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {state.query || state.filters.category.length
                      ? 'No resources match your search. Try a different filter or keyword.'
                      : "We're adding more organizations — submit one here."}
                  </p>
                  <Link href="/submit-resource">
                    <Button className="rounded-xl font-semibold">Share a resource</Button>
                  </Link>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {results.map((resource, i) => (
                  <Reveal key={resource.id} delay={i % 2 ? 0.05 : 0}>
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

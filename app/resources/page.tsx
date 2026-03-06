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
            <span className="section-label block mb-4 text-[var(--color-accent-soft)]">Community resources</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight mb-4">
              Resources
            </h1>
            <p className="text-lg text-gray-200 max-w-2xl mb-6">
              Every listing is verified by our team. Search by name, zip code, or type of help.
            </p>
          </Reveal>
        </div>
      </PageSplineBanner>

      <section className="pb-16 md:pb-24 relative z-10 -mt-4">
        <div className="container-custom">
          <Reveal width="100%">
            <div className="max-w-2xl mb-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={state.query}
                  onChange={(e) => updateQuery(e.target.value)}
                  placeholder="Search by name, zip code, or type of help..."
                  className="pl-12 h-14 rounded-2xl border-gray-200 dark:border-primary-800 bg-white dark:bg-primary-950/50 text-base"
                />
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
                        'w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all',
                        (label === 'All' && activeCategory === 'All') || activeCategory === label
                          ? 'bg-primary-950 dark:bg-primary-700 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-primary-900/50'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="mt-8 p-4 rounded-2xl bg-primary-50 dark:bg-primary-950/50 border border-primary-100 dark:border-primary-800">
                  <p className="text-sm text-primary-800 dark:text-primary-200 font-medium mb-3">
                    Know an organization we should list?
                  </p>
                  <Link href="/submit-resource">
                    <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold">
                      Share a resource
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    <>
                      <span className="font-semibold text-primary-950 dark:text-white">{totalCount}</span> resources
                    </>
                  )}
                </p>
                <select
                  value={`${state.sortBy}-${state.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    updateSort(sortBy as 'name' | 'created_at' | 'relevance', sortOrder as 'asc' | 'desc');
                  }}
                  className="rounded-xl border border-gray-200 dark:border-primary-800 bg-white dark:bg-primary-950/50 px-4 py-2 text-sm text-primary-950 dark:text-white focus:ring-2 focus:ring-primary-500/20 outline-none"
                >
                  <option value="relevance-desc">Relevance</option>
                  <option value="name-asc">Name (A–Z)</option>
                  <option value="created_at-desc">Recently added</option>
                </select>
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

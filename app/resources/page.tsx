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
    <div className="min-h-screen bg-[var(--color-bg)] dark:bg-[#0f172a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      <PageSplineBanner sceneUrl={SPLINE_PAGES_URL || undefined} height="36vh">
        <div className="container-custom w-full">
          <Reveal width="100%">
            <span className="section-label block mb-4 text-[var(--color-accent-soft)]">Community resources</span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight mb-4">
              Resources
            </h1>
            <p className="text-base md:text-lg text-gray-200 max-w-2xl">
              Every listing is verified by our team. Search by name, zip code, or type of help.
            </p>
          </Reveal>
        </div>
      </PageSplineBanner>

      <section className="relative z-10 pt-10 pb-16 md:pt-12 md:pb-24">
        <div className="container-custom">
          <Reveal width="100%">
            <div className="bg-[var(--color-surface)] dark:bg-[#1e293b] rounded-2xl p-4 sm:p-6 shadow-sm border border-[var(--color-border)] dark:border-white/10 mb-10">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
                  <Input
                    value={state.query}
                    onChange={(e) => updateQuery(e.target.value)}
                    placeholder="Search by name, zip code, or type of help..."
                    className="pl-12 h-12 rounded-xl border-[var(--color-border)] bg-white dark:bg-white/5 text-[var(--color-text)] placeholder:text-[var(--color-text-light)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                  />
                </div>
                <div className="flex gap-3 items-center shrink-0">
                  <label className="text-sm font-semibold text-[var(--color-text-muted)] whitespace-nowrap">Sort</label>
                  <select
                    value={`${state.sortBy}-${state.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      updateSort(sortBy as 'name' | 'created_at' | 'relevance', sortOrder as 'asc' | 'desc');
                    }}
                    className="h-12 px-4 rounded-xl border border-[var(--color-border)] bg-white dark:bg-white/5 text-sm font-medium text-[var(--color-text)] dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none cursor-pointer"
                  >
                    <option value="relevance-desc">Relevance</option>
                    <option value="name-asc">A–Z</option>
                    <option value="created_at-desc">Newest</option>
                  </select>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <aside className="lg:w-52 shrink-0">
              <div className="sticky top-28">
                <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Category
                </h3>
                <div className="space-y-1">
                  {categoryChips.map((label) => (
                    <button
                      key={label}
                      onClick={() => updateFilters({ category: label === 'All' ? [] : [label] })}
                      className={cn(
                        'w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                        (label === 'All' && activeCategory === 'All') || activeCategory === label
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'text-[var(--color-text-muted)] hover:bg-[var(--color-border)]/50 hover:text-[var(--color-primary)]'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-[var(--color-border)]/30 dark:bg-white/5 border border-[var(--color-border)] dark:border-white/10">
                  <p className="text-sm text-[var(--color-text)] dark:text-gray-200 font-medium mb-3">
                    Know an organization we should list?
                  </p>
                  <Link href="/submit-resource">
                    <Button className="w-full rounded-xl text-sm font-semibold bg-[var(--color-primary)] hover:opacity-90 text-white">
                      Share a resource
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4 mb-6">
                <p className="text-sm text-[var(--color-text-muted)]">
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    <>
                      <span className="font-semibold text-[var(--color-text)] dark:text-white">{totalCount}</span> resources
                    </>
                  )}
                </p>
              </div>

              {!isLoading && results.length === 0 && (
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] dark:bg-white/5 p-12 text-center">
                  <p className="text-[var(--color-text-muted)] mb-6">
                    {state.query || (activeCategory !== 'All' && activeCategory)
                      ? 'No resources match your search. Try a different filter or keyword.'
                      : "We're adding more organizations — submit one here."}
                  </p>
                  <Link href="/submit-resource">
                    <Button className="rounded-xl font-semibold bg-[var(--color-primary)] text-white hover:opacity-90">
                      Share a resource
                    </Button>
                  </Link>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
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

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
    <div className="min-h-screen bg-[var(--color-bg)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      <PageSplineBanner sceneUrl={SPLINE_PAGES_URL || undefined} height="38vh">
        <div className="container-custom w-full">
          <Reveal width="100%">
            <div className="flex flex-col items-start gap-4 text-left">
              <span className="px-5 py-2 rounded-full bg-accent-500/10 border border-accent-400/20 text-accent-400 font-black uppercase tracking-[0.3em] text-[10px] backdrop-blur-md">
                Community Verified
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white tracking-tighter leading-none italic mb-4">
                Resources<span className="text-secondary-500 not-italic">.</span>
              </h1>
              <div className="w-24 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mb-6" />
              <p className="text-xl md:text-2xl text-blue-50/70 max-w-3xl leading-relaxed italic font-medium">
                Every listing is community verified. Search by name, zip code, or type of help.
              </p>
            </div>
          </Reveal>
        </div>
      </PageSplineBanner>

      <section className="relative z-20 pt-10 pb-16 md:pt-12 md:pb-24">
        <div className="container-custom">
          <Reveal width="100%">
            <div className="bg-[var(--color-surface)] rounded-2xl p-4 sm:p-6 shadow-sm border border-[var(--color-border)] mb-10">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
                  <Input
                    value={state.query}
                    onChange={(e) => updateQuery(e.target.value)}
                    placeholder="Search by name, zip code, or type of help..."
                    className="pl-12 h-12 rounded-xl border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder:text-[var(--color-text-light)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
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
                    className="h-12 px-4 rounded-xl border border-[var(--color-border)] bg-white text-sm font-medium text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none cursor-pointer"
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
                <div className="mt-6 p-4 rounded-xl bg-[var(--color-border)]/30 border border-[var(--color-border)]">
                  <p className="text-sm text-[var(--color-text)] font-medium mb-3">
                    Know an organization we should list?
                  </p>
                  <Button asChild href="/submit-resource" className="w-full rounded-xl text-sm font-semibold bg-[var(--color-primary)] hover:opacity-90 text-white">
                    <span className="flex items-center justify-center">
                      Share a resource
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </Button>
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
                      <span className="font-semibold text-[var(--color-text)]">{totalCount}</span> community-verified resources
                    </>
                  )}
                </p>
              </div>

              {!isLoading && results.length === 0 && (
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
                  <p className="text-[var(--color-text-muted)] mb-6">
                    {state.query || (activeCategory !== 'All' && activeCategory)
                      ? 'No resources match your search. Try a different filter or keyword.'
                      : "We're adding more organizations — submit one here."}
                  </p>
                  <Button asChild href="/submit-resource" className="rounded-xl font-semibold bg-[var(--color-primary)] text-white hover:opacity-90">
                    <span>Share a resource</span>
                  </Button>
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

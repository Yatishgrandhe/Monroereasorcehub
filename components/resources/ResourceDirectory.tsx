'use client';

import { useState, useEffect } from 'react';
import { Grid, List, SlidersHorizontal, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterPanel, FilterGroup } from '@/components/ui/FilterPanel';
import { ResourceCard } from './ResourceCard';
import { useResourceSearch } from '@/hooks/useResourceSearch';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database';
import { Badge } from '@/components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ResourceSkeleton } from '@/components/ui/Skeleton';

type Resource = Database['public']['Tables']['resources']['Row'] & {
  categories: Database['public']['Tables']['categories']['Row'];
};

type Category = Database['public']['Tables']['categories']['Row'];

export function ResourceDirectory() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allServices, setAllServices] = useState<string[]>([]);
  const [allPopulations, setAllPopulations] = useState<string[]>([]);

  const {
    state,
    results,
    totalCount,
    isLoading,
    updateQuery,
    updateFilters,
    updateSort,
    updatePage,
    clearAll,
  } = useResourceSearch();

  useEffect(() => {
    async function loadFilterOptions() {
      const supabase = createClient();
      const { data: categoriesData } = await supabase.from('categories').select('*').order('name');
      if (categoriesData) setCategories(categoriesData);

      const { data: resourcesData } = await supabase.from('resources').select('services_offered, population_served').eq('is_approved', true);
      if (resourcesData) {
        const services = new Set<string>();
        const populations = new Set<string>();
        resourcesData.forEach(resource => {
          resource.services_offered?.forEach((service: string) => services.add(service));
          resource.population_served?.forEach((population: string) => populations.add(population));
        });
        setAllServices(Array.from(services).sort());
        setAllPopulations(Array.from(populations).sort());
      }
    }
    loadFilterOptions();
  }, []);

  const organizeServices = (services: string[]) => {
    const serviceGroups = {
      'Healthcare & Medical': ['Primary Care', 'Dental Services', 'Behavioral Health', 'Pharmacy', 'Emergency Care', 'Surgery', 'Cancer Treatment', 'Long-term Care', 'Specialty Care Clinics', 'Women and Children\'s Center', 'Community Wellness', 'Interventional Heart Program', 'Physician Practices', 'Pediatric Emergency Department', 'Health Screenings', 'Nutrition Counseling', 'Wellness Checks'],
      'Education & Learning': ['Educational Programs', 'Research Assistance', 'Children\'s Programs', 'Adult Literacy', 'K-12 Education', 'Special Education', 'Adult Education', 'ESL Programs', 'Career and Technical Education', 'Advanced Placement Courses', 'Athletics', 'Arts Programs', 'Nutrition Education'],
      'Food & Nutrition': ['Food Distribution', 'Emergency Food Assistance', 'Child Hunger Programs', 'Senior Nutrition', 'Mobile Food Pantries', 'Community Gardens', 'Meal Delivery', 'Emergency Food', 'Holiday Meals'],
      'Housing & Shelter': ['Public Housing', 'Section 8 Vouchers', 'Housing Counseling', 'Emergency Shelter'],
      'Employment & Career': ['Job Training', 'Resume Writing', 'Interview Preparation', 'Job Placement', 'Case Management'],
      'Family & Community': ['Social Activities', 'Childcare Referrals', 'Financial Assistance', 'Provider Training', 'Quality Ratings', 'Parenting Classes', 'Childcare Resources', 'Family Counseling', 'Support Groups', 'Individual Counseling', 'Family Therapy', 'Family Counseling', 'Group Therapy', 'Crisis Intervention'],
      'Legal & Advocacy': ['Family Law', 'Housing Law', 'Consumer Protection', 'Estate Planning'],
      'Transportation': ['Fixed Route Service', 'Paratransit', 'Senior Transportation', 'Medical Transportation'],
      'Library & Technology': ['Book Lending', 'Computer Access', 'Digital Resources', 'Meeting Rooms']
    };

    const organizedServices: { [key: string]: string[] } = {};
    services.forEach(service => {
      let found = false;
      for (const [group, groupServices] of Object.entries(serviceGroups)) {
        if (groupServices.includes(service)) {
          if (!organizedServices[group]) organizedServices[group] = [];
          organizedServices[group].push(service);
          found = true;
          break;
        }
      }
      if (!found) {
        if (!organizedServices['Other Services']) organizedServices['Other Services'] = [];
        organizedServices['Other Services'].push(service);
      }
    });
    return organizedServices;
  };

  const organizePopulations = (populations: string[]) => {
    const populationGroups = {
      'Age Groups': ['Children', 'Teens', 'Adults', 'Seniors', 'Elderly', 'All Ages'],
      'Family Status': ['Families', 'Parents', 'Single Adults'],
      'Special Needs': ['Disabled', 'Disabled Adults', 'Homeless', 'Veterans'],
      'Economic Status': ['Low Income', 'Uninsured', 'Unemployed'],
      'Life Stage': ['Students', 'Job Seekers', 'Career Changers', 'Childcare Providers']
    };
    const organizedPopulations: { [key: string]: string[] } = {};
    populations.forEach(population => {
      let found = false;
      for (const [group, groupPopulations] of Object.entries(populationGroups)) {
        if (groupPopulations.includes(population)) {
          if (!organizedPopulations[group]) organizedPopulations[group] = [];
          organizedPopulations[group].push(population);
          found = true;
          break;
        }
      }
      if (!found) {
        if (!organizedPopulations['Other Populations']) organizedPopulations['Other Populations'] = [];
        organizedPopulations['Other Populations'].push(population);
      }
    });
    return organizedPopulations;
  };

  const filterGroups: FilterGroup[] = [
    {
      id: 'category',
      label: 'Category',
      type: 'multiple',
      options: categories.map(cat => ({ id: cat.id, label: cat.name, value: cat.name })),
    },
    {
      id: 'services',
      label: 'Services Offered',
      type: 'multiple',
      options: Object.entries(organizeServices(allServices)).flatMap(([group, services]) =>
        services.map(service => ({ id: service, label: service, value: service, group: group }))
      ),
    },
    {
      id: 'population',
      label: 'Population Served',
      type: 'multiple',
      options: Object.entries(organizePopulations(allPopulations)).flatMap(([group, populations]) =>
        populations.map(population => ({ id: population, label: population, value: population, group: group }))
      ),
    },
  ];

  const totalPages = Math.ceil(totalCount / state.limit);

  return (
    <div className="min-h-screen bg-[#020617] pt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
      <div className="container-custom section-padding">
        {/* Header Section */}
        <div className="mb-12 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="glass" className="mb-6 px-4 py-1.5 border-primary-500/20 text-primary-400 font-bold uppercase tracking-widest text-[10px]">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Resource Directory
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              Find <span className="text-gradient-logo">Support</span> in Monroe
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
              Browse our comprehensive list of local organizations and services. We've vetted everything to ensure you find high-quality help quickly.
            </p>
          </motion.div>
        </div>

        {/* Search & Layout Controls Row */}
        <div className="mb-10 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="flex-1">
            <SearchBar
              value={state.query}
              onChange={updateQuery}
              onClear={() => updateQuery('')}
              placeholder="Search by name, service, or keyword..."
              loading={isLoading}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
              className={cn("lg:hidden h-14 rounded-2xl border-white/10 text-white flex items-center gap-2", showFilters && "bg-white/10")}
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filters</span>
            </Button>

            <div className="flex items-center h-14 p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "h-11 w-12 rounded-xl border-none transition-all",
                  viewMode === 'grid' ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Grid className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  "h-11 w-12 rounded-xl border-none transition-all",
                  viewMode === 'list' ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(showFilters || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={cn("lg:col-span-1 lg:block", !showFilters && "hidden")}
              >
                <FilterPanel
                  filters={filterGroups}
                  selectedFilters={{
                    category: state.filters.category,
                    services: state.filters.services,
                    population: state.filters.population,
                  }}
                  onFilterChange={(filterId, values) => updateFilters({ [filterId]: values })}
                  onClearAll={clearAll}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <p className="text-slate-400 font-medium">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                    Updating results...
                  </span>
                ) : (
                  <>Showing <span className="text-white font-bold">{totalCount}</span> resources</>
                )}
              </p>

              <select
                value={`${state.sortBy}-${state.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  updateSort(sortBy as any, sortOrder as any);
                }}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all cursor-pointer"
              >
                <option value="relevance-desc" className="bg-slate-900">Relevance</option>
                <option value="name-asc" className="bg-slate-900">Name (A-Z)</option>
                <option value="created_at-desc" className="bg-slate-900">Recently Added</option>
              </select>
            </div>

            {isLoading && results.length === 0 ? (
              <div className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              )}>
                {[1, 2, 3, 4, 5, 6].map(i => <ResourceSkeleton key={i} />)}
              </div>
            ) : results.length > 0 ? (
              <motion.div
                layout
                className={cn(
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                )}
              >
                <AnimatePresence mode='popLayout'>
                  {results.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      showCategory={viewMode === 'grid'}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 glass-card rounded-3xl border-dashed border-white/10"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Grid className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No resources found</h3>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                  Try adjusting your filters or search keywords to find what you're looking for.
                </p>
                <Button variant="outline" onClick={clearAll} className="rounded-full border-white/10 text-white">
                  Reset everything
                </Button>
              </motion.div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-16 p-6 glass-card rounded-2xl border-white/5">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updatePage(state.page - 1)}
                    disabled={state.page <= 1}
                    className="h-10 rounded-xl hover:bg-white/5 text-slate-400 disabled:opacity-30"
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Previous
                  </Button>

                  <div className="hidden sm:flex items-center gap-1.5 px-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, state.page - 2) + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <Button
                          key={pageNum}
                          onClick={() => updatePage(pageNum)}
                          className={cn(
                            "h-10 w-10 rounded-xl transition-all border-none font-bold",
                            pageNum === state.page
                              ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                              : "text-slate-500 hover:text-white hover:bg-white/5"
                          )}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updatePage(state.page + 1)}
                    disabled={state.page >= totalPages}
                    className="h-10 rounded-xl hover:bg-white/5 text-slate-400 disabled:opacity-30"
                  >
                    Next
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Button>
                </div>

                <p className="text-sm font-medium text-slate-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                  Page <span className="text-primary-400 font-bold">{state.page}</span> of <span className="text-white">{totalPages}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

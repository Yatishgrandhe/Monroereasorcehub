'use client';

import { useState, useEffect } from 'react';
import { Grid, List, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterPanel, FilterGroup } from '@/components/ui/FilterPanel';
import { ResourceCard } from './ResourceCard';
import { useResourceSearch } from '@/hooks/useResourceSearch';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database';

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
    clearFilters,
    clearAll,
  } = useResourceSearch();

  // Load filter options
  useEffect(() => {
    async function loadFilterOptions() {
      const supabase = createClient();
      
      // Load categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (categoriesData) {
        setCategories(categoriesData);
      }

      // Load all resources to extract unique services and populations
      const { data: resourcesData } = await supabase
        .from('resources')
        .select('services_offered, population_served')
        .eq('is_approved', true);
      
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

  // Organize services into logical groups
  const organizeServices = (services: string[]) => {
    const serviceGroups = {
      'Healthcare & Medical': ['Primary Care', 'Dental Services', 'Behavioral Health', 'Pharmacy', 'Emergency Care', 'Surgery', 'Cancer Treatment', 'Long-term Care', 'Specialty Care Clinics', 'Women and Children\'s Center', 'Community Wellness', 'Interventional Heart Program', 'Physician Practices', 'Pediatric Emergency Department', 'Health Screenings', 'Nutrition Counseling', 'Wellness Checks'],
      'Education & Learning': ['Educational Programs', 'Research Assistance', 'Children\'s Programs', 'Adult Literacy', 'K-12 Education', 'Special Education', 'Adult Education', 'ESL Programs', 'Career and Technical Education', 'Advanced Placement Courses', 'Athletics', 'Arts Programs', 'Nutrition Education'],
      'Food & Nutrition': ['Food Distribution', 'Emergency Food Assistance', 'Child Hunger Programs', 'Senior Nutrition', 'Mobile Food Pantries', 'Community Gardens', 'Meal Delivery', 'Emergency Food', 'Holiday Meals'],
      'Housing & Shelter': ['Public Housing', 'Section 8 Vouchers', 'Housing Counseling', 'Emergency Shelter'],
      'Employment & Career': ['Job Training', 'Resume Writing', 'Interview Preparation', 'Job Placement', 'Case Management'],
      'Family & Community': ['Social Activities', 'Childcare Referrals', 'Financial Assistance', 'Provider Training', 'Quality Ratings', 'Parenting Classes', 'Childcare Resources', 'Family Counseling', 'Support Groups', 'Individual Counseling', 'Family Therapy', 'Group Therapy', 'Crisis Intervention'],
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

  // Organize populations into logical groups
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

  const organizedServices = organizeServices(allServices);
  const organizedPopulations = organizePopulations(allPopulations);

  const filterGroups: FilterGroup[] = [
    {
      id: 'category',
      label: 'Category',
      type: 'multiple',
      options: categories.map(cat => ({
        id: cat.id,
        label: cat.name,
        value: cat.name,
      })),
    },
    {
      id: 'services',
      label: 'Services Offered',
      type: 'multiple',
      options: Object.entries(organizedServices).flatMap(([group, services]) => 
        services.map(service => ({
          id: service,
          label: service,
          value: service,
          group: group,
        }))
      ),
    },
    {
      id: 'population',
      label: 'Population Served',
      type: 'multiple',
      options: Object.entries(organizedPopulations).flatMap(([group, populations]) => 
        populations.map(population => ({
          id: population,
          label: population,
          value: population,
          group: group,
        }))
      ),
    },
  ];

  const totalPages = Math.ceil(totalCount / state.limit);

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom section-padding">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Community Resources
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl">
            Discover local organizations, services, and support available in Monroe, North Carolina
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <SearchBar
                value={state.query}
                onChange={updateQuery}
                placeholder="Search resources, services, or organizations..."
                loading={isLoading}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <div className="flex items-center border border-secondary-300 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none border-r border-secondary-300"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterPanel
              filters={filterGroups}
              selectedFilters={{
                category: state.filters.category,
                services: state.filters.services,
                population: state.filters.population,
              }}
              onFilterChange={(filterId, values) => {
                updateFilters({ [filterId]: values });
              }}
              onClearAll={clearAll}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <p className="text-secondary-600">
                  {isLoading ? (
                    'Searching...'
                  ) : (
                    `${totalCount} resource${totalCount !== 1 ? 's' : ''} found`
                  )}
                </p>
                
                {state.query && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-secondary-500">for</span>
                    <span className="font-medium">"{state.query}"</span>
                  </div>
                )}
              </div>

              <select
                value={`${state.sortBy}-${state.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  updateSort(sortBy as any, sortOrder as any);
                }}
                className="input w-auto"
              >
                <option value="relevance-desc">Most Relevant</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
              </select>
            </div>

            {/* Results Grid/List */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-80 bg-secondary-200 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                  {results.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      showCategory={viewMode === 'grid'}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updatePage(state.page - 1)}
                        disabled={state.page <= 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, state.page - 2) + i;
                          if (pageNum > totalPages) return null;
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={pageNum === state.page ? 'primary' : 'outline'}
                              size="sm"
                              onClick={() => updatePage(pageNum)}
                              className="w-10"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updatePage(state.page + 1)}
                        disabled={state.page >= totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-secondary-500">
                      Page {state.page} of {totalPages}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Grid className="h-8 w-8 text-secondary-400" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  No resources found
                </h3>
                <p className="text-secondary-600 mb-4">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button variant="outline" onClick={clearAll}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

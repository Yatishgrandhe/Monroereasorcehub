'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { debounce } from '@/lib/utils';

export interface SearchFilters {
  category: string[];
  services: string[];
  population: string[];
  location: string;
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  sortBy: 'name' | 'created_at' | 'relevance';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

const defaultState: SearchState = {
  query: '',
  filters: {
    category: [],
    services: [],
    population: [],
    location: '',
  },
  sortBy: 'relevance',
  sortOrder: 'desc',
  page: 1,
  limit: 12,
};

export function useResourceSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState<SearchState>(() => {
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category')?.split(',').filter(Boolean) || [];
    const services = searchParams.get('services')?.split(',').filter(Boolean) || [];
    const population = searchParams.get('population')?.split(',').filter(Boolean) || [];
    const location = searchParams.get('location') || '';
    const sortBy = (searchParams.get('sortBy') as SearchState['sortBy']) || 'relevance';
    const sortOrder = (searchParams.get('sortOrder') as SearchState['sortOrder']) || 'desc';
    const page = parseInt(searchParams.get('page') || '1');

    return {
      ...defaultState,
      query,
      filters: { category, services, population, location },
      sortBy,
      sortOrder,
      page,
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Update URL when state changes
  const updateURL = useCallback((newState: SearchState) => {
    const params = new URLSearchParams();

    if (newState.query) params.set('q', newState.query);
    if (newState.filters.category.length > 0) params.set('category', newState.filters.category.join(','));
    if (newState.filters.services.length > 0) params.set('services', newState.filters.services.join(','));
    if (newState.filters.population.length > 0) params.set('population', newState.filters.population.join(','));
    if (newState.filters.location) params.set('location', newState.filters.location);
    if (newState.sortBy !== 'relevance') params.set('sortBy', newState.sortBy);
    if (newState.sortOrder !== 'desc') params.set('sortOrder', newState.sortOrder);
    if (newState.page > 1) params.set('page', newState.page.toString());

    const newQueryString = params.toString();
    const currentQueryString = searchParams.toString();

    if (newQueryString !== currentQueryString) {
      const url = newQueryString ? `?${newQueryString}` : '/resources';
      router.push(url, { scroll: false });
    }
  }, [router, searchParams]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchState: SearchState) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();

        if (searchState.query) params.set('q', searchState.query);
        if (searchState.filters.category.length > 0) params.set('category', searchState.filters.category.join(','));
        if (searchState.filters.services.length > 0) params.set('services', searchState.filters.services.join(','));
        if (searchState.filters.population.length > 0) params.set('population', searchState.filters.population.join(','));
        if (searchState.filters.location) params.set('location', searchState.filters.location);
        params.set('sortBy', searchState.sortBy);
        params.set('sortOrder', searchState.sortOrder);
        params.set('page', searchState.page.toString());
        params.set('limit', searchState.limit.toString());

        const response = await fetch(`/api/resources/search?${params.toString()}`);
        const data = await response.json();

        setResults(data.resources || []);
        setTotalCount(data.totalCount || 0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Update search when state changes
  useEffect(() => {
    debouncedSearch(state);
  }, [state, debouncedSearch]);

  // Update URL when state changes
  useEffect(() => {
    updateURL(state);
  }, [state, updateURL]);

  const updateQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query, page: 1 }));
  }, []);

  const updateFilters = useCallback((filters: Partial<SearchFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
      page: 1
    }));
  }, []);

  const updateSort = useCallback((sortBy: SearchState['sortBy'], sortOrder: SearchState['sortOrder']) => {
    setState(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
  }, []);

  const updatePage = useCallback((page: number) => {
    setState(prev => ({ ...prev, page }));
  }, []);

  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: defaultState.filters,
      page: 1,
    }));
  }, []);

  const clearAll = useCallback(() => {
    setState({
      ...defaultState,
      page: 1,
    });
  }, []);

  return {
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
  };
}

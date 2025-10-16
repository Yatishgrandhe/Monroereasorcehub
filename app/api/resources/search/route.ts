import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = await createClient();

    // Parse query parameters
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category')?.split(',').filter(Boolean) || [];
    const services = searchParams.get('services')?.split(',').filter(Boolean) || [];
    const population = searchParams.get('population')?.split(',').filter(Boolean) || [];
    const location = searchParams.get('location') || '';
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const offset = (page - 1) * limit;

    // Build the query
    let supabaseQuery = supabase
      .from('resources')
      .select(`
        *,
        categories (
          id,
          name,
          icon
        )
      `, { count: 'exact' })
      .eq('is_approved', true);

    // Apply text search
    if (query) {
      supabaseQuery = supabaseQuery.or(
        `name.ilike.%${query}%,description.ilike.%${query}%,address.ilike.%${query}%`
      );
    }

    // Apply category filter
    if (category.length > 0) {
      const { data: categoryIds } = await supabase
        .from('categories')
        .select('id')
        .in('name', category);
      
      if (categoryIds && categoryIds.length > 0) {
        const ids = categoryIds.map(cat => cat.id);
        supabaseQuery = supabaseQuery.in('category_id', ids);
      }
    }

    // Apply services filter
    if (services.length > 0) {
      supabaseQuery = supabaseQuery.overlaps('services_offered', services);
    }

    // Apply population filter
    if (population.length > 0) {
      supabaseQuery = supabaseQuery.overlaps('population_served', population);
    }

    // Apply location filter
    if (location) {
      supabaseQuery = supabaseQuery.ilike('address', `%${location}%`);
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        supabaseQuery = supabaseQuery.order('name', { ascending: sortOrder === 'asc' });
        break;
      case 'created_at':
        supabaseQuery = supabaseQuery.order('created_at', { ascending: sortOrder === 'asc' });
        break;
      case 'relevance':
      default:
        if (query) {
          // For relevance, we'll order by name for now
          // In a real implementation, you might use full-text search ranking
          supabaseQuery = supabaseQuery.order('name', { ascending: true });
        } else {
          supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
        }
        break;
    }

    // Apply pagination
    supabaseQuery = supabaseQuery.range(offset, offset + limit - 1);

    const { data: resources, error, count } = await supabaseQuery;

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json(
        { error: 'Failed to search resources' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      resources: resources || [],
      totalCount: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

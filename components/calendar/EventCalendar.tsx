'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, Plus, Filter, Grid, List } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterPanel, FilterGroup } from '@/components/ui/FilterPanel';
import { createClient } from '@/lib/supabase/client';
import { formatDate, formatTime, isToday, isTomorrow, getRelativeTime } from '@/lib/utils';
import { Database } from '@/types/database';

type Event = Database['public']['Tables']['events']['Row'];

const eventCategories = [
  'Health & Wellness',
  'Education',
  'Community',
  'Employment',
  'Arts & Culture',
  'Sports & Recreation',
  'Business',
  'Volunteer'
];

export function EventCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({});
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const filterGroups: FilterGroup[] = [
    {
      id: 'category',
      label: 'Category',
      type: 'multiple',
      options: eventCategories.map(category => ({
        id: category,
        label: category,
        value: category
      }))
    }
  ];

  // Load events from database
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const supabase = createClient();
        const { data: eventsData, error } = await supabase
          .from('events')
          .select('*')
          .eq('is_approved', true)
          .order('start_date', { ascending: true });

        if (error) {
          console.error('Error loading events:', error);
        } else {
          setEvents(eventsData || []);
          setFilteredEvents(eventsData || []);
        }
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Filter events based on search and filters
  useEffect(() => {
    let filtered = events;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filters
    if (selectedFilters.category && selectedFilters.category.length > 0) {
      filtered = filtered.filter(event =>
        event.category && selectedFilters.category.includes(event.category)
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedFilters]);

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.start_date).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  const getEventsForWeek = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return filteredEvents.filter(event => {
      const eventDate = new Date(event.start_date);
      return eventDate >= startDate && eventDate <= endDate;
    });
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const weeks = [];
    const currentWeek = new Date(startDate);

    while (currentWeek <= lastDay || currentWeek.getMonth() === month) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(currentWeek);
        const dayEvents = getEventsForDate(day);
        week.push({ date: day, events: dayEvents });
        currentWeek.setDate(currentWeek.getDate() + 1);
      }
      weeks.push(week);
    }

    return (
      <div className="bg-white rounded-lg border border-secondary-200 overflow-hidden">
        <div className="grid grid-cols-7">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-4 text-center font-semibold text-secondary-700 bg-secondary-50 border-b border-secondary-200">
              {day}
            </div>
          ))}
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const isCurrentMonth = day.date.getMonth() === month;
              const isTodayDate = isToday(day.date);

              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`min-h-[120px] p-2 border-b border-r border-secondary-200 ${!isCurrentMonth ? 'bg-secondary-50' : 'bg-white'
                    }`}
                >
                  <div className={`text-sm font-medium mb-1 ${isCurrentMonth ? 'text-secondary-900' : 'text-secondary-400'
                    } ${isTodayDate ? 'text-primary-600' : ''}`}>
                    {day.date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {day.events.slice(0, 2).map((event, eventIndex) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 bg-primary-100 text-primary-800 rounded truncate cursor-pointer hover:bg-primary-200"
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {day.events.length > 2 && (
                      <div className="text-xs text-secondary-500">
                        +{day.events.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const weekEvents = getEventsForWeek(startOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      const dayEvents = weekEvents.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate.toDateString() === day.toDateString();
      });
      days.push({ date: day, events: dayEvents });
    }

    return (
      <div className="bg-white rounded-lg border border-secondary-200 overflow-hidden">
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const isTodayDate = isToday(day.date);
            const dayName = day.date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNumber = day.date.getDate();

            return (
              <div key={index} className="border-r border-secondary-200 last:border-r-0">
                <div className={`p-4 text-center border-b border-secondary-200 ${isTodayDate ? 'bg-primary-50' : 'bg-secondary-50'
                  }`}>
                  <div className="text-sm font-medium text-secondary-600">{dayName}</div>
                  <div className={`text-lg font-semibold ${isTodayDate ? 'text-primary-600' : 'text-secondary-900'}`}>
                    {dayNumber}
                  </div>
                </div>
                <div className="p-2 min-h-[200px]">
                  <div className="space-y-2">
                    {day.events.map((event) => (
                      <div
                        key={event.id}
                        className="p-2 bg-primary-100 text-primary-800 rounded text-sm cursor-pointer hover:bg-primary-200"
                        title={event.title}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-xs text-primary-600">
                          {formatTime(event.start_date)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);

    return (
      <div className="bg-white rounded-lg border border-secondary-200">
        <div className="p-6 border-b border-secondary-200">
          <h3 className="text-xl font-semibold text-secondary-900">
            {currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
        </div>
        <div className="p-6">
          {dayEvents.length > 0 ? (
            <div className="space-y-4">
              {dayEvents.map((event) => (
                <Card key={event.id} hover>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-secondary-900 mb-2">{event.title}</h4>
                        {event.description && (
                          <p className="text-secondary-600 mb-3 line-clamp-2">{event.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-secondary-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(event.start_date)} - {formatTime(event.end_date)}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.organizer && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{event.organizer}</span>
                            </div>
                          )}
                        </div>
                        {event.category && (
                          <Badge variant="outline" className="mt-2">
                            {event.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Nothing on the calendar for this day
              </h3>
              <p className="text-secondary-600">
                Check back later or try looking at a different date!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderListView = () => {
    return (
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <Card key={event.id} hover>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                        {event.title}
                      </h3>
                      {event.organizer && (
                        <p className="text-primary-600 font-medium mb-2">
                          Organized by {event.organizer}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-secondary-600">
                        {formatDate(event.start_date)}
                      </div>
                      <div className="text-sm text-secondary-600">
                        {formatTime(event.start_date)} - {formatTime(event.end_date)}
                      </div>
                    </div>
                  </div>

                  {event.description && (
                    <p className="text-secondary-700 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-secondary-600 mb-3">
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{getRelativeTime(event.start_date)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {event.category && (
                      <Badge variant="outline">{event.category}</Badge>
                    )}
                    {isToday(new Date(event.start_date)) && (
                      <Badge variant="primary">Today</Badge>
                    )}
                    {isTomorrow(new Date(event.start_date)) && (
                      <Badge variant="secondary">Tomorrow</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);

    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    }

    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom section-padding">
        <div className="mb-8">
          <h1 className="title-section mb-4">
            What's Happening
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl">
            See what's going on in Monroe. Workshops, gatherings, and fun stuff for everyone.
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Looking for something to do?"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>

              <div className="flex items-center border border-secondary-300 rounded-lg">
                <Button
                  variant={viewMode === 'month' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                  className="rounded-r-none border-r border-secondary-300"
                >
                  Month
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                  className="rounded-none border-r border-secondary-300"
                >
                  Week
                </Button>
                <Button
                  variant={viewMode === 'day' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                  className="rounded-none border-r border-secondary-300"
                >
                  Day
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  List
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filterGroups}
              selectedFilters={selectedFilters}
              onFilterChange={(filterId, values) => {
                setSelectedFilters(prev => ({ ...prev, [filterId]: values }));
              }}
              onClearAll={() => setSelectedFilters({})}
            />
          </div>

          {/* Calendar/Events */}
          <div className="lg:col-span-3">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold text-secondary-900 min-w-[200px] text-center">
                  {viewMode === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  {viewMode === 'week' && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
                  {viewMode === 'day' && currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  {viewMode === 'list' && 'All Events'}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-secondary-600">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Calendar/Events Content */}
            {viewMode === 'month' && renderMonthView()}
            {viewMode === 'week' && renderWeekView()}
            {viewMode === 'day' && renderDayView()}
            {viewMode === 'list' && renderListView()}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                Hosting something?
              </h2>
              <p className="text-white/90 mb-6">
                Let the community know what you're planning.
              </p>
              <Button variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30 force-white-text" asChild>
                <Link href="/submit-event">
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Calendar
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

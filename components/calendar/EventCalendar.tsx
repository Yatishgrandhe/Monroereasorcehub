'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, Plus, Sparkles, LayoutGrid, List as ListIcon, X, CalendarDays, ExternalLink, Info, Heart, Phone, Mail, Award, HandHeart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterPanel, FilterGroup } from '@/components/ui/FilterPanel';
import { PageSplineBanner } from '@/components/ui/PageSplineBanner';
import { createClient } from '@/lib/supabase/client';
import { formatDate, formatTime, isToday, isTomorrow, getRelativeTime, cn } from '@/lib/utils';
import { Reveal } from '@/components/ui/Reveal';
import { Database } from '@/types/database';
import { SPLINE_PAGES_URL } from '@/lib/spline';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

type Event = Database['public']['Tables']['events']['Row'];

const eventCategories = [
  'Health & Wellness', 'Education', 'Community', 'Employment',
  'Arts & Culture', 'Sports & Recreation', 'Business', 'Volunteer', 'Government'
];

export function EventCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({});
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const supabase = createClient();
        const { data: eventsData, error } = await supabase
          .from('events')
          .select('*')
          .eq('is_approved', true)
          .order('start_date', { ascending: true });

        if (error) console.error('Error loading events:', error);
        else {
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

  useEffect(() => {
    let filtered = events;
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedFilters.category?.length > 0) {
      filtered = filtered.filter(event => event.category && selectedFilters.category.includes(event.category));
    }
    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedFilters]);

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const weeks = [];
    const currentWeekCursor = new Date(startDate);

    while (currentWeekCursor <= lastDay || currentWeekCursor.getMonth() === month) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(currentWeekCursor);
        const dateStr = day.toISOString().split('T')[0];
        const dayEvents = filteredEvents.filter(e => new Date(e.start_date).toISOString().split('T')[0] === dateStr);
        week.push({ date: day, events: dayEvents });
        currentWeekCursor.setDate(currentWeekCursor.getDate() + 1);
      }
      weeks.push(week);
    }

    return (
      <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-soft">
        <div className="grid grid-cols-7 border-b border-gray-50">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="p-4 text-center font-black text-[10px] text-gray-400 tracking-widest bg-gray-50/50">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {weeks.flatMap((week, wi) => week.map((day, di) => {
            const isCurrMonth = day.date.getMonth() === month;
            const isTodayDate = isToday(day.date);
            return (
              <div key={`${wi}-${di}`} className={cn(
                "min-h-[140px] p-3 border-r border-b border-gray-50 transition-colors",
                !isCurrMonth ? "bg-gray-50/30 opacity-40" : "bg-white hover:bg-gray-50/50"
              )}>
                <div className={cn(
                  "text-sm font-bold mb-3 flex items-center justify-center w-8 h-8 rounded-full transition-all",
                  isTodayDate ? "bg-primary-600 text-white shadow-md shadow-primary-600/20" : isCurrMonth ? "text-primary-950" : "text-gray-300"
                )}>
                  {day.date.getDate()}
                </div>
                <div className="space-y-1.5">
                  {day.events.slice(0, 3).map(event => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full text-left text-[10px] p-1.5 px-2 bg-primary-50 border border-primary-100 text-primary-700 rounded-lg truncate font-semibold hover:bg-primary-100 transition-colors"
                    >
                      {event.title}
                    </button>
                  ))}
                  {day.events.length > 3 && (
                    <div className="text-[10px] text-slate-500 font-bold pl-1">
                      +{day.events.length - 3} MORE
                    </div>
                  )}
                </div>
              </div>
            );
          }))}
        </div>
      </div>
    );
  };

  const renderListView = () => (
    <div className="space-y-6">
      {filteredEvents.map((event, idx) => (
        <motion.div key={event.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
          <Card
            className="glass-card border-white/5 overflow-hidden group cursor-pointer"
            onClick={() => setSelectedEvent(event)}
          >
            <CardContent className="p-0 flex flex-col md:flex-row">
              <div className="md:w-48 bg-gray-50 p-8 flex flex-col items-center justify-center text-center shrink-0 border-r border-gray-100">
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{formatDate(event.start_date).split(' ')[0]}</div>
                <div className="text-4xl font-bold text-primary-950 font-serif">{new Date(event.start_date).getDate()}</div>
                <div className="text-sm font-semibold text-primary-700">{formatTime(event.start_date)}</div>
              </div>
              <div className="p-8 flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-primary-50 border-primary-100 text-primary-700 font-bold text-[10px] uppercase tracking-widest">{event.category}</Badge>
                </div>
                <h3 className="text-2xl font-bold text-primary-950 mb-2 group-hover:text-primary-700 transition-colors font-serif tracking-tight">{event.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">{event.description}</p>
                <div className="flex flex-wrap gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary-600" /> {event.location || 'Monroe, NC'}</div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary-600" /> {event.organizer || 'Community Host'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const navigateDate = (dir: 'prev' | 'next') => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() + (dir === 'next' ? 1 : -1));
    else d.setDate(d.getDate() + (dir === 'next' ? 7 : -7));
    setCurrentDate(d);
  };

  const eventsHero = (
    <div className="container-custom w-full">
      <Reveal width="100%">
        <div className="flex flex-col items-start gap-4">
          <span className="px-5 py-2 rounded-full bg-accent-500/10 border border-accent-400/20 text-accent-400 font-black uppercase tracking-[0.3em] text-[10px] backdrop-blur-md">
            Community Schedule
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white tracking-tighter leading-none italic mb-4">
            Events Hub<span className="text-secondary-500 not-italic">.</span>
          </h1>
          <div className="w-24 h-2 bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 rounded-full mb-6" />
          <p className="text-xl md:text-2xl text-blue-50/70 max-w-3xl leading-relaxed italic font-medium">
            Discover workshops, social gatherings, and civic initiatives driving Monroe forward through verified community operations.
          </p>
        </div>
      </Reveal>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <PageSplineBanner sceneUrl={SPLINE_PAGES_URL || undefined} height="38vh">
        {eventsHero}
      </PageSplineBanner>

      <div className="container-custom py-12 md:py-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 mb-16 items-center justify-between">
          <div className="w-full lg:max-w-xl">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search unified community missions..." />
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-50 p-1.5 rounded-2xl border border-gray-100 flex shadow-sm">
              <button
                onClick={() => setViewMode('month')}
                className={cn(
                  "px-8 py-2.5 rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest",
                  viewMode === 'month' ? "bg-primary-950 text-white shadow-lg" : "text-gray-400 hover:text-primary-950"
                )}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "px-8 py-2.5 rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest",
                  viewMode === 'list' ? "bg-primary-950 text-white shadow-lg" : "text-gray-400 hover:text-primary-950"
                )}
              >
                List
              </button>
            </div>
            <Button
              variant="outline"
              className="rounded-2xl h-12 px-8 border-primary-100 text-primary-950 font-bold uppercase tracking-widest text-[10px] hover:bg-primary-50"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filterGroups}
              selectedFilters={selectedFilters}
              onFilterChange={(id, v) => setSelectedFilters(p => ({ ...p, [id]: v }))}
              onClearAll={() => setSelectedFilters({})}
            />
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('prev')}
                  className="h-12 w-12 p-0 rounded-2xl border-gray-100 text-gray-600 hover:bg-gray-50 shadow-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl font-serif font-bold text-primary-950 tracking-tight">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('next')}
                  className="h-12 w-12 p-0 rounded-2xl border-gray-100 text-gray-600 hover:bg-gray-50 shadow-sm"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                {filteredEvents.length} Active Missions
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode + currentDate.toISOString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {viewMode === 'month' ? renderMonthView() : renderListView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl bg-white border-none p-0 overflow-hidden rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
          {selectedEvent && (
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-40 bg-primary-50/50 pointer-events-none" />
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Calendar className="w-64 h-64 text-primary-950" />
              </div>

              <div className="p-12 md:p-16 relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <Badge className="bg-primary-950 text-white border-none px-4 py-1.5 font-bold text-[10px] tracking-widest rounded-full">
                    {selectedEvent.category}
                  </Badge>
                </div>

                <DialogTitle className="text-4xl md:text-6xl font-serif font-bold text-primary-950 mb-8 tracking-tighter leading-tight italic">
                  {selectedEvent.title}
                </DialogTitle>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <div className="flex items-center gap-5 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-soft">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center">
                      <CalendarDays className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date</div>
                      <div className="text-sm font-bold text-primary-950">{formatDate(selectedEvent.start_date)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-soft">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Schedule</div>
                      <div className="text-sm font-bold text-primary-950">{formatTime(selectedEvent.start_date)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-soft">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Location</div>
                      <div className="text-sm font-bold text-primary-950">{selectedEvent.location || 'Monroe, NC'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-soft">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Organizer</div>
                      <div className="text-sm font-bold text-primary-950">{selectedEvent.organizer || 'Community Host'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-primary-700 uppercase tracking-[0.2em]">
                    <Info className="w-4 h-4" /> Operational Description
                  </div>
                  <div className="text-lg text-gray-500 font-medium leading-relaxed bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-50">
                    {selectedEvent.description}
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                  <Button className="flex-1 bg-primary-950 hover:bg-black text-white h-16 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-primary-950/20">
                    Add to Calendar
                  </Button>
                  <Button variant="outline" className="h-16 w-16 rounded-2xl border-primary-100 flex items-center justify-center hover:bg-primary-50 text-primary-950">
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

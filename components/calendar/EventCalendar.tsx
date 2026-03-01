'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, Plus, Sparkles, LayoutGrid, List as ListIcon, X, CalendarDays, ExternalLink, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterPanel, FilterGroup } from '@/components/ui/FilterPanel';
import { createClient } from '@/lib/supabase/client';
import { formatDate, formatTime, isToday, isTomorrow, getRelativeTime, cn } from '@/lib/utils';
import { Database } from '@/types/database';
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
      <div className="glass-card border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="grid grid-cols-7 border-b border-white/5">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="p-4 text-center font-black text-[10px] text-slate-500 tracking-widest bg-white/[0.02]">
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
                "min-h-[140px] p-3 border-r border-b border-white/5 transition-colors",
                !isCurrMonth ? "bg-black/20 opacity-30" : "bg-white/[0.01] hover:bg-white/[0.03]"
              )}>
                <div className={cn(
                  "text-sm font-bold mb-3 flex items-center justify-center w-8 h-8 rounded-full transition-all",
                  isTodayDate ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30" : isCurrMonth ? "text-slate-300" : "text-slate-600"
                )}>
                  {day.date.getDate()}
                </div>
                <div className="space-y-1.5">
                  {day.events.slice(0, 3).map(event => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full text-left text-[10px] p-1.5 px-2 bg-primary-500/10 border border-primary-500/20 text-primary-300 rounded-lg truncate font-medium hover:bg-primary-500/20 transition-colors"
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
            className="glass-card border-white/5 overflow-hidden group hover:border-primary-500/30 transition-all cursor-pointer"
            onClick={() => setSelectedEvent(event)}
          >
            <CardContent className="p-0 flex flex-col md:flex-row">
              <div className="md:w-48 bg-gradient-to-br from-primary-600 to-accent-700 p-8 flex flex-col items-center justify-center text-center shrink-0">
                <div className="text-sm font-bold uppercase tracking-widest text-white/70 mb-1">{formatDate(event.start_date).split(' ')[0]}</div>
                <div className="text-4xl font-black text-white">{new Date(event.start_date).getDate()}</div>
                <div className="text-sm font-bold text-white/80">{formatTime(event.start_date)}</div>
              </div>
              <div className="p-8 flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="glass" className="bg-primary-500/10 border-primary-500/20 text-primary-400">{event.category}</Badge>
                </div>
                <h3 className="text-2xl font-black text-white mb-2 group-hover:text-primary-400 transition-colors uppercase tracking-tight">{event.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">{event.description}</p>
                <div className="flex flex-wrap gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary-500" /> {event.location || 'Monroe, NC'}</div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary-500" /> {event.organizer || 'Community Host'}</div>
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

  return (
    <div className="min-h-screen bg-[#020617] pt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />

      <div className="container-custom section-padding relative z-10">
        <div className="mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="glass" className="mb-6 px-4 py-1.5 border-primary-500/20 text-primary-400 font-bold uppercase tracking-widest text-[10px]">
              <Sparkles className="w-3.5 h-3.5 mr-2" /> Events
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Event <span className="text-gradient-logo">Hub</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">Discover workshops, social gatherings, and community initiatives driving Monroe forward.</p>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-12 items-center justify-between">
          <div className="w-full lg:max-w-xl">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Filter by event name or mission..." />
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex">
              <button onClick={() => setViewMode('month')} className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest", viewMode === 'month' ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30" : "text-slate-500 hover:text-slate-300")}>Month</button>
              <button onClick={() => setViewMode('list')} className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest", viewMode === 'list' ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30" : "text-slate-500 hover:text-slate-300")}>List</button>
            </div>
            <Button variant="gradient" className="rounded-2xl" onClick={() => setCurrentDate(new Date())}>Today</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-1">
            <FilterPanel filters={filterGroups} selectedFilters={selectedFilters} onFilterChange={(id, v) => setSelectedFilters(p => ({ ...p, [id]: v }))} onClearAll={() => setSelectedFilters({})} />
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => navigateDate('prev')} className="h-10 w-10 p-0 rounded-xl border-white/10 text-white"><ChevronLeft className="h-4 w-4" /></Button>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <Button variant="outline" size="sm" onClick={() => navigateDate('next')} className="h-10 w-10 p-0 rounded-xl border-white/10 text-white"><ChevronRight className="h-4 w-4" /></Button>
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{filteredEvents.length} RESULTS</div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={viewMode + currentDate.toISOString()} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                {viewMode === 'month' ? renderMonthView() : renderListView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl bg-[#020617] border-white/10 text-white p-0 overflow-hidden rounded-[2rem]">
          {selectedEvent && (
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary-600/20 to-accent-600/20 pointer-events-none" />

              <div className="p-8 pt-12 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <Badge variant="glass" className="bg-primary-500/10 border-primary-500/20 text-primary-400 font-bold uppercase tracking-widest text-[10px] px-3 py-1">
                    {selectedEvent.category}
                  </Badge>
                </div>

                <DialogTitle className="text-4xl font-black text-white mb-6 uppercase tracking-tight leading-none">
                  {selectedEvent.title}
                </DialogTitle>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</div>
                      <div className="text-sm font-bold text-white">{formatDate(selectedEvent.start_date)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-accent-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Time</div>
                      <div className="text-sm font-bold text-white">{formatTime(selectedEvent.start_date)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Location</div>
                      <div className="text-sm font-bold text-white">{selectedEvent.location || 'Monroe, NC'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Organizer</div>
                      <div className="text-sm font-bold text-white">{selectedEvent.organizer || 'Community Host'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <Info className="w-3 h-3" /> Description
                  </div>
                  <p className="text-slate-300 leading-relaxed font-medium bg-white/[0.02] p-6 rounded-[1.5rem] border border-white/5">
                    {selectedEvent.description}
                  </p>
                </div>

              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

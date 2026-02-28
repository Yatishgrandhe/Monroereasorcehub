'use client';

import { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Clock, Users, FileText, Calendar, BarChart3, Settings, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';
import { formatDate, cn } from '@/lib/utils';

interface PendingResource {
  id: string;
  name: string;
  description: string;
  category: { name: string } | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  services_offered: string[];
  population_served: string[];
  submitted_at: string;
  contact_person: string | null;
  contact_title: string | null;
}

interface PendingEvent {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  organizer: string;
  category: string;
  submitted_at: string;
}

export function AdminDashboard() {
  const [pendingResources, setPendingResources] = useState<PendingResource[]>([]);
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalResources: 0,
    approvedResources: 0,
    pendingResources: 0,
    totalEvents: 0,
    approvedEvents: 0,
    pendingEvents: 0
  });

  // Load pending submissions and stats
  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient();

        // Load pending resources
        const { data: resources } = await supabase
          .from('resources')
          .select(`
            id, name, description, email, phone, website, address,
            services_offered, population_served, submitted_at,
            contact_person, contact_title,
            category:categories(name)
          `)
          .eq('is_approved', false)
          .order('submitted_at', { ascending: false });

        // Load pending events
        const { data: events } = await supabase
          .from('events')
          .select('*')
          .eq('is_approved', false)
          .order('submitted_at', { ascending: false });

        // Load stats
        const { data: resourceStats } = await supabase
          .from('resources')
          .select('is_approved');

        const { data: eventStats } = await supabase
          .from('events')
          .select('is_approved');

        if (resources) setPendingResources(resources as unknown as PendingResource[]);
        if (events) setPendingEvents(events as unknown as PendingEvent[]);

        if (resourceStats) {
          const totalResources = resourceStats.length;
          const approvedResources = resourceStats.filter(r => r.is_approved).length;
          setStats(prev => ({
            ...prev,
            totalResources,
            approvedResources,
            pendingResources: totalResources - approvedResources
          }));
        }

        if (eventStats) {
          const totalEvents = eventStats.length;
          const approvedEvents = eventStats.filter(e => e.is_approved).length;
          setStats(prev => ({
            ...prev,
            totalEvents,
            approvedEvents,
            pendingEvents: totalEvents - approvedEvents
          }));
        }

      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const approveResource = async (resourceId: string) => {
    setProcessing(resourceId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('resources')
        .update({ is_approved: true, approved_at: new Date().toISOString() })
        .eq('id', resourceId);

      if (error) throw error;

      setPendingResources(prev => prev.filter(r => r.id !== resourceId));
      setStats(prev => ({
        ...prev,
        approvedResources: prev.approvedResources + 1,
        pendingResources: prev.pendingResources - 1
      }));
    } catch (error) {
      console.error('Error approving resource:', error);
    } finally {
      setProcessing(null);
    }
  };

  const rejectResource = async (resourceId: string) => {
    setProcessing(resourceId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);

      if (error) throw error;

      setPendingResources(prev => prev.filter(r => r.id !== resourceId));
      setStats(prev => ({
        ...prev,
        pendingResources: prev.pendingResources - 1
      }));
    } catch (error) {
      console.error('Error rejecting resource:', error);
    } finally {
      setProcessing(null);
    }
  };

  const approveEvent = async (eventId: string) => {
    setProcessing(eventId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('events')
        .update({ is_approved: true, approved_at: new Date().toISOString() })
        .eq('id', eventId);

      if (error) throw error;

      setPendingEvents(prev => prev.filter(e => e.id !== eventId));
      setStats(prev => ({
        ...prev,
        approvedEvents: prev.approvedEvents + 1,
        pendingEvents: prev.pendingEvents - 1
      }));
    } catch (error) {
      console.error('Error approving event:', error);
    } finally {
      setProcessing(null);
    }
  };

  const rejectEvent = async (eventId: string) => {
    setProcessing(eventId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setPendingEvents(prev => prev.filter(e => e.id !== eventId));
      setStats(prev => ({
        ...prev,
        pendingEvents: prev.pendingEvents - 1
      }));
    } catch (error) {
      console.error('Error rejecting event:', error);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 mesh-bg pt-20">
      <div className="container-custom section-padding">
        <div className="mb-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="glass" className="mb-6 px-4 py-1.5 border-primary-500/20 text-primary-400 font-bold uppercase tracking-widest text-[10px]">
              <Shield className="w-3.5 h-3.5 mr-2" /> System Control
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Admin <span className="text-gradient-logo">Terminal</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
              Manage community resources, oversee events, and orchestrate platform operations.
            </p>
          </motion.div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Resources</p>
                  <p className="text-3xl font-black text-white">{stats.totalResources}</p>
                </div>
                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-warning-500/20 bg-warning-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-warning-500/60 uppercase tracking-widest mb-1">Pending Resources</p>
                  <p className="text-3xl font-black text-warning-400">{stats.pendingResources}</p>
                </div>
                <div className="w-12 h-12 bg-warning-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Events</p>
                  <p className="text-3xl font-black text-white">{stats.totalEvents}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-warning-500/20 bg-warning-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-warning-500/60 uppercase tracking-widest mb-1">Pending Events</p>
                  <p className="text-3xl font-black text-warning-400">{stats.pendingEvents}</p>
                </div>
                <div className="w-12 h-12 bg-warning-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* Pending Resources */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase px-1">Pending Resources</h2>
              <Badge variant="glass" className="bg-warning-500/10 text-warning-400 border-warning-500/20">{pendingResources.length} PENDING</Badge>
            </div>

            {pendingResources.length > 0 ? (
              <div className="space-y-4">
                {pendingResources.map((resource) => (
                  <Card key={resource.id} className="glass-card border-white/5 hover:border-primary-500/30 transition-all">
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {resource.name}
                          </h3>
                          <Badge variant="glass" className="bg-primary-500/10 text-primary-400 border-primary-500/20 uppercase tracking-widest text-[10px] font-black">{resource.category?.name || 'Uncategorized'}</Badge>
                        </div>

                        <p className="text-slate-300 line-clamp-3">
                          {resource.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400">
                          {resource.email && (
                            <div>
                              <strong>Email:</strong> {resource.email}
                            </div>
                          )}
                          {resource.phone && (
                            <div>
                              <strong>Phone:</strong> {resource.phone}
                            </div>
                          )}
                          {resource.website && (
                            <div>
                              <strong>Website:</strong> {resource.website}
                            </div>
                          )}
                          {resource.address && (
                            <div>
                              <strong>Address:</strong> {resource.address}
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <strong className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Services:</strong>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {resource.services_offered.slice(0, 5).map((service, index) => (
                                <Badge key={index} variant="outline" size="sm" className="bg-white/5 border-white/10 text-slate-400">
                                  {service}
                                </Badge>
                              ))}
                              {resource.services_offered.length > 5 && (
                                <Badge variant="outline" size="sm" className="bg-white/5 border-white/10 text-slate-400">
                                  +{resource.services_offered.length - 5} MORE
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-slate-500">
                          Submitted: {formatDate(resource.submitted_at)}
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            variant="gradient"
                            size="sm"
                            onClick={() => approveResource(resource.id)}
                            loading={processing === resource.id}
                            disabled={processing !== null}
                            className="rounded-xl px-6"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => rejectResource(resource.id)}
                            loading={processing === resource.id}
                            disabled={processing !== null}
                            className="text-red-400 hover:bg-red-500/10 rounded-xl px-6"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass-card border-white/5 border-emerald-500/20 bg-emerald-500/5">
                <CardContent className="p-12 text-center">
                  <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Clean Slate
                  </h3>
                  <p className="text-slate-400 max-w-[200px] mx-auto text-sm">
                    All resource submissions have been reviewed. Good job!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pending Events */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Pending Events</h2>
              <Badge variant="warning">{pendingEvents.length} pending</Badge>
            </div>

            {pendingEvents.length > 0 ? (
              <div className="space-y-4">
                {pendingEvents.map((event) => (
                  <Card key={event.id} className="glass-card border-white/5 hover:border-emerald-500/30 transition-all">
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {event.title}
                          </h3>
                          <Badge variant="glass" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase tracking-widest text-[10px] font-black">{event.category}</Badge>
                        </div>

                        <p className="text-slate-300 line-clamp-3">
                          {event.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-emerald-500" />
                            <span>{formatDate(event.start_date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-emerald-500" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-emerald-500" />
                            <span>Organized by: {event.organizer}</span>
                          </div>
                        </div>

                        <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                          Submitted: {formatDate(event.submitted_at)}
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            variant="gradient"
                            size="sm"
                            onClick={() => approveEvent(event.id)}
                            loading={processing === event.id}
                            disabled={processing !== null}
                            className="rounded-xl px-6"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => rejectEvent(event.id)}
                            loading={processing === event.id}
                            disabled={processing !== null}
                            className="text-red-400 hover:bg-red-500/10 rounded-xl px-6"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-success-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No Pending Events
                  </h3>
                  <p className="text-slate-400">
                    All event submissions have been reviewed.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="mt-16 pb-20">
          <Card className="glass-card border-white/10 rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
              <CardTitle className="flex items-center gap-3 text-white text-xl uppercase tracking-widest font-black">
                <Settings className="h-6 w-6 text-primary-400" />
                Administrative Tasks
              </CardTitle>
              <CardDescription className="text-slate-500 font-medium">
                Additional orchestration and platform management functions.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Button variant="outline" className="h-16 rounded-2xl border-white/10 text-white hover:bg-white/5 group" asChild href="/resources">
                  <span className="flex items-center justify-center gap-3">
                    <FileText className="h-5 w-5 text-primary-500 group-hover:scale-110 transition-transform" />
                    Manage Resources
                  </span>
                </Button>
                <Button variant="outline" className="h-16 rounded-2xl border-white/10 text-white hover:bg-white/5 group" asChild href="/events">
                  <span className="flex items-center justify-center gap-3">
                    <Calendar className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                    Manage Events
                  </span>
                </Button>
                <Button variant="outline" className="h-16 rounded-2xl border-white/10 text-white hover:bg-white/5 group" asChild href="/admin/users">
                  <span className="flex items-center justify-center gap-3">
                    <Users className="h-5 w-5 text-accent-500 group-hover:scale-110 transition-transform" />
                    User Management
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

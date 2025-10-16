'use client';

import { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Clock, Users, FileText, Calendar, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';

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
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom section-padding">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl">
            Manage community resources, events, and platform content
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Total Resources</p>
                  <p className="text-2xl font-bold text-secondary-900">{stats.totalResources}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Pending Resources</p>
                  <p className="text-2xl font-bold text-warning-600">{stats.pendingResources}</p>
                </div>
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Total Events</p>
                  <p className="text-2xl font-bold text-secondary-900">{stats.totalEvents}</p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-success-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Pending Events</p>
                  <p className="text-2xl font-bold text-warning-600">{stats.pendingEvents}</p>
                </div>
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Resources */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">Pending Resources</h2>
              <Badge variant="warning">{pendingResources.length} pending</Badge>
            </div>

            {pendingResources.length > 0 ? (
              <div className="space-y-4">
                {pendingResources.map((resource) => (
                  <Card key={resource.id}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                            {resource.name}
                          </h3>
                          <Badge variant="outline">{resource.category?.name || 'Uncategorized'}</Badge>
                        </div>

                        <p className="text-secondary-700 line-clamp-3">
                          {resource.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-secondary-600">
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

                        <div className="space-y-2">
                          <div>
                            <strong className="text-sm text-secondary-700">Services:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {resource.services_offered.slice(0, 5).map((service, index) => (
                                <Badge key={index} variant="outline" size="sm">
                                  {service}
                                </Badge>
                              ))}
                              {resource.services_offered.length > 5 && (
                                <Badge variant="outline" size="sm">
                                  +{resource.services_offered.length - 5} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-secondary-500">
                          Submitted: {formatDate(resource.submitted_at)}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => approveResource(resource.id)}
                            loading={processing === resource.id}
                            disabled={processing !== null}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => rejectResource(resource.id)}
                            loading={processing === resource.id}
                            disabled={processing !== null}
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
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    No Pending Resources
                  </h3>
                  <p className="text-secondary-600">
                    All resource submissions have been reviewed.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pending Events */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">Pending Events</h2>
              <Badge variant="warning">{pendingEvents.length} pending</Badge>
            </div>

            {pendingEvents.length > 0 ? (
              <div className="space-y-4">
                {pendingEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                            {event.title}
                          </h3>
                          <Badge variant="outline">{event.category}</Badge>
                        </div>

                        <p className="text-secondary-700 line-clamp-3">
                          {event.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-secondary-600">
                          <div>
                            <strong>Date:</strong> {formatDate(event.start_date)}
                          </div>
                          <div>
                            <strong>Location:</strong> {event.location}
                          </div>
                          <div>
                            <strong>Organizer:</strong> {event.organizer}
                          </div>
                        </div>

                        <div className="text-sm text-secondary-500">
                          Submitted: {formatDate(event.submitted_at)}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => approveEvent(event.id)}
                            loading={processing === event.id}
                            disabled={processing !== null}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => rejectEvent(event.id)}
                            loading={processing === event.id}
                            disabled={processing !== null}
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
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    No Pending Events
                  </h3>
                  <p className="text-secondary-600">
                    All event submissions have been reviewed.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Admin Actions
              </CardTitle>
              <CardDescription>
                Additional administrative functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" asChild href="/resources">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Resources
                </Button>
                <Button variant="outline" asChild href="/events">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Events
                </Button>
                <Button variant="outline" asChild href="/admin/users">
                  <Users className="h-4 w-4 mr-2" />
                  User Management
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

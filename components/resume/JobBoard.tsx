'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Calendar, Heart, ExternalLink, Filter, Briefcase, DollarSign, Clock, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterPanel, FilterGroup } from '@/components/ui/FilterPanel';
import { formatDate, getRelativeTime, cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: string;
  description: string;
  requirements: string[];
  postedDate: string;
  applicationUrl: string;
  category: string;
  isRemote: boolean;
  experienceLevel: 'entry' | 'mid' | 'senior';
}

// Sample job listings for Monroe, NC area
const sampleJobs: JobListing[] = [
  {
    id: '1',
    title: 'Registered Nurse',
    company: 'Atrium Health Union',
    location: 'Monroe, NC',
    type: 'full-time',
    salary: '$65,000 - $85,000',
    description: 'Join our nursing team at Atrium Health Union. We are seeking a compassionate and skilled Registered Nurse to provide high-quality patient care in our medical-surgical unit.',
    requirements: [
      'Current RN license in North Carolina',
      'BLS certification required',
      '2+ years of nursing experience preferred',
      'Strong communication and teamwork skills'
    ],
    postedDate: '2024-01-15T10:00:00Z',
    applicationUrl: 'https://careers.atriumhealth.org/job/12345',
    category: 'Healthcare',
    isRemote: false,
    experienceLevel: 'mid'
  },
  {
    id: '2',
    title: 'Elementary School Teacher',
    company: 'Union County Public Schools',
    location: 'Monroe, NC',
    type: 'full-time',
    salary: '$45,000 - $55,000',
    description: 'We are looking for a dedicated Elementary School Teacher to join our team. The ideal candidate will have a passion for education and a commitment to student success.',
    requirements: [
      'Bachelor\'s degree in Education',
      'North Carolina teaching license',
      'Experience with elementary-aged children',
      'Strong classroom management skills'
    ],
    postedDate: '2024-01-14T14:30:00Z',
    applicationUrl: 'https://ucps.k12.nc.us/careers',
    category: 'Education',
    isRemote: false,
    experienceLevel: 'entry'
  },
  {
    id: '3',
    title: 'Software Developer',
    company: 'Monroe Tech Solutions',
    location: 'Monroe, NC',
    type: 'full-time',
    salary: '$70,000 - $90,000',
    description: 'Join our growing tech team as a Software Developer. Work on exciting projects using modern technologies including React, Node.js, and cloud platforms.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '2+ years of software development experience',
      'Proficiency in JavaScript, React, and Node.js',
      'Experience with databases and APIs'
    ],
    postedDate: '2024-01-13T09:15:00Z',
    applicationUrl: 'https://monroetech.com/careers',
    category: 'Technology',
    isRemote: true,
    experienceLevel: 'mid'
  },
  {
    id: '4',
    title: 'Social Worker',
    company: 'Monroe Family Services',
    location: 'Monroe, NC',
    type: 'full-time',
    salary: '$50,000 - $65,000',
    description: 'Help families in our community as a Social Worker. Provide counseling, case management, and support services to individuals and families in need.',
    requirements: [
      'Master\'s degree in Social Work',
      'Licensed Clinical Social Worker (LCSW) preferred',
      'Experience in family services or mental health',
      'Strong interpersonal and communication skills'
    ],
    postedDate: '2024-01-12T16:45:00Z',
    applicationUrl: 'https://monroefamilyservices.org/careers',
    category: 'Social Services',
    isRemote: false,
    experienceLevel: 'mid'
  },
  {
    id: '5',
    title: 'Retail Manager',
    company: 'Monroe Shopping Center',
    location: 'Monroe, NC',
    type: 'full-time',
    salary: '$40,000 - $50,000',
    description: 'Lead our retail team as a Store Manager. Oversee daily operations, manage staff, and ensure excellent customer service in our busy shopping center location.',
    requirements: [
      'High school diploma or equivalent',
      '3+ years of retail management experience',
      'Strong leadership and customer service skills',
      'Ability to work flexible hours including weekends'
    ],
    postedDate: '2024-01-11T11:20:00Z',
    applicationUrl: 'https://monroeshopping.com/jobs',
    category: 'Retail',
    isRemote: false,
    experienceLevel: 'mid'
  },
  {
    id: '6',
    title: 'Marketing Coordinator',
    company: 'Union County Chamber of Commerce',
    location: 'Monroe, NC',
    type: 'full-time',
    salary: '$45,000 - $55,000',
    description: 'Join our marketing team to promote local businesses and community events. Create engaging content, manage social media, and coordinate marketing campaigns.',
    requirements: [
      'Bachelor\'s degree in Marketing or related field',
      'Experience with social media and content creation',
      'Strong writing and communication skills',
      'Knowledge of digital marketing tools'
    ],
    postedDate: '2024-01-10T13:10:00Z',
    applicationUrl: 'https://unioncountychamber.org/careers',
    category: 'Marketing',
    isRemote: false,
    experienceLevel: 'entry'
  }
];

const jobTypes = ['full-time', 'part-time', 'contract', 'internship'];
const categories = ['Healthcare', 'Education', 'Technology', 'Social Services', 'Retail', 'Marketing', 'Manufacturing', 'Government'];
const experienceLevels = ['entry', 'mid', 'senior'];

export function JobBoard() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({});
  const [favoriteJobs, setFavoriteJobs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterGroups: FilterGroup[] = [
    {
      id: 'type',
      label: 'Job Type',
      type: 'multiple',
      options: jobTypes.map(type => ({
        id: type,
        label: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
        value: type
      }))
    },
    {
      id: 'category',
      label: 'Category',
      type: 'multiple',
      options: categories.map(category => ({
        id: category,
        label: category,
        value: category
      }))
    },
    {
      id: 'experience',
      label: 'Experience Level',
      type: 'multiple',
      options: experienceLevels.map(level => ({
        id: level,
        label: level.charAt(0).toUpperCase() + level.slice(1),
        value: level
      }))
    }
  ];

  // Fetch jobs from Supabase
  useEffect(() => {
    const fetchJobs = async (retryCount = 0) => {
      try {
        setLoading(true);
        setError(null);

        // Try fetching from Supabase
        const { data, error: fetchError } = await supabase
          .from('job_listings')
          .select('*')
          .eq('status', 'active')
          .order('posted_date', { ascending: false });

        if (fetchError) {
          if ((fetchError.message?.includes('schema cache') ||
            fetchError.message?.includes('not found') ||
            fetchError.code === 'PGRST116') && retryCount < 1) {
            console.warn('Schema cache issue, retrying...', fetchError.message);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchJobs(retryCount + 1);
          }

          console.warn('Using sample data due to:', fetchError.message);
          setJobs(sampleJobs);
          setFilteredJobs(sampleJobs);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          const transformedJobs: JobListing[] = data.map((job: any) => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.job_type as 'full-time' | 'part-time' | 'contract' | 'internship',
            salary: job.salary || undefined,
            description: job.description,
            requirements: job.requirements || [],
            postedDate: job.posted_date,
            applicationUrl: job.application_url,
            category: job.category,
            isRemote: job.is_remote || false,
            experienceLevel: job.experience_level as 'entry' | 'mid' | 'senior'
          }));

          setJobs(transformedJobs);
          setFilteredJobs(transformedJobs);
        } else {
          setJobs(sampleJobs);
          setFilteredJobs(sampleJobs);
        }
      } catch (err: any) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'Failed to load job listings');
        setJobs(sampleJobs);
        setFilteredJobs(sampleJobs);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = jobs;

    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilters.category && selectedFilters.category.length > 0) {
      filtered = filtered.filter(job => selectedFilters.category.includes(job.category));
    }

    if (selectedFilters.type && selectedFilters.type.length > 0) {
      filtered = filtered.filter(job => selectedFilters.type.includes(job.type));
    }

    if (selectedFilters.experience && selectedFilters.experience.length > 0) {
      filtered = filtered.filter(job => selectedFilters.experience.includes(job.experienceLevel));
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, selectedFilters]);

  const toggleFavorite = (jobId: string) => {
    setFavoriteJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const clearFilters = () => {
    setSelectedFilters({});
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      {/* Hero Section */}
      <div className="pt-32 pb-16 bg-primary-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(52,97,173,0.1),transparent)]" />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-primary-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Opportunity Network</span>
            <h1 className="text-5xl md:text-7xl font-serif font-black text-primary-950 tracking-tighter leading-none italic mb-6">
              Local <span className="text-primary-700 not-italic">Jobs.</span>
            </h1>
            <p className="text-xl text-gray-400 font-serif italic max-w-2xl leading-relaxed">
              Discover career opportunities in Monroe, NC and across the expanded Union County professional landscape.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-24 relative z-10">
        {/* Search and Filters Hub */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-soft">
            <div className="flex-1 w-full max-w-2xl">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search jobs, companies, or keywords..."
                className="bg-gray-50 border-none rounded-2xl h-14"
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden sm:block">
                {filteredJobs.length} matches found
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                disabled={Object.keys(selectedFilters).length === 0 && !searchQuery}
                className="rounded-xl border-gray-100 bg-white text-primary-950 font-black uppercase tracking-[0.2em] text-[9px] h-12 px-6 shadow-soft"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <FilterPanel
                filters={filterGroups}
                selectedFilters={selectedFilters}
                onFilterChange={(filterId, values) => {
                  setSelectedFilters(prev => ({ ...prev, [filterId]: values }));
                }}
                onClearAll={clearFilters}
                className="bg-white rounded-[3rem] border border-gray-50 p-8 shadow-soft"
              />
            </div>
          </div>

          {/* Job Listings Archive */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-24 bg-white rounded-[4rem] border border-gray-50 shadow-soft">
                <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto mb-6 shadow-lg shadow-primary-500/20" />
                <p className="text-gray-400 font-serif italic text-lg">Accessing job database...</p>
              </div>
            ) : error ? (
              <div className="text-center py-24 bg-white rounded-[4rem] border border-gray-50 shadow-soft">
                <Briefcase className="h-20 w-20 text-gray-200 mx-auto mb-8" />
                <h3 className="text-3xl font-serif font-black text-primary-950 mb-4 italic tracking-tight">Access Protocol Failure</h3>
                <p className="text-lg text-gray-400 font-serif italic mb-10">{error}</p>
                <Button
                  size="lg"
                  onClick={() => window.location.reload()}
                  className="bg-primary-950 hover:bg-black text-white px-10 h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]"
                >
                  Retry Connection
                </Button>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="space-y-8 lg:space-y-12">
                {filteredJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-white p-10 lg:p-12 rounded-[4rem] border border-gray-50 shadow-soft hover:shadow-civic-hover hover:-translate-y-1 transition-all duration-700 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[4rem] pointer-events-none opacity-50" />

                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-6">
                            <div>
                              <h3 className="text-3xl font-serif font-black text-primary-950 mb-2 italic tracking-tight group-hover:text-primary-700 transition-colors">
                                {job.title}
                              </h3>
                              <p className="text-xl text-primary-700 font-serif italic mb-6">
                                {job.company}
                              </p>
                              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                <div className="flex items-center gap-3">
                                  <MapPin className="h-4 w-4 text-primary-700" />
                                  <span>{job.location}</span>
                                  {job.isRemote && (
                                    <span className="ml-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[8px]">Remote</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <Briefcase className="h-4 w-4 text-primary-700" />
                                  <span className="capitalize">{job.type.replace('-', ' ')}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Calendar className="h-4 w-4 text-primary-700" />
                                  <span>{getRelativeTime(job.postedDate)}</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(job.id)}
                              className={cn("rounded-2xl w-14 h-14", favoriteJobs.includes(job.id) ? 'text-red-500 bg-red-50 shadow-inner' : 'text-gray-300 hover:bg-gray-50 hover:text-primary-950')}
                            >
                              <Heart className={`h-6 w-6 ${favoriteJobs.includes(job.id) ? 'fill-current' : ''}`} />
                            </Button>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mb-8">
                            <span className="px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-[9px] font-black uppercase tracking-[0.2em]">
                              {job.category}
                            </span>
                            <span className="px-4 py-1.5 rounded-full bg-gray-50 text-gray-500 text-[9px] font-black uppercase tracking-[0.2em]">
                              {job.experienceLevel} Level
                            </span>
                            {job.salary && (
                              <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-[0.2em]">
                                {job.salary}
                              </span>
                            )}
                          </div>

                          <p className="text-lg text-gray-500 font-serif italic mb-10 line-clamp-2 leading-relaxed max-w-4xl">
                            {job.description}
                          </p>

                          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 border-t border-gray-50">
                            <div className="flex flex-wrap gap-3">
                              {job.requirements.slice(0, 3).map((req, index) => (
                                <span key={index} className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] px-4 py-1 border border-gray-50 rounded-full">
                                  {req}
                                </span>
                              ))}
                              {job.requirements.length > 3 && (
                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] px-4 py-1">
                                  +{job.requirements.length - 3} more
                                </span>
                              )}
                            </div>
                            <Button
                              size="lg"
                              className="bg-primary-950 hover:bg-black text-white px-10 h-16 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary-950/20 transform hover:-translate-y-1 transition-all shrink-0 w-full sm:w-auto"
                              asChild
                              href={job.applicationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="flex items-center">
                                Apply Now
                                <ExternalLink className="h-4 w-4 ml-3" />
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-[5rem] border border-gray-50 shadow-soft">
                <Briefcase className="h-24 w-24 text-gray-100 mx-auto mb-10" />
                <h3 className="text-4xl font-serif font-black text-primary-950 mb-6 italic tracking-tight">No Match Found</h3>
                <p className="text-xl text-gray-400 font-serif italic mb-12 max-w-md mx-auto">
                  Expand your search parameters to discover other professional avenues in Monroe.
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="rounded-2xl border-gray-100 bg-white text-primary-950 font-black uppercase tracking-[0.2em] text-[10px] h-16 px-12 shadow-soft"
                >
                  Reset Parameters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Global CTA Section */}
        <div className="mt-32">
          <div className="bg-primary-950 p-16 md:p-24 rounded-[5rem] text-white shadow-2xl shadow-primary-950/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(52,97,173,0.3),transparent)]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 blur-3xl rounded-full" />

            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-6xl font-serif font-black mb-8 tracking-tighter italic">
                Strategic Career <span className="text-primary-400">Navigation.</span>
              </h2>
              <p className="text-xl text-primary-100/60 font-serif italic mb-16 max-w-3xl mx-auto leading-relaxed">
                Utilize our AI-powered professional suite to engineer compelling documentation and master the Monroe job market.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  href="/career/job-assistant"
                  variant="outline"
                  size="lg"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-[2.5rem] px-12 h-20 font-black uppercase tracking-[0.2em] text-[10px]"
                  asChild
                >
                  <span className="flex items-center">
                    <Sparkles className="mr-3 h-5 w-5" />
                    Job Assistant
                  </span>
                </Button>
                <Button
                  href="/career/resume-builder"
                  variant="outline"
                  size="lg"
                  className="bg-white text-primary-950 border-white hover:bg-gray-100 rounded-[2.5rem] px-12 h-20 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-white/10"
                  asChild
                >
                  <span className="flex items-center">
                    <FileText className="mr-3 h-5 w-5" />
                    Builder Module
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


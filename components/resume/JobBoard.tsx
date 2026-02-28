'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Calendar, Heart, ExternalLink, Filter, Briefcase, DollarSign, Clock, FileText } from 'lucide-react';
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
          // If schema cache error, retry once after a short delay
          if ((fetchError.message?.includes('schema cache') ||
            fetchError.message?.includes('not found') ||
            fetchError.code === 'PGRST116') && retryCount < 1) {
            console.warn('Schema cache issue, retrying...', fetchError.message);
            // Wait a bit and retry
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchJobs(retryCount + 1);
          }

          // If retry failed or other error, use sample data
          console.warn('Using sample data due to:', fetchError.message);
          setJobs(sampleJobs);
          setFilteredJobs(sampleJobs);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          // Transform Supabase data to JobListing format
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
          // No data returned, use sample jobs
          setJobs(sampleJobs);
          setFilteredJobs(sampleJobs);
        }
      } catch (err: any) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'Failed to load job listings');
        // Fallback to sample jobs if fetch fails
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

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filters
    if (selectedFilters.category && selectedFilters.category.length > 0) {
      filtered = filtered.filter(job => selectedFilters.category.includes(job.category));
    }

    // Apply type filters
    if (selectedFilters.type && selectedFilters.type.length > 0) {
      filtered = filtered.filter(job => selectedFilters.type.includes(job.type));
    }

    // Apply experience level filters
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
    <div className="min-h-screen bg-slate-900 mesh-bg pt-20">
      <div className="container-custom section-padding">
        <div className="mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="glass" className="mb-6 px-4 py-1.5 border-primary-500/20 text-primary-400 font-bold uppercase tracking-widest text-[10px]">
              <Briefcase className="w-3.5 h-3.5 mr-2" /> Opportunity Network
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Local <span className="text-gradient-logo">Jobs</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
              Discover career opportunities in Monroe, NC and surrounding Union County area
            </p>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search jobs, companies, or keywords..."
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                className="btn btn-outline btn-sm inline-flex items-center justify-center"
                onClick={clearFilters}
                disabled={Object.keys(selectedFilters).length === 0 && !searchQuery}
              >
                Clear Filters
              </button>
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
              onClearAll={clearFilters}
            />
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-400">
                {loading ? 'Loading jobs...' : `${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="loading-spinner w-12 h-12 mx-auto mb-4 border-primary-500"></div>
                <p className="text-slate-400">Loading job listings...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Error Loading Jobs
                </h3>
                <p className="text-slate-400 mb-4">
                  {error}
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="rounded-xl"
                >
                  Try Again
                </Button>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="glass-card border-white/5 hover:border-primary-500/30 group transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-white mb-1 tracking-tight group-hover:text-primary-400 transition-colors">
                                {job.title}
                              </h3>
                              <p className="text-lg text-primary-400 font-semibold mb-2">
                                {job.company}
                              </p>
                              <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 text-primary-500" />
                                  <span>{job.location}</span>
                                  {job.isRemote && <Badge variant="glass" className="ml-2 py-0">Remote</Badge>}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Briefcase className="h-3.5 w-3.5 text-primary-500" />
                                  <span className="capitalize">{job.type.replace('-', ' ')}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5 text-primary-500" />
                                  <span>{getRelativeTime(job.postedDate)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(job.id)}
                                className={cn("rounded-full", favoriteJobs.includes(job.id) ? 'text-red-500 bg-red-500/10' : 'text-slate-500 hover:bg-white/5')}
                              >
                                <Heart className={`h-4 w-4 ${favoriteJobs.includes(job.id) ? 'fill-current' : ''}`} />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <Badge variant="glass" className="bg-primary-500/10 border-primary-500/20 text-primary-400">{job.category}</Badge>
                            <Badge variant="outline" className="capitalize border-white/10 text-slate-400">{job.experienceLevel} Level</Badge>
                            {job.salary && (
                              <Badge variant="outline" className="border-emerald-500/20 text-emerald-400">
                                <DollarSign className="h-3 w-3 mr-1" />
                                {job.salary}
                              </Badge>
                            )}
                          </div>

                          <p className="text-slate-400 mb-6 line-clamp-2 text-sm leading-relaxed">
                            {job.description}
                          </p>

                          <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-1.5">
                              {job.requirements.slice(0, 3).map((req, index) => (
                                <Badge key={index} variant="outline" size="sm" className="border-white/5 text-slate-500 text-[10px]">
                                  {req}
                                </Badge>
                              ))}
                              {job.requirements.length > 3 && (
                                <Badge variant="outline" size="sm" className="border-white/5 text-slate-500 text-[10px]">
                                  +{job.requirements.length - 3} more
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="primary"
                              size="sm"
                              className="rounded-xl shadow-lg shadow-primary-500/20 px-6 shrink-0"
                              asChild
                              href={job.applicationUrl}
                            >
                              <span className="flex items-center">
                                Apply Now
                                <ExternalLink className="h-3.5 w-3.5 ml-2" />
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  No jobs found
                </h3>
                <p className="text-slate-400 mb-6">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="rounded-xl border-white/10 text-white"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-br from-primary-600 to-accent-700 text-white rounded-[2.5rem] border-none shadow-2xl shadow-primary-500/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-mesh opacity-10" />
            <CardContent className="p-12 md:p-16 relative z-10">
              <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">
                Don't see the perfect job?
              </h2>
              <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Use our AI-powered job application assistant to create compelling cover letters and prepare for interviews.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  href="/career/job-assistant"
                  variant="outline"
                  size="lg"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full px-10"
                  asChild
                >
                  <span className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Job Assistant
                  </span>
                </Button>
                <Button
                  href="/career/resume-builder"
                  variant="outline"
                  size="lg"
                  className="bg-white text-primary-900 border-white hover:bg-slate-100 rounded-full px-10"
                  asChild
                >
                  <span className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Build Your Resume
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

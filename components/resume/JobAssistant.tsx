'use client';

import { useState, useEffect } from 'react';
import { Save, Download, Sparkles, FileText, Briefcase, MapPin, Calendar, Users, Target, Lightbulb, Info, Database, LogIn, CheckCircle, Plus, Trash2, Eye, Edit, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { supabase } from '@/lib/supabase/client';
import { generateCoverLetterAction, analyzeJobAction, generateInterviewQuestionsAction } from '@/app/actions/ai';
import { migrateLocalDataToDatabase, hasLocalDataToMigrate } from '@/lib/utils/data-migration';
import type { JobPosting, ResumeData } from '@/lib/ai/gemini';
import { formatDate } from '@/lib/utils';

interface JobAnalysis {
  keyRequirements: string[];
  preferredSkills: string[];
  experienceLevel: string;
  salaryRange?: string;
  benefits?: string[];
}

interface SavedJobApplication {
  id: string;
  title: string;
  company: string;
  job_title: string;
  location?: string;
  job_description?: string;
  job_requirements?: any;
  cover_letter?: string;
  job_analysis?: JobAnalysis;
  interview_questions?: string[];
  resume_id?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

const LOCAL_STORAGE_KEY = 'monroe_job_applications';

export function JobAssistant() {
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [savedApplications, setSavedApplications] = useState<SavedJobApplication[]>([]);
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);
  const [jobPosting, setJobPosting] = useState<JobPosting>({
    title: '',
    company: '',
    description: '',
    requirements: [],
    location: ''
  });
  const [resumes, setResumes] = useState<Array<{ id: string; title: string; resume_data: ResumeData; updated_at: string }>>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [resumesLoading, setResumesLoading] = useState(true);

  // Check user authentication and migrate local data
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setUserLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      
      // Migrate local data when user logs in
      if (newUser && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        if (hasLocalDataToMigrate()) {
          try {
            const migrationResult = await migrateLocalDataToDatabase(newUser.id);
            if (migrationResult.success) {
              console.log('Local data migrated successfully:', migrationResult.migrated);
              // Reload applications after migration
              loadApplications();
            }
          } catch (error) {
            console.error('Error migrating local data:', error);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load saved applications
  const loadApplications = async () => {
    try {
      setLoadingApplications(true);
      if (user) {
        // Load from Supabase for logged-in users
        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) throw error;
        setSavedApplications(data || []);
      } else {
        // Load from local storage for guest users
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setSavedApplications(Array.isArray(parsed) ? parsed : []);
            } catch (error) {
              console.error('Error loading applications from local storage:', error);
              setSavedApplications([]);
            }
          } else {
            setSavedApplications([]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setSavedApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  };

  // Load applications on mount and when user changes
  useEffect(() => {
    if (!userLoading) {
      loadApplications();
    }
  }, [user, userLoading]);

  // Load all user's resumes (from database for logged in, from local storage for guests)
  useEffect(() => {
    if (userLoading) return;
    
    const loadResumes = async () => {
      try {
        setResumesLoading(true);
        if (user) {
          // Load all resumes from database for logged in users
          const { data: resumesData, error } = await supabase
          .from('resumes')
            .select('id, title, resume_data, updated_at')
          .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

          if (error) throw error;
          
          if (resumesData && resumesData.length > 0) {
            const formattedResumes = resumesData.map(r => ({
              id: r.id,
              title: r.title || `${r.resume_data?.personalInfo?.firstName || ''} ${r.resume_data?.personalInfo?.lastName || ''}`.trim() || 'Untitled Resume',
              resume_data: r.resume_data,
              updated_at: r.updated_at
            }));
            setResumes(formattedResumes);
            // Set the most recent resume as selected by default
            if (!selectedResumeId && formattedResumes.length > 0) {
              setSelectedResumeId(formattedResumes[0].id);
              setResumeData(formattedResumes[0].resume_data);
            }
          }
        } else {
          // Load from local storage for guest users
          if (typeof window !== 'undefined') {
            const savedData = localStorage.getItem('monroe_resume_builder_data');
            if (savedData) {
              try {
                const parsed = JSON.parse(savedData);
                const localResume = {
                  id: 'local-resume',
                  title: `${parsed.personalInfo?.firstName || 'My'} ${parsed.personalInfo?.lastName || 'Resume'}`,
                  resume_data: parsed,
                  updated_at: new Date().toISOString()
                };
                setResumes([localResume]);
                setSelectedResumeId('local-resume');
                setResumeData(parsed);
              } catch (error) {
                console.error('Error loading from local storage:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading resumes:', error);
      } finally {
        setResumesLoading(false);
      }
    };

    loadResumes();
  }, [user, userLoading]);

  // Update resumeData when selectedResumeId changes
  useEffect(() => {
    if (selectedResumeId && resumes.length > 0) {
      const selectedResume = resumes.find(r => r.id === selectedResumeId);
      if (selectedResume) {
        setResumeData(selectedResume.resume_data);
      }
    }
  }, [selectedResumeId, resumes]);

  // Load application data when editing
  const loadApplication = (application: SavedJobApplication) => {
    setCurrentApplicationId(application.id);
    setJobPosting({
      title: application.job_title,
      company: application.company,
      description: application.job_description || '',
      requirements: application.job_requirements || [],
      location: application.location || ''
    });
    setCoverLetter(application.cover_letter || '');
    setJobAnalysis(application.job_analysis || null);
    setInterviewQuestions(application.interview_questions || []);
    if (application.resume_id) {
      setSelectedResumeId(application.resume_id);
    }
    setViewMode('edit');
  };

  // Create new application
  const createNewApplication = () => {
    setCurrentApplicationId(null);
    setJobPosting({
      title: '',
      company: '',
      description: '',
      requirements: [],
      location: ''
    });
    setCoverLetter('');
    setJobAnalysis(null);
    setInterviewQuestions([]);
    setViewMode('create');
  };

  // Save application
  const saveApplication = async () => {
    if (!jobPosting.title || !jobPosting.company) {
      alert('Please fill in at least the job title and company name.');
      return;
    }

    setSaving(true);
    try {
      const applicationData: Omit<SavedJobApplication, 'id' | 'created_at' | 'updated_at'> = {
        title: `${jobPosting.title} at ${jobPosting.company}`,
        company: jobPosting.company,
        job_title: jobPosting.title,
        location: jobPosting.location,
        job_description: jobPosting.description,
        job_requirements: jobPosting.requirements,
        cover_letter: coverLetter,
        job_analysis: jobAnalysis || undefined,
        interview_questions: interviewQuestions,
        resume_id: selectedResumeId || undefined,
        status: 'draft'
      };

      if (user) {
        // Save to Supabase
        if (currentApplicationId) {
          // Update existing
          const { error } = await supabase
            .from('job_applications')
            .update(applicationData)
            .eq('id', currentApplicationId)
            .eq('user_id', user.id);

          if (error) throw error;
        } else {
          // Create new
          const { error } = await supabase
            .from('job_applications')
            .insert({
              ...applicationData,
              user_id: user.id
            });

          if (error) throw error;
        }
        alert('Application saved to cloud successfully!');
      } else {
        // Save to local storage
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        const applications: SavedJobApplication[] = saved ? JSON.parse(saved) : [];
        
        if (currentApplicationId) {
          // Update existing
          const index = applications.findIndex(a => a.id === currentApplicationId);
          if (index >= 0) {
            applications[index] = {
              ...applications[index],
              ...applicationData,
              updated_at: new Date().toISOString()
            };
          }
        } else {
          // Create new
          const newApp: SavedJobApplication = {
            id: Date.now().toString(),
            ...applicationData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          applications.unshift(newApp);
        }
        
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(applications));
        alert('Application saved to local storage! Your data will persist on this device.');
      }

      // Reload applications and switch to list view
      await loadApplications();
      setViewMode('list');
    } catch (error) {
      console.error('Error saving application:', error);
      alert('Failed to save application. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Delete application
  const deleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      if (user) {
        const { error } = await supabase
          .from('job_applications')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const applications: SavedJobApplication[] = JSON.parse(saved);
          const filtered = applications.filter(a => a.id !== id);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
        }
      }

      await loadApplications();
      if (currentApplicationId === id) {
        createNewApplication();
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Failed to delete application. Please try again.');
    }
  };

  const analyzeJob = async () => {
    if (!jobPosting.description.trim()) {
      alert('Please enter a job description to analyze.');
      return;
    }

    setAnalysisLoading(true);
    try {
      const result = await analyzeJobAction(jobPosting.description);
      if (result.success && result.analysis) {
        setJobAnalysis(result.analysis);
      } else {
        alert('Failed to analyze job description. Please try again.');
      }
    } catch (error) {
      alert('An error occurred while analyzing the job description.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const generateCoverLetter = async () => {
    if (!jobPosting.title || !jobPosting.company || !jobPosting.description) {
      alert('Please fill in the job title, company, and description.');
      return;
    }

    setLoading(true);
    try {
      // Use minimal resume data if no resume exists
      const resumeDataToUse = resumeData || {
        personalInfo: {
          firstName: 'Your',
          lastName: 'Name',
          email: 'your.email@example.com',
          phone: '(555) 555-5555',
          address: ''
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        languages: []
      };

      // Use server action (Gemini or local AI)
      const result = await generateCoverLetterAction(resumeDataToUse, jobPosting);
      
      if (result.success && result.coverLetter) {
        setCoverLetter(result.coverLetter);
      } else {
        alert(`Failed to generate cover letter: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`An error occurred while generating the cover letter: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const generateInterviewQuestions = async () => {
    if (!jobPosting.title || !jobPosting.company || !jobPosting.description) {
      alert('Please fill in the job details first.');
      return;
    }

    setQuestionsLoading(true);
    try {
      const result = await generateInterviewQuestionsAction(jobPosting);
      if (result.success && result.questions) {
        setInterviewQuestions(result.questions);
      } else {
        alert('Failed to generate interview questions. Please try again.');
      }
    } catch (error) {
      alert('An error occurred while generating interview questions.');
    } finally {
      setQuestionsLoading(false);
    }
  };

  const downloadCoverLetter = () => {
    if (!coverLetter.trim()) {
      alert('No cover letter to download.');
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([coverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `cover-letter-${jobPosting.company}-${jobPosting.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Show list view
  if (viewMode === 'list') {
    return (
      <div className="min-h-screen bg-secondary-50">
        <div className="container-custom section-padding">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="title-section mb-2">Job Application Helper</h1>
                <p className="text-xl text-secondary-600 max-w-3xl font-sans">
                  {user ? 'Manage your saved job applications saved in cloud' : 'Manage your saved job applications saved in local storage'}
                </p>
              </div>
              <Button variant="gradient" size="md" onClick={createNewApplication}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Application
              </Button>
            </div>

            {/* Guest User Notice */}
            {!user && !userLoading && (
              <div className="mb-6">
                <Card className="bg-primary-50 border-primary-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Database className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-primary-900 mb-1">Guest User - Local Storage</p>
                        <p className="text-sm text-primary-700 mb-2">
                          Your applications are saved in your browser&apos;s local storage. This means your data stays on this device and won&apos;t sync across other devices or browsers. 
                          <strong> Consider creating an account</strong> to access your work from anywhere.
                        </p>
                        <p className="text-xs text-primary-600 mb-3 italic">
                          💡 <strong>Good news:</strong> When you create an account or log in, all your local data (resumes, cover letters, job applications) 
                          will be automatically migrated to your account so you can access everything from anywhere!
                        </p>
                        <div className="flex items-center gap-2">
                          <Link 
                            href="/auth/signup"
                            className="btn btn-outline btn-sm inline-flex items-center justify-center"
                          >
                            <LogIn className="h-4 w-4 mr-2" />
                            Create Account
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {loadingApplications ? (
            <div className="text-center py-12">
              <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
              <p className="text-secondary-600">Loading applications...</p>
            </div>
          ) : savedApplications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Briefcase className="h-16 w-16 mx-auto mb-4 text-secondary-400" />
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  No saved applications yet
                </h3>
                <p className="text-secondary-600 mb-6">
                  Start creating your first job application to save it here for easy access and editing.
                </p>
                <Button variant="gradient" size="md" onClick={createNewApplication}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Application
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedApplications.map((app) => (
                <Card key={app.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          {app.job_title}
                        </CardTitle>
                        <CardDescription>{app.company}</CardDescription>
                      </div>
                      <Briefcase className="h-8 w-8 text-primary-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {app.location && (
                        <div className="flex items-center text-sm text-secondary-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {app.location}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-secondary-600">
                        <Clock className="h-4 w-4 mr-2" />
                        Updated {formatDate(app.updated_at)}
                      </div>
                      {app.status && (
                        <Badge variant={app.status === 'submitted' ? 'primary' : 'outline'} size="sm">
                          {app.status}
                        </Badge>
                      )}
                      <div className="flex items-center gap-2 text-xs text-secondary-500">
                        {app.cover_letter && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            Cover Letter
                          </span>
                        )}
                        {app.job_analysis && (
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            Analysis
                          </span>
                        )}
                        {app.interview_questions && app.interview_questions.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {app.interview_questions.length} Questions
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadApplication(app)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-error"
                        onClick={() => deleteApplication(app.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show create/edit view (rest of the original component)
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom section-padding">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="title-section mb-2">
                {currentApplicationId ? 'Edit Application' : 'New Job Application'}
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl font-sans">
            Get AI-powered help with your job applications. Generate personalized cover letters, analyze job requirements, and prepare for interviews.
          </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="md" onClick={() => setViewMode('list')}>
                Back to List
              </Button>
              <Button variant="gradient" size="md" onClick={saveApplication} loading={saving}>
                <Save className="h-4 w-4 mr-2" />
                Save Application
              </Button>
            </div>
          </div>
          
          {/* Local Storage Notice for Guest Users */}
          {!user && !userLoading && (
            <div className="mt-6">
              <Card className="bg-primary-50 border-primary-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-primary-900 mb-1">Your Data is Auto-Saved</p>
                      <p className="text-sm text-primary-700 mb-3">
                        As a guest user, your cover letters and job analysis data are automatically saved in your browser&apos;s local storage. 
                        This means your work is saved on this device, but won&apos;t sync across other devices or browsers.
                      </p>
                      <p className="text-xs text-primary-600 mb-3 italic">
                        💡 <strong>Good news:</strong> When you create an account or log in, all your local data (resumes, cover letters, job analysis) 
                        will be automatically migrated to your account so you can access everything from anywhere!
                      </p>
                      <div className="flex items-center gap-2">
                        <Link 
                          href="/auth/signup"
                          className="btn btn-outline btn-sm inline-flex items-center justify-center"
                        >
                          <LogIn className="h-4 w-4 mr-2" />
                          Create Account for Cloud Sync
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details Form */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Job Details
                </CardTitle>
                <CardDescription>
                  Enter the job information to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Job Title"
                  value={jobPosting.title}
                  onChange={(e) => setJobPosting(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Software Engineer"
                />
                <Input
                  label="Company"
                  value={jobPosting.company}
                  onChange={(e) => setJobPosting(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Tech Company Inc."
                />
                <Input
                  label="Location"
                  value={jobPosting.location}
                  onChange={(e) => setJobPosting(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Monroe, NC"
                />
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    className="textarea"
                    rows={8}
                    value={jobPosting.description}
                    onChange={(e) => setJobPosting(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Paste the complete job description here..."
                  />
                </div>
                <button
                  className="btn btn-primary w-full text-white inline-flex items-center justify-center"
                  onClick={analyzeJob}
                  disabled={analysisLoading || !jobPosting.description || !jobPosting.description.trim()}
                >
                  {analysisLoading && <div className="loading-spinner w-4 h-4 mr-2" />}
                  <Target className="h-4 w-4 mr-2" />
                  Analyze Job Requirements
                </button>
              </CardContent>
            </Card>

            {/* Job Analysis Results */}
            {jobAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Job Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Experience Level</h4>
                    <Badge variant="outline">{jobAnalysis.experienceLevel}</Badge>
                  </div>
                  
                  {jobAnalysis.keyRequirements.length > 0 && (
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2">Key Requirements</h4>
                      <div className="space-y-1">
                        {jobAnalysis.keyRequirements.map((req, index) => (
                          <div key={index} className="text-sm text-secondary-700">
                            • {req}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {jobAnalysis.preferredSkills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2">Preferred Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {jobAnalysis.preferredSkills.map((skill, index) => (
                          <Badge key={index} variant="secondary" size="sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {jobAnalysis.salaryRange && (
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2">Salary Range</h4>
                      <p className="text-sm text-secondary-700">{jobAnalysis.salaryRange}</p>
                    </div>
                  )}
                  
                  {jobAnalysis.benefits && jobAnalysis.benefits.length > 0 && (
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2">Benefits</h4>
                      <div className="space-y-1">
                        {jobAnalysis.benefits.map((benefit, index) => (
                          <div key={index} className="text-sm text-secondary-700">
                            • {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Resume Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resume Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resumesLoading ? (
                  <div className="text-center py-4">
                    <div className="loading-spinner w-6 h-6 mx-auto mb-2"></div>
                    <p className="text-sm text-secondary-600">Loading resumes...</p>
                  </div>
                ) : resumeData && resumeData.personalInfo ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-success-600">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span className="text-sm font-medium">Resume loaded successfully</span>
                    </div>
                    {resumes.length > 1 && (
                      <select
                        className="input w-full mt-2"
                        value={selectedResumeId}
                        onChange={(e) => setSelectedResumeId(e.target.value)}
                      >
                        {resumes.map((resume) => (
                          <option key={resume.id} value={resume.id}>
                            {resume.title}
                          </option>
                        ))}
                      </select>
                    )}
                    <p className="text-sm text-secondary-600">
                      {resumeData.personalInfo.firstName || ''} {resumeData.personalInfo.lastName || ''}
                      {(!resumeData.personalInfo.firstName && !resumeData.personalInfo.lastName) && 'My Resume'}
                    </p>
                    {resumeData.personalInfo.email && (
                      <p className="text-xs text-secondary-500 truncate">
                        {resumeData.personalInfo.email}
                      </p>
                    )}
                    {resumeData.experience?.length > 0 && (
                      <p className="text-xs text-secondary-500">
                        {resumeData.experience.length} experience{resumeData.experience.length > 1 ? 's' : ''} • {resumeData.skills?.length || 0} skill{resumeData.skills?.length !== 1 ? 's' : ''}
                      </p>
                    )}
                    <Link 
                      href="/career/resume-builder" 
                      className="btn btn-outline btn-sm w-full text-center inline-flex items-center justify-center mt-3"
                    >
                      {resumes.length > 0 ? 'Edit Resume' : 'Create Resume'}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-warning-600">
                      <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                      <span className="text-sm font-medium">No resume found</span>
                    </div>
                    <p className="text-sm text-secondary-600">
                      {user 
                        ? 'Create a resume first to generate personalized cover letters. Your resume will be saved to your account.'
                        : 'Create a resume first to generate personalized cover letters. Your resume will be saved in your browser\'s local storage.'}
                    </p>
                    <Link 
                      href="/career/resume-builder" 
                      className="btn btn-primary btn-sm w-full text-white text-center inline-flex items-center justify-center mt-3"
                    >
                      Create Resume
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover Letter Generator */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Cover Letter Generator
                    </CardTitle>
                    <CardDescription>
                      Generate a personalized, professional cover letter tailored to this specific position
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-primary btn-sm text-white inline-flex items-center justify-center"
                      onClick={generateCoverLetter}
                      disabled={loading || !jobPosting.title.trim() || !jobPosting.company.trim() || !jobPosting.description.trim()}
                    >
                      {loading && <div className="loading-spinner w-4 h-4 mr-2" />}
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Cover Letter
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {coverLetter ? (
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-lg border border-secondary-200 shadow-sm">
                      <div className="whitespace-pre-wrap text-secondary-700 leading-relaxed font-sans text-[15px]">
                        {coverLetter}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="btn btn-primary btn-sm text-white inline-flex items-center justify-center"
                        onClick={downloadCoverLetter}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download as Text
                      </button>
                      <button
                        className="btn btn-ghost btn-sm inline-flex items-center justify-center"
                        onClick={() => {
                          navigator.clipboard.writeText(coverLetter);
                          alert('Cover letter copied to clipboard!');
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Copy to Clipboard
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                    <p className="text-secondary-600 font-medium mb-1">
                      Ready to Generate Your Cover Letter
                    </p>
                    <p className="text-sm text-secondary-500">
                      Make sure you&apos;ve filled in the job title, company, and description above, then click &quot;Generate Cover Letter&quot;
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Interview Preparation */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Interview Preparation
                    </CardTitle>
                    <CardDescription>
                      Get AI-generated, role-specific interview questions tailored to this position
                    </CardDescription>
                  </div>
                  <button
                    className="btn btn-primary btn-sm text-white inline-flex items-center justify-center"
                    onClick={generateInterviewQuestions}
                    disabled={questionsLoading || !jobPosting.title.trim() || !jobPosting.company.trim() || !jobPosting.description.trim()}
                  >
                    {questionsLoading && <div className="loading-spinner w-4 h-4 mr-2" />}
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Questions
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {interviewQuestions.length > 0 ? (
                  <div className="space-y-3">
                    {interviewQuestions.map((question, index) => (
                      <div key={index} className="p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-secondary-700 font-medium">{question}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        className="btn btn-primary btn-sm text-white inline-flex items-center justify-center"
                        onClick={() => {
                          const questionsText = interviewQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n\n');
                          const blob = new Blob([questionsText], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `interview-questions-${jobPosting.company}-${jobPosting.title}.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Questions
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                    <p className="text-secondary-600 font-medium mb-1">
                      Ready to Generate Interview Questions
                    </p>
                    <p className="text-sm text-secondary-500">
                      Make sure you&apos;ve filled in the job title, company, and description above, then click &quot;Generate Questions&quot;
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Save, Download, Sparkles, FileText, Briefcase, MapPin, Calendar, Users, Target, Lightbulb, Info, Database, LogIn, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { supabase } from '@/lib/supabase/client';
import { generateCoverLetterAction, analyzeJobAction, generateInterviewQuestionsAction } from '@/app/actions/ai';
import { migrateLocalDataToDatabase, hasLocalDataToMigrate } from '@/lib/utils/data-migration';
import type { JobPosting, ResumeData } from '@/lib/ai/gemini';

interface JobAnalysis {
  keyRequirements: string[];
  preferredSkills: string[];
  experienceLevel: string;
  salaryRange?: string;
  benefits?: string[];
}

export function JobAssistant() {
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
              // Trigger a reload of resumes by updating user state
              // The useEffect that loads resumes will automatically run
            }
          } catch (error) {
            console.error('Error migrating local data:', error);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

      console.log('Generating cover letter with:', { 
        hasResume: !!resumeData, 
        jobTitle: jobPosting.title, 
        company: jobPosting.company,
        descriptionLength: jobPosting.description?.length || 0
      });

      // Use server action (Gemini or local AI)
      const result = await generateCoverLetterAction(resumeDataToUse, jobPosting);
      console.log('Cover letter result:', result);
      
      if (result.success && result.coverLetter) {
        setCoverLetter(result.coverLetter);
        console.log('Cover letter generated successfully, length:', result.coverLetter.length);
      } else {
        console.error('Failed to generate cover letter:', result);
        alert(`Failed to generate cover letter: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Cover letter generation error:', error);
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
      // Use server action (Gemini or local AI)
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

  const saveCoverLetter = async () => {
    if (!coverLetter.trim()) {
      alert('No cover letter to save.');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Save to local storage for all users (guests and logged in)
      const savedCoverLetters = JSON.parse(localStorage.getItem('savedCoverLetters') || '[]');
      const newCoverLetter = {
        id: Date.now().toString(),
        title: `${jobPosting.title} at ${jobPosting.company}`,
        content: coverLetter,
        jobPosting,
        createdAt: new Date().toISOString(),
        userId: user?.id || 'guest'
      };
      
      savedCoverLetters.unshift(newCoverLetter);
      localStorage.setItem('savedCoverLetters', JSON.stringify(savedCoverLetters.slice(0, 10))); // Keep last 10
      
      if (user) {
      alert('Cover letter saved successfully!');
      } else {
        alert('Cover letter saved to your browser\'s local storage! Your data will persist on this device.');
      }
    } catch (error) {
      alert('An error occurred while saving the cover letter.');
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

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom section-padding">
        <div className="mb-8">
          <h1 className="title-section mb-4">
            AI Job Application Assistant
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl font-sans">
            Get AI-powered help with your job applications. Generate personalized cover letters, analyze job requirements, and prepare for interviews.
          </p>
          
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
                        As a guest user, your cover letters and job analysis data are automatically saved in your browser's local storage. 
                        This means your work is saved on this device, but won't sync across other devices or browsers.
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
                        <Link 
                          href="/career"
                          className="btn btn-ghost btn-sm inline-flex items-center justify-center"
                        >
                          <Info className="h-4 w-4 mr-2" />
                          Learn More
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
                      <p className="text-xs text-secondary-500">
                        {resumes.length} resume{resumes.length > 1 ? 's' : ''} available. Select which one to use above.
                      </p>
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
                {/* Helpful Context and Tips */}
                {!coverLetter && (
                  <div className="mb-6 space-y-4">
                    <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-primary-900 mb-2">How Our AI Cover Letter Generator Works</h4>
                          <ul className="text-sm text-primary-800 space-y-1.5">
                            <li className="flex items-start gap-2">
                              <span className="text-primary-600 mt-1">•</span>
                              <span><strong>Analyzes the job description</strong> to identify key requirements, skills, and qualifications</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-600 mt-1">•</span>
                              <span><strong>Matches your resume</strong> to highlight relevant experience, skills, and achievements</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-600 mt-1">•</span>
                              <span><strong>Creates personalized content</strong> that connects your background to the specific role</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-600 mt-1">•</span>
                              <span><strong>Uses professional formatting</strong> with proper greeting, body paragraphs, and closing</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Context-Aware Tips Based on Job Posting */}
                    {jobPosting.description && (
                      <div className="p-4 bg-success-50 rounded-lg border border-success-200">
                        <div className="flex items-start gap-3">
                          <Target className="h-5 w-5 text-success-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-success-900 mb-2">Tips for This Specific Position</h4>
                            <ul className="text-sm text-success-800 space-y-1.5">
                              {jobPosting.description.toLowerCase().includes('team') && (
                                <li>• Emphasize collaboration and teamwork experiences from your resume</li>
                              )}
                              {(jobPosting.description.toLowerCase().includes('lead') || jobPosting.description.toLowerCase().includes('manage')) && (
                                <li>• Highlight any leadership or management experience you have</li>
                              )}
                              {jobPosting.description.toLowerCase().includes('client') || jobPosting.description.toLowerCase().includes('customer') && (
                                <li>• Focus on customer service and relationship-building skills</li>
                              )}
                              {jobPosting.description.toLowerCase().includes('problem') || jobPosting.description.toLowerCase().includes('solve') && (
                                <li>• Include specific examples of problem-solving from your experience</li>
                              )}
                              {jobPosting.description.toLowerCase().includes('communicat') && (
                                <li>• Emphasize your communication skills and provide examples</li>
                              )}
                              {resumeData && resumeData.skills && resumeData.skills.length > 0 && (
                                <li>• Your cover letter will automatically highlight your {resumeData.skills.slice(0, 3).join(', ')} skills</li>
                              )}
                              {resumeData && resumeData.experience && resumeData.experience.length > 0 && (
                                <li>• Your top {Math.min(resumeData.experience.length, 3)} most relevant experiences will be featured</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Best Practices */}
                    <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                      <h4 className="font-semibold text-secondary-900 mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Cover Letter Best Practices
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-secondary-700">
                        <div>
                          <p className="font-medium mb-1">✓ Do:</p>
                          <ul className="space-y-1 text-secondary-600">
                            <li>• Customize for each specific job</li>
                            <li>• Keep it concise (3-4 paragraphs)</li>
                            <li>• Use specific examples and achievements</li>
                            <li>• Show enthusiasm for the role</li>
                            <li>• Proofread carefully before submitting</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-1">✗ Don't:</p>
                          <ul className="space-y-1 text-secondary-600">
                            <li>• Use generic templates without customization</li>
                            <li>• Repeat your resume verbatim</li>
                            <li>• Make it too long (over 1 page)</li>
                            <li>• Include irrelevant information</li>
                            <li>• Forget to update company/role names</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* What Information Will Be Used */}
                    {resumeData && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <strong>Your cover letter will include:</strong> Your name ({resumeData.personalInfo?.firstName} {resumeData.personalInfo?.lastName}), 
                          {resumeData.experience?.length > 0 ? ` your ${resumeData.experience.length} experience${resumeData.experience.length > 1 ? 's' : ''},` : ''}
                          {resumeData.skills?.length > 0 ? ` your ${resumeData.skills.length} skill${resumeData.skills.length > 1 ? 's' : ''},` : ''}
                          {resumeData.education?.length > 0 ? ` your education background,` : ''}
                          {' '}and how they align with this {jobPosting.title} position at {jobPosting.company}.
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {/* Resume Selector */}
                {resumes.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Select Resume to Use
                    </label>
                    <select
                      className="input w-full"
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      disabled={resumesLoading}
                    >
                      {resumes.map((resume) => (
                        <option key={resume.id} value={resume.id}>
                          {resume.title} {resume.updated_at ? `(Updated ${new Date(resume.updated_at).toLocaleDateString()})` : ''}
                        </option>
                      ))}
                    </select>
                    {resumeData && (
                      <p className="mt-2 text-sm text-secondary-600">
                        Using: <strong>{resumeData.personalInfo?.firstName} {resumeData.personalInfo?.lastName}</strong>
                        {resumeData.experience?.length > 0 && ` • ${resumeData.experience.length} experience${resumeData.experience.length > 1 ? 's' : ''}`}
                        {resumeData.skills?.length > 0 && ` • ${resumeData.skills.length} skill${resumeData.skills.length > 1 ? 's' : ''}`}
                      </p>
                    )}
                  </div>
                )}
                
                {resumes.length === 0 && !resumesLoading && (
                  <div className="mb-6 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                    <p className="text-sm text-secondary-700 mb-3">
                      No resume found. Create a resume first to generate a personalized cover letter.
                    </p>
                    <Link
                      href="/career/resume-builder"
                      className="btn btn-outline btn-sm inline-flex items-center justify-center"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Create Resume
                    </Link>
                  </div>
                )}

                {coverLetter ? (
                  <div className="space-y-4">
                    {/* Success Message and Next Steps */}
                    <div className="p-4 bg-success-50 rounded-lg border border-success-200">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-success-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-success-900 mb-2">Cover Letter Generated Successfully!</h4>
                          <p className="text-sm text-success-800 mb-3">
                            Your personalized cover letter has been created based on your resume and the job requirements. 
                            Review it carefully and customize it further to make it perfect.
                          </p>
                          <div className="text-sm text-success-700 space-y-1">
                            <p className="font-medium">Before submitting, make sure to:</p>
                            <ul className="list-disc list-inside space-y-0.5 ml-2">
                              <li>Review and edit the content to add your personal touch</li>
                              <li>Check that all names, dates, and details are accurate</li>
                              <li>Add any specific achievements or experiences you want to highlight</li>
                              <li>Proofread for grammar, spelling, and clarity</li>
                              <li>Ensure the tone matches the company culture</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Generated Cover Letter */}
                    <div className="bg-white p-6 rounded-lg border border-secondary-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-secondary-200">
                        <h4 className="font-semibold text-secondary-900">Your Cover Letter</h4>
                        <Badge variant="outline" className="text-xs">
                          {coverLetter.split('\n').filter(line => line.trim()).length} paragraphs
                        </Badge>
                      </div>
                      <div className="whitespace-pre-wrap text-secondary-700 leading-relaxed font-sans text-[15px]">
                        {coverLetter}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="btn btn-outline btn-sm inline-flex items-center justify-center"
                        onClick={saveCoverLetter}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Cover Letter
                      </button>
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
                      <button
                        className="btn btn-ghost btn-sm inline-flex items-center justify-center"
                        onClick={() => setCoverLetter('')}
                      >
                        Generate New
                      </button>
                    </div>

                    {/* Customization Tips */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Tips for Customizing Your Cover Letter
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1.5">
                        <li>• <strong>Add specific examples:</strong> Include concrete achievements with numbers or metrics when possible</li>
                        <li>• <strong>Research the company:</strong> Mention something specific about the company to show genuine interest</li>
                        <li>• <strong>Address the hiring manager:</strong> If you know their name, use it instead of "Dear Hiring Manager"</li>
                        <li>• <strong>Match keywords:</strong> Use terminology from the job description naturally throughout</li>
                        <li>• <strong>Show cultural fit:</strong> If the job description mentions values or culture, align your letter accordingly</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                    <p className="text-secondary-600 font-medium mb-1">
                      Ready to Generate Your Cover Letter
                    </p>
                    <p className="text-sm text-secondary-500">
                      Make sure you've filled in the job title, company, and description above, then click "Generate Cover Letter"
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
                {/* Helpful Context and Tips */}
                {interviewQuestions.length === 0 && (
                  <div className="mb-6 space-y-4">
                    <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-primary-900 mb-2">How Our AI Interview Question Generator Works</h4>
                          <ul className="text-sm text-primary-800 space-y-1.5">
                            <li className="flex items-start gap-2">
                              <span className="text-primary-600 mt-1">•</span>
                              <span><strong>Analyzes the job description</strong> to identify key skills, responsibilities, and requirements</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-600 mt-1">•</span>
                              <span><strong>Generates role-specific questions</strong> based on the position title and requirements</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-600 mt-1">•</span>
                              <span><strong>Includes behavioral questions</strong> to assess your experience and problem-solving abilities</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-600 mt-1">•</span>
                              <span><strong>Creates technical questions</strong> for roles requiring specific skills or knowledge</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-600 mt-1">•</span>
                              <span><strong>Provides comprehensive coverage</strong> of common interview topics for this role</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Context-Aware Tips Based on Job Posting */}
                    {jobPosting.description && (
                      <div className="p-4 bg-success-50 rounded-lg border border-success-200">
                        <div className="flex items-start gap-3">
                          <Target className="h-5 w-5 text-success-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-success-900 mb-2">What to Expect for This Position</h4>
                            <ul className="text-sm text-success-800 space-y-1.5">
                              {jobPosting.description.toLowerCase().includes('team') && (
                                <li>• Expect questions about teamwork, collaboration, and handling group dynamics</li>
                              )}
                              {(jobPosting.description.toLowerCase().includes('lead') || jobPosting.description.toLowerCase().includes('manage')) && (
                                <li>• Prepare for leadership scenarios and management style questions</li>
                              )}
                              {(jobPosting.description.toLowerCase().includes('client') || jobPosting.description.toLowerCase().includes('customer')) && (
                                <li>• Be ready for customer service scenarios and relationship management questions</li>
                              )}
                              {(jobPosting.description.toLowerCase().includes('problem') || jobPosting.description.toLowerCase().includes('solve')) && (
                                <li>• Anticipate problem-solving and critical thinking questions</li>
                              )}
                              {jobPosting.description.toLowerCase().includes('communicat') && (
                                <li>• Prepare examples demonstrating your communication skills</li>
                              )}
                              {(jobPosting.description.toLowerCase().includes('technical') || jobPosting.description.toLowerCase().includes('code') || jobPosting.description.toLowerCase().includes('programming')) && (
                                <li>• Expect technical questions and coding challenges if applicable</li>
                              )}
                              {jobPosting.description.toLowerCase().includes('project') && (
                                <li>• Be ready to discuss project management and deadline handling</li>
                              )}
                              {jobPosting.title && (
                                <li>• Questions will be tailored specifically for a {jobPosting.title} role</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Best Practices */}
                    <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                      <h4 className="font-semibold text-secondary-900 mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Interview Preparation Best Practices
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-secondary-700">
                        <div>
                          <p className="font-medium mb-1">✓ Do:</p>
                          <ul className="space-y-1 text-secondary-600">
                            <li>• Use the STAR method (Situation, Task, Action, Result)</li>
                            <li>• Prepare specific examples from your experience</li>
                            <li>• Research the company and role thoroughly</li>
                            <li>• Practice your answers out loud</li>
                            <li>• Prepare thoughtful questions to ask</li>
                            <li>• Practice with a friend or in front of a mirror</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-1">✗ Don't:</p>
                          <ul className="space-y-1 text-secondary-600">
                            <li>• Memorize answers word-for-word</li>
                            <li>• Give vague or generic responses</li>
                            <li>• Speak negatively about previous employers</li>
                            <li>• Forget to ask questions at the end</li>
                            <li>• Arrive unprepared or late</li>
                            <li>• Forget to follow up after the interview</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* STAR Method Explanation */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        The STAR Method for Answering Questions
                      </h4>
                      <div className="text-sm text-blue-800 space-y-2">
                        <p>When answering behavioral interview questions, use the STAR method:</p>
                        <ul className="space-y-1.5 ml-2">
                          <li><strong>Situation:</strong> Describe the context or background</li>
                          <li><strong>Task:</strong> Explain what you needed to accomplish</li>
                          <li><strong>Action:</strong> Detail the specific steps you took</li>
                          <li><strong>Result:</strong> Share the outcome and what you learned</li>
                        </ul>
                        <p className="mt-2 text-blue-700 italic">
                          Example: "Tell me about a time you handled a difficult situation" → Use STAR to structure your answer with a concrete example.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {interviewQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {/* Success Message and Tips */}
                    <div className="p-4 bg-success-50 rounded-lg border border-success-200">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-success-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-success-900 mb-2">Interview Questions Generated Successfully!</h4>
                          <p className="text-sm text-success-800 mb-3">
                            We've created {interviewQuestions.length} personalized interview questions based on the {jobPosting.title} position at {jobPosting.company}. 
                            Use these to prepare thoughtful, specific answers.
                          </p>
                          <div className="text-sm text-success-700 space-y-1">
                            <p className="font-medium">How to use these questions:</p>
                            <ul className="list-disc list-inside space-y-0.5 ml-2">
                              <li>Practice answering each question using the STAR method</li>
                              <li>Prepare 2-3 specific examples from your experience</li>
                              <li>Time yourself to ensure concise, clear answers</li>
                              <li>Research the company to tailor your responses</li>
                              <li>Prepare follow-up questions to ask the interviewer</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Generated Questions */}
                  <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-secondary-900">Practice Questions</h4>
                        <Badge variant="outline" className="text-xs">
                          {interviewQuestions.length} question{interviewQuestions.length > 1 ? 's' : ''}
                        </Badge>
                      </div>
                    {interviewQuestions.map((question, index) => (
                        <div key={index} className="p-4 bg-secondary-50 rounded-lg border border-secondary-200 hover:border-primary-300 transition-colors">
                        <div className="flex items-start gap-3">
                            <div className="w-7 h-7 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-secondary-700 font-medium mb-2">{question}</p>
                              <div className="mt-2 pt-2 border-t border-secondary-200">
                                <p className="text-xs text-secondary-500 italic">
                                  💡 Tip: Use the STAR method (Situation, Task, Action, Result) to structure your answer
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        className="btn btn-outline btn-sm inline-flex items-center justify-center"
                        onClick={() => {
                          const questionsText = interviewQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n\n');
                          navigator.clipboard.writeText(questionsText);
                          alert('Interview questions copied to clipboard!');
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Copy All Questions
                      </button>
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
                      <button
                        className="btn btn-ghost btn-sm inline-flex items-center justify-center"
                        onClick={() => setInterviewQuestions([])}
                      >
                        Generate New Set
                      </button>
                    </div>

                    {/* Additional Preparation Tips */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Additional Preparation Tips
                      </h4>
                      <div className="text-sm text-blue-800 space-y-2">
                        <div>
                          <p className="font-medium mb-1">Before the Interview:</p>
                          <ul className="list-disc list-inside space-y-0.5 ml-2">
                            <li>Research {jobPosting.company} - their mission, values, recent news, and culture</li>
                            <li>Review the job description again and identify how your skills match</li>
                            <li>Prepare questions to ask about the role, team, and company</li>
                            <li>Plan your outfit and route to arrive 10-15 minutes early</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-1">During the Interview:</p>
                          <ul className="list-disc list-inside space-y-0.5 ml-2">
                            <li>Listen carefully and take a moment to think before answering</li>
                            <li>Use specific examples from your experience</li>
                            <li>Show enthusiasm for the role and company</li>
                            <li>Ask thoughtful questions that show your interest</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-1">After the Interview:</p>
                          <ul className="list-disc list-inside space-y-0.5 ml-2">
                            <li>Send a thank-you email within 24 hours</li>
                            <li>Reiterate your interest and highlight key points from the conversation</li>
                            <li>Follow up if you haven't heard back within the expected timeframe</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                    <p className="text-secondary-600 font-medium mb-1">
                      Ready to Generate Interview Questions
                    </p>
                    <p className="text-sm text-secondary-500">
                      Make sure you've filled in the job title, company, and description above, then click "Generate Questions"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Application Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Application Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-medium text-primary-900 mb-2">Cover Letter Best Practices</h4>
                    <ul className="text-sm text-primary-800 space-y-1">
                      <li>• Customize each cover letter for the specific job and company</li>
                      <li>• Highlight relevant experience and achievements</li>
                      <li>• Keep it concise (3-4 paragraphs)</li>
                      <li>• Proofread carefully before submitting</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-success-50 rounded-lg">
                    <h4 className="font-medium text-success-900 mb-2">Interview Preparation</h4>
                    <ul className="text-sm text-success-800 space-y-1">
                      <li>• Research the company and role thoroughly</li>
                      <li>• Prepare specific examples using the STAR method</li>
                      <li>• Practice your answers to common questions</li>
                      <li>• Prepare thoughtful questions to ask the interviewer</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-warning-50 rounded-lg">
                    <h4 className="font-medium text-warning-900 mb-2">Follow-up</h4>
                    <ul className="text-sm text-warning-800 space-y-1">
                      <li>• Send a thank-you email within 24 hours</li>
                      <li>• Follow up if you haven't heard back in 1-2 weeks</li>
                      <li>• Keep track of your applications and responses</li>
                      <li>• Continue applying to other positions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

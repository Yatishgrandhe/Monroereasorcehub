'use client';

import { useState, useEffect } from 'react';
import { Save, Download, Sparkles, FileText, Briefcase, MapPin, Calendar, Users, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { supabase } from '@/lib/supabase/client';
import { generateCoverLetterAction, analyzeJobAction, generateInterviewQuestionsAction } from '@/app/actions/ai';
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
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Load user's resume data
  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: resume } = await supabase
          .from('resumes')
          .select('resume_data')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (resume) {
          setResumeData(resume.resume_data);
        }
      } catch (error) {
        console.error('Error loading resume data:', error);
      }
    };

    loadResumeData();
  }, []);

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
    if (!resumeData) {
      alert('Please create a resume first to generate a cover letter.');
      return;
    }

    if (!jobPosting.title || !jobPosting.company || !jobPosting.description) {
      alert('Please fill in the job title, company, and description.');
      return;
    }

    setLoading(true);
    try {
      const result = await generateCoverLetterAction(resumeData, jobPosting);
      if (result.success && result.coverLetter) {
        setCoverLetter(result.coverLetter);
      } else {
        alert('Failed to generate cover letter. Please try again.');
      }
    } catch (error) {
      alert('An error occurred while generating the cover letter.');
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

  const saveCoverLetter = async () => {
    if (!coverLetter.trim()) {
      alert('No cover letter to save.');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('You must be signed in to save your cover letter.');
        return;
      }

      // Save to local storage for now (could be extended to save to database)
      const savedCoverLetters = JSON.parse(localStorage.getItem('savedCoverLetters') || '[]');
      const newCoverLetter = {
        id: Date.now().toString(),
        title: `${jobPosting.title} at ${jobPosting.company}`,
        content: coverLetter,
        jobPosting,
        createdAt: new Date().toISOString()
      };
      
      savedCoverLetters.unshift(newCoverLetter);
      localStorage.setItem('savedCoverLetters', JSON.stringify(savedCoverLetters.slice(0, 10))); // Keep last 10
      
      alert('Cover letter saved successfully!');
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
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={analyzeJob}
                  loading={analysisLoading}
                  disabled={!jobPosting.description.trim()}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Analyze Job Requirements
                </Button>
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
                {resumeData ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-success-600">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span className="text-sm">Resume loaded successfully</span>
                    </div>
                    <p className="text-sm text-secondary-600">
                      {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                    </p>
                    <Button variant="outline" size="sm" asChild href="/career/resume-builder" className="w-full">
                      Edit Resume
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-warning-600">
                      <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                      <span className="text-sm">No resume found</span>
                    </div>
                    <p className="text-sm text-secondary-600">
                      Create a resume first to generate personalized cover letters
                    </p>
                    <Button variant="primary" size="sm" asChild href="/career/resume-builder" className="w-full">
                      Create Resume
                    </Button>
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
                      Generate a personalized cover letter for this position
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateCoverLetter}
                      loading={loading}
                      disabled={!resumeData || !jobPosting.title || !jobPosting.company}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Cover Letter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {coverLetter ? (
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-lg border border-secondary-200">
                      <div className="whitespace-pre-wrap text-secondary-700 leading-relaxed">
                        {coverLetter}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={saveCoverLetter}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Cover Letter
                      </Button>
                      <Button variant="primary" size="sm" onClick={downloadCoverLetter}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                    <p className="text-secondary-600">
                      Fill in the job details and click "Generate Cover Letter" to create a personalized cover letter.
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
                      Get AI-generated interview questions to help you prepare
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateInterviewQuestions}
                    loading={questionsLoading}
                    disabled={!jobPosting.title || !jobPosting.company}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Questions
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {interviewQuestions.length > 0 ? (
                  <div className="space-y-3">
                    {interviewQuestions.map((question, index) => (
                      <div key={index} className="p-4 bg-secondary-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-secondary-700">{question}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-10 w-10 text-secondary-400 mx-auto mb-3" />
                    <p className="text-secondary-600">
                      Fill in the job details and click "Generate Questions" to get interview preparation questions.
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

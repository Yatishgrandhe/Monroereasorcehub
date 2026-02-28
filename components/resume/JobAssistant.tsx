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
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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
      if (newUser && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        if (hasLocalDataToMigrate()) {
          try {
            await migrateLocalDataToDatabase(newUser.id);
          } catch (error) {
            console.error(error);
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userLoading) return;
    const loadResumes = async () => {
      try {
        setResumesLoading(true);
        if (user) {
          const { data, error } = await supabase.from('resumes').select('id, title, resume_data, updated_at').eq('user_id', user.id).order('updated_at', { ascending: false });
          if (error) throw error;
          if (data) {
            const formatted = data.map(r => ({ id: r.id, title: r.title || 'Untitled', resume_data: r.resume_data, updated_at: r.updated_at }));
            setResumes(formatted);
            if (!selectedResumeId && formatted.length > 0) {
              setSelectedResumeId(formatted[0].id);
              setResumeData(formatted[0].resume_data);
            }
          }
        } else {
          const savedData = localStorage.getItem('monroe_resume_builder_data');
          if (savedData) {
            const parsed = JSON.parse(savedData);
            const localResume = { id: 'local-resume', title: 'Local Resume', resume_data: parsed, updated_at: new Date().toISOString() };
            setResumes([localResume]);
            setSelectedResumeId('local-resume');
            setResumeData(parsed);
          }
        }
      } finally {
        setResumesLoading(false);
      }
    };
    loadResumes();
  }, [user, userLoading]);

  useEffect(() => {
    if (selectedResumeId && resumes.length > 0) {
      const found = resumes.find(r => r.id === selectedResumeId);
      if (found) setResumeData(found.resume_data);
    }
  }, [selectedResumeId, resumes]);

  const analyzeJob = async () => {
    if (!jobPosting.description.trim()) return;
    setAnalysisLoading(true);
    try {
      const result = await analyzeJobAction(jobPosting.description);
      if (result.success && result.analysis) setJobAnalysis(result.analysis);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const generateCoverLetter = async () => {
    if (!jobPosting.title || !jobPosting.company || !jobPosting.description) return;
    setLoading(true);
    try {
      const result = await generateCoverLetterAction(resumeData || {} as ResumeData, jobPosting);
      if (result.success && result.coverLetter) setCoverLetter(result.coverLetter);
    } finally {
      setLoading(false);
    }
  };

  const downloadCoverLetter = () => {
    const file = new Blob([coverLetter], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = 'cover-letter.txt';
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-900 mesh-bg pt-20">
      <div className="container-custom section-padding">
        <div className="mb-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="glass" className="mb-6 px-4 py-1.5 border-primary-500/20 text-primary-400 font-bold uppercase tracking-widest text-[10px]">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Career Acceleration
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              AI Job <span className="text-gradient-logo">Assistant</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
              Leverage heavy-duty AI to dissect job postings, engineer personalized cover letters, and master your interview prep.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start relative z-10">
          <div className="lg:col-span-1 space-y-8">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary-400" /> Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input label="Title" value={jobPosting.title} onChange={(e) => setJobPosting(p => ({ ...p, title: e.target.value }))} className="bg-white/5 border-white/10 text-white" />
                <Input label="Company" value={jobPosting.company} onChange={(e) => setJobPosting(p => ({ ...p, company: e.target.value }))} className="bg-white/5 border-white/10 text-white" />
                <textarea className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white min-h-[200px]" rows={8} value={jobPosting.description} onChange={(e) => setJobPosting(p => ({ ...p, description: e.target.value }))} placeholder="Job description..." />
                <Button variant="gradient" className="w-full rounded-xl" onClick={analyzeJob} loading={analysisLoading}>Analyze Requirements</Button>
              </CardContent>
            </Card>

            {jobAnalysis && (
              <Card className="glass-card border-white/10 border-primary-500/30">
                <CardHeader><CardTitle className="text-white">Analysis Results</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Badge variant="glass">{jobAnalysis.experienceLevel}</Badge>
                  <div className="space-y-2">
                    {jobAnalysis.keyRequirements.slice(0, 5).map((req, i) => (
                      <div key={i} className="text-sm text-slate-400">• {req}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2 space-y-8">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Cover Letter</CardTitle>
                  <Button variant="gradient" size="sm" onClick={generateCoverLetter} loading={loading} disabled={!jobPosting.description}>
                    <Sparkles className="h-4 w-4 mr-2" /> Generate
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {coverLetter ? (
                  <div className="space-y-6">
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl whitespace-pre-wrap text-slate-300 font-serif leading-relaxed">
                      {coverLetter}
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={downloadCoverLetter} className="text-white border-white/10">Download .txt</Button>
                      <Button variant="ghost" onClick={() => { navigator.clipboard.writeText(coverLetter); alert('Copied!'); }} className="text-slate-400">Copy</Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <div className="h-20 w-20 rounded-3xl bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
                      <FileText className="h-10 w-10 text-primary-400" />
                    </div>
                    <p className="text-slate-500">Enter job details on the left to generate your letter.</p>
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

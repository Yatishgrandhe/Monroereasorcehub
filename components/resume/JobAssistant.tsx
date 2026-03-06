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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      {/* Hero Section */}
      <div className="pt-32 pb-16 bg-primary-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(52,97,173,0.1),transparent)]" />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-primary-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Career Acceleration</span>
            <h1 className="text-5xl md:text-7xl font-serif font-black text-primary-950 tracking-tighter leading-none italic mb-6">
              Job <span className="text-primary-700 not-italic">Assistant.</span>
            </h1>
            <p className="text-xl text-gray-400 font-serif italic max-w-2xl leading-relaxed">
              Leverage high-bandwidth AI to dissect job postings, engineer persona-mapped cover letters, and master interview protocols.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          {/* Inputs Section */}
          <div className="lg:col-span-1 space-y-12">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-soft relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[4rem] pointer-events-none opacity-50 transition-all group-hover:w-40 group-hover:h-40" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary-950 flex items-center justify-center text-white shadow-lg">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-serif font-black text-primary-950 italic tracking-tight">Job Analysis</h2>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Job Designation</label>
                    <Input
                      value={jobPosting.title}
                      onChange={(e) => setJobPosting(p => ({ ...p, title: e.target.value }))}
                      className="bg-gray-50 border-none rounded-2xl h-14 focus:ring-2 ring-primary-500/20"
                      placeholder="e.g. Lead Architect"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Corporation</label>
                    <Input
                      value={jobPosting.company}
                      onChange={(e) => setJobPosting(p => ({ ...p, company: e.target.value }))}
                      className="bg-gray-50 border-none rounded-2xl h-14 focus:ring-2 ring-primary-500/20"
                      placeholder="e.g. Monroe Logistics"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Requirements Manifest</label>
                    <textarea
                      className="w-full px-6 py-5 bg-gray-50 border-none rounded-3xl text-primary-950 text-sm font-medium focus:ring-2 ring-primary-500/20 outline-none transition-all placeholder:text-gray-300 min-h-[250px]"
                      rows={8}
                      value={jobPosting.description}
                      onChange={(e) => setJobPosting(p => ({ ...p, description: e.target.value }))}
                      placeholder="Paste the full job description here for deep scanning..."
                    />
                  </div>

                  <Button
                    className="w-full bg-primary-950 hover:bg-black text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary-950/20 transition-all transform hover:-translate-y-1 active:translate-y-0"
                    onClick={analyzeJob}
                    loading={analysisLoading}
                  >
                    Audit Job Requirements
                  </Button>
                </div>
              </div>
            </div>

            {jobAnalysis && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="bg-primary-50 p-10 rounded-[3rem] border border-primary-100 shadow-sm relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-xl font-serif font-black text-primary-950 mb-6 italic tracking-tight">Scan Insights</h3>
                    <div className="space-y-6">
                      <span className="inline-flex px-4 py-1.5 rounded-full bg-white text-primary-700 text-[10px] font-black uppercase tracking-[0.2em] border border-primary-100">
                        Level: {jobAnalysis.experienceLevel}
                      </span>
                      <div className="space-y-3">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block">Core Priorities</span>
                        {jobAnalysis.keyRequirements.slice(0, 5).map((req, i) => (
                          <div key={i} className="flex gap-3 text-sm text-primary-900 font-serif italic">
                            <span className="text-primary-400 font-bold">»</span>
                            {req}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Letter Generation Section */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white p-12 lg:p-16 rounded-[4rem] border border-gray-50 shadow-soft min-h-[600px] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-bl-[8rem] pointer-events-none opacity-30" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                  <div>
                    <h2 className="text-3xl font-serif font-black text-primary-950 italic tracking-tight mb-2">Cover Letter Module</h2>
                    <p className="text-gray-400 font-serif italic">Persona-mapped professional correspondence</p>
                  </div>
                  <Button
                    className="bg-primary-950 hover:bg-black text-white px-10 h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary-950/20 transform hover:-translate-y-1 transition-all"
                    onClick={generateCoverLetter}
                    loading={loading}
                    disabled={!jobPosting.description}
                  >
                    <Sparkles className="h-4 w-4 mr-3" />
                    Engineer Letter
                  </Button>
                </div>

                {coverLetter ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
                    <div className="flex-1 bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100 font-serif text-lg leading-relaxed text-gray-700 italic preserve-whitespace mb-10 overflow-auto max-h-[700px]">
                      {coverLetter}
                    </div>
                    <div className="flex flex-wrap gap-4 pt-10 border-t border-gray-50">
                      <Button variant="outline" onClick={downloadCoverLetter} className="rounded-2xl border-gray-100 bg-white text-primary-950 font-black uppercase tracking-[0.2em] text-[9px] h-14 px-10 shadow-soft hover:bg-gray-50">
                        <Download className="h-4 w-4 mr-3" />
                        Download .TXT
                      </Button>
                      <Button variant="ghost" onClick={() => { navigator.clipboard.writeText(coverLetter); alert('Protocol: Copied to Clipboard'); }} className="rounded-2xl text-gray-400 hover:text-primary-950 font-black uppercase tracking-[0.2em] text-[9px] h-14 px-10">
                        Copy to Clipboard
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-100 rounded-[4rem]">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-primary-50 flex items-center justify-center mb-8 border border-primary-100 shadow-inner">
                      <FileText className="h-10 w-10 text-primary-300" />
                    </div>
                    <h3 className="text-2xl font-serif font-black text-gray-300 italic tracking-tight mb-4 text-center">Engine Standby</h3>
                    <p className="text-gray-400 font-serif italic text-center max-w-sm">
                      Input the job manifest details on the left to initiate professional letter synthesis.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


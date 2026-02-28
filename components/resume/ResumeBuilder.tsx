'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Save, Download, Sparkles, User, Briefcase, GraduationCap,
  Award, Globe, Plus, Trash2, Info, Database, LogIn, ChevronLeft, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ResumePreview } from './ResumePreview';
import { TemplateSelector } from './TemplateSelector';
import { AIAssistant } from './AIAssistant';
import { supabase } from '@/lib/supabase/client';
import { migrateLocalDataToDatabase, hasLocalDataToMigrate } from '@/lib/utils/data-migration';
import { generateId, cn } from '@/lib/utils';
import { exportResumeToPDF } from '@/lib/utils/pdf-export';
import type { ResumeData } from '@/lib/ai/gemini';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';

const initialResumeData: ResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    website: ''
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  languages: []
};

export function ResumeBuilder() {
  const searchParams = useSearchParams();
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [targetJob, setTargetJob] = useState('');
  const [industry, setIndustry] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'ready' | 'generating'>('idle');
  const [aiProgress, setAiProgress] = useState(0);
  const [aiMessage, setAiMessage] = useState('');
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const LOCAL_STORAGE_KEY = 'monroe_resume_builder_data';

  useEffect(() => {
    // Initialize AI Worker (from public/workers/ - served at /workers/ai.worker.js)
    let aiWorker: Worker | null = null;
    try {
      aiWorker = new Worker('/workers/ai.worker.js', { type: 'module' });
      setWorker(aiWorker);

      aiWorker.onmessage = (e) => {
      const { type, status, progress, message, output, error } = e.data;
      if (type === 'progress') {
        setAiProgress(progress);
        setAiMessage(message);
        if (status === 'ready') setAiStatus('ready');
        if (status === 'downloading' || status === 'init') setAiStatus('loading');
        if (status === 'generating') setAiStatus('generating');
      } else if (type === 'result') {
        setAiStatus('ready');
        // We'll handle the actual result in the calling function via a promise or callback
        // For simplicity, we'll dispatch a custom event or check for output
        window.dispatchEvent(new CustomEvent('ai-result', { detail: { output } }));
      } else if (type === 'error') {
        setAiStatus('ready');
        console.error('Local AI Error:', error);
      }
    };
      aiWorker.onerror = (err) => {
        console.warn('AI worker load error, using server actions only:', err);
        setWorker(null);
      };
    } catch (err) {
      console.warn('AI worker not available, using server actions only:', err);
    }

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
            console.error('Error migrating local data:', error);
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      aiWorker?.terminate();
    };
  }, []);

  useEffect(() => {
    if (loadedFromStorage || userLoading) return;
    const viewParam = searchParams?.get('view');
    if (viewParam && typeof window !== 'undefined') {
      const savedData = sessionStorage.getItem('viewingResume');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setResumeData(parsed);
          setCurrentStep(6);
          setLoadedFromStorage(true);
          sessionStorage.removeItem('viewingResume');
        } catch (error) {
          console.error('Error loading saved resume:', error);
        }
      } else if (user) {
        loadResumeFromDatabase(viewParam);
      }
    } else if (!user && typeof window !== 'undefined') {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setResumeData(parsed);
          setLoadedFromStorage(true);
        } catch (error) {
          console.error('Error loading from local storage:', error);
        }
      }
    }
    setLoadedFromStorage(true);
  }, [searchParams, loadedFromStorage, user, userLoading]);

  const loadResumeFromDatabase = async (resumeId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('resume_data')
        .eq('id', resumeId)
        .single();
      if (error) throw error;
      if (data && data.resume_data) {
        setResumeData(data.resume_data);
        setCurrentStep(6);
      }
    } catch (error) {
      console.error('Error loading resume from database:', error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Personal', icon: User },
    { id: 2, name: 'Summary', icon: Sparkles },
    { id: 3, name: 'Experience', icon: Briefcase },
    { id: 4, name: 'Education', icon: GraduationCap },
    { id: 5, name: 'Skills', icon: Award },
    { id: 6, name: 'Preview', icon: Globe }
  ];

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addExperience = () => {
    const newExperience = {
      id: generateId(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: ['']
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEducation = {
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const callLocalAI = (type: 'summary' | 'experience', text: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!worker) return reject('AI Worker not initialized');

      const requestId = generateId();
      const handler = (e: MessageEvent) => {
        if (e.data.type === 'result' && e.data.requestId === requestId) {
          window.removeEventListener('ai-result', handler as any);
          resolve(e.data.output);
        } else if (e.data.type === 'error') {
          reject(e.data.error);
        }
      };

      // We use a window event to capture the result from the worker's onmessage globally
      const resultHandler = (e: any) => {
        if (e.detail && e.detail.output) {
          window.removeEventListener('ai-result', resultHandler);
          resolve(e.detail.output);
        }
      };
      window.addEventListener('ai-result', resultHandler);

      worker.postMessage({
        type,
        text,
        jobTitle: targetJob,
        industry,
        experienceLevel,
        requestId
      });
    });
  };

  const generateSummary = async () => {
    if (!targetJob || !industry) {
      alert('Please select a Target Job and Industry first.');
      return;
    }
    setAiLoading(true);
    try {
      // Gather experience text for context if available
      const expContext = resumeData.experience.map(e => `${e.position} at ${e.company}`).join(', ');
      const result = await callLocalAI('summary', expContext || 'No experience listed yet.');
      setResumeData(prev => ({ ...prev, summary: result }));
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  const enhanceBulletPoint = async (experienceId: string, achievementIndex: number) => {
    const experience = resumeData.experience.find(exp => exp.id === experienceId);
    if (!experience || !experience.achievements[achievementIndex]) return;
    setAiLoading(true);
    try {
      const result = await callLocalAI('experience', experience.achievements[achievementIndex]);
      if (result) {
        setResumeData(prev => {
          const newExp = prev.experience.map(exp => {
            if (exp.id === experienceId) {
              const newAch = [...exp.achievements];
              newAch[achievementIndex] = result;
              return { ...exp, achievements: newAch };
            }
            return exp;
          });
          return { ...prev, experience: newExp };
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (!user && typeof window !== 'undefined' && loadedFromStorage) {
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resumeData));
        } catch (error) {
          console.error(error);
        }
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [resumeData, user, loadedFromStorage]);

  const saveResume = async () => {
    setSaving(true);
    try {
      if (!user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resumeData));
          alert('Saved locally!');
        }
        return;
      }
      await supabase.from('resumes').upsert({
        user_id: user.id,
        resume_data: resumeData,
        title: `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName} - Resume`,
        updated_at: new Date().toISOString()
      });
      alert('Saved to cloud!');
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const exportToPDF = async () => {
    setLoading(true);
    try {
      await exportResumeToPDF(resumeData, selectedTemplate);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="First Name" value={resumeData.personalInfo.firstName} onChange={(e) => updatePersonalInfo('firstName', e.target.value)} className="bg-white/5 border-white/10 text-white h-14 rounded-2xl" />
              <Input label="Last Name" value={resumeData.personalInfo.lastName} onChange={(e) => updatePersonalInfo('lastName', e.target.value)} className="bg-white/5 border-white/10 text-white h-14 rounded-2xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Email Address" type="email" value={resumeData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} className="bg-white/5 border-white/10 text-white h-14 rounded-2xl" />
              <Input label="Phone Number" type="tel" value={resumeData.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} className="bg-white/5 border-white/10 text-white h-14 rounded-2xl" />
            </div>

            <div className="pt-8 border-t border-white/5 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center border border-primary-500/30">
                  <Sparkles className="w-4 h-4 text-primary-400" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-widest">AI Context Engine</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Target Job</label>
                  <input
                    className="w-full h-14 px-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-primary-500 outline-none transition-all"
                    placeholder="e.g. Software Engineer"
                    value={targetJob}
                    onChange={(e) => setTargetJob(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Industry</label>
                  <select
                    className="w-full h-14 px-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-primary-500 outline-none transition-all appearance-none"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    <option value="" disabled className="bg-slate-900">Select Industry</option>
                    {['Technology', 'Healthcare', 'Finance', 'Education', 'Construction', 'Creative', 'Government', 'Retail'].map(opt => (
                      <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Exp. Level</label>
                  <select
                    className="w-full h-14 px-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-primary-500 outline-none transition-all appearance-none"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                  >
                    <option value="" disabled className="bg-slate-900">Select Level</option>
                    {['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Executive'].map(opt => (
                      <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Professional Summary</h3>
                <p className="text-sm text-slate-500 font-medium">Define your narrative in exactly 3 impactful sentences.</p>
              </div>
              <Button
                variant="gradient"
                size="sm"
                onClick={generateSummary}
                loading={aiLoading || aiStatus === 'loading'}
                className="rounded-full px-6 shadow-lg shadow-primary-500/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Magic Generate
              </Button>
            </div>

            {aiStatus === 'loading' && (
              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                  <span>{aiMessage}</span>
                  <span>{Math.round(aiProgress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${aiProgress}%` }}
                    className="h-full bg-gradient-to-r from-primary-500 to-blue-400"
                  />
                </div>
              </div>
            )}

            <textarea
              className="w-full min-h-[250px] p-8 bg-white/5 border border-white/10 rounded-[2rem] text-white text-lg leading-relaxed focus:border-primary-500 outline-none transition-all glass-card"
              placeholder="Start typing your summary or use 'Magic Generate' to let local AI architect it for you based on your context..."
              value={resumeData.summary}
              onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Experience</h3>
                <p className="text-sm text-slate-500 font-medium">Record your professional history and use AI to architect bullet points.</p>
              </div>
              <Button variant="outline" size="sm" onClick={addExperience} className="rounded-xl border-white/10 text-white hover:bg-white/5 h-12 px-6">
                <Plus className="h-4 w-4 mr-2" /> Add Position
              </Button>
            </div>

            {aiStatus === 'loading' && (
              <div className="mb-6 space-y-3 p-4 bg-primary-500/5 rounded-2xl border border-primary-500/10">
                <div className="flex justify-between text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                  <span>{aiMessage}</span>
                  <span>{Math.round(aiProgress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${aiProgress}%` }}
                    className="h-full bg-gradient-to-r from-primary-500 to-blue-400"
                  />
                </div>
              </div>
            )}

            {resumeData.experience.map((exp, idx) => (
              <Card key={exp.id} className="glass-card border-white/10 relative overflow-visible p-2 rounded-[2rem]">
                <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)} className="absolute top-6 right-6 text-slate-500 hover:text-red-400 z-20">
                  <Trash2 className="h-5 w-5" />
                </Button>
                <CardHeader className="pt-8 px-8"><CardTitle className="text-white text-xl font-black">Position {idx + 1}</CardTitle></CardHeader>
                <CardContent className="px-8 pb-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Job Title" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} className="bg-white/5 border-white/10 text-white h-14 rounded-2xl" placeholder="e.g. Lead Developer" />
                    <Input label="Corporation" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="bg-white/5 border-white/10 text-white h-14 rounded-2xl" placeholder="e.g. Stark Industries" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input label="Start Date" type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="bg-white/5 border-white/10 text-white h-14 rounded-2xl [color-scheme:dark]" />
                    <Input label="End Date" type="month" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} disabled={exp.current} className="bg-white/5 border-white/10 text-white h-14 rounded-2xl [color-scheme:dark]" />
                    <div className="flex items-center gap-3 pt-8 pb-2">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        className="h-6 w-6 rounded-lg border-white/10 bg-white/5 text-primary-500 cursor-pointer"
                      />
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Position</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Key Achievements & Impact</label>
                    </div>
                    {exp.achievements.map((ach, achIdx) => (
                      <div key={achIdx} className="group relative flex gap-3">
                        <textarea
                          className="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm leading-relaxed focus:border-primary-500 outline-none transition-all min-h-[80px]"
                          placeholder="Briefly mention a success or responsibility..."
                          value={ach}
                          onChange={(e) => {
                            const updated = [...exp.achievements];
                            updated[achIdx] = e.target.value;
                            updateExperience(exp.id, 'achievements', updated);
                          }}
                        />
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => enhanceBulletPoint(exp.id, achIdx)}
                            loading={aiLoading || aiStatus === 'loading'}
                            className="bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 rounded-xl h-10 w-10 p-0"
                            title="Enhance with Local AI"
                          >
                            <Sparkles className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updated = exp.achievements.filter((_, i) => i !== achIdx);
                              updateExperience(exp.id, 'achievements', updated);
                            }}
                            className="text-slate-600 hover:text-red-400 rounded-xl h-10 w-10 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => updateExperience(exp.id, 'achievements', [...exp.achievements, ''])} className="text-primary-400 font-bold uppercase tracking-widest text-[10px] hover:bg-primary-500/5">
                      <Plus className="h-4 w-4 mr-2" /> Add Achievement Line
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Education</h3>
              <Button variant="outline" size="sm" onClick={addEducation} className="rounded-xl border-white/10 text-white">
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
            {resumeData.education.map((edu, idx) => (
              <Card key={edu.id} className="glass-card border-white/10 relative overflow-visible">
                <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <CardHeader><CardTitle className="text-white">Education {idx + 1}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input label="Institution" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                  <Input label="Degree / Field" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Skills</h3>
            {resumeData.skills.map((skill, idx) => (
              <div key={idx} className="flex gap-2">
                <Input value={skill} onChange={(e) => updateSkill(idx, e.target.value)} className="bg-white/5 border-white/10 text-white" />
                <Button variant="ghost" onClick={() => removeSkill(idx)} className="text-red-400">×</Button>
              </div>
            ))}
            <Button variant="outline" onClick={addSkill} className="text-white border-white/10">Add Skill</Button>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Preview</h3>
              <div className="flex gap-3">
                <Button variant="gradient" onClick={exportToPDF} loading={loading} className="rounded-full px-8">
                  <Download className="h-4 w-4 mr-2" /> PDF Export
                </Button>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              <ResumePreview resumeData={resumeData} template={selectedTemplate} />
            </div>
          </div>
        );
      default: return null;
    }
  };

  const isViewingMode = !!searchParams?.get('view');

  return (
    <div className="min-h-screen bg-slate-900 mesh-bg pt-20">
      <div className="container-custom section-padding">
        <div className="mb-12 relative z-10">
          <motion.div layout layoutId="header-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="glass" className="mb-6 px-4 py-1.5 border-primary-500/20 text-primary-400 font-bold uppercase tracking-widest text-[10px]">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              {isViewingMode ? 'Saved Asset' : 'AI Resume Platform'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              {isViewingMode ? <><span className="text-gradient-logo">Preview</span> Resume</> : <>AI <span className="text-gradient-logo">Resume</span> Builder</>}
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl">Construct a world-class resume with intelligent AI assistance for summaries, content enhancement, and skill mapping.</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start relative z-10">
          {!isViewingMode && (
            <div className="lg:col-span-1 sticky top-24">
              <Card className="glass-card border-white/10 p-2 rounded-3xl">
                <CardHeader><CardTitle className="text-white text-lg">Builder Guide</CardTitle></CardHeader>
                <CardContent className="p-2 space-y-1">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    return (
                      <button key={step.id} onClick={() => setCurrentStep(step.id)} className={cn(
                        "w-full flex items-center gap-3 p-4 rounded-2xl transition-all",
                        isActive ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25" : "text-slate-400 hover:bg-white/5"
                      )}>
                        <Icon className="h-4 w-4" />
                        <span className="font-bold text-sm uppercase tracking-wider">{step.name}</span>
                        {currentStep > step.id && <CheckCircle className="h-3 w-3 ml-auto text-emerald-400" />}
                      </button>
                    );
                  })}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <Button variant="gradient" className="w-full rounded-xl" onClick={saveResume} loading={saving}>Save Progress</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div className={cn(isViewingMode ? "lg:col-span-4" : "lg:col-span-3")}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[400px]"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {!isViewingMode && (
              <div className="mt-12 flex justify-between">
                <Button variant="ghost" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1} className="text-slate-400">Back</Button>
                <Button variant="gradient" onClick={() => setCurrentStep(Math.min(6, currentStep + 1))} className="rounded-full px-8">
                  {currentStep === 6 ? 'Finalize' : 'Next Step'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

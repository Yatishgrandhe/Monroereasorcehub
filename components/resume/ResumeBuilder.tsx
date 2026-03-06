'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
import { generateSummaryAction, enhanceBulletPointAction, suggestSkillsAction } from '@/app/actions/ai';
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
  const router = useRouter();
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
          // Include requestId in the event detail
          window.dispatchEvent(new CustomEvent('ai-result', {
            detail: { output, requestId: e.data.requestId }
          }));
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
        setLoadedFromStorage(false); // Force re-fetch from DB on login
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
          setCurrentStep(7);
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
          if (parsed.targetJob) setTargetJob(parsed.targetJob);
          if (parsed.industry) setIndustry(parsed.industry);
          if (parsed.experienceLevel) setExperienceLevel(parsed.experienceLevel);
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
        const rData = data.resume_data;
        setResumeData(rData);
        if (rData.targetJob) setTargetJob(rData.targetJob);
        if (rData.industry) setIndustry(rData.industry);
        if (rData.experienceLevel) setExperienceLevel(rData.experienceLevel);
        setCurrentStep(7);
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
    { id: 6, name: 'Expertise', icon: Globe },
    { id: 7, name: 'Preview', icon: CheckCircle }
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

  const addCertification = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { id: generateId(), name: '', issuer: '', date: '' }]
    }));
  };

  const updateCertification = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert => cert.id === id ? { ...cert, [field]: value } : cert)
    }));
  };

  const removeCertification = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  const addLanguage = () => {
    setResumeData(prev => ({
      ...prev,
      languages: [...prev.languages, { id: generateId(), language: '', proficiency: 'Professional' }]
    }));
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.map(lang => lang.id === id ? { ...lang, [field]: value } : lang)
    }));
  };

  const removeLanguage = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
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
        if (e.detail && e.detail.requestId === requestId) {
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
      // 1. Try Server-Side AI (Cloud / Vercel hosted) - 0 downloads for user
      const result = await generateSummaryAction(resumeData.experience, targetJob, industry, experienceLevel);
      if (result.success && result.summary) {
        setResumeData(prev => ({ ...prev, summary: result.summary }));
        return;
      }

      // 2. Fallback to Local AI (Worker) if cloud is unavailable or key is missing
      console.warn('Server AI (Gemini) not responding, falling back to Local Engine...');
      const expContext = resumeData.experience.map(e => `${e.position} at ${e.company}`).join(', ');
      const localResult = await callLocalAI('summary', expContext || 'No experience listed yet.');
      setResumeData(prev => ({ ...prev, summary: localResult }));
    } catch (error) {
      console.error('AI generation failure:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const enhanceBulletPoint = async (experienceId: string, achievementIndex: number) => {
    const experience = resumeData.experience.find(exp => exp.id === experienceId);
    if (!experience || !experience.achievements[achievementIndex]) return;
    setAiLoading(true);
    try {
      // 1. Try Server-Side AI (Cloud / Vercel hosted)
      const contextStr = `${experience.position} at ${experience.company} in the ${industry} industry`;
      const result = await enhanceBulletPointAction(experience.achievements[achievementIndex], contextStr);
      if (result.success && result.enhanced) {
        setResumeData(prev => {
          const newExp = prev.experience.map(exp => {
            if (exp.id === experienceId) {
              const newAch = [...exp.achievements];
              newAch[achievementIndex] = result.enhanced!;
              return { ...exp, achievements: newAch };
            }
            return exp;
          });
          return { ...prev, experience: newExp };
        });
        return;
      }

      // 2. Fallback to Local AI (Worker)
      console.warn('Server AI (Gemini) not responding, falling back to Local Engine...');
      const localResult = await callLocalAI('experience', experience.achievements[achievementIndex]);
      if (localResult) {
        setResumeData(prev => {
          const newExp = prev.experience.map(exp => {
            if (exp.id === experienceId) {
              const newAch = [...exp.achievements];
              newAch[achievementIndex] = localResult;
              return { ...exp, achievements: newAch };
            }
            return exp;
          });
          return { ...prev, experience: newExp };
        });
      }
    } catch (error) {
      console.error('AI generation failure:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const suggestSkills = async () => {
    if (!targetJob) {
      alert('Please specify a Target Job in Step 1 for the AI to suggest mapping skills.');
      return;
    }
    setAiLoading(true);
    try {
      const result = await suggestSkillsAction(targetJob, resumeData.skills);
      if (result.success && result.skills) {
        // Add only new skills
        const existingSet = new Set(resumeData.skills.map(s => s.toLowerCase()));
        const newSkills = result.skills.filter(s => !existingSet.has(s.toLowerCase()));

        if (newSkills.length > 0) {
          setResumeData(prev => ({
            ...prev,
            skills: [...prev.skills, ...newSkills]
          }));
        }
      }
    } catch (error) {
      console.error('Skill suggestion failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (!user && typeof window !== 'undefined' && loadedFromStorage) {
      const timeoutId = setTimeout(() => {
        try {
          const bundle = { ...resumeData, targetJob, industry, experienceLevel };
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bundle));
        } catch (error) {
          console.error(error);
        }
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [resumeData, targetJob, industry, experienceLevel, user, loadedFromStorage]);

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
      const bundle = {
        ...resumeData,
        targetJob,
        industry,
        experienceLevel
      };
      await supabase.from('resumes').upsert({
        user_id: user.id,
        resume_data: bundle,
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
              <Input label="First Name" value={resumeData.personalInfo.firstName} onChange={(e) => updatePersonalInfo('firstName', e.target.value)} className="bg-gray-50 border-gray-200 text-gray-800 h-14 rounded-xl" />
              <Input label="Last Name" value={resumeData.personalInfo.lastName} onChange={(e) => updatePersonalInfo('lastName', e.target.value)} className="bg-gray-50 border-gray-200 text-gray-800 h-14 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Email Address" type="email" value={resumeData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} className="bg-gray-50 border-gray-200 text-gray-800 h-14 rounded-xl" />
              <Input label="Phone Number" type="tel" value={resumeData.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} className="bg-gray-50 border-gray-200 text-gray-800 h-14 rounded-xl" />
            </div>

            <div className="pt-8 border-t border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center border border-primary-200">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="text-lg font-serif font-black text-primary-950 uppercase tracking-tight italic">AI Context Engine</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Target Job</label>
                  <input
                    className="w-full h-14 px-5 text-base bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:border-primary-500 outline-none transition-all"
                    placeholder="e.g. Software Engineer"
                    value={targetJob}
                    onChange={(e) => setTargetJob(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Industry</label>
                  <select
                    className="w-full h-14 px-5 text-base bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:border-primary-500 outline-none transition-all appearance-none"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    <option value="" disabled className="bg-white">Select Industry</option>
                    {['Technology', 'Healthcare', 'Finance', 'Education', 'Construction', 'Creative', 'Government', 'Retail'].map(opt => (
                      <option key={opt} value={opt} className="bg-white">{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Exp. Level</label>
                  <select
                    className="w-full h-14 px-5 text-base bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:border-primary-500 outline-none transition-all appearance-none"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                  >
                    <option value="" disabled className="bg-white">Select Level</option>
                    {['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Executive'].map(opt => (
                      <option key={opt} value={opt} className="bg-white">{opt}</option>
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
                <h3 className="text-2xl font-serif font-black text-primary-950 uppercase tracking-tight italic">Professional Summary</h3>
                <p className="text-sm text-gray-500 font-medium">Define your narrative in exactly 3 impactful sentences.</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={generateSummary}
                loading={aiLoading || aiStatus === 'loading'}
                className="rounded-xl px-6 shadow-lg bg-primary-950 text-white hover:bg-black"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Magic Generate
              </Button>
            </div>

            {aiStatus === 'loading' && (
              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-primary-600 uppercase tracking-widest">
                  <span>{aiMessage}</span>
                  <span>{Math.round(aiProgress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${aiProgress}%` }}
                    className="h-full bg-gradient-to-r from-primary-500 to-blue-400"
                  />
                </div>
              </div>
            )}

            <textarea
              className="w-full min-h-[250px] p-8 text-base bg-gray-50 border border-gray-200 rounded-3xl text-gray-800 leading-relaxed focus:border-primary-500 outline-none transition-all shadow-soft resize-none"
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
                <h3 className="text-2xl font-serif font-black text-primary-950 uppercase tracking-tight italic">Experience</h3>
                <p className="text-sm text-gray-500 font-medium">Record your professional history and use AI to architect bullet points.</p>
              </div>
              <Button variant="outline" size="sm" onClick={addExperience} className="rounded-xl border-gray-200 text-gray-800 hover:bg-gray-50 h-12 px-6">
                <Plus className="h-4 w-4 mr-2" /> Add Position
              </Button>
            </div>

            {aiStatus === 'loading' && (
              <div className="mb-6 space-y-3 p-4 bg-primary-50/50 rounded-2xl border border-primary-100">
                <div className="flex justify-between text-[10px] font-bold text-primary-600 uppercase tracking-widest">
                  <span>{aiMessage}</span>
                  <span>{Math.round(aiProgress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${aiProgress}%` }}
                    className="h-full bg-gradient-to-r from-primary-500 to-blue-400"
                  />
                </div>
              </div>
            )}

            {resumeData.experience.map((exp, idx) => (
              <Card key={exp.id} className="shadow-soft border-gray-100 relative overflow-visible p-2 rounded-3xl">
                <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 z-20">
                  <Trash2 className="h-5 w-5" />
                </Button>
                <CardHeader className="pt-8 px-8"><CardTitle className="text-primary-950 text-xl font-serif font-black italic">Position {idx + 1}</CardTitle></CardHeader>
                <CardContent className="px-8 pb-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Job Title" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} className="bg-gray-50 border-gray-200 text-gray-800 h-14 rounded-xl" placeholder="e.g. Lead Developer" />
                    <Input label="Corporation" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="bg-gray-50 border-gray-200 text-gray-800 h-14 rounded-xl" placeholder="e.g. Stark Industries" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input label="Start Date" type="date" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="bg-gray-50 border-gray-200 text-gray-800 h-14 rounded-xl" />
                    <Input label="End Date" type="date" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} disabled={exp.current} className="bg-gray-50 border-gray-200 text-gray-800 h-14 rounded-xl" />
                    <div className="flex items-center gap-3 pt-8 pb-2">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        className="h-6 w-6 rounded-lg border-gray-200 bg-gray-50 text-primary-500 cursor-pointer focus:ring-primary-500"
                      />
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Active Position</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Key Achievements & Impact</label>
                    </div>
                    {exp.achievements.map((ach, achIdx) => (
                      <div key={achIdx} className="group relative flex gap-3">
                        <textarea
                          className="flex-1 px-5 py-4 text-base bg-gray-50 border border-gray-200 rounded-xl text-gray-800 leading-relaxed focus:border-primary-500 outline-none transition-all min-h-[80px] resize-none"
                          placeholder="Briefly mention a success or responsibility..."
                          value={ach}
                          onChange={(e) => {
                            const updated = [...exp.achievements];
                            updated[achIdx] = e.target.value;
                            updateExperience(exp.id, 'achievements', updated);
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = exp.achievements.filter((_, i) => i !== achIdx);
                            updateExperience(exp.id, 'achievements', updated);
                          }}
                          className="text-gray-400 hover:text-red-500 rounded-xl h-10 w-10 p-0 shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => updateExperience(exp.id, 'achievements', [...exp.achievements, ''])} className="text-primary-600 font-bold uppercase tracking-widest text-[10px] hover:bg-primary-50/50">
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
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-serif font-black text-primary-950 uppercase tracking-tight italic">Education</h3>
                <p className="text-sm text-gray-500 font-medium">Add your academic background and certifications.</p>
              </div>
              <Button variant="outline" size="sm" onClick={addEducation} className="rounded-xl border-gray-200 text-gray-800 hover:bg-gray-50 h-12 px-6">
                <Plus className="h-4 w-4 mr-2" /> Add Education
              </Button>
            </div>

            {resumeData.education.map((edu, idx) => (
              <Card key={edu.id} className="shadow-soft border-gray-100 relative overflow-visible p-2 rounded-3xl">
                <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 z-20">
                  <Trash2 className="h-5 w-5" />
                </Button>
                <CardHeader className="pt-8 px-8"><CardTitle className="text-primary-950 text-xl font-serif font-black italic">Institution {idx + 1}</CardTitle></CardHeader>
                <CardContent className="px-8 pb-8 space-y-8">
                  <Input label="School / University" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} className="bg-gray-50 border-gray-200 text-gray-800 h-14 rounded-xl" placeholder="e.g. NC State University" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Degree Type</label>
                      <select
                        className="w-full h-14 px-5 text-base bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:border-primary-500 outline-none transition-all appearance-none"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      >
                        <option value="" disabled className="bg-white">Select Degree</option>
                        {['High School Diploma', "Associate's Degree", "Bachelor's Degree", "Master's Degree", 'PhD / Doctorate', 'Professional Certification', 'Other'].map(opt => (
                          <option key={opt} value={opt} className="bg-white">{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Field of Study</label>
                      <select
                        className="w-full h-14 px-5 text-base bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:border-primary-500 outline-none transition-all appearance-none"
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                      >
                        <option value="" disabled className="bg-white">Select Field</option>
                        {['Computer Science', 'Business Administration', 'Nursing', 'Psychology', 'Mechanical Engineering', 'General Studies', 'Communications', 'Accounting', 'Criminal Justice', 'Other'].map(opt => (
                          <option key={opt} value={opt} className="bg-white">{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Start Date" type="date" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} className="bg-gray-50 border-gray-200 text-gray-800 h-14 rounded-xl" />
                    <Input label="End Date (Expected)" type="date" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} className="bg-gray-50 border-gray-200 text-gray-800 h-14 rounded-xl" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-1 mb-4">
              <h3 className="text-2xl font-serif font-black text-primary-950 uppercase tracking-tight italic">Strategic Skills</h3>
              <p className="text-sm text-gray-500 font-medium">Map your core competencies to the target role.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumeData.skills.map((skill, idx) => (
                <div key={idx} className="group flex items-center gap-3 bg-gray-50 border border-gray-200 p-2 pl-4 rounded-xl focus-within:border-primary-500/50 transition-all">
                  <input
                    value={skill}
                    onChange={(e) => updateSkill(idx, e.target.value)}
                    className="flex-1 bg-transparent border-none text-base text-gray-800 font-bold uppercase tracking-wider focus:outline-none"
                    placeholder="e.g. Project Architecture"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(idx)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <button
                onClick={addSkill}
                className="flex items-center justify-center gap-3 p-4 rounded-xl border border-dashed border-gray-200 text-gray-500 hover:border-primary-500/50 hover:text-primary-600 transition-all group h-14"
              >
                <Plus className="h-4 w-4 mr-2 transition-transform group-hover:rotate-90" />
                <span className="text-[10px] font-black uppercase tracking-widest">Append Manual Skill</span>
              </button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif font-black text-primary-950 uppercase tracking-tight italic">Certifications</h3>
                  <p className="text-sm text-gray-500 font-medium">Add professional licenses and credentials.</p>
                </div>
                <Button variant="outline" size="sm" onClick={addCertification} className="rounded-xl border-gray-200 text-gray-800 hover:bg-gray-50 h-12 px-6">
                  <Plus className="h-4 w-4 mr-2" /> Add Credential
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resumeData.certifications.map((cert) => (
                  <div key={cert.id} className="relative bg-gray-50 border border-gray-200 p-6 rounded-3xl group shadow-soft">
                    <button onClick={() => removeCertification(cert.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="space-y-4">
                      <Input label="Certification Name" value={cert.name} onChange={(e) => updateCertification(cert.id, 'name', e.target.value)} className="bg-white border-gray-200 text-gray-800" />
                      <Input label="Issuing Organization" value={cert.issuer} onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)} className="bg-white border-gray-200 text-gray-800" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8 pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif font-black text-primary-950 uppercase tracking-tight italic">Languages</h3>
                  <p className="text-sm text-gray-500 font-medium">Specify your linguistic proficiency.</p>
                </div>
                <Button variant="outline" size="sm" onClick={addLanguage} className="rounded-xl border-gray-200 text-gray-800 hover:bg-gray-50 h-12 px-6">
                  <Plus className="h-4 w-4 mr-2" /> Add Language
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resumeData.languages.map((lang) => (
                  <div key={lang.id} className="relative bg-gray-50 border border-gray-200 p-4 rounded-xl group flex flex-col gap-3 shadow-soft">
                    <button onClick={() => removeLanguage(lang.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-3 w-3" />
                    </button>
                    <input className="bg-transparent border-none text-base text-gray-800 font-bold placeholder:text-gray-400 focus:outline-none" placeholder="Language" value={lang.language} onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)} />
                    <select className="bg-white border border-gray-200 rounded-lg text-[10px] text-primary-600 font-black uppercase p-2 outline-none" value={lang.proficiency} onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}>
                      {['Native', 'Fluent', 'Professional', 'Intermediate', 'Basic'].map(p => <option key={p} value={p} className="bg-white">{p}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-serif font-black text-primary-950 uppercase tracking-tight italic">Final Preview</h3>
              <div className="flex gap-3">
                <Button variant="primary" onClick={exportToPDF} loading={loading} className="rounded-xl px-8 bg-primary-950 text-white hover:bg-black">
                  <Download className="h-4 w-4 mr-2" /> PDF Export
                </Button>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-[3rem] p-1 shadow-soft overflow-hidden">
              <ResumePreview resumeData={resumeData} template={selectedTemplate} />
            </div>
          </div>
        );

      default: return null;
    }
  };

  const isViewingMode = !!searchParams?.get('view');

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      {/* Hero Section */}
      <div className="pt-32 pb-16 bg-primary-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(52,97,173,0.1),transparent)]" />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-primary-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Professional Suite</span>
            <h1 className="text-5xl md:text-7xl font-serif font-black text-primary-950 tracking-tighter leading-none italic mb-6">
              Resume <span className="text-primary-700 not-italic">Builder.</span>
            </h1>
            <p className="text-xl text-gray-400 font-serif italic max-w-2xl leading-relaxed">
              Architect your professional identity with AI-augmented specificity and premium design aesthetics.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 lg:sticky lg:top-32">
            <div className="bg-white rounded-[3rem] border border-gray-50 p-8 shadow-soft">
              <div className="space-y-4">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={cn(
                        "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group",
                        currentStep === step.id
                          ? "bg-primary-950 text-white shadow-xl shadow-primary-950/20"
                          : "hover:bg-gray-50 text-gray-400 hover:text-primary-950"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        currentStep === step.id ? "bg-white/10" : "bg-gray-100 group-hover:bg-gray-200"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-serif italic font-bold text-lg">{step.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-12 pt-12 border-t border-gray-50 space-y-4">
                <Button
                  onClick={saveResume}
                  loading={saving}
                  className="w-full bg-primary-950 hover:bg-black text-white h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]"
                >
                  <Save className="h-4 w-4 mr-3" />
                  Preserve Stack
                </Button>
                <Button
                  onClick={exportToPDF}
                  className="w-full bg-primary-50 text-primary-950 hover:bg-primary-100 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]"
                >
                  <Download className="h-4 w-4 mr-3" />
                  Export PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="lg:col-span-9 space-y-12">
            <div className="bg-white p-12 lg:p-16 rounded-[4rem] border border-gray-50 shadow-soft relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-bl-[8rem] pointer-events-none opacity-30" />

              <div className="relative z-10">
                {renderStepContent()}

                <div className="flex items-center justify-between mt-20 pt-12 border-t border-gray-50">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                    disabled={currentStep === 1}
                    className="text-gray-400 hover:text-primary-950 font-black uppercase tracking-[0.2em] text-[10px]"
                  >
                    <ChevronLeft className="h-4 w-4 mr-3" />
                    Previous Module
                  </Button>

                  {currentStep < 7 ? (
                    <Button
                      onClick={() => setCurrentStep(prev => Math.min(7, prev + 1))}
                      className="bg-primary-950 hover:bg-black text-white px-10 h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary-950/20 transform hover:-translate-y-1 transition-all"
                    >
                      Next Module
                    </Button>
                  ) : (
                    <Button
                      onClick={exportToPDF}
                      className="bg-primary-950 hover:bg-black text-white px-10 h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary-950/20 transform hover:-translate-y-1 transition-all"
                    >
                      Confirm & Export
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

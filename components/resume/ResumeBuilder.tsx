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
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [targetJob, setTargetJob] = useState('');
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const LOCAL_STORAGE_KEY = 'monroe_resume_builder_data';

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
            console.error('Error migrating local data:', error);
          }
        }
      }
    });
    return () => subscription.unsubscribe();
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

  const generateSummary = async () => {
    if (resumeData.experience.length === 0) return;
    setAiLoading(true);
    try {
      const result = await generateSummaryAction(resumeData.experience, targetJob);
      if (result.success && result.summary) {
        setResumeData(prev => ({ ...prev, summary: result.summary }));
      }
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
      const result = await enhanceBulletPointAction(
        experience.achievements[achievementIndex],
        `${experience.position} at ${experience.company}`
      );
      if (result.success && result.enhanced) {
        const updatedAchievements = [...experience.achievements];
        updatedAchievements[achievementIndex] = result.enhanced;
        updateExperience(experienceId, 'achievements', updatedAchievements);
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="First Name" value={resumeData.personalInfo.firstName} onChange={(e) => updatePersonalInfo('firstName', e.target.value)} placeholder="John" className="bg-white/5 border-white/10 text-white" />
              <Input label="Last Name" value={resumeData.personalInfo.lastName} onChange={(e) => updatePersonalInfo('lastName', e.target.value)} placeholder="Doe" className="bg-white/5 border-white/10 text-white" />
            </div>
            <Input label="Email" type="email" value={resumeData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} placeholder="john@example.com" className="bg-white/5 border-white/10 text-white" />
            <Input label="Phone" value={resumeData.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} placeholder="(704) 123-4567" className="bg-white/5 border-white/10 text-white" />
            <Input label="Address" value={resumeData.personalInfo.address} onChange={(e) => updatePersonalInfo('address', e.target.value)} placeholder="Monroe, NC" className="bg-white/5 border-white/10 text-white" />
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl p-6 mb-8">
              <h4 className="font-bold text-lg text-primary-400 mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> AI Optimization
              </h4>
              <Input label="Target Job" value={targetJob} onChange={(e) => setTargetJob(e.target.value)} placeholder="Software Engineer" className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Summary</h3>
              <Button variant="gradient" size="sm" onClick={generateSummary} loading={aiLoading} disabled={resumeData.experience.length === 0} className="rounded-full">
                <Sparkles className="h-4 w-4 mr-2" /> Generate with AI
              </Button>
            </div>
            <textarea className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white min-h-[160px]" rows={6} value={resumeData.summary} onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))} placeholder="High-impact summary..." />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Experience</h3>
              <Button variant="outline" size="sm" onClick={addExperience} className="rounded-xl border-white/10 text-white">
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
            {resumeData.experience.map((exp, idx) => (
              <Card key={exp.id} className="glass-card border-white/10 relative overflow-visible">
                <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <CardHeader><CardTitle className="text-white">Experience {idx + 1}</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Title" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                    <Input label="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Input label="Start" type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="bg-white/5 border-white/10 text-white [color-scheme:dark]" />
                    <Input label="End" type="month" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} disabled={exp.current} className="bg-white/5 border-white/10 text-white [color-scheme:dark]" />
                    <div className="pt-8 flex items-center gap-2">
                      <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)} className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary-500" />
                      <span className="text-sm text-slate-400">Current</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {exp.achievements.map((ach, achIdx) => (
                      <div key={achIdx} className="flex gap-2">
                        <textarea className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm" rows={2} value={ach} onChange={(e) => {
                          const updated = [...exp.achievements];
                          updated[achIdx] = e.target.value;
                          updateExperience(exp.id, 'achievements', updated);
                        }} />
                        <Button variant="ghost" size="sm" onClick={() => enhanceBulletPoint(exp.id, achIdx)} loading={aiLoading} className="bg-primary-500/10 text-primary-400">
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => updateExperience(exp.id, 'achievements', [...exp.achievements, ''])} className="text-primary-400">
                      <Plus className="h-3 w-3 mr-1" /> Add Achievement
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
              <Button variant="outline" size="sm" onClick={addEducation} className="rounded-xl border-white/10 text-white">Add</Button>
            </div>
            {resumeData.education.map((edu, idx) => (
              <Card key={edu.id} className="glass-card border-white/10">
                <CardContent className="pt-6 space-y-4">
                  <Input label="Institution" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                  <Input label="Degree" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                  <Button variant="ghost" onClick={() => removeEducation(edu.id)} className="text-red-400">Remove</Button>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
              <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
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

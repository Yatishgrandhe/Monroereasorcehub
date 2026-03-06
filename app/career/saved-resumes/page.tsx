'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import { FileText, Download, Trash2, Eye, Edit, Plus, Database, LogIn, Info } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { exportResumeToPDF } from '@/lib/utils/pdf-export';
import type { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';

interface SavedResume {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  resume_data: any;
}

const LOCAL_STORAGE_KEY = 'monroe_resume_builder_data';

export default function SavedResumesPage() {
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    loadResumes();

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user !== null) {
      loadResumes();
    }
  }, [user]);

  const loadResumes = async () => {
    try {
      setLoading(true);

      if (user) {
        // Load from database for logged-in users
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) throw error;
        setResumes(data || []);
      } else {
        // Load from local storage for guest users
        if (typeof window !== 'undefined') {
          const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (savedData) {
            try {
              const parsed = JSON.parse(savedData);
              // Create a resume object from local storage data
              const localResume: SavedResume = {
                id: 'local-resume',
                title: `${parsed.personalInfo?.firstName || 'My'} ${parsed.personalInfo?.lastName || 'Resume'}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                resume_data: parsed
              };
              setResumes([localResume]);
            } catch (error) {
              console.error('Error loading from local storage:', error);
              setResumes([]);
            }
          } else {
            setResumes([]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading resumes:', error);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    setDeleting(id);
    try {
      if (user) {
        // Delete from database for logged-in users
        const { error } = await supabase
          .from('resumes')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } else {
        // Delete from local storage for guest users
        if (typeof window !== 'undefined') {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
      setResumes(resumes.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleExport = async (resumeData: any) => {
    setExporting(resumeData.personalInfo?.firstName || 'export');
    try {
      await exportResumeToPDF(resumeData, 'modern');
    } catch (error) {
      console.error('Error exporting resume:', error);
      alert('Failed to export resume. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const handleView = async (resumeData: any, resumeId: string) => {
    try {
      // Store resume data in sessionStorage for viewing
      sessionStorage.setItem('viewingResume', JSON.stringify(resumeData));
      router.push(`/career/resume-builder?view=${resumeId}`);
    } catch (error) {
      console.error('Error viewing resume:', error);
      alert('Failed to view resume. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center relative">
          <div className="absolute -inset-8 bg-primary-500/10 blur-3xl rounded-full" />
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto mb-6 shadow-lg shadow-primary-500/20" />
            <h2 className="text-2xl font-black text-primary-950 mb-2 tracking-tighter uppercase font-serif italic">
              Monroe <span className="text-primary-700">Resource</span> Hub
            </h2>
            <p className="text-slate-500 font-medium font-serif italic">
              Accessing your career archives...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      {/* Hero Header */}
      <div className="pt-32 pb-16 bg-primary-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(52,97,173,0.1),transparent)]" />
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <span className="text-primary-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Personal Archives</span>
              <h1 className="text-5xl md:text-7xl font-serif font-black text-primary-950 tracking-tighter leading-none italic mb-6">
                My Resumes<span className="text-primary-700 not-italic">.</span>
              </h1>
              <p className="text-xl text-gray-400 font-serif italic max-w-2xl">
                {user
                  ? 'Professional infrastructure for auditing and exporting your career documentation.'
                  : 'Local browser cache containing your active resume development data.'}
              </p>
            </div>
            <Button size="lg" asChild className="bg-primary-950 hover:bg-black text-white px-10 h-16 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary-950/20 transition-all transform hover:-translate-y-1 active:translate-y-0" href="/career/resume-builder">
              <Plus className="h-4 w-4 mr-3" />
              New Archive
            </Button>
          </div>
        </div>
      </div>

      <div className="container-custom py-24 relative z-10">
        {/* Guest User Notice */}
        {!user && (
          <div className="mb-16">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-soft relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[4rem] pointer-events-none opacity-50" />
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-950 shrink-0">
                  <Database className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-serif font-black text-primary-950 mb-3 italic tracking-tight">Guest Protocol Active</h3>
                  <p className="text-gray-500 font-serif italic leading-relaxed text-lg mb-8 max-w-3xl">
                    Your documentation is currently stored within this browser&apos;s local cache. This data is device-specific and will not persist across different systems.
                    <strong className="text-primary-700"> Sync your archives</strong> to the cloud for universal professional access.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline" size="sm" asChild className="rounded-2xl border-gray-100 bg-white text-primary-950 font-black uppercase tracking-[0.2em] text-[9px] h-12 px-8 hover:bg-gray-50 shadow-soft" href="/auth/signup">
                      <LogIn className="h-4 w-4 mr-3" />
                      Create Account
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="rounded-2xl text-gray-400 hover:text-primary-950 font-black uppercase tracking-[0.2em] text-[9px] h-12 px-8" href="/career">
                      <Info className="h-4 w-4 mr-3" />
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {resumes.length === 0 ? (
          <div className="bg-white p-24 text-center rounded-[5rem] border border-gray-50 shadow-soft relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
            <div className="relative z-10">
              <div className="w-24 h-24 rounded-[2rem] bg-primary-50 flex items-center justify-center mx-auto mb-10 border border-primary-100 shadow-inner">
                <FileText className="h-10 w-10 text-primary-400" />
              </div>
              <h3 className="text-4xl font-serif font-black text-primary-950 mb-6 italic tracking-tight">No Active Archives</h3>
              <p className="text-xl text-gray-400 font-serif italic max-w-md mx-auto mb-12">
                {user
                  ? 'Start building your professional narrative to architect your career story and save it for easy access.'
                  : "Your browser storage is currently empty. Start building your first resume to see it archived here."}
              </p>
              <Button size="lg" asChild className="bg-primary-950 hover:bg-black text-white px-12 h-20 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary-950/20 transition-all transform hover:-translate-y-1 active:translate-y-0" href="/career/resume-builder">
                <Plus className="h-5 w-5 mr-3" />
                Architect Resume
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {resumes.map((resume) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="bg-white p-12 lg:p-14 h-full flex flex-col border border-gray-50 rounded-[4rem] shadow-soft hover:shadow-civic-hover hover:-translate-y-2 transition-all duration-700 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[4rem] pointer-events-none opacity-50" />

                  <div className="flex items-start justify-between mb-10">
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="text-2xl font-serif font-black text-primary-950 mb-2 italic tracking-tight truncate">
                        {resume.resume_data?.personalInfo?.firstName} {resume.resume_data?.personalInfo?.lastName}
                      </h3>
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-[9px] font-black uppercase tracking-[0.2em]">
                        {resume.title.split(' - ')[1] || 'Professional Archive'}
                      </span>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-950 group-hover:bg-primary-950 group-hover:text-white transition-all duration-500 shadow-sm">
                      <FileText className="h-7 w-7" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-6 mb-12">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-700" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Updated {formatDate(resume.updated_at)}</span>
                    </div>
                    {resume.resume_data?.targetJob && (
                      <div>
                        <span className="text-[9px] font-black text-primary-700 uppercase tracking-[0.3em] block mb-2">Operational Goal</span>
                        <p className="text-lg text-gray-500 font-serif italic line-clamp-2 leading-snug">
                          {resume.resume_data.targetJob}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-10 border-t border-gray-50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(resume.resume_data, resume.id)}
                      className="rounded-2xl border-gray-100 bg-white text-primary-950 font-black uppercase tracking-[0.2em] text-[9px] h-14 hover:bg-gray-50 shadow-soft"
                    >
                      <Eye className="h-4 w-4 mr-3" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleExport(resume.resume_data)}
                      loading={exporting === (resume.resume_data?.personalInfo?.firstName || 'export')}
                      className="rounded-2xl bg-primary-50 text-primary-950 hover:bg-primary-100 font-black uppercase tracking-[0.2em] text-[9px] h-14 shadow-sm"
                    >
                      <Download className="h-4 w-4 mr-3" />
                      PDF
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="col-span-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl text-[8px] font-black uppercase tracking-[0.3em] transition-all h-10 mt-4"
                      onClick={() => handleDelete(resume.id)}
                      loading={deleting === resume.id}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-3" />
                      Purge Archive
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 mesh-bg pt-20">
      <div className="container-custom section-padding">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">My Saved Resumes</h1>
              <p className="text-xl text-slate-400 max-w-3xl font-sans">
                {user ? 'Manage and export your saved resumes' : 'View and manage your resume saved in your browser'}
              </p>
            </div>
            <Button variant="gradient" size="md" asChild href="/career/resume-builder">
              <Plus className="h-4 w-4 mr-2" />
              Create New Resume
            </Button>
          </div>

          {/* Guest User Notice */}
          {!user && (
            <div className="mb-6">
              <Card className="bg-primary-500/10 border-primary-500/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-white mb-1">Guest User - Local Storage</p>
                      <p className="text-sm text-slate-300 mb-2">
                        Your resume is saved in your browser&apos;s local storage. This means your data stays on this device and won&apos;t sync across other devices or browsers.
                        <strong> Consider creating an account</strong> to access your work from anywhere and save multiple resumes.
                      </p>
                      <p className="text-xs text-slate-400 mb-3 italic">
                        💡 <strong>Good news:</strong> When you create an account or log in, all your local data (resumes, cover letters, job analysis)
                        will be automatically migrated to your account so you can access everything from anywhere!
                      </p>
                      <div className="flex items-center gap-2">
                        <Link
                          href="/auth/signup"
                          className="btn btn-outline btn-sm inline-flex items-center justify-center border-white/20 text-white hover:bg-white/10"
                        >
                          <LogIn className="h-4 w-4 mr-2" />
                          Create Account
                        </Link>
                        <Link
                          href="/career"
                          className="btn btn-ghost btn-sm inline-flex items-center justify-center text-slate-400 hover:text-white"
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

        {resumes.length === 0 ? (
          <Card className="glass-card border-white/10 overflow-hidden rounded-[3rem]">
            <CardContent className="text-center py-24">
              <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner">
                <FileText className="h-10 w-10 text-slate-500" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
                No Saved Resumes
              </h3>
              <p className="text-slate-400 mb-10 max-w-md mx-auto font-medium">
                {user
                  ? 'Start building your first resume to architect your career story and save it for easy access.'
                  : "Your browser storage is currently empty. Start building your first resume now to see it here."}
              </p>
              <Button variant="gradient" size="lg" asChild href="/career/resume-builder" className="rounded-full px-10 shadow-lg shadow-primary-500/20">
                <Plus className="h-5 w-5 mr-3" />
                Architect Resume
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumes.map((resume) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="glass-card border-white/10 hover:border-primary-500/50 transition-all duration-500 group overflow-hidden rounded-[2.5rem] h-full flex flex-col hover:shadow-2xl hover:shadow-primary-500/10">
                  <CardHeader className="p-8 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl font-black text-white mb-1 truncate tracking-tight">
                          {resume.resume_data?.personalInfo?.firstName} {resume.resume_data?.personalInfo?.lastName}
                        </CardTitle>
                        <Badge variant="glass" className="bg-primary-500/10 text-primary-400 border-none text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5">
                          {resume.title.split(' - ')[1] || 'Professional Resume'}
                        </Badge>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary-500/30 transition-colors">
                        <FileText className="h-6 w-6 text-primary-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-4 flex-1 flex flex-col">
                    <div className="space-y-4 mb-8 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500/50" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Updated {formatDate(resume.updated_at)}</span>
                      </div>
                      {resume.resume_data?.targetJob && (
                        <p className="text-sm text-slate-400 line-clamp-2 font-medium">
                          <span className="text-slate-500 font-bold uppercase text-[9px] block mb-1 tracking-widest">Target Role</span>
                          {resume.resume_data.targetJob}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(resume.resume_data, resume.id)}
                        className="rounded-2xl border-white/10 text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px] h-12"
                      >
                        <Eye className="h-3.5 w-3.5 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExport(resume.resume_data)}
                        loading={exporting === (resume.resume_data?.personalInfo?.firstName || 'export')}
                        className="rounded-2xl bg-white/5 text-slate-300 hover:text-white font-bold uppercase tracking-widest text-[10px] h-12"
                      >
                        <Download className="h-3.5 w-3.5 mr-2" />
                        PDF
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="col-span-2 text-slate-600 hover:text-red-400 hover:bg-red-400/5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all h-8 mt-2"
                        onClick={() => handleDelete(resume.id)}
                        loading={deleting === resume.id}
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Purged Archive
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


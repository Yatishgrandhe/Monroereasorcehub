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
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom section-padding">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="title-section mb-2">My Saved Resumes</h1>
              <p className="text-xl text-secondary-600 max-w-3xl font-sans">
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
              <Card className="bg-primary-50 border-primary-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-primary-900 mb-1">Guest User - Local Storage</p>
                      <p className="text-sm text-primary-700 mb-2">
                        Your resume is saved in your browser&apos;s local storage. This means your data stays on this device and won&apos;t sync across other devices or browsers. 
                        <strong> Consider creating an account</strong> to access your work from anywhere and save multiple resumes.
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
                          Create Account
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

        {resumes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-secondary-400" />
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  No saved resumes yet
                </h3>
                <p className="text-secondary-600 mb-6">
                  {user 
                    ? 'Start building your first resume to save it here for easy access and editing.'
                    : "Start building your first resume. It will be saved in your browser's local storage for easy access and editing."}
                </p>
                <Button variant="gradient" size="md" asChild href="/career/resume-builder">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Resume
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <Card key={resume.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          {resume.resume_data?.personalInfo?.firstName} {resume.resume_data?.personalInfo?.lastName}
                        </CardTitle>
                        <CardDescription>{resume.title}</CardDescription>
                      </div>
                      <FileText className="h-8 w-8 text-primary-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-secondary-600">
                        <span className="font-medium mr-2">Created:</span>
                        {formatDate(resume.created_at)}
                      </div>
                      <div className="flex items-center text-sm text-secondary-600">
                        <span className="font-medium mr-2">Updated:</span>
                        {formatDate(resume.updated_at)}
                      </div>
                      {resume.resume_data?.personalInfo?.email && (
                        <div className="flex items-center text-sm text-secondary-600 truncate">
                          <span className="font-medium mr-2">Email:</span>
                          {resume.resume_data.personalInfo.email}
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(resume.resume_data, resume.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExport(resume.resume_data)}
                        loading={exporting === (resume.resume_data?.personalInfo?.firstName || 'export')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="col-span-2 text-error"
                        onClick={() => handleDelete(resume.id)}
                        loading={deleting === resume.id}
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


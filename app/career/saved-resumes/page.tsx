'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase/client';
import {
  FileText,
  Download,
  Trash2,
  Edit,
  Copy,
  Plus,
  Database,
  LogIn,
  AlertCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { exportResumeToPDF } from '@/lib/utils/pdf-export';
import {
  getGuestResumes,
  deleteGuestResume,
  duplicateGuestResume,
  type GuestResume,
} from '@/lib/utils/guest-resumes';
import type { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { PageSplineBanner } from '@/components/ui/PageSplineBanner';
import { Reveal } from '@/components/ui/Reveal';
import { SPLINE_PAGES_URL } from '@/lib/spline';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

const GUEST_EXPIRY_WARNING_KEY = 'guest_resumes_expiry_warning_shown';

interface SavedResumeDb {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  resume_data: Record<string, unknown>;
}

export default function SavedResumesPage() {
  const [resumes, setResumes] = useState<SavedResumeDb[]>([]);
  const [guestResumes, setGuestResumes] = useState<GuestResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadResumes();
  }, [user]);

  function loadResumes() {
    setLoading(true);
    try {
      if (user) {
        loadFromDb();
      } else {
        setGuestResumes(getGuestResumes());
        setResumes([]);
        if (typeof window !== 'undefined' && !sessionStorage.getItem(GUEST_EXPIRY_WARNING_KEY)) {
          setShowExpiryWarning(true);
          sessionStorage.setItem(GUEST_EXPIRY_WARNING_KEY, '1');
        }
      }
    } catch (error) {
      console.error('Error loading resumes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadFromDb() {
    if (!user) return;
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    setResumes((data as SavedResumeDb[]) || []);
    setGuestResumes([]);
  }

  const handleDeleteDb = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase.from('resumes').delete().eq('id', id);
      if (error) throw error;
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume. Please try again.');
    } finally {
      setDeleting(null);
      setDeleteConfirmId(null);
    }
  };

  const handleDeleteGuest = (id: string) => {
    deleteGuestResume(id);
    setGuestResumes(getGuestResumes());
    setDeleteConfirmId(null);
    setDeleting(null);
  };

  const handleDelete = (id: string, isGuest: boolean) => {
    if (isGuest) {
      setDeleteConfirmId(id);
      setDeleting(id);
    } else {
      if (!confirm('Are you sure you want to delete this resume?')) return;
      handleDeleteDb(id);
    }
  };

  const confirmDeleteGuest = () => {
    if (deleteConfirmId) {
      handleDeleteGuest(deleteConfirmId);
    }
  };

  const handleExport = async (resumeData: Record<string, unknown>) => {
    const key = (resumeData?.personalInfo as { firstName?: string })?.firstName ?? 'export';
    setExporting(key);
    try {
      await exportResumeToPDF(resumeData as unknown as Parameters<typeof exportResumeToPDF>[0], 'modern');
    } catch (error) {
      console.error('Error exporting resume:', error);
      alert('Failed to export resume. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const handleDuplicateGuest = (id: string) => {
    const copy = duplicateGuestResume(id);
    if (copy) setGuestResumes(getGuestResumes());
    else alert('Guest accounts are limited to 3 resumes. Sign up to save unlimited resumes.');
  };

  const isGuest = !user;
  const displayList = isGuest ? guestResumes : resumes;
  const getResumeData = (item: GuestResume | SavedResumeDb): Record<string, unknown> =>
    'data' in item ? item.data : (item as SavedResumeDb).resume_data;
  const getTitle = (item: GuestResume | SavedResumeDb) =>
    'title' in item ? item.title : (item as SavedResumeDb).title;
  const getUpdatedAt = (item: GuestResume | SavedResumeDb) =>
    'updatedAt' in item ? (item as GuestResume).updatedAt : (item as SavedResumeDb).updated_at;
  const getItemId = (item: GuestResume | SavedResumeDb) => item.id;

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
            <p className="text-slate-500 font-medium font-serif italic">Loading your resumes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      <PageSplineBanner sceneUrl={SPLINE_PAGES_URL || undefined} height="40vh">
        <div className="container-custom w-full">
          <Reveal width="100%">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 w-full text-left">
              <div className="max-w-3xl">
                <span className="px-5 py-2 rounded-full bg-accent-500/10 border border-accent-400/20 text-accent-400 font-black uppercase tracking-[0.3em] text-[10px] backdrop-blur-md mb-4 inline-block">
                  Personal Archives
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white tracking-tighter leading-none italic mb-6 whitespace-nowrap">
                  My Resumes<span className="text-secondary-500 not-italic">.</span>
                </h1>
                <div className="w-24 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mb-6" />
                <p className="text-xl md:text-2xl text-blue-50/70 max-w-2xl leading-relaxed italic font-medium">
                  {user
                    ? 'Professional infrastructure for auditing and exporting your career documentation.'
                    : 'Local browser storage. Sign up to save resumes to the cloud and access them anywhere.'}
                </p>
              </div>
              <Button
                size="lg"
                asChild
                className="bg-white hover:bg-blue-50 text-primary-950 px-10 h-16 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all transform hover:-translate-y-1 active:translate-y-0 shrink-0 mb-4"
                href="/career/resume-builder"
              >
                <>
                  <Plus className="h-4 w-4 mr-3" />
                  New Resume
                </>
              </Button>
            </div>
          </Reveal>
        </div>
      </PageSplineBanner>

      <div className="container-custom py-12 relative z-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Career Center', href: '/career' }, { label: 'My Resumes' }]} className="mb-6" />
        {/* Guest banner */}
        {isGuest && (
          <div className="mb-10 rounded-2xl border border-primary-200 bg-primary-50/80 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center shrink-0">
                <Database className="h-6 w-6 text-[#2563EB]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-950">
                  You&apos;re viewing as a guest
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Sign up to save your resumes to the cloud and access them anywhere.
                </p>
              </div>
            </div>
            <Button asChild className="bg-primary-950 hover:bg-black text-white shrink-0 rounded-xl px-8 h-12">
              <Link href="/auth/signup">
                <LogIn className="h-4 w-4 mr-2" />
                Sign Up
              </Link>
            </Button>
          </div>
        )}

        {/* Expiry warning — once per session */}
        {isGuest && showExpiryWarning && guestResumes.length > 0 && (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Guest resumes are stored on this device only and may be lost if you clear your browser
              data.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 text-amber-700 hover:bg-amber-100"
              onClick={() => setShowExpiryWarning(false)}
            >
              Dismiss
            </Button>
          </div>
        )}

        {displayList.length === 0 ? (
          <div className="bg-white p-24 text-center rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="w-24 h-24 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-10 border border-primary-100">
              <FileText className="h-10 w-10 text-primary-400" />
            </div>
            <h3 className="text-3xl font-serif font-black text-primary-950 mb-4 italic tracking-tight">
              No resumes saved yet
            </h3>
            <p className="text-lg text-gray-500 font-serif italic max-w-md mx-auto mb-10">
              Build your first resume and save it here to edit, download, or duplicate anytime.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-primary-950 hover:bg-black text-white px-12 h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary-950/20"
              href="/career/resume-builder"
            >
              <>
                <Plus className="h-5 w-5 mr-2" />
                Build your first resume
              </>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayList.map((item) => {
              const data = getResumeData(item);
              const title = getTitle(item);
              const updatedAt = getUpdatedAt(item);
              const id = getItemId(item);
              const personalInfo = (data?.personalInfo || {}) as { firstName?: string; lastName?: string };
              const displayTitle = title || `${personalInfo.firstName || ''} ${personalInfo.lastName || 'Resume'}`.trim() || 'Untitled Resume';

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <Card className="border-0 shadow-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-semibold text-primary-950 truncate">
                        {displayTitle}
                      </CardTitle>
                      <p className="text-xs text-gray-500">Last updated {formatDate(updatedAt)}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="rounded-lg"
                        >
                          <Link href={isGuest ? `/career/resume-builder?guestId=${id}` : `/career/resume-builder?view=${id}`}>
                            <Edit className="h-3.5 w-3.5 mr-1.5" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => handleExport(data)}
                          disabled={!!exporting}
                        >
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          Download PDF
                        </Button>
                        {isGuest && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg"
                            onClick={() => handleDuplicateGuest(id)}
                          >
                            <Copy className="h-3.5 w-3.5 mr-1.5" />
                            Duplicate
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(id, isGuest)}
                          disabled={deleting === id}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete confirmation for guest resumes */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this resume?</DialogTitle>
            <DialogDescription>
              This will remove the resume from this device. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setDeleteConfirmId(null); setDeleting(null); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteGuest}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

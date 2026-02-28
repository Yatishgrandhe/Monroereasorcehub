import { Suspense } from 'react';
import { ResumeBuilder } from '@/components/resume/ResumeBuilder';

function ResumeBuilderContent() {
  return <ResumeBuilder />;
}

export default function ResumeBuilderPage() {
  return (
      <Suspense fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading resume builder...</p>
          </div>
        </div>
      }>
        <ResumeBuilderContent />
      </Suspense>
  );
}

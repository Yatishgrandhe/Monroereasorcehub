import { Suspense } from 'react';
import { ResumeBuilder } from '@/components/resume/ResumeBuilder';

function ResumeBuilderContent() {
  return <ResumeBuilder />;
}

export default function ResumeBuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading resume builder...</p>
        </div>
      </div>
    }>
      <ResumeBuilderContent />
    </Suspense>
  );
}

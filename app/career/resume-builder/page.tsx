import { Suspense } from 'react';
import { ResumeBuilder } from '@/components/resume/ResumeBuilder';

function ResumeBuilderContent() {
  return <ResumeBuilder />;
}

export default function ResumeBuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto mb-6 shadow-lg shadow-primary-500/20" />
          <p className="text-gray-400 font-serif italic text-lg">Initializing builder module...</p>
        </div>
      </div>
    }>
      <ResumeBuilderContent />
    </Suspense>
  );
}

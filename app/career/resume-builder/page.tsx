import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ResumeBuilder } from '@/components/resume/ResumeBuilder';

export default function ResumeBuilderPage() {
  return (
    <ProtectedRoute>
      <ResumeBuilder />
    </ProtectedRoute>
  );
}

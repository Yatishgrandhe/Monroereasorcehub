import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { JobAssistant } from '@/components/resume/JobAssistant';

export default function JobAssistantPage() {
  return (
    <ProtectedRoute>
      <JobAssistant />
    </ProtectedRoute>
  );
}

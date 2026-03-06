import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Copyright Checklist',
  description: 'Complete documentation of all copyrighted materials used in the Monroe Resource Hub project.',
};

export default function StudentCopyrightChecklistPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <iframe
        src="/documents/student-copyright-checklist.pdf"
        title="Student Copyright Checklist"
        className="w-full h-[calc(100vh-2rem)] rounded-lg border-0"
      />
    </div>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work Log',
  description: 'Detailed log of all work completed during Monroe Resource Hub project development.',
};

export default function WorkLogPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <iframe
        src="/documents/work-log.pdf"
        title="Work Log"
        className="w-full h-[calc(100vh-2rem)] rounded-lg border-0"
      />
    </div>
  );
}

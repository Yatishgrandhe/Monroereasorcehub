import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Saved Resumes',
    description: 'Manage and export your saved resumes.',
};

export default function SavedResumesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

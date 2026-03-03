import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Saved Resumes',
};

export default function SavedResumesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Resume Builder',
    description: 'Build a professional AI-enhanced resume.',
};

export default function ResumeBuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

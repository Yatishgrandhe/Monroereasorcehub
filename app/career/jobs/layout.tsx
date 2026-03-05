import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Job Board',
    description: 'Find local jobs in Monroe and Union County.',
};

export default function JobsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

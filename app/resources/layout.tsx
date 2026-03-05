import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Resources',
    description: 'Community resource directory for Monroe and Union County.',
};

export default function ResourcesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

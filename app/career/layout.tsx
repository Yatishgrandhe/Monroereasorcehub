import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Career Center',
    description: 'AI-powered career tools for Monroe residents.',
};

export default function CareerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

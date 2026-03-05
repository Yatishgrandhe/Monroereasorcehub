import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Job Assistant',
    description: 'AI-powered help for cover letters and interview prep.',
};

export default function JobAssistantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

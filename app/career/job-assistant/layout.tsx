import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Job Assistant',
};

export default function JobAssistantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

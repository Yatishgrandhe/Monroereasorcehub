import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Volunteer Opportunities',
    description: 'Find ways to give back to the Monroe community.',
};

export default function VolunteerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

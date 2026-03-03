import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Career Center',
};

export default function CareerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

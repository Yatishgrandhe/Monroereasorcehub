import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Submit Resource',
};

export default function SubmitResourceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Information',
  description: 'Detailed information and documents.',
};

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

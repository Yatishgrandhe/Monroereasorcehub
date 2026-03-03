import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Map',
};

export default function ResourceMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

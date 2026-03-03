import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Information',
};

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

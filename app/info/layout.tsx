import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Info | Monroe Resource Hub',
  description: 'Project information, credits, and documentation for Monroe Resource Hub.',
};

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

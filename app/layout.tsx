import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
// import { InspectProtection } from '@/components/protection/InspectProtection';
// import { ObfuscatedScript } from '@/components/protection/ObfuscatedScript';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Monroe Resource Hub - Community Resources & Services',
  description: 'Connecting Monroe, North Carolina residents with vital community resources, services, and opportunities. Find food assistance, healthcare, education, housing, and more.',
  keywords: 'Monroe NC, community resources, food assistance, healthcare, education, housing, family support, senior services',
  authors: [{ name: 'Central Academy of Technology and Arts TSA Chapter' }],
  creator: 'Central Academy of Technology and Arts TSA Chapter',
  publisher: 'Monroe Resource Hub',
  icons: {
    icon: [
      { url: '/logo-icon.png', sizes: 'any' },
      { url: '/logo-icon.png', type: 'image/png' },
    ],
    apple: '/logo-icon.png',
    shortcut: '/logo-icon.png',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://monroeresourcehub.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Monroe Resource Hub - Community Resources & Services',
    description: 'Connecting Monroe, North Carolina residents with vital community resources, services, and opportunities.',
    url: 'https://monroeresourcehub.org',
    siteName: 'Monroe Resource Hub',
    images: [
      {
        url: '/logo-icon.png',
        width: 1200,
        height: 630,
        alt: 'Monroe Resource Hub - Community Resources',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monroe Resource Hub - Community Resources & Services',
    description: 'Connecting Monroe, North Carolina residents with vital community resources, services, and opportunities.',
    images: ['/logo-icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {/* Developer tools protection - DISABLED FOR NOW */}
        {/* <InspectProtection /> */}
        {/* <ObfuscatedScript /> */}
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
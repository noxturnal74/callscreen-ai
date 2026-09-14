import type { Metadata } from 'next';
import './globals.css';
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'CallScreen AI | AI Phone Screening untuk Rekrutmen Frontline',
    template: '%s | CallScreen AI',
  },
  description: SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  authors: [{ name: SITE_AUTHOR.name }],
  creator: SITE_AUTHOR.name,
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: SITE_NAME,
    title: 'CallScreen AI | AI Phone Screening untuk Rekrutmen Frontline',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: 'CallScreen AI | AI Phone Screening untuk Rekrutmen Frontline',
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#0f0f11] text-white min-h-screen font-sans antialiased selection:bg-brand selection:text-white">
        <noscript>
          <style>{`.reveal,.reveal-left,.reveal-right,.reveal-scale{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}

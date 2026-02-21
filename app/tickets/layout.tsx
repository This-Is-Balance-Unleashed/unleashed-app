import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Your Tickets | Hit Refresh 2026',
  description:
    'Choose your ticket type for Hit Refresh: Career + Wellness Summit 2026. From General Admission at ₦10,000 to VIP experiences at ₦18,000, find the perfect fit for your journey. Corporate and Virtual passes also available.',
  alternates: {
    canonical: '/tickets',
  },
  keywords: [
    'Hit Refresh tickets',
    'career summit tickets',
    'wellness conference tickets Lagos',
    'professional development event',
    'VIP conference tickets Nigeria',
    'corporate event tickets',
    'virtual conference pass',
  ],
  openGraph: {
    title: 'Get Your Tickets | Hit Refresh 2026',
    description:
      'Secure your spot at Nigeria\'s premier Career + Wellness Summit. General Admission, VIP, Corporate, and Virtual passes available.',
    type: 'website',
    url: '/tickets',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Your Tickets | Hit Refresh 2026',
    description:
      'Book your tickets for Hit Refresh 2026 - Career + Wellness Summit in Nigeria.',
  },
};

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

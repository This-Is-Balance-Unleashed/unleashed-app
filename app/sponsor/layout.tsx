import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sponsor a Ticket',
  description:
    'Sponsor a ticket for someone who cannot afford to attend Hit Refresh 2026. Make a difference by enabling access to career and wellness resources for professionals in need.',
  keywords: [
    'sponsor a ticket',
    'donate conference ticket',
    'Hit Refresh donation',
    'support career development',
    'wellness summit donation',
    'CSR Nigeria',
    'social impact donation',
  ],
  openGraph: {
    title: 'Sponsor a Ticket | Hit Refresh 2026',
    description:
      'Make a difference by sponsoring a ticket for someone who cannot afford to attend Hit Refresh 2026 Career + Wellness Summit.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sponsor a Ticket | Hit Refresh 2026',
    description:
      'Support career development by sponsoring a ticket for Hit Refresh 2026.',
  },
};

export default function SponsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

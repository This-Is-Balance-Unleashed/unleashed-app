import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partner With Us',
  description:
    'Partner with Hit Refresh 2026 - Nigeria\'s premier Career and Wellness Summit. Join us in empowering 1,000+ professionals through sponsorship packages starting from ₦1M. Platinum, Gold, Silver, and Bronze tiers available.',
  keywords: [
    'Hit Refresh partnership',
    'sponsor career summit',
    'Nigeria conference sponsorship',
    'wellness summit sponsor',
    'corporate partnership Lagos',
    'event sponsorship Nigeria',
    'Balance Unleashed partner',
  ],
  openGraph: {
    title: 'Partner With Hit Refresh 2026 | Career + Wellness Summit',
    description:
      'Become a partner at Nigeria\'s premier Career and Wellness Summit. Connect with 1,000+ mid-to-senior professionals and leaders.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Partner With Hit Refresh 2026',
    description:
      'Partner with Nigeria\'s premier Career and Wellness Summit. Sponsorship packages from ₦1M to ₦7.5M.',
  },
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

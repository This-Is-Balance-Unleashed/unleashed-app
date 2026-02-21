import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Speakers',
  description:
    "Meet the inspiring speakers at Hit Refresh Conference — Lagos' premier career and wellness summit on February 28, 2026. Industry leaders sharing insights on career growth, mental wellness, and work-life balance.",
  keywords: [
    'Hit Refresh speakers',
    'wellness conference speakers Lagos',
    'career summit speakers Nigeria',
    'professional development speakers 2026',
    'mental wellness speakers Lagos',
    'keynote speakers Nigeria event',
  ],
  alternates: {
    canonical: '/speakers',
  },
  openGraph: {
    title: 'Speakers | Hit Refresh Conference 2026',
    description:
      "Meet the inspiring speakers at Hit Refresh Conference — Lagos' premier career and wellness summit on February 28, 2026.",
    url: '/speakers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Speakers | Hit Refresh Conference 2026',
    description:
      "Meet the inspiring speakers at Hit Refresh Conference — Lagos' premier career and wellness summit on February 28, 2026.",
  },
};

export default function SpeakersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Speakers | Hit Refresh Conference 2026',
  description:
    "Meet the inspiring speakers at Hit Refresh Conference — Lagos' premier career and wellness summit on February 28, 2026.",
  openGraph: {
    title: 'Speakers | Hit Refresh Conference 2026',
    description:
      "Meet the inspiring speakers at Hit Refresh Conference — Lagos' premier career and wellness summit on February 28, 2026.",
    url: 'https://hit-refresh.balanceunleashed.org/speakers',
  },
};

export default function SpeakersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

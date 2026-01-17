import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Failed',
  description:
    'Your ticket purchase for Hit Refresh 2026 encountered an error. Please try again or contact support for assistance.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TicketErrorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

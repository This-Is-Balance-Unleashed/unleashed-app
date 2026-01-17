import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Cancelled',
  description:
    'Your ticket purchase for Hit Refresh 2026 was cancelled. No charges were made. You can try again anytime.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TicketCancelledLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

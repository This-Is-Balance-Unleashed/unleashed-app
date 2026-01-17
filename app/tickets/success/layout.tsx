import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Successful',
  description:
    'Your ticket purchase for Hit Refresh 2026 Career + Wellness Summit was successful. Check your email for your ticket confirmation and QR code.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TicketSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

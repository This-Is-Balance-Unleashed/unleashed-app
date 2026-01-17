import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Ticket',
  description:
    'View your ticket details and QR code for Hit Refresh: Career + Wellness Summit 2026.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TicketDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

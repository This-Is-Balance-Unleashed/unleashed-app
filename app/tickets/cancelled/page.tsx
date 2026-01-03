import Link from 'next/link';
import { Suspense } from 'react';
import CancelledContent from './CancelledContent';

export default function TicketCancelledPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    }>
      <CancelledContent />
    </Suspense>
  );
}

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TicketSuccessSkeleton } from '@/components/ui/skeleton';

interface TicketDetails {
  id: string;
  email: string;
  name: string;
  event_title: string;
  ticket_type_name: string;
  amount_paid: number;
  qr_code_url: string | null;
  payment_reference: string;
  created_at: string;
}

interface VerifyResponse {
  error?: Error | string | null;
  success: boolean;
  tickets_count: number;
  total_amount_paid: number;
  tickets: TicketDetails[];
  ticket: TicketDetails; // For backwards compatibility
}

function TicketSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  const [ticketsData, setTicketsData] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<VerifyResponse['error']>(null);

  useEffect(() => {
    if (!reference) {
      setError('No payment reference found');
      setLoading(false);
      return;
    }

    let retryCount = 0;
    const maxRetries = 5;

    // Verify payment and fetch ticket details
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/tickets/verify?reference=${reference}`);
        const data: VerifyResponse = await response.json();

        if (response.ok && data.success) {
          setTicketsData(data);
        } else if (response.status === 202 && retryCount < maxRetries) {
          // Tickets are still being generated, retry after delay
          retryCount++;
          setTimeout(verifyPayment, 2000); // Retry after 2 seconds
        } else {
          setError(data?.error || 'Failed to verify payment');
        }
      } catch {
        setError('Failed to verify payment. Please contact support.');
      } finally {
        if (retryCount === 0 || retryCount >= maxRetries) {
          setLoading(false);
        }
      }
    };

    verifyPayment();
  }, [reference]);

  if (loading) {
    return <TicketSuccessSkeleton />;
  }

  if (error || !ticketsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h1>
          <p className="text-gray-600 mb-6">{error as string}</p>
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Return to Homepage
            </Link>
            <p className="text-sm text-gray-500">
              Reference: {reference}
              <br />
              Contact support if you were charged.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-melo">
            Payment Successful! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            {ticketsData.tickets_count === 1 
              ? 'Your ticket has been confirmed'
              : `Your ${ticketsData.tickets_count} tickets have been confirmed`
            }
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-primary text-white px-6 py-4">
            <h2 className="text-xl font-bold">{ticketsData.tickets[0].event_title}</h2>
            <p className="text-sm opacity-90">{ticketsData.tickets[0].ticket_type_name}</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Number of Tickets</span>
              <span className="font-semibold text-gray-900 text-2xl">{ticketsData.tickets_count}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Email</span>
              <span className="font-semibold text-gray-900">{ticketsData.tickets[0].email}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Total Amount Paid</span>
              <span className="font-semibold text-gray-900">
                ₦{(ticketsData.total_amount_paid / 100).toLocaleString('en-NG', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Reference</span>
              <span className="font-mono text-sm text-gray-900">
                {ticketsData.tickets[0].payment_reference.split('-')[0]}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Purchase Date</span>
              <span className="font-semibold text-gray-900">
                {new Date(ticketsData.tickets[0].created_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Individual Tickets */}
        {ticketsData.tickets_count > 1 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Tickets</h3>
            <div className="grid gap-4">
              {ticketsData.tickets.map((ticket, index) => (
                <div key={ticket.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-900">Ticket #{index + 1}</span>
                    <Link
                      href={`/tickets/${ticket.id}`}
                      className="text-primary hover:underline text-sm font-medium"
                      onMouseEnter={() => router.prefetch(`/tickets/${ticket.id}`)}
                    >
                      View Details →
                    </Link>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference</span>
                      <span className="font-mono text-xs">{ticket.payment_reference}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <svg
              className="w-6 h-6 text-blue-600 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Check Your Email</p>
              <p>
                Your ticket{ticketsData.tickets_count > 1 ? 's' : ''} confirmation and QR code{ticketsData.tickets_count > 1 ? 's' : ''} have been sent to{' '}
                <span className="font-semibold">{ticketsData.tickets[0].email}</span>. Please check your
                inbox (and spam folder).
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {ticketsData.tickets_count === 1 ? (
            <Link
              href={`/tickets/${ticketsData.tickets[0].id}`}
              className="block w-full bg-primary text-white text-center py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
              onMouseEnter={() => router.prefetch(`/tickets/${ticketsData.tickets[0].id}`)}
            >
              View Ticket & QR Code
            </Link>
          ) : (
            <>
              <button
                onClick={() => {
                  // Open all tickets in new tabs immediately (must be synchronous to avoid popup blocking)
                  ticketsData.tickets.forEach((ticket) => {
                    window.open(`/tickets/${ticket.id}`, '_blank');
                  });
                }}
                onMouseEnter={() => {
                  // Prefetch all ticket pages on hover
                  ticketsData.tickets.forEach((ticket) => {
                    router.prefetch(`/tickets/${ticket.id}`);
                  });
                }}
                className="block w-full bg-primary text-white text-center py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                View All {ticketsData.tickets_count} Tickets
              </button>
              <div className="grid grid-cols-2 gap-3">
                {ticketsData.tickets.map((ticket, index) => (
                  <Link
                    key={ticket.id}
                    href={`/tickets/${ticket.id}`}
                    className="block w-full border-2 border-primary text-primary text-center py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                    onMouseEnter={() => router.prefetch(`/tickets/${ticket.id}`)}
                  >
                    View Ticket #{index + 1}
                  </Link>
                ))}
              </div>
            </>
          )}
          <Link
            href="/"
            className="block w-full border-2 border-gray-300 text-gray-700 text-center py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TicketSuccessPage() {
  return (
    <Suspense fallback={<TicketSuccessSkeleton />}>
      <TicketSuccessContent />
    </Suspense>
  );
}

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface TicketDetails {
  id: string;
  email: string;
  event_title: string;
  ticket_type_name: string;
  amount_paid: number;
  payment_reference: string;
  created_at: string;
}

function TicketSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) {
      setError('No payment reference found');
      setLoading(false);
      return;
    }

    // Verify payment and fetch ticket details
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/tickets/verify?reference=${reference}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setTicketDetails(data.ticket);
        } else {
          setError(data.error || 'Failed to verify payment');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('Failed to verify payment. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [reference]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error || !ticketDetails) {
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
          <p className="text-gray-600 mb-6">{error}</p>
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
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
          <p className="text-lg text-gray-600">Your ticket has been confirmed</p>
        </div>

        {/* Ticket Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-primary text-white px-6 py-4">
            <h2 className="text-xl font-bold">{ticketDetails.event_title}</h2>
            <p className="text-sm opacity-90">{ticketDetails.ticket_type_name}</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Email</span>
              <span className="font-semibold text-gray-900">{ticketDetails.email}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Amount Paid</span>
              <span className="font-semibold text-gray-900">
                ₦{(ticketDetails.amount_paid / 100).toLocaleString('en-NG', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Reference</span>
              <span className="font-mono text-sm text-gray-900">
                {ticketDetails.payment_reference}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Purchase Date</span>
              <span className="font-semibold text-gray-900">
                {new Date(ticketDetails.created_at).toLocaleDateString('en-GB', {
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

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <svg
              className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
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
                Your ticket confirmation and QR code have been sent to{' '}
                <span className="font-semibold">{ticketDetails.email}</span>. Please check your
                inbox (and spam folder).
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href={`/tickets/${ticketDetails.id}`}
            className="block w-full bg-primary text-white text-center py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            View Ticket & QR Code
          </Link>
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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <TicketSuccessContent />
    </Suspense>
  );
}

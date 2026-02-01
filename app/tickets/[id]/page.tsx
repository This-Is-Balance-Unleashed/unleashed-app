'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Image from 'next/image';
import { TicketDetailSkeleton } from '@/components/ui/skeleton';

interface TicketDetails {
  id: string;
  email: string;
  name: string | null;
  status: string;
  price_paid: number;
  paystack_reference: string;
  ticket_secret: string;
  qr_code_url: string | null;
  checked_in_at: string | null;
  created_at: string;
  event: {
    id: string;
    title: string;
    event_date: string;
    location: string;
  };
  ticket_type: {
    name: string;
    description: string;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // Fetch ticket details (use different endpoint for actual tickets)
  const { data, error, isLoading } = useSWR<TicketDetails>(`/api/tickets/detail/${id}`, fetcher);

  if (isLoading) {
    return <TicketDetailSkeleton />;
  }

  if (error || !data) {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ticket Not Found</h1>
          <p className="text-gray-600 mb-6">
            The ticket you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-gray-100 text-gray-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Extract base reference (remove ticket number suffix)
  const getBaseReference = (fullReference: string) => {
    // Format: test_1767969715419_gz0mzp-1 -> test_1767969715419_gz0mzp
    return fullReference.split('-')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/tickets/success?reference=${getBaseReference(data.paystack_reference)}`}
            className="text-primary hover:underline text-sm"
            onMouseEnter={() => router.prefetch(`/tickets/success?reference=${getBaseReference(data.paystack_reference)}`)}
          >
            ← Back to Purchase Summary
          </Link>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Header */}
          <div className="bg-linear-to-r from-primary to-green-600 text-white px-6 py-8">
            <h1 className="text-2xl font-bold mb-2 font-melo">{data.event.title}</h1>
            <div className="space-y-1 text-sm opacity-90">
              <p>📅 {formatDate(data.event.event_date)}</p>
              <p>📍 {data.event.location}</p>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-white p-8 border-b border-gray-200">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Ticket QR Code</h2>
              {data.qr_code_url ? (
                <div className="inline-block bg-white p-4 rounded-lg shadow-sm">
                  <img
                    src={data.qr_code_url}
                    alt="Ticket QR Code"
                    className="w-64 h-64 mx-auto"
                  />
                </div>
              ) : (
                <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-gray-600">QR code not available</p>
                </div>
              )}
              <p className="text-sm text-gray-600 mt-4">
                Present this QR code at the event entrance
              </p>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Ticket Type</span>
              <span className="font-semibold text-gray-900">{data.ticket_type.name}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Email</span>
              <span className="font-semibold text-gray-900">{data.email}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Amount Paid</span>
              <span className="font-semibold text-gray-900">
                ₦{(data.price_paid / 100).toLocaleString('en-NG', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Status</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  data.status
                )}`}
              >
                {data.status.toUpperCase()}
              </span>
            </div>

            {data.checked_in_at && (
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Checked In</span>
                <span className="font-semibold text-gray-900">
                  {formatDate(data.checked_in_at)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Reference</span>
              <span className="font-mono text-sm text-gray-900">{data.paystack_reference}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Purchase Date</span>
              <span className="font-semibold text-gray-900">{formatDate(data.created_at)}</span>
            </div>
          </div>

          {/* Download Button */}
          <div className="bg-gray-50 px-6 py-4">
            <button
              onClick={() => {
                if (data.qr_code_url) {
                  const link = document.createElement('a');
                  link.href = data.qr_code_url;
                  link.download = `ticket-${data.id}.png`;
                  link.click();
                }
              }}
              disabled={!data.qr_code_url}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download QR Code
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
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
              <p className="font-semibold mb-1">Important Information</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Save this page or download the QR code</li>
                <li>Bring your QR code (digital or printed) to the event</li>
                <li>One-time use only - do not share</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

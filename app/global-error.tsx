'use client';

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong!
            </h1>
            <p className="text-gray-600 mb-6">
              An unexpected error occurred. We apologize for the inconvenience.
            </p>

            {error.digest && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">
                  Error ID:{" "}
                  <span className="font-mono text-gray-900">{error.digest}</span>
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={reset}
                className="block w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="block w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Return to Homepage
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Need help?{" "}
                <a
                  href="mailto:events@balanceunleashed.org"
                  className="text-primary hover:underline"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

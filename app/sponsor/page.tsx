'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function SponsorPage() {
  // Redirect to Flutterwave donation page
  useEffect(() => {
    window.location.href = 'https://flutterwave.com/donate/98memyo7lgbf';
  }, []);


  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600 mb-2">Redirecting to donation page...</p>
        <p className="text-sm text-gray-500">
          If you&apos;re not redirected,{' '}
          <a 
            href="https://flutterwave.com/donate/98memyo7lgbf" 
            className="text-primary hover:underline"
          >
            click here
          </a>
        </p>
      </div>
    </div>
  );
}

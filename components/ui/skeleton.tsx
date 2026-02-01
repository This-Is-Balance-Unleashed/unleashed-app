import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  );
}

// Ticket Success Page Skeleton
export function TicketSuccessSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header Skeleton */}
        <div className="text-center mb-8">
          <Skeleton className="inline-block w-20 h-20 rounded-full mb-4" />
          <Skeleton className="h-9 w-80 mx-auto mb-2" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>

        {/* Summary Card Skeleton */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gray-300 px-6 py-4">
            <Skeleton className="h-7 w-64 mb-2 bg-gray-400" />
            <Skeleton className="h-4 w-32 bg-gray-400" />
          </div>

          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center pb-4 border-b border-gray-200 last:border-0">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </div>
        </div>

        {/* Info Box Skeleton */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Ticket Detail Page Skeleton
export function TicketDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-5 w-48" />
        </div>

        {/* Ticket Card Skeleton */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Header Skeleton */}
          <div className="bg-gray-300 px-6 py-8">
            <Skeleton className="h-8 w-64 mb-2 bg-gray-400" />
            <Skeleton className="h-4 w-48 mb-1 bg-gray-400" />
            <Skeleton className="h-4 w-56 bg-gray-400" />
          </div>

          {/* QR Code Section Skeleton */}
          <div className="bg-white p-8 border-b border-gray-200">
            <div className="text-center">
              <Skeleton className="h-6 w-48 mx-auto mb-4" />
              <Skeleton className="w-64 h-64 mx-auto rounded-lg" />
            </div>
          </div>

          {/* Ticket Details Skeleton */}
          <div className="p-6 space-y-4">
            <Skeleton className="h-7 w-40 mb-4" />
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex justify-between items-center pb-4 border-b border-gray-200 last:border-0">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </div>

          {/* Status Badge Skeleton */}
          <div className="px-6 pb-6">
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="border-t border-gray-200 p-6 space-y-3">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>

        {/* Info Box Skeleton */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Purchase Page Skeleton
export function PurchasePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form Skeleton */}
          <div>
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-32 rounded" />
              </div>
            </div>
          </div>

          {/* Right Column - Summary Skeleton */}
          <div>
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="space-y-4 mb-6">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
              <div className="space-y-3 py-4 border-y border-gray-200">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-12 w-full rounded-lg mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

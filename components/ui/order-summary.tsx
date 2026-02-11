'use client';

import { memo } from 'react';

interface OrderSummaryProps {
  eventTitle: string;
  eventDate: string;
  onAddCouponClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  total: number;
}

const formatPrice = (kobo: number) => {
  return `₦${(kobo / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const OrderSummary = memo(function OrderSummary({
  eventTitle,
  eventDate,
  onAddCouponClick,
  children,
  total,
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 h-fit sticky top-8">
      <h3 className="text-xl font-bold text-gray-900 mb-2 font-melo">{eventTitle}</h3>
      <p className="text-sm text-gray-600 mb-6">
        {formatDate(eventDate)} – 16:00 WAT
        <br />
        Physical & Online
      </p>

      <button
        type="button"
        className="text-primary text-sm hover:underline mb-6 flex items-center space-x-1"
        onClick={onAddCouponClick}
        title="Hold Shift + Alt and click for a surprise..."
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span>Add Coupon Code</span>
      </button>

      <div className="border-t border-gray-200 pt-4">
        {children}

        <div className="bg-gray-100 -mx-8 px-8 py-4 flex justify-between items-center mt-4">
          <p className="text-lg font-bold text-gray-900">Total</p>
          <p className="text-lg font-bold text-gray-900">{formatPrice(total)}</p>
        </div>
      </div>
    </div>
  );
});

interface OrderSummaryRowProps {
  label: React.ReactNode;
  value: string;
  className?: string;
  valueClassName?: string;
}

export const OrderSummaryRow = ({ label, value, className = 'mb-4', valueClassName = 'font-semibold text-gray-900' }: OrderSummaryRowProps) => (
  <div className={`flex justify-between items-center ${className}`}>
    <div className="text-gray-900">{label}</div>
    <div className={valueClassName}>{value}</div>
  </div>
);

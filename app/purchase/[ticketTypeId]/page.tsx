'use client';

import { useState, useEffect, use } from 'react';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import useSWR from 'swr';

// interface TicketType {
//   id: string;
//   name: string;
//   description: string;
//   price_in_kobo: number;
//   event_id: string;
// }

interface Event {
  id: string;
  title: string;
  event_date: string;
  location: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PurchasePage({ params }: { params: Promise<{ ticketTypeId: string }> }) {
  const { ticketTypeId } = use(params);
  // const router = useRouter();
  const [step, setStep] = useState<'details' | 'payment'>('details');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    careerCategory: '',
    quantity: 1,
    couponCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [couponDiscount, setCouponDiscount] = useState<{
    valid: boolean;
    discount_amount: number;
    new_price: number;
  } | null>(null);
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);

  // Fetch ticket type and event data using SWR
  const { data, error, isLoading } = useSWR<{
    id: string;
    name: string;
    description: string;
    price_in_kobo: number;
    event_id: string;
    event: Event;
  }>(`/api/tickets/${ticketTypeId}`, fetcher);

  const ticketType = data ? {
    id: data.id,
    name: data.name,
    description: data.description,
    price_in_kobo: data.price_in_kobo,
    event_id: data.event_id,
  } : null;

  const event = data?.event || null;

  const SERVICE_FEE_PERCENT = 2.5; // 2.5% service fee

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsExpired(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatPrice = (kobo: number) => {
    return `₦${(kobo / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculatePrices = () => {
    if (!ticketType) return { subtotal: 0, serviceFee: 0, total: 0 };

    const basePrice = couponDiscount ? couponDiscount.new_price : ticketType.price_in_kobo;
    const subtotal = basePrice * formData.quantity;
    const serviceFee = Math.round(subtotal * (SERVICE_FEE_PERCENT / 100));
    const total = subtotal + serviceFee;

    return { subtotal, serviceFee, total };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.careerCategory) {
      newErrors.careerCategory = 'Please select a career category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 'details') {
      if (validateForm()) {
        setStep('payment');
      }
    } else {
      // Payment step - call purchase API
      calculatePrices();

      try {
        const response = await fetch('/api/tickets/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            event_id: event?.id,
            ticket_type_id: ticketType?.id,
            quantity: formData.quantity,
            coupon_code: formData.couponCode || undefined,
          }),
        });

        const data = await response.json();

        if (response.ok && data.url) {
          // Redirect to Paystack
          window.location.href = data.url;
        } else {
          alert(data.error || 'Failed to initialize payment');
        }
      } catch (error) {
        alert('An error occurred. Please try again.');
      }
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim() || !ticketType) return;

    try {
      const response = await fetch('/api/coupons/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponInput,
          ticket_type_id: ticketType.id,
          event_id: event?.id,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setCouponDiscount(data);
        setFormData((prev) => ({ ...prev, couponCode: couponInput }));
        setIsCouponDialogOpen(false);
        setCouponInput('');
      } else {
        alert(data.error || 'Invalid coupon code');
        setCouponDiscount(null);
      }
    } catch (error) {
      alert('Failed to apply coupon');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error loading ticket</h1>
          <p className="text-gray-600 mb-4">{error.message || 'Failed to load ticket details'}</p>
          <Link href="/" className="text-primary hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticketType || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ticket not found</h1>
          <Link href="/" className="text-primary hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-sm">
          <div className="mb-6">
            <svg
              className="w-16 h-16 text-red-500 mx-auto"
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
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Expired</h1>
          <p className="text-gray-600 mb-6">
            Your ticket reservation has expired. Please start a new purchase to secure your tickets.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Return to Event Page
          </Link>
        </div>
      </div>
    );
  }

  const { subtotal, serviceFee, total } = calculatePrices();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Details */}
              {step === 'details' && (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-green-600 font-melo">
                      1. Add your details
                    </h1>
                    <p className={`font-medium ${
                      timeRemaining < 300 ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      Time remaining: {formatTimeRemaining()}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          *First name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          *Last name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        *Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        *Which of these career category best describes you?
                      </label>
                      <div className="space-y-3">
                        {[
                          'Entrepreneur',
                          'Unemployed',
                          'Freelancer',
                          'Career professional',
                          'Creative',
                          'Prefer not to disclose',
                        ].map((category) => (
                          <label key={category} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="careerCategory"
                              value={category}
                              checked={formData.careerCategory === category}
                              onChange={handleInputChange}
                              className="w-5 h-5 text-primary focus:ring-primary"
                            />
                            <span className="text-gray-700">{category}</span>
                          </label>
                        ))}
                      </div>
                      {errors.careerCategory && (
                        <p className="text-red-500 text-sm mt-2">{errors.careerCategory}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        *Quantity
                      </label>
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={(e) => {
                            const value = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
                            setFormData(prev => ({ ...prev, quantity: value }));
                          }}
                          min="1"
                          max="10"
                          className="w-20 text-center px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, quantity: Math.min(10, prev.quantity + 1) }))}
                          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <span className="text-sm text-gray-600">Max 10 tickets</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
                    >
                      Get Your Ticket
                    </button>
                  </div>
                </>
              )}

              {/* Step 2: Payment */}
              {step === 'payment' && (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <h2 className="text-3xl font-bold text-green-600 font-melo">
                        Add your details
                      </h2>
                      <button
                        type="button"
                        onClick={() => setStep('details')}
                        className="text-sm text-primary hover:underline ml-4"
                      >
                        Edit
                      </button>
                    </div>
                    <p className={`font-medium ${
                      timeRemaining < 300 ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      Time remaining: {formatTimeRemaining()}
                    </p>
                  </div>

                  <div className="mb-8">
                    <p className="font-semibold text-gray-900">
                      {formData.firstName} {formData.lastName}
                    </p>
                    <p className="text-gray-600">{formData.email}</p>
                  </div>

                  <hr className="my-8" />

                  <h2 className="text-3xl font-bold text-green-600 font-melo mb-6">2. Payment</h2>

                  <div className="border border-gray-300 rounded-lg p-6 mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path
                            fillRule="evenodd"
                            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="font-semibold text-lg">Paystack</span>
                    </div>

                    <div className="mt-4 bg-gray-50 p-4 rounded flex items-start space-x-3">
                      <svg
                        className="w-6 h-6 text-gray-600 shrink-0 mt-0.5"
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
                      <p className="text-sm text-gray-700">
                        After placing the order, you&apos;ll be{' '}
                        <span className="font-semibold">redirected to Paystack</span> to complete
                        payment.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
                  >
                    Place Order
                  </button>
                </>
              )}
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="bg-white rounded-lg shadow-sm p-8 h-fit sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-melo">{event.title}</h3>
            <p className="text-sm text-gray-600 mb-6">
              {formatDate(event.event_date)} – 16:00 WAT
              <br />
              Physical & Online
            </p>

            <button
              type="button"
              className="text-primary text-sm hover:underline mb-6 flex items-center space-x-1"
              onClick={() => setIsCouponDialogOpen(true)}
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
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold text-gray-900">{ticketType.name}</p>
                  <p className="text-sm text-gray-600">Qty: {formData.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatPrice(ticketType.price_in_kobo)}
                </p>
              </div>

              {couponDiscount && (
                <div className="flex justify-between items-center mb-4 text-green-600">
                  <p className="text-sm">Coupon Discount</p>
                  <p className="text-sm font-semibold">
                    -{formatPrice(couponDiscount.discount_amount)}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-700">Subtotal</p>
                <p className="font-semibold text-gray-900">{formatPrice(subtotal)}</p>
              </div>

              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-700">Service fee</p>
                <p className="text-gray-900">{formatPrice(serviceFee)}</p>
              </div>

              <div className="bg-gray-100 -mx-8 px-8 py-4 flex justify-between items-center">
                <p className="text-lg font-bold text-gray-900">Total</p>
                <p className="text-lg font-bold text-gray-900">{formatPrice(total)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Dialog */}
      <Dialog open={isCouponDialogOpen} onClose={() => setIsCouponDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-md w-full bg-white rounded-lg shadow-xl p-6">
            <DialogTitle className="text-xl font-bold text-gray-900 mb-4">
              Enter Coupon Code
            </DialogTitle>
            <div className="space-y-4">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="ENTER CODE"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent uppercase"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApplyCoupon();
                  }
                }}
              />
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCouponDialogOpen(false);
                    setCouponInput('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded hover:opacity-90 transition-opacity"
                >
                  Apply
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

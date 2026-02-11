/** eslint-disable react/no-children-prop */
'use client';

import { useActionState } from 'react';
import {
  initialFormState,
  mergeForm,
  useForm,
  useTransform,
} from '@tanstack/react-form-nextjs';
import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useEasterEggs } from '@/hooks/useEasterEggs';
import { OrderSummary } from '@/components/ui/order-summary';
import { CorporateFields } from './corporate-fields';
import { GroupFields } from './group-fields';
import { MemberFieldsArray } from './member-fields-array';
import { createGroupBookingAction } from './group-booking-action';
import { groupFormOptions } from './group-form-options';

// Dynamically import Easter egg components
const FlyingBird = dynamic(
  () => import('@/components/ui/easter-eggs/flying-bird').then(m => m.FlyingBird),
  { ssr: false }
);
const SecretHoverZone = dynamic(
  () => import('@/components/ui/easter-eggs/secret-hover-zone').then(m => m.SecretHoverZone),
  { ssr: false }
);
const EasterEggToast = dynamic(
  () => import('@/components/ui/easter-eggs/easter-egg-toast').then(m => m.EasterEggToast),
  { ssr: false }
);

// Easter egg coupon configuration
const EASTER_EGG_COUPON_CODE = 'EARLYBIRD';

interface GroupCheckoutFormProps {
  ticketTypeId: string;
  ticketTypeName: string;
  basePrice: number; // in kobo
  membersPerTicket: number; // 4, 6, or 8 members per ticket
  bookingType: 'corporate' | 'group';
  event?: {
    id: string;
    title: string;
    event_date: string;
    location: string;
  };
}

export type GroupFormData = typeof groupFormOptions.defaultValues;

export function GroupCheckoutForm({
  ticketTypeId,
  ticketTypeName,
  basePrice,
  membersPerTicket,
  bookingType,
  event,
}: GroupCheckoutFormProps) {
  const [quantity, setQuantity] = useState(1); // Start at 1 ticket/package
  const [state, action, isPending] = useActionState(createGroupBookingAction, initialFormState);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const isExpired = timeRemaining <= 0;
  const [easterEggFound, setEasterEggFound] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<{
    valid: boolean;
    discount_amount: number;
    new_price: number;
  } | null>(null);

  const SERVICE_FEE_PERCENT = 2.5;

  const form = useForm({
    ...groupFormOptions,
    transform: useTransform((baseForm) => mergeForm(baseForm, state!), [state]),
  });

  // Handle redirect to payment URL
  useEffect(() => {
    if (state && 'success' in state && state.success && 'paymentUrl' in state) {
      if (typeof window !== 'undefined') {
        window.location.href = state.paymentUrl as string;
      }
    }
  }, [state]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Easter egg handler
  const handleEasterEggFound = useCallback(async () => {
    if (easterEggFound) return;

    setEasterEggFound(true);
    setToastMessage('Special discount applied!');
    setShowToast(true);

    // Auto-apply a coupon or special discount if applicable
    try {
      console.log('🎉 Easter egg found! Attempting to apply coupon:', EASTER_EGG_COUPON_CODE);
      console.log('Ticket type ID:', ticketTypeId);
      console.log('Event ID:', event?.id);

      const response = await fetch('/api/coupons/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: EASTER_EGG_COUPON_CODE,
          ticket_type_id: ticketTypeId,
          event_id: event?.id,
        }),
      });

      const data = await response.json();
      console.log('Coupon check response:', data);

      if (data.valid) {
        console.log('✅ Coupon valid! Applying discount...');
        setCouponDiscount(data);
        setAppliedCouponCode(EASTER_EGG_COUPON_CODE);
      } else {
        console.log('❌ Coupon not valid:', data.error);
        setToastMessage(data.error || 'Coupon not available');
      }
    } catch (error) {
      console.error('Failed to apply easter egg coupon:', error);
      setToastMessage('Failed to apply discount');
    }
  }, [easterEggFound, ticketTypeId, event]);

  // Initialize easter eggs
  const {
    showBird,
    birdPosition,
    isEarlyBirdTime,
    handleSecretZoneEnter,
    handleSecretZoneLeave,
    handleShiftAltClick,
  } = useEasterEggs({ onEasterEggFound: handleEasterEggFound });

  const handleBirdClick = useCallback(() => {
    handleEasterEggFound();
  }, [handleEasterEggFound]);

  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatPrice = (kobo: number) => {
    return `₦${(kobo / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
  };

  const currentPriceData = useMemo(() => {
    // Service fee is calculated on ORIGINAL price (before any discounts)
    const originalSubtotal = basePrice * quantity;
    const serviceFee = Math.round(originalSubtotal * (SERVICE_FEE_PERCENT / 100));

    // Apply coupon discount to base price only
    const pricePerTicket = couponDiscount ? couponDiscount.new_price : basePrice;
    const subtotalAfterCoupon = pricePerTicket * quantity;
    const couponDiscountAmount = originalSubtotal - subtotalAfterCoupon;

    // Apply volume discount (10% for 2+ corporate packages)
    const shouldApplyVolumeDiscount = bookingType === 'corporate' && quantity >= 2;
    const volumeDiscountPercentage = shouldApplyVolumeDiscount ? 0.1 : 0;
    const volumeDiscount = Math.floor(subtotalAfterCoupon * volumeDiscountPercentage);
    const subtotalAfterDiscount = subtotalAfterCoupon - volumeDiscount;

    // Total = discounted price + service fee (on original)
    const total = subtotalAfterDiscount + serviceFee;

    return { originalSubtotal, subtotal: subtotalAfterCoupon, volumeDiscount, subtotalAfterDiscount, serviceFee, total, couponDiscountAmount };
  }, [bookingType, quantity, couponDiscount, basePrice]);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;

    try {
      const response = await fetch('/api/coupons/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponInput,
          ticket_type_id: ticketTypeId,
          event_id: event?.id,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setCouponDiscount(data);
        setAppliedCouponCode(couponInput);
        setIsCouponDialogOpen(false);
        setCouponInput('');
      } else {
        alert(data.error || 'Invalid coupon code');
        setCouponDiscount(null);
        setAppliedCouponCode('');
      }
    } catch {
      console.log('Failed to apply coupon');
    }
  };

  const totalMembers = membersPerTicket * quantity; // Total members across all tickets
  const memberCount = totalMembers - 1; // Subtract primary contact
  const { volumeDiscount, subtotalAfterDiscount, serviceFee, total } = currentPriceData;

  const handleCouponClick = useCallback((e: React.MouseEvent) => {
    handleShiftAltClick(e);
    if (!e.defaultPrevented) {
      setIsCouponDialogOpen(true);
    }
  }, [handleShiftAltClick]);

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
            Your booking session has expired. Please start a new purchase to secure your tickets.
          </p>
          <a
            href="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Return to Event Page
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl text-green-600 font-melo font-semibold">
                {bookingType === 'corporate' ? 'Corporate' : 'Group'} Booking
              </h1>
              <p className={`font-medium ${
                timeRemaining < 300 ? 'text-red-500' : 'text-gray-500'
              }`}>
                Time remaining: {formatTimeRemaining()}
              </p>
            </div>

            <form action={action as never}>
              {/* Hidden fields for additional data */}
              <input type="hidden" name="ticketTypeId" value={ticketTypeId} />
              <input type="hidden" name="bookingType" value={bookingType} />
              <input type="hidden" name="quantity" value={quantity} />
              <input type="hidden" name="totalMembers" value={totalMembers} />
              {appliedCouponCode && (
                <input type="hidden" name="couponCode" value={appliedCouponCode} />
              )}
              {/* Serialize selectedPerks array for form submission */}
              <form.Subscribe selector={(state) => state.values.selectedPerks}>
                {(selectedPerks) => (
                  <input
                    type="hidden"
                    name="selectedPerksArray"
                    value={JSON.stringify(selectedPerks || [])}
                  />
                )}
              </form.Subscribe>
              {/* Serialize members array for form submission (inputs have no name attr) */}
              <form.Subscribe selector={(state) => ({ members: state.values.members, provide: state.values.provideMemberDetails })}>
                {({ members, provide }) => (
                  <>
                    <input type="hidden" name="membersArray" value={JSON.stringify(members || [])} />
                    <input type="hidden" name="provideMemberDetailsValue" value={provide ? 'true' : 'false'} />
                  </>
                )}
              </form.Subscribe>

              {/* Quantity Selector */}
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Number of {bookingType === 'corporate' ? 'Team Packages' : 'Group Packages'}
                  <span className="block text-xs font-normal text-gray-500 mt-1">
                    ({membersPerTicket} members per package)
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-lg bg-white border-2 border-gray-300 hover:border-primary transition-colors flex items-center justify-center text-xl font-bold"
                  >
                    −
                  </button>
                  <div className="text-center">
                    <span className="text-3xl font-bold block">{quantity}</span>
                    <span className="text-xs text-gray-600">= {totalMembers} total members</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-lg bg-white border-2 border-gray-300 hover:border-primary transition-colors flex items-center justify-center text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Contact */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Primary Contact</h3>
                <div className="space-y-4">
                  <form.Field name="primaryContactName">
                    {(field) => (
                      <div>
                        <label htmlFor="primaryContactName" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          id="primaryContactName"
                          type="text"
                          name="primaryContactName"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="primaryContactEmail">
                    {(field) => (
                      <div>
                        <label htmlFor="primaryContactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          id="primaryContactEmail"
                          type="email"
                          name="primaryContactEmail"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="john@company.com"
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="primaryContactPhone">
                    {(field) => (
                      <div>
                        <label htmlFor="primaryContactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          id="primaryContactPhone"
                          type="tel"
                          name="primaryContactPhone"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="+234 800 000 0000"
                        />
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>

              {/* Corporate or Group Specific Fields */}
              {bookingType === 'corporate' ? (
                <CorporateFields form={form} />
              ) : (
                <GroupFields form={form} />
              )}

              {/* Optional Member Details */}
              <MemberFieldsArray form={form} memberCount={memberCount} />

              {/* Error Display */}
              {state && 'error' in state && state.error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {state.error as string}
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-8">
                <form.Subscribe
                  selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
                >
                  {([canSubmit, isSubmitting]) => (
                    <button
                      type="submit"
                      disabled={!canSubmit || isSubmitting || isPending}
                      className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {(isSubmitting || isPending) ? 'Processing...' : `Proceed to Payment (${formatPrice(total)})`}
                    </button>
                  )}
                </form.Subscribe>
              </div>
            </form>
          </div>

          {/* Summary Sidebar */}
          <OrderSummary
            eventTitle={event?.title || 'Balance Unleashed 2025'}
            eventDate={event?.event_date || ''}
            onAddCouponClick={handleCouponClick}
            total={total}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold text-gray-900">{ticketTypeName}</p>
                <p className="text-sm text-gray-600">
                  {quantity} package{quantity !== 1 ? 's' : ''} × {membersPerTicket} members
                </p>
                <p className="text-xs text-gray-500">Total: {totalMembers} members</p>
              </div>
              <p className="font-semibold text-gray-900">
                {formatPrice(basePrice)}
              </p>
            </div>

            {couponDiscount && (
              <div className="flex justify-between items-center mb-4 text-green-600">
                <p className="text-sm">Coupon Discount</p>
                <p className="text-sm font-semibold">
                  -{formatPrice(couponDiscount.discount_amount * quantity)}
                </p>
              </div>
            )}

            {volumeDiscount > 0 && (
              <div className="flex justify-between items-center mb-4 text-green-600">
                <p className="text-sm">Volume Discount (10%)</p>
                <p className="text-sm font-semibold">
                  -{formatPrice(volumeDiscount)}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-700">Subtotal</p>
              <p className="font-semibold text-gray-900">{formatPrice(subtotalAfterDiscount)}</p>
            </div>

            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-700">Service fee</p>
              <p className="text-gray-900">{formatPrice(serviceFee)}</p>
            </div>
          </OrderSummary>
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

      {/* Easter Eggs */}
      <FlyingBird
        visible={showBird}
        position={birdPosition}
        onClick={handleBirdClick}
      />

      <SecretHoverZone
        onHoverEnter={handleSecretZoneEnter}
        onHoverLeave={handleSecretZoneLeave}
      />

      <EasterEggToast
        show={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />

      {/* Early bird time indicator */}
      {isEarlyBirdTime && !easterEggFound && (
        <div className="fixed bottom-4 left-4 bg-orange-100 border border-orange-300 text-orange-800 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-40 animate-pulse">
          <span className="text-xl">🌅</span>
          <span className="text-sm font-medium">Early bird hours active!</span>
        </div>
      )}
    </div>
  );
}

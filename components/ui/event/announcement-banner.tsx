'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Transition } from '@headlessui/react';

interface AnnouncementBannerProps {
  message: string;
  ctaText?: string;
  ctaLink?: string;
  dismissible?: boolean;
  storageKey?: string;
  variant?: 'urgent' | 'info' | 'success';
}

export function AnnouncementBanner({
  message,
  ctaText,
  ctaLink,
  dismissible = true,
  storageKey = 'announcement-banner-dismissed',
  variant = 'urgent',
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let timerId: NodeJS.Timeout
    // Check if banner was previously dismissed
    const isDismissed = localStorage.getItem(storageKey);
    if (!isDismissed) {
      timerId = setTimeout(() => {
        setIsVisible(true);
        setIsLoaded(true);
      }, 0)
    }
    
    return () => {
      clearTimeout(timerId)
    }
  }, [storageKey]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (dismissible) {
      localStorage.setItem(storageKey, 'true');
    }
  };

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'urgent':
        return {
          gradient: 'from-orange-500 via-orange-600 to-red-600',
          icon: '🚨',
        };
      case 'info':
        return {
          gradient: 'from-primary via-secondary to-primary',
          icon: '📢',
        };
      case 'success':
        return {
          gradient: 'from-secondary via-green-600 to-secondary',
          icon: '✨',
        };
      default:
        return {
          gradient: 'from-primary to-secondary',
          icon: '📢',
        };
    }
  };

  const styles = getVariantStyles();

  if (!isLoaded) {
    return null; // Prevent flash of content
  }

  return (
    <Transition
      show={isVisible}
      enter="transform transition duration-300"
      enterFrom="-translate-y-full opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transform transition duration-200"
      leaveFrom="translate-y-0 opacity-100"
      leaveTo="-translate-y-full opacity-0"
    >
      <div className={`relative bg-linear-to-r ${styles.gradient} text-white overflow-hidden`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%,transparent_100%)] bg-size-[20px_20px] animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 gap-4">
            {/* Icon and Message */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-2xl shrink-0 animate-pulse">{styles.icon}</span>
              <p className="text-sm sm:text-base font-medium truncate sm:whitespace-normal">
                {message}
              </p>
            </div>

            {/* CTA Button */}
            {ctaText && ctaLink && (
              <Link
                href={ctaLink as Route}
                className="shrink-0 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
              >
                {ctaText}
              </Link>
            )}

            {/* Dismiss Button */}
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="shrink-0 text-white hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white/10"
                aria-label="Dismiss announcement"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Bottom glow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent" />
      </div>
    </Transition>
  );
}

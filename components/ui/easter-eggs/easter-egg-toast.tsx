'use client';

import { Fragment, useEffect } from 'react';
import { Transition } from '@headlessui/react';

interface EasterEggToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export function EasterEggToast({ show, message, onClose }: EasterEggToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div className="fixed top-4 right-4 z-100 pointer-events-none">
      <Transition
        show={show}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-x-full opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="transform ease-in duration-200 transition"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="translate-x-full opacity-0"
      >
        <div className="pointer-events-auto bg-linear-to-r from-orange-500 to-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-4 max-w-md relative overflow-hidden">
          {/* Bird emoji with animation */}
          <div className="text-3xl animate-bounce relative z-10">🐦</div>

          {/* Message */}
          <div className="flex-1 relative z-10">
            <p className="font-bold text-lg">Early Bird Found!</p>
            <p className="text-sm opacity-90">{message}</p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors relative z-10"
            aria-label="Close notification"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Animated feathers background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute text-xl opacity-40"
                style={{
                  left: `${20 + i * 15}%`,
                  top: '-20px',
                  animation: `fall ${2 + i * 0.5}s ease-in infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                🪶
              </div>
            ))}
          </div>
        </div>
      </Transition>
    </div>
  );
}

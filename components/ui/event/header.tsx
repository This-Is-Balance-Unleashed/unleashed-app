'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Button } from './button';

const navigation = [
  // { name: 'Home', href: '/' },
  { name: 'Tickets', href: '/tickets' },
  { name: 'Partner', href: '/partner' },
  // { name: 'Sponsor', href: '/sponsor' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-10 container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <nav className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo2.svg"
              alt="Career + Wellness Summit"
              width={160}
              height={48}
              className="w-32 sm:w-40 md:w-48 lg:w-50 h-auto"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              // @ts-expect-error unknown type
              href={item.href}
              className="text-sm lg:text-base font-medium text-gray-800 hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <Button variant="primary" size="md">
            <Link
              href="/sponsor"
              className="block text-sm lg:text-base font-medium font-sans"
            >
              Sponsor A Ticket
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-primary hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open main menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dialog */}
      <Transition show={mobileMenuOpen}>
        <Dialog onClose={setMobileMenuOpen} className="relative z-50 md:hidden">
          {/* Backdrop */}
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </TransitionChild>

          {/* Slide-in Panel */}
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <Image
                      src="/logo2.svg"
                      alt="Career + Wellness Summit"
                      width={140}
                      height={42}
                      className="h-10 w-auto"
                    />
                  </Link>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      // @ts-expect-error unknown
                      href={item.href}
                      className="block px-4 py-3 text-base font-medium text-gray-800 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="px-4 py-6 border-t border-gray-100">
                  <Link
                    href="/sponsor"
                    className="block w-full text-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sponsor A Ticket
                  </Link>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </header>
  );
}

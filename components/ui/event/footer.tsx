import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-primary-light" style={{
        background: 'linear-gradient(to bottom, var(--color-primary-light), #f5f1ed)',
      }}>
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'url(/noise.svg)',
          backgroundSize: 'cover',
        }}
      />

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 items-start">
            {/* Left Column - Logo & Social */}
            <div className="space-y-6 text-center sm:text-left">
              <Image
                src="/logo2.svg"
                alt="Career + Wellness Summit"
                width={180}
                height={60}
                className="mb-6 sm:mb-8 mx-auto sm:mx-0 w-40 sm:w-48 lg:w-[220px] h-auto"
              />

              {/* Social Media Icons */}
              <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
                <Link
                  href="https://facebook.com/balanceunleashed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary-hover transition-colors"
                >
                  <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </Link>
                <Link
                  href="https://instagram.com/balanceunleashed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary-hover transition-colors"
                >
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </Link>
                <Link
                  href="https://twitter.com/balanceunleashd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary-hover transition-colors"
                >
                  <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </Link>
                <Link
                  href="https://linkedin.com/company/balanceunleashed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary-hover transition-colors"
                >
                  <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </Link>
              </div>
            </div>

            {/* Center Column - Details */}
            <div className="space-y-4 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold font-melo mb-4">Hit Refresh Details</h3>
              <p className="text-sm sm:text-base font-sans">February 28th, 2026.</p>
              <div className="space-y-2">
                <p className="text-sm sm:text-base font-sans">Have any questions, reach out to us at</p>
                <Link
                  href="mailto:events@balanceunleashed.org"
                  className="text-sm sm:text-base font-medium font-sans hover:text-primary transition-colors break-all"
                >
                  events@balanceunleashed.org
                </Link>
              </div>
            </div>

            {/* Right Column - CTA Links */}
            <div className="space-y-4 text-center sm:text-left sm:col-span-2 lg:col-span-1">
              <h3 className="text-xl sm:text-2xl font-bold font-melo mb-4">
                Can&apos;t Attend? You can still be part of this experience
              </h3>
              <div className="space-y-3 flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-4 lg:gap-3 items-center sm:items-start">
                <Link
                  href="/partner"
                  className="text-sm sm:text-base font-medium font-sans underline hover:text-primary transition-colors"
                >
                  Be a Partner
                </Link>
                <Link
                  href="/sponsor"
                  className="text-sm sm:text-base font-medium font-sans underline hover:text-primary transition-colors"
                >
                  Sponsor a Ticket
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Orange */}
        <div className="bg-primary py-3 sm:py-4">
          <div className="container mx-auto px-4 sm:px-6">
            <p className="text-center text-white text-xs sm:text-sm md:text-base font-sans">
              All right reserved. Balance Unleashed © 2026
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

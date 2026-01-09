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
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-12 items-start">
            {/* Left Column - Logo & Social */}
            <div className="space-y-6">
              <Image
                src="/logo2.svg"
                alt="Career + Wellness Summit"
                width={220}
                height={80}
                className="mb-8"
              />

              {/* Social Media Icons */}
              <div className="flex gap-4">
                <Link
                  href="https://facebook.com/balanceunleashed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary-hover transition-colors"
                >
                  <Facebook className="w-6 h-6 text-white" />
                </Link>
                <Link
                  href="https://instagram.com/balanceunleashed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary-hover transition-colors"
                >
                  <Instagram className="w-6 h-6 text-white" />
                </Link>
                <Link
                  href="https://twitter.com/balanceunleashd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary-hover transition-colors"
                >
                  <Twitter className="w-6 h-6 text-white" />
                </Link>
                <Link
                  href="https://linkedin.com/company/balanceunleashed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary-hover transition-colors"
                >
                  <Linkedin className="w-6 h-6 text-white" />
                </Link>
              </div>
            </div>

            {/* Center Column - Details */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold font-melo mb-4">Hit Refresh Details</h3>
              <p className="text-base font-sans">February 28th, 2026.</p>
              <div className="space-y-2">
                <p className="text-base font-sans">Have any questions, reach out to us at</p>
                <Link
                  href="mailto:events@balanceunleashed.org"
                  className="text-base font-medium font-sans hover:text-primary transition-colors"
                >
                  events@balanceunleashed.org
                </Link>
              </div>
            </div>

            {/* Right Column - CTA Links */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold font-melo mb-4">
                Can&apos;t Attend? You can still be part of this experience
              </h3>
              <div className="space-y-3">
                <Link
                  href="/partner"
                  className="block text-base font-medium font-sans underline hover:text-primary transition-colors"
                >
                  Be a Partner
                </Link>
                <Link
                  href="/sponsor"
                  className="block text-base font-medium font-sans underline hover:text-primary transition-colors"
                >
                  Sponsor a Ticket
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Orange */}
        <div className="bg-primary py-4">
          <div className="container mx-auto px-6">
            <p className="text-center text-white text-sm md:text-base font-sans">
              All right reserved. Balance Unleashed © 2026
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

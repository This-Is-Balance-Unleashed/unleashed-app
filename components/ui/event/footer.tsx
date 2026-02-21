import Image from 'next/image';
import Link from 'next/link';

// Custom SVG icons to avoid lucide-react bundle overhead
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// Style constants to prevent object recreation on each render
const footerGradientStyle = {
  background: 'linear-gradient(to bottom, var(--color-primary-light), #f5f1ed)',
} as const;

const noiseTextureStyle = {
  backgroundImage: 'url(/noise.svg)',
  backgroundSize: 'cover',
} as const;

export function Footer() {
  return (
    <footer className="relative bg-primary-light" style={footerGradientStyle}>
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={noiseTextureStyle}
      />

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 items-start">
            {/* Left Column - Logo & Social */}
            <div className="space-y-6 text-center sm:text-left">
              <div>
                <Image
                  src="/logo2.svg"
                  alt="Hit Refresh Conference - Lagos Wellness Event"
                  width={180}
                  height={60}
                  className="mb-3 mx-auto sm:mx-0 w-40 sm:w-48 lg:w-55 h-auto"
                />
                <p className="text-sm font-sans text-gray-700 max-w-xs mx-auto sm:mx-0">
                  premier career and wellness conference. Join us for a transformative experience.
                </p>
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
                <Link
                  href="https://facebook.com/balanceunleashed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary-hover transition-colors"
                >
                  <FacebookIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </Link>
                <Link
                  href="https://instagram.com/balanceunleashed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary-hover transition-colors"
                >
                  <InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </Link>
                <Link
                  href="https://twitter.com/balanceunleashd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary-hover transition-colors"
                >
                  <TwitterIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </Link>
                <Link
                  href="https://linkedin.com/company/balanceunleashed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary-hover transition-colors"
                >
                  <LinkedinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </Link>
              </div>
            </div>

            {/* Center Column - Details */}
            <div className="space-y-4 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold font-melo mb-4">Event Details</h3>
              <div className="space-y-2">
                <p className="text-sm sm:text-base font-sans"><strong>Date:</strong> February 28th, 2026</p>
                <p className="text-sm sm:text-base font-sans"><strong>Venue:</strong> Waterfalls Event Center, Oregun, Ikeja, Lagos</p>
              </div>
              <div className="space-y-2 mt-4">
                <p className="text-sm sm:text-base font-sans">Have any questions?</p>
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
              All right reserved. Balance Unleashed © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

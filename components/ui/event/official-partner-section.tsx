'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const noiseTextureStyle = {
  backgroundImage: 'url(/noise.svg)',
  backgroundSize: 'cover',
} as const;

export function OfficialPartnerSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative overflow-hidden bg-secondary"
    >
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={noiseTextureStyle} />

      <div
        className={`relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 scroll-fade-in ${isVisible ? 'visible' : ''}`}
      >
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: copy */}
          <div className="space-y-5 text-white">
            {/* Badge */}
            <span className="inline-block bg-white/20 text-white text-xs font-sans font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest">
              Official Wellness Partner
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-melo font-semibold leading-tight">
              Proud to partner with MyTherapist.ng
            </h2>

            <p className="text-base sm:text-lg font-sans text-white/85 max-w-md leading-relaxed">
              Nigeria&apos;s leading mental health platform — making therapy accessible,
              affordable, and stigma-free for every professional.
            </p>

            <Link
              href="https://mytherapist.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-secondary font-sans font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors shadow-md"
            >
              Visit MyTherapist.ng
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="sr-only"> (opens in new tab)</span>
            </Link>
          </div>

          {/* Right: logo */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl px-10 py-8 shadow-xl flex items-center justify-center w-full max-w-sm">
              <Image
                src="/Mytherapist.ngLogos/Mytherapist.ng_logo_dark.png"
                alt="MyTherapist.ng — Official Wellness Partner"
                width={320}
                height={120}
                className="h-20 sm:h-24 w-auto object-contain"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

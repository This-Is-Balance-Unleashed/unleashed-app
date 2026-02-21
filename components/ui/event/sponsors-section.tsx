'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Style constants — outside component to prevent recreation per render
const sectionGradientStyle = {
  background: 'linear-gradient(to bottom, #f5f1ed, var(--color-primary-light))',
} as const;

const noiseTextureStyle = {
  backgroundImage: 'url(/noise.svg)',
  backgroundSize: 'cover',
} as const;

const sponsors = [
  {
    name: 'MyTherapist.ng',
    badge: 'Official Wellness Partner',
    logo: '/Mytherapist.ngLogos/Mytherapist.ng_logo_dark.png',
    href: 'https://mytherapist.ng',
    logoWidth: 280,
    logoHeight: 100,
  },
] as const;

export function SponsorsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-12 sm:py-16"
      style={sectionGradientStyle}
    >
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={noiseTextureStyle} />

      <div className={`relative z-10 container mx-auto px-4 sm:px-6 scroll-fade-in ${isVisible ? 'visible' : ''}`}>
        {/* Section heading */}
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-widest text-gray-500 mb-2">
            Our Partners
          </p>
          <h2 className="text-2xl sm:text-3xl font-melo font-semibold text-gray-900">
            Proudly Supported By
          </h2>
        </div>

        {/* Sponsor logos row */}
        <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16">
          {sponsors.map((sponsor: typeof sponsors[0]) => (
            <div key={sponsor.name} className="flex flex-col items-center gap-3">
              {/* Badge chip */}
              <span className="inline-block bg-primary/10 text-primary text-xs font-sans font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                {sponsor.badge}
              </span>
              {/* Logo */}
              <Link
                href={sponsor.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block opacity-90 hover:opacity-100 transition-opacity"
                aria-label={`Visit ${sponsor.name}`}
              >
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={sponsor.logoWidth}
                  height={sponsor.logoHeight}
                  className="h-20 sm:h-28 md:h-32 w-auto object-contain"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

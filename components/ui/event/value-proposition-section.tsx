'use client';

import Image from 'next/image';
import { MotivationIcon } from '../icons';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Static data moved outside component to prevent recreation on each render
const features = [
  {
    iconSrc: '/work.svg',
    expressionSrc: '/f.svg',
    title: 'Work smarter, not harder, and still grow your income',
  },
  {
    iconSrc: '/refine.svg',
    expressionSrc: '/e.svg',
    title: 'Redefine success in a way that feels like you again',
  },
  {
    iconSrc: '/free.svg',
    expressionSrc: '/quote.svg',
    title: 'Break free from glorifying exhaustion',
  },
  {
    iconSrc: '/routines.svg',
    expressionSrc: '/rocket.svg',
    title: 'Build routines that protect your wellbeing',
  },
];

// Style constants to prevent object recreation on each render
const noiseTextureStyle = {
  backgroundImage: 'url(/noise.svg)',
  backgroundSize: 'cover',
} as const;

export function ValuePropositionSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative bg-primary-light py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={noiseTextureStyle}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className={`max-w-3xl mx-auto text-center mb-10 sm:mb-12 md:mb-16 scroll-fade-in ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-melo font-semibold mb-4">
            <span className="text-gradient-primary">Why Wellness Events Matter</span>
          </h2>
          {/* Green underline decoration */}
          <MotivationIcon className="absolute top-14 sm:top-10 right-1/10 sm:right-4/15 mx-auto w-48 sm:w-64 md:w-80 hidden sm:block" />
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans mt-6 sm:mt-8 md:mt-10">
            Hit Refresh Conference isn&apos;t just another event - it&apos;s a wellness movement.
            You&apos;ve been giving your best: your time, your care, your energy. But lately, the
            spark feels dimmer & the days feel heavier. And even when you rest, it doesn&apos;t feel
            like it&apos;s enough.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-2 sm:space-y-4">
              {/* Icon */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 relative">
                <Image
                  src={feature.iconSrc}
                  alt={feature.title}
                  width={200}
                  height={200}
                  className="w-full h-full"
                />
              </div>
              {/* Title with expression icon */}
              <div className="flex items-start gap-2 sm:gap-3 text-left">
                <Image
                  src={feature.expressionSrc}
                  alt="Expression"
                  width={40}
                  height={40}
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 shrink-0"
                />
                <p
                  className="text-xs sm:text-sm md:text-base lg:text-lg font-medium font-sans text-left"
                  style={{ maxWidth: '22ch' }}
                >
                  {feature.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

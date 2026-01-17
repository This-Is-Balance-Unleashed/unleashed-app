import { Button } from './button';

// Style constants to prevent object recreation on each render
const sectionGradientStyle = {
  background: 'linear-gradient(to bottom, var(--color-primary-light), #f5f1ed)',
} as const;

const noiseTextureStyle = {
  backgroundImage: 'url(/noise.svg)',
  backgroundSize: 'cover',
} as const;

export function FinalCTASection() {
  return (
    <section className="relative bg-primary-light py-12 sm:py-16 md:py-20 overflow-hidden" style={sectionGradientStyle}>
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={noiseTextureStyle}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Large Green Rounded Card */}
          <div className="relative bg-secondary rounded-2xl sm:rounded-3xl md:rounded-[3rem] p-6 sm:p-10 md:p-12 lg:p-16 overflow-hidden">
            {/* Blue decorative swooshes (left side) - hidden on small screens */}
            <div className="absolute left-4 bottom-4 sm:left-8 sm:bottom-8 md:left-16 md:bottom-16 hidden sm:block">
              <svg
                className="w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-48"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M40 100 Q60 60 100 80 T160 100"
                  stroke="#60A5FA"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.4"
                />
                <path
                  d="M30 120 Q50 80 90 100 T150 120"
                  stroke="#60A5FA"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.3"
                />
                <path
                  d="M50 80 Q70 40 110 60 T170 80"
                  stroke="#60A5FA"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.4"
                />
              </svg>
            </div>

            {/* Orange accent marks (top right) - hidden on small screens */}
            <div className="absolute top-4 right-4 sm:top-8 sm:right-8 md:top-12 md:right-12 hidden sm:block">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20 20 L40 10" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
                <path d="M25 35 L45 25" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
                <path d="M30 50 L50 40" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>

            {/* Orange accent marks (bottom left) - hidden on small screens */}
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 md:bottom-12 md:left-12 hidden sm:block">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M70 70 L90 80" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
                <path d="M65 55 L85 65" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
                <path d="M60 40 L80 50" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center space-y-4 sm:space-y-6 md:space-y-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-melo font-semibold text-white leading-tight max-w-3xl mx-auto">
                You don&apos;t have to wait until you&apos;re overwhelmed to choose yourself
              </h2>

              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white max-w-2xl mx-auto leading-relaxed font-sans">
                Take one intentional day to reset before 2026 sweeps you away as 2025 did. Come
                breathe, restrategize, and build with a community that understands your journey.
              </p>

              {/* CTA Button */}
              <div className="pt-2 sm:pt-4">
                <Button variant="primary" size="lg" href="/tickets">
                  Get Your Ticket
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

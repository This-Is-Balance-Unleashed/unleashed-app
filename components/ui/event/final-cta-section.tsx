import { Button } from './button';

export function FinalCTASection() {
  return (
    <section className="relative bg-primary-light py-20 overflow-hidden" style={{
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

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Large Green Rounded Card */}
          <div className="relative bg-secondary rounded-[3rem] p-12 md:p-16 overflow-hidden">
            {/* Blue decorative swooshes (left side) */}
            <div className="absolute left-8 bottom-8 md:left-16 md:bottom-16">
              <svg
                className="w-32 h-32 md:w-48 md:h-48"
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

            {/* Orange accent marks (top right) */}
            <div className="absolute top-8 right-8 md:top-12 md:right-12">
              <svg
                className="w-16 h-16 md:w-24 md:h-24"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20 20 L40 10" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
                <path d="M25 35 L45 25" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
                <path d="M30 50 L50 40" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>

            {/* Orange accent marks (bottom left) */}
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
              <svg
                className="w-12 h-12 md:w-16 md:h-16"
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
            <div className="relative z-10 text-center space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-melo text-white leading-tight max-w-3xl mx-auto">
                You don&apos;t have to wait until you&apos;re overwhelmed to choose yourself
              </h2>

              <p className="text-lg md:text-xl text-white max-w-2xl mx-auto leading-relaxed font-sans">
                Take one intentional day to reset before 2026 sweeps you away as 2025 did. Come
                breathe, restrategize, and build with a community that understands your journey.
              </p>

              {/* CTA Button */}
              <div className="pt-4">
                <Button variant="primary" size="lg">
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

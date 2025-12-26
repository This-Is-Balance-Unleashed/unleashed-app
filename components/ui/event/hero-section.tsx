import Image from 'next/image';
import { Button } from './button';

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, var(--color-primary-light), #f5f1ed)',
      }}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'url(/noise.svg)',
          backgroundSize: 'cover',
        }}
      />

      {/* Header/Navigation */}
      <header className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/logo2.svg"
            alt="Career + Wellness Summit"
            width={200}
            height={60}
            priority
          />
        </div>
        <Button variant="primary" size="md">
          Sponsor A Ticket
        </Button>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 py-12 lg:py-20">
        {/* Background bubbles decoration */}
        <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
          <Image
            src="/four-green-bubbles.svg"
            alt="Background decoration"
            width={500}
            height={800}
            className="absolute left-0 top-1/25 w-150 md:w-175 lg:w-150 opacity-80"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="relative space-y-8">
            {/* Date/Location Badge */}
            <div className="inline-block">
              <div
                className="px-8 py-4 md:px-15 md:py-7 inline-flex items-center gap-2"
                style={{
                  backgroundImage: 'url(/border-date.svg)',
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              >
                <span className="text-sm md:text-base font-medium font-sans">
                  28th February, 2026 | Lagos, Nigeria
                </span>
              </div>
              {/* Orange decorative swoosh */}

            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <div className="relative inline-block">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-melo font-semibold leading-tight">
                  It&apos;s Time To
                  <br />
                  Breathe Again
                </h1>
                {/* Right swoosh beside the n */}
                <Image
                  src="/right-swoosh.svg"
                  alt="Swoosh decoration"
                  width={60}
                  height={60}
                  className="absolute -right-12 md:-right-16 top-1/2 w-12 md:w-16 rotate-12"
                />
              </div>
              {/* Underline decoration */}
              <Image
                src="/under-breathe.svg"
                alt="Underline decoration"
                width={450}
                height={30}
                className="w-96 md:w-lg lg:w-98"
              />
            </div>

            {/* Subheading */}
            <p className="text-lg md:text-xl max-w-lg leading-relaxed font-sans">
              Hit Refresh is your one-day pause; A chance to reset how you work, live, earn and lead.
              Embrace this opportunity to reset and get strategies that empower you to thrive in 2026.
            </p>

            {/* CTA Button */}
            <Button variant="primary" size="lg">
              Get Your Ticket
            </Button>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative">
            {/* Decorative swooshes */}
            <Image
              src="/tingles.svg"
              alt="Decoration"
              width={100}
              height={100}
              className="absolute rotate-y-180 top-1 -left-15 w-20 h-20 md:w-24 md:h-24"
            />

            {/* Image Container with skew */}
            <div className="relative transform rounded-2xl overflow-hidden">
              <Image
                src="/hero-people.svg"
                alt="Event attendees"
                width={800}
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Bottom decorative swoosh */}
            <Image
              src="/w.svg"
              alt="Decoration"
              width={80}
              height={80}
              className="absolute rotate-80 bottom-6 -left-11 w-16 h-16 md:w-20 md:h-20"
            />
            
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { Button } from "./button";
import { Header } from "./header";
import {
  FourGreenBubblesIcon,
  RightSwooshIcon,
  UnderBreatheIcon,
  TinglesIcon,
  WIcon,
} from "../icons";

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, var(--color-primary-light), #f5f1ed)",
      }}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "url(/noise.svg)",
          backgroundSize: "cover",
        }}
      />

      {/* Header/Navigation */}
      <Header />

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-20">
        {/* Background bubbles decoration */}
        <div className="absolute left-0 top-0 w-full h-full pointer-events-none hidden sm:block">
          <FourGreenBubblesIcon className="absolute left-0 top-1/25 w-150 md:w-175 lg:w-150 opacity-80" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="relative space-y-6 sm:space-y-8">
            {/* Date/Location Badge */}
            <div className="inline-block">
              <div
                className="px-4 py-3 sm:px-8 sm:py-4 md:px-15 md:py-7 inline-flex items-center gap-2"
                style={{
                  backgroundImage: "url(/border-date.svg)",
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <span className="text-xs sm:text-sm md:text-base font-medium font-sans">
                  28th February, 2026 | Lagos, Nigeria
                </span>
              </div>
              {/* Orange decorative swoosh */}
            </div>

            {/* Main Headline */}
            <div className="space-y-2 sm:space-y-4">
              <div className="relative inline-block">
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-melo font-semibold leading-tight">
                  It&apos;s Time To
                  <br />
                  Breathe Again
                </h1>
                {/* Right swoosh beside the n */}
                <RightSwooshIcon className="absolute -right-8 sm:-right-12 md:-right-16 top-1/2 w-8 sm:w-12 md:w-16 rotate-12" />
              </div>
              {/* Underline decoration */}
              <UnderBreatheIcon className="w-64 sm:w-96 md:w-lg lg:w-98" />
            </div>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl max-w-lg leading-relaxed font-sans">
              Hit Refresh is your one-day pause; A chance to reset how you work,
              live, earn and lead. Embrace this opportunity to reset and get
              strategies that empower you to thrive in 2026.
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <Button variant="primary" size="lg" href="/tickets">
                Get Your Ticket
              </Button>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative mt-8 lg:mt-0">
            {/* Decorative swooshes */}
            <TinglesIcon className="absolute rotate-y-180 top-1 -left-8 sm:-left-15 w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24" />

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
            <WIcon className="absolute rotate-80 bottom-4 sm:bottom-6 -left-8 sm:-left-11 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
          </div>
        </div>
      </div>
    </section>
  );
}

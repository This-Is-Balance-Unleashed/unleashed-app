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

// Style constants to prevent object recreation on each render
const sectionGradientStyle = {
  background: "linear-gradient(to bottom, var(--color-primary-light), #f5f1ed)",
} as const;

const noiseTextureStyle = {
  backgroundImage: "url(/noise.svg)",
  backgroundSize: "cover",
} as const;


export function HeroSection() {
  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={sectionGradientStyle}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={noiseTextureStyle}
      />

      {/* Animated floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-16 h-16 rounded-full bg-linear-to-br from-green-400/20 to-green-600/20 animate-float-slow" />
        <div className="absolute top-1/3 right-20 w-24 h-24 rounded-full bg-linear-to-br from-orange-400/15 to-orange-600/15 animate-float-slower" />
        <div className="absolute bottom-1/4 left-1/4 w-20 h-20 rounded-full bg-linear-to-br from-green-400/10 to-green-600/10 animate-float" />
      </div>

      {/* Header/Navigation */}
      <Header />

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-20">
        {/* Background bubbles decoration with animation */}
        <div className="absolute left-0 top-0 w-full h-full pointer-events-none hidden sm:block">
          <FourGreenBubblesIcon className="absolute left-0 top-1/25 w-150 md:w-175 lg:w-150 opacity-80 animate-float-slow" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content with staggered animations */}
          <div className="relative space-y-6 sm:space-y-8">
            {/* Date/Location Badge - fade in first */}
            <div className="inline-block animate-fade-in-up">
              <div className="relative px-8 py-4 sm:px-12 sm:py-5 md:px-16 md:py-7 inline-flex items-center gap-2">
                <span className="text-xs sm:text-sm md:text-base font-medium font-sans relative z-10">
                  28th February, 2026 | Waterfalls Event Center, Ikeja, Lagos
                </span>
                <svg
                  className="absolute inset-0 w-full h-full overflow-visible"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <ellipse
                    cx="50"
                    cy="50"
                    rx="49"
                    ry="47"
                    fill="none"
                    stroke="#ff8e00"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
            </div>

            {/* Main Headline - fade in second with slight delay */}
            <div className="space-y-2 sm:space-y-4 animate-fade-in-up animation-delay-200">
              <div className="relative inline-block">
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-melo font-semibold leading-tight">
                  It&apos;s Time To
                  <br />
                  Breathe Again
                </h1>
                {/* Right swoosh with entrance animation */}
                <RightSwooshIcon className="absolute -right-8 sm:-right-12 md:-right-16 top-1/2 w-8 sm:w-12 md:w-16 rotate-12 animate-draw-swoosh" />
              </div>
              {/* Underline decoration with draw animation */}
              <UnderBreatheIcon className="w-64 sm:w-96 md:w-lg lg:w-98 animate-draw-line" />
            </div>

            {/* Subheading - fade in third */}
            <p className="text-base sm:text-lg md:text-xl max-w-lg leading-relaxed font-sans animate-fade-in-up animation-delay-400">
              Join the premier career and wellness event on February 28, 2026.
              Hit Refresh Conference is your one-day pause to reset how you work,
              live, earn and lead. Get strategies that empower you to thrive in 2026
              at this transformative wellness summit in Nigeria.
            </p>

            {/* CTA Button - fade in last with scale */}
            <div className="pt-2 animate-fade-in-up animation-delay-600">
              <Button variant="primary" size="lg" href="/tickets">
                Get Your Ticket
              </Button>
            </div>
          </div>

          {/* Right Column - Hero Image with parallax effect */}
          <div className="relative mt-8 lg:mt-0 animate-fade-in-up animation-delay-300">
            {/* Decorative swooshes with entrance animations */}
            <TinglesIcon className="absolute rotate-y-180 top-1 -left-8 sm:-left-15 w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 animate-spin-in animation-delay-500" />

            {/* Image Container with hover effect */}
            <div className="relative transform rounded-2xl overflow-hidden transition-transform duration-500 hover:scale-[1.02] hover:rotate-1">
              <Image
                src="https://res.cloudinary.com/drnqdd87d/image/upload/f_auto,q_auto:best/balanced/hero-illustration"
                alt="Hit Refresh Conference Lagos - Career and wellness event featuring professionals at a transformative wellness summit in Lagos, Nigeria"
                width={966}
                height={662}
                sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 966px"
                quality={90}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Bottom decorative swoosh with rotation animation */}
            <WIcon className="absolute rotate-80 bottom-4 sm:bottom-6 -left-8 sm:-left-11 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 animate-spin-in animation-delay-700" />
          </div>
        </div>
      </div>
    </section>
  );
}

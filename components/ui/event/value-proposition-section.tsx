import Image from 'next/image';
import { MotivationIcon } from '../icons';

export function ValuePropositionSection() {
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

  return (
    <section className="relative bg-primary-light py-20 overflow-hidden">
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'url(/noise.svg)',
          backgroundSize: 'cover',
        }}
      />

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-melo font-semibold mb-4">
            This Is Not Another Motivation Rally
          </h2>
          {/* Green underline decoration */}
          <MotivationIcon className="absolute top-10 right-4/15 mx-auto w-64 md:w-80" />
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans mt-10">
            You&apos;ve been giving your best: your time, your care, your energy. But lately, the
            spark feels dimmer & the days feel heavier. And even when you rest, it doesn&apos;t feel
            like it&apos;s enough
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4">
              {/* Icon */}
              <div className="w-48 h-48 relative">
                <Image
                  src={feature.iconSrc}
                  alt={feature.title}
                  width={200}
                  height={200}
                  className="w-full h-full"
                />
              </div>
              {/* Title with expression icon */}
              <div className="flex items-start gap-3 text-left">
                <Image
                  src={feature.expressionSrc}
                  alt="Expression"
                  width={40}
                  height={40}
                  className="w-10 h-10 md:w-12 md:h-12 shrink-0"
                />
                <p
                  className="text-base md:text-lg font-medium font-sans text-left"
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

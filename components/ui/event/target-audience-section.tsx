import { Check, X } from 'lucide-react';

export function TargetAudienceSection() {
  const forYouList = [
    "You're ambitious but constantly tired.",
    'You\'ve said "I just need to breathe" more than 3 times this year; you don\'t want to run on fumes in 2026.',
    "You've achieved your goals but lost your spark along the way.",
    "You want to earn well without losing your mind in the process.",
  ];

  const notForYouList = [
    'You still believe stress is proof of commitment.',
    'You believe and want to retain that burnout is a badge of honour.',
    'You want to outwork yourself to the point of exhaustion.',
    "You don't want to earn well and lose your mind in the process.",
  ];

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
        {/* Green wave decoration at top */}
        <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden -mt-32">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path d="M0 0 Q360 50 720 20 T1440 0 L1440 120 L0 120 Z" fill="var(--color-secondary)" />
            <path
              d="M0 20 Q360 70 720 40 T1440 20 L1440 120 L0 120 Z"
              fill="var(--color-secondary)"
              fillOpacity="0.5"
            />
            <path
              d="M0 40 Q360 90 720 60 T1440 40 L1440 120 L0 120 Z"
              fill="var(--color-secondary)"
              fillOpacity="0.3"
            />
          </svg>
        </div>

        {/* Two Cards Side by Side */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Green Card - For You */}
          <div className="relative bg-secondary rounded-3xl p-8 md:p-10 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-melo text-white mb-8">
              Hit Refresh is for you if
            </h2>

            <ul className="space-y-6">
              {forYouList.map((item, index) => (
                <li key={index} className="flex gap-4 items-start">
                  <div className="shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center mt-1">
                    <Check className="w-5 h-5 text-secondary" strokeWidth={3} />
                  </div>
                  <p className="text-white text-lg leading-relaxed font-sans">{item}</p>
                </li>
              ))}
            </ul>

            {/* Orange bottom accent stroke */}
            <div className="absolute bottom-0 left-0 right-0 h-2 overflow-hidden rounded-b-3xl">
              <svg
                className="w-full h-8"
                viewBox="0 0 400 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 15 Q100 5 200 15 T400 15"
                  stroke="var(--color-primary)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* Black Card - Not For You */}
          <div className="relative bg-black rounded-3xl p-8 md:p-10 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-melo text-white mb-8">
              Hit Refresh is not for you if
            </h2>

            <ul className="space-y-6">
              {notForYouList.map((item, index) => (
                <li key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center mt-1">
                    <X className="w-5 h-5 text-black" strokeWidth={3} />
                  </div>
                  <p className="text-white text-lg leading-relaxed font-sans">{item}</p>
                </li>
              ))}
            </ul>

            {/* Orange bottom brushstroke decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden rounded-b-3xl">
              <svg
                className="w-full h-full"
                viewBox="0 0 400 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 30 Q50 10 100 30 T200 30 T300 30 T400 30"
                  stroke="var(--color-primary)"
                  strokeWidth="20"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.8"
                />
                <path
                  d="M0 40 Q50 20 100 40 T200 40 T300 40 T400 40"
                  stroke="var(--color-primary)"
                  strokeWidth="15"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.6"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

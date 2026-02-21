'use client';

import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is Hit Refresh Conference?',
    answer: 'Hit Refresh Conference is a premier career and wellness event in Nigeria, taking place on February 28, 2026. It brings together industry leaders and wellness experts to help professionals achieve work-life balance and sustainable career growth.',
  },
  {
    question: 'Where is Hit Refresh Conference happening?',
    answer: 'Hit Refresh Conference will take place at Waterfalls Event Center, Oregun, Ikeja, Lagos, with both in-person and virtual attendance options available.',
  },
  {
    question: 'What makes this different from other events?',
    answer: "Hit Refresh Conference is not a typical motivation rally. It's a practical wellness summit focused on actionable strategies for work-life balance, mental wellness, and sustainable career growth. Attendees learn to work smarter, break free from burnout, and build routines that protect their wellbeing.",
  },
  {
    question: 'When is Hit Refresh Conference 2026?',
    answer: 'Hit Refresh Conference 2026 takes place on February 28, 2026, from 8:00 AM to 4:00 PM WAT at Waterfalls Event Center, Oregun, Ikeja, Lagos.',
  },
  {
    question: 'What are the ticket prices?',
    answer: 'Hit Refresh Conference offers multiple ticket options: General Admission (₦10,000), Refresh+ VIP Experience (₦18,000), Refresh Corporate packages (₦70,000), and Refresh Online Virtual Pass (₦6,500).',
  },
];

// Style constants
const sectionGradientStyle = {
  background: 'linear-gradient(to bottom, #f5f1ed, var(--color-primary-light))',
} as const;

const noiseTextureStyle = {
  backgroundImage: 'url(/noise.svg)',
  backgroundSize: 'cover',
} as const;

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative bg-primary-light py-12 sm:py-16 md:py-20 overflow-hidden" style={sectionGradientStyle}>
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={noiseTextureStyle}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-10 sm:mb-12 scroll-fade-in ${isVisible ? 'visible' : ''}`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-melo font-semibold mb-4">
              <span className="text-gradient-orange">Frequently Asked Questions</span>
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-sans mt-4">
              Everything you need to know about Hit Refresh Conference
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 scroll-fade-in ${isVisible ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <h3 className="text-base sm:text-lg font-semibold font-sans pr-4">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-5 text-sm sm:text-base font-sans leading-relaxed text-gray-700">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

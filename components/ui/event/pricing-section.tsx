import Image from 'next/image';
import { Button } from './button';

interface TicketProps {
  type: 'general' | 'vip' | 'teams' | 'virtual';
  title: string;
  label: string;
  description: string;
  price: string;
  className?: string;
}

function TicketCard({ type, title, label, description, price, className = '' }: TicketProps) {
  const bgColors = {
    general: 'bg-white border-4 border-blue-500',
    vip: 'bg-yellow-400',
    teams: 'bg-black text-white',
    virtual: 'bg-secondary text-white',
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 ${bgColors[type]} ${className}`}
    >
      <div className="grid grid-cols-[1fr_auto] min-h-[280px]">
        {/* Main Content */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <Image src="/icon-logo.svg" alt="Logo" width={40} height={40} />
            <span
              className={`text-xs md:text-sm font-medium px-3 py-1 rounded ${
                type === 'general' || type === 'vip' ? 'text-black' : 'text-white opacity-70'
              }`}
            >
              {label}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-bold font-melo mb-3">{title}</h3>
            <p
              className={`text-sm md:text-base leading-relaxed font-sans ${
                type === 'teams' || type === 'virtual'
                  ? 'text-gray-200'
                  : type === 'vip'
                    ? 'text-gray-800'
                    : 'text-gray-600'
              }`}
            >
              {description}
            </p>
          </div>

          {/* Price */}
          <div className="mt-4">
            <p className="text-2xl md:text-3xl font-bold">{price}</p>
          </div>
        </div>

        {/* Perforated Edge & Barcode Section */}
        <div className="relative w-24 md:w-32 border-l-2 border-dashed border-gray-400">
          {/* Perforated circles */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black" />

          {/* Barcode */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <svg
              viewBox="0 0 100 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-32 md:h-40"
            >
              {/* Barcode lines */}
              {Array.from({ length: 15 }).map((_, i) => (
                <rect
                  key={i}
                  x={i * 7}
                  y="0"
                  width={Math.random() > 0.5 ? 3 : 5}
                  height="200"
                  fill={type === 'teams' || type === 'virtual' ? 'white' : 'black'}
                  opacity={0.8}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Ticket notch effects */}
      <div className="absolute -top-3 right-28 w-6 h-6 rounded-full bg-black" />
      <div className="absolute -bottom-3 right-28 w-6 h-6 rounded-full bg-black" />
    </div>
  );
}

export function PricingSection() {
  const tickets = [
    {
      type: 'general' as const,
      title: 'Refresh Access',
      label: 'General Access',
      description: 'Access to all sessions + Two Masterclasses + Digital Reflection Workbook.',
      price: '₦10,000',
    },
    {
      type: 'vip' as const,
      title: 'Refresh+ Experience',
      label: 'VIP',
      description:
        'Everything in General Admission + All Masterclasses + Front-row seating + Wellness Goody Bag.',
      price: '₦18,000',
    },
    {
      type: 'teams' as const,
      title: 'Corporate Refresh',
      label: 'Teams',
      description: 'Perfect for companies investing in staff wellness and productivity.',
      price: '₦70,000',
    },
    {
      type: 'virtual' as const,
      title: 'Refresh Online',
      label: 'Virtual Pass',
      description: 'Livestream access + 14-day replay.',
      price: '₦6,500',
    },
  ];

  return (
    <section className="relative bg-black py-20 overflow-hidden">
      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-melo text-white mb-4">
            Choose Your Experience
          </h2>
          {/* Orange handwritten underline */}
          <svg
            className="mx-auto w-80"
            viewBox="0 0 400 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 20 Q50 10 100 20 T200 20 T300 20 T395 20"
              stroke="var(--color-primary)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M10 25 Q60 15 110 25 T210 25 T310 25 T390 25"
              stroke="var(--color-primary)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* Tickets Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {tickets.map((ticket, index) => (
            <TicketCard key={index} {...ticket} />
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button variant="primary" size="lg">
            Get Your Ticket
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-8 left-8 w-16 h-16">
        <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="20" fill="var(--color-primary)" opacity="0.3" />
        </svg>
      </div>
    </section>
  );
}

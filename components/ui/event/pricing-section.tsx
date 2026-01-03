import Image from 'next/image';
import Link from 'next/link';
import { Button } from './button';

interface TicketProps {
  type: 'general' | 'vip' | 'teams' | 'virtual';
  title: string;
  label: string;
  description: string;
  price: string;
  ticketTypeId: string;
  className?: string;
}

function TicketCard({ type, title, label, description, price, ticketTypeId, className = '' }: TicketProps) {
  const bgColors = {
    general: 'bg-white border-4 border-blue-500',
    vip: 'bg-yellow-400',
    teams: 'bg-black text-white',
    virtual: 'bg-secondary text-white',
  };

  return (
    <Link href={`/purchase/${ticketTypeId}`} className="block">
      <div
        className={`relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 ${bgColors[type]} ${className}`}
      >
      <div className="grid grid-cols-[1fr_auto] min-h-70">
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
            <h3 className="text-2xl md:text-3xl font-semibold font-melo mb-3">{title}</h3>
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
                  // eslint-disable-next-line react-hooks/purity
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
    </Link>
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
      ticketTypeId: '00000000-0000-0000-0001-000000000001',
    },
    {
      type: 'vip' as const,
      title: 'Refresh+ Experience',
      label: 'VIP',
      description:
        'Everything in General Admission + All Masterclasses + Front-row seating + Wellness Goody Bag.',
      price: '₦18,000',
      ticketTypeId: '00000000-0000-0000-0001-000000000002',
    },
    {
      type: 'teams' as const,
      title: 'Corporate Refresh',
      label: 'Teams',
      description: 'Perfect for companies investing in staff wellness and productivity.',
      price: '₦70,000',
      ticketTypeId: '00000000-0000-0000-0001-000000000003',
    },
    {
      type: 'virtual' as const,
      title: 'Refresh Online',
      label: 'Virtual Pass',
      description: 'Livestream access + 14-day replay.',
      price: '₦6,500',
      ticketTypeId: '00000000-0000-0000-0001-000000000004',
    },
  ];

  return (
    <section className="relative bg-black py-20 overflow-hidden">
      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 relative">
          {/* Right swoosh decoration */}
          <svg
            className="absolute right-19 top-0 w-12 h-12 rotate-30 hidden lg:block"
            xmlns="http://www.w3.org/2000/svg"
            width="54"
            height="66"
            fill="none"
            viewBox="0 0 54 66"
          >
            <path
              fill="#ff8e00"
              d="M46 55.4q1.4.3 2.3-.6 1.3-1.2 1.9-3.1l-1-.4h-4.4l-7-1-2-.1q-1 .2-2 0-.7-.2-1.5-.1l-2.8-.2a10 10 0 0 0-4.9.4q.2.9.8.6 1.2 0 2 .6c1.3 1.2 2.8 1.2 4.3 1.4l2.4.2c1.9.6 3.9.6 5.8 1.3 1 .4 2 .3 3 .5.7-1 1.6-.4 2.4-.3q.6.2.8.9zM3.7 19.8q2.6-1.1 4.1-2.6l5.6-3.7 3.3-2L19 9.9c.8-.5 1.1-1.6 1.8-2.2A11 11 0 0 0 24 1.8v-1c-.1-.3-.9-.7-1.2-.4l-.8.9a27 27 0 0 1-5.5 6L8.6 14a19 19 0 0 0-5 5.8M39.3 31c-1.2-.5-2-.2-3-.1q-2.7.3-5.6.1-3.6-.2-7.1.8l-1.4.2c-1.4.3-1.6.7-1 2.3 1.9-.6 3.9-.2 5.8-.2q1 0 2 .6t2 .5q2.3-.4 4.3 0L37 35l.7-2.2zm-21.7 3 1.7-.1c-.8-.8-.8-.8-1.7.1"
            />
            <path fill="#ff8e00" d="M45.3 54.7v-.1l.8.8z" />
            <path fill="#fff" d="m45.3 54.7.7.8q0-.7-.7-.8" />
          </svg>

          <h2 className="text-4xl md:text-5xl font-melo font-semibold text-white mb-4">
            Choose Your Experience
          </h2>

          {/* Choose experience underline */}
          <svg
            className="mx-auto w-52"
            xmlns="http://www.w3.org/2000/svg"
            width="203"
            height="32"
            fill="none"
            viewBox="0 0 203 32"
          >
            <path
              fill="#ff8e00"
              d="M160.3 12.6c-1.6-1.8-3.4-1.2-5-.3q-3.4 1.8-7.2 2.8c-2.2.6-4.6.5-6.5 2q-.6.3-1.5.2l-2.6-.6c-1 .6-1.4 2-3.1 1.6l-.8-2.3c-.4-1.8 0-2.4 2-2.7q.9 0 1.3-.3c1.2-2 4-1 5.2-2.8-.2-.9-.8-.9-1.3-.8-1.1.4-2.1.8-3.4.3q-1-.2-1.7.6-.8.7-1.6 1.8c-1.5-.5-2.9.2-4.3.5q-4 .9-7.7 2.4l-3.2 1.4c-1.7.8-3.4 1.5-5.2.7l-1.2.9c-.7.6-1.3 1.7-2.4 1.4-1.2-.3-2.5-.2-3.4-1.5q-1.2-1.5-2.8-3h-1.4l-5 1.4-1.8.9-2 .7q-2.2.4-4 1.6-1.4.8-3.3 1.2-2.4.6-5 .9c-1.6.1-1.9-.1-2.6-1.8l-.5-1.1c-1.2-.6-2.2-.3-3.2 0-3.2 1.3-6.7 1.9-9.6 4l-1 .3-6 2-5.7 2.4-1.2.4q-1-.1-1.4-.7t0-1.5q1.6-2.4 4.5-3l2.1-.6a3 3 0 0 0 2-1.4 7 7 0 0 1 2.2-1.9q1-.6 2.2-.2c1.8.4 1.8.4 2.7-1.3q.3-.7 1-1c2-.6 3.9-1.4 6-.6q1.5.4 2.6-1 1.4-1.5 3-2.8 2-1.3 4.2-1.8 2.1-.2 3.9-1.3l2.1-1 2 1 1-.4a9 9 0 0 1 5.7-2.8q2.5-.1 4.3-2 .7-.7 1.7-.6.8 0 1.5-.2c1.9-.7 2.1-.6 2.7 1.4l.9 2.8c.2.7 1 .9 1.6.4l.6-.7q1-.8 1.7 0 .8.8 1.2 1.8c.9.2 1.2-.4 1.4-1l.7-2.5 1.6.5 1.2-1.3 1 1.2c.8.8 1.4 1.3 2.6.7.4-.1 1 .5 1.7.7 1-.7.2-2 .8-2.8 1.3-.8 2.4 0 3.3.3l2.6-1.5q.9-.3 1.9 0 1.9.3 1.5 2.4c-.2 1-.4 1.8.3 2.8.8-.8.5-1.7.6-2.5q.3-1.2 1.3-1.8 2.8-1.7 5.4.4l4.9-1.7a11 11 0 0 1 6.7-.7c1.1.3 2-.4 3.1-.5l2.6 1.4-.3 1.2c1 1.9 2.5 1.2 4 .5l.5 2.3c.7.5 1-.2 1.3-.5q.7-.7 1.4-.3c.8.8 1.7.3 2.6.7l.8 3.1 2.6-1.1 1-5q.3-1.8 2.3-1.9l4.9-.3 1.7 2.1q4.8.5 9.5-1.3 4.3-2.1 9.7-2l2.2 2.5c-1 2.8-3.5 1.3-4.9 2.3-1.3.3-1 2.1-2.4 2.2V5.8h-.3q0 .8.3 1.2l-2.9 2q-.7.6-1.3.8c-1.6.2-2.8 1.2-4.2 1.6-3.3 1-6.3 2.8-9.8 3.2q-1.4.2-2.7 1a12 12 0 0 1-4.6 1.2q-1.1 0-1.9.6c-1.6 1.2-3.4 1-5.3.9q-1.5 0-2.4-1.3c-1.7-2-1.7-2-.4-4.5 2.5-.1 4.7-.7 5.8-3.2q-.4-.8-1-.2-1 1.5-2.8 1h-.3c-1.1 0-1.4.2-1.7 1.5zm20.6-7.3q-1.5-1.4-3-1.2c-.9.2-1.8-.9-2.4 0-.9 1.2.8 1.2 1 2l.8 1.6c.4-1.4 1.5-1.5 2.6-1.6zm-33.1 1c-.6 1.3.1 2.3.7 3.5l.7-1.6h1.8l.5-1q0-1.5-1.1-1.4l-2.6.6m-46.6 4.2q-2.4-1.2-3 .3-.6 1.2.7 1.7zM137.6 7q1-.9.2-2c-1.1.8-1.1.8-.2 2m17-4.2-.3.6q.2.4.6.7l.4-.7zm-6.5 1.5-.8-.2-.1.5.7.4zM1.6 32Q0 30.9 0 29.5L4.4 25l1.3-.9q6.7-2.4 12.7-6.5 3.4-2 7.3-3.5l7.7-3.3L36 10a48 48 0 0 0 9.4-3.3q.5-.4.9-.4c2 .5 3.2-.8 4.7-1.7l5-2.4a4 4 0 0 1 1.8-.5q2.5 0 4.8-1.2c1-.5 2.3-.3 3.5-.4q.3 0 .5.2 1.8 2.4-.6 3.3l-2.8 1-6.7 2-1.2.6a40 40 0 0 1-8.6 3.8l-3.3 1.4-9.4 4.3-1.8.8C25 20 18.4 24 11.5 27q-1.2.5-2.2 1.3-3.5 2.4-7.7 3.7m20.4-.2c-1-2.5-1-2.8.3-4l1-.8 7.8-4.6c5.2-3.1 11-5.1 16.5-7.4q5.2-1.9 10-4.7 1.4-1 3-1 2.2 0 3.8-1.7 1.2-1.3 3-1.5 2.5-.5 4.8-1.2c2.2-.5 2.6-.1 3 2.5Q74 9 72.2 9.2q-2 .6-3.8 1.8-3 1.6-6.2 2.8l-5.3 2.4-1.8.8c-4.8 2.2-9.8 3.9-14.4 6.6-2.3 1.3-5 2-7.4 3.2a26 26 0 0 0-4.2 2.4c-2.1 1.6-4.6 1.9-7.1 2.6"
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

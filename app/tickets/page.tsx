import Link from 'next/link';
import Image from 'next/image';
import { memo } from 'react';

interface TicketType {
  id: string;
  name: string;
  label: string;
  price: string;
  priceInKobo: number;
  description: string;
  features: string[];
  popular?: boolean;
  color: 'blue' | 'yellow' | 'black' | 'yellow-gradient' | 'green' | 'teal';
}

// Style constants moved outside component to prevent recreation on each render
const bgColors = {
  blue: 'bg-white border-4 border-blue-500',
  yellow: 'bg-yellow-400',
  black: 'bg-black text-white',
  'yellow-gradient': 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black',
  green: 'bg-gradient-to-br from-green-500 to-green-700 text-white',
  teal: 'bg-[oklch(70%_0.15_200)] text-white',
} as const;

const ticketTypes: TicketType[] = [
  {
    id: '00000000-0000-0000-0001-000000000001',
    name: 'Refresh Access',
    label: 'General Access',
    price: '₦10,000',
    priceInKobo: 1000000,
    description: 'Perfect for professionals seeking growth and wellness insights.',
    features: [
      'Access to all keynotes, speakers, and panel sessions',
      'Two exclusive Masterclasses',
      'Digital workbook/reflection journal (PDF)',
      'Networking opportunities',
      'Light refreshments',
    ],
    popular: true,
    color: 'blue',
  },
  {
    id: '00000000-0000-0000-0001-000000000002',
    name: 'Refresh+ Experience',
    label: 'VIP',
    price: '₦18,000',
    priceInKobo: 1800000,
    description: 'An enhanced experience with premium perks and exclusive access.',
    features: [
      'Everything in General Admission',
      'Access to ALL Masterclasses',
      'Reserved front-row seating',
      'Wellness Goody Bag',
      'VIP networking lounge access',
      'Priority entry',
    ],
    color: 'yellow',
  },
  {
    id: '00000000-0000-0000-0001-000000000003',
    name: 'Corporate Refresh',
    label: 'Teams',
    price: '₦70,000',
    priceInKobo: 7000000,
    description: 'Ideal for HR departments and companies investing in staff wellness.',
    features: [
      'Admits 8 people (General Access)',
      'Company logo featured in "Corporate Partners" section',
      'Reserved team seating area',
      'Post-summit "Career Wellness Audit" report',
      'Team photo opportunity',
      'Dedicated support contact',
    ],
    color: 'black',
  },
  {
    id: '00000000-0000-0000-0001-000000000005',
    name: 'Corporate VIP',
    label: 'Teams VIP',
    price: '₦70,000',
    priceInKobo: 7000000,
    description: 'Premium corporate package with VIP access for your team.',
    features: [
      'Admits 4 people (VIP Access)',
      'All VIP perks for each attendee',
      'Company logo featured in "Corporate Partners" section',
      'Reserved VIP team seating area',
      'Post-summit "Career Wellness Audit" report',
      'Team photo opportunity',
      'Dedicated support contact',
    ],
    color: 'yellow-gradient',
  },
  {
    id: '00000000-0000-0000-0001-000000000006',
    name: 'Group Refresh',
    label: 'Friends Discount',
    price: '₦50,000',
    priceInKobo: 5000000,
    description: 'Perfect for friends coming together! Buy 5, Get 1 Free.',
    features: [
      'Admits 6 people (General Access)',
      'Save ₦10,000 compared to individual tickets',
      'Reserved group seating area',
      'Networking opportunities',
      'Access to all sessions and two Masterclasses',
    ],
    color: 'green',
  },
  {
    id: '00000000-0000-0000-0001-000000000004',
    name: 'Refresh Online',
    label: 'Virtual Pass',
    price: '₦6,500',
    priceInKobo: 650000,
    description: 'Join from anywhere! Perfect for remote attendees.',
    features: [
      'Livestream access to keynote + panel sessions',
      'Replay access for 14 days',
      'Digital workbook/reflection journal (PDF)',
      'Virtual networking opportunities',
      'Q&A participation',
    ],
    color: 'teal',
  },
];

export default function TicketsPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/" className="inline-block mb-6 text-sm text-gray-400 hover:text-white transition-colors">
              ← Back to Event
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold font-melo mb-4">
              Choose Your Experience
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Hit Refresh: Career + Wellness Summit
            </p>
            <p className="text-lg text-gray-400">
              February 28, 2026 | Pistis Annex, Marwa, Lekki, Lagos
            </p>
          </div>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {ticketTypes.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold font-melo text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <FAQItem
              question="Can I transfer my ticket to someone else?"
              answer="Yes! Tickets are transferable. Simply contact us with the new attendee's details at least 48 hours before the event."
            />
            <FAQItem
              question="What's the refund policy?"
              answer="Full refunds are available up to 14 days before the event. After that, tickets are non-refundable but transferable."
            />
            <FAQItem
              question="Will sessions be recorded?"
              answer="Yes! Virtual pass holders and all physical attendees will have access to session replays for 14 days after the event."
            />
            <FAQItem
              question="What's included in the Wellness Goody Bag?"
              answer="VIP ticket holders receive a curated bag with wellness products, journals, and exclusive summit merchandise valued at ₦5,000+."
            />
          </div>
        </div>

        {/* Need Help Section */}
        <div className="max-w-2xl mx-auto mt-16 bg-primary/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold font-melo mb-4">Need Help Choosing?</h3>
          <p className="text-gray-700 mb-6">
            Not sure which ticket is right for you? Our team is here to help!
          </p>
          <a
            href="mailto:events@balanceunleashed.org"
            className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

// Memoized TicketCard component to prevent unnecessary re-renders
const TicketCard = memo(function TicketCard({ ticket }: { ticket: TicketType }) {
  return (
    <div className="relative">
      {ticket.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
            Most Popular
          </span>
        </div>
      )}
      <Link href={`/purchase/${ticket.id}`} className="block group h-full">
        <div
          className={`relative rounded-2xl overflow-hidden shadow-xl transform group-hover:scale-105 transition-all duration-300 h-full ${bgColors[ticket.color]}`}
        >
          <div className="p-8 flex flex-col h-full min-h-[500px]">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <Image src="/icon-logo.svg" alt="Logo" width={40} height={40} />
              <span
                className={`text-xs md:text-sm font-medium px-3 py-1 rounded ${
                  ticket.color === 'blue' || ticket.color === 'yellow' || ticket.color === 'yellow-gradient'
                    ? 'bg-black/10 text-black'
                    : 'bg-white/20 text-white'
                }`}
              >
                {ticket.label}
              </span>
            </div>

            {/* Title & Price */}
            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl font-semibold font-melo mb-2">
                {ticket.name}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold">{ticket.price}</span>
                <span
                  className={`text-sm ${ticket.color === 'black' || ticket.color === 'teal' ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  per ticket
                </span>
              </div>
            </div>

            {/* Description */}
            <p
              className={`text-sm md:text-base mb-6 ${
                ticket.color === 'black' || ticket.color === 'teal' || ticket.color === 'green'
                  ? 'text-gray-200'
                  : ticket.color === 'yellow'
                    ? 'text-gray-800'
                    : ticket.color === 'yellow-gradient'
                      ? 'text-gray-900'
                      : 'text-gray-600'
              }`}
            >
              {ticket.description}
            </p>

            {/* Features List */}
            <ul className="space-y-3 mb-8 flex-1">
              {ticket.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      ticket.color === 'black' || ticket.color === 'teal' || ticket.color === 'green'
                        ? 'text-green-400'
                        : 'text-green-600'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span
                    className={`text-sm ${
                      ticket.color === 'black' || ticket.color === 'teal' || ticket.color === 'green'
                        ? 'text-gray-200'
                        : ticket.color === 'yellow'
                          ? 'text-gray-800'
                          : ticket.color === 'yellow-gradient'
                            ? 'text-gray-900'
                            : 'text-gray-700'
                    }`}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                ticket.color === 'blue'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : ticket.color === 'yellow' || ticket.color === 'yellow-gradient'
                    ? 'bg-black text-white hover:bg-gray-900'
                    : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              Select Ticket →
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
});

// Memoized FAQItem component to prevent unnecessary re-renders
const FAQItem = memo(function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-white rounded-lg shadow-sm border border-gray-200">
      <summary className="cursor-pointer p-6 font-semibold text-gray-900 flex items-center justify-between group-open:border-b group-open:border-gray-200">
        {question}
        <svg
          className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="p-6 pt-0 text-gray-600">{answer}</div>
    </details>
  );
});

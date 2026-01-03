export function EventSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://unleashed.conference';

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Hit Refresh: Career + Wellness Summit',
    description:
      "Join Nigeria's premier career and wellness summit. Rooted in purpose, insights from industry leaders, and all-round growth for a sustainable and impactful life.",
    startDate: '2026-02-28T08:00:00+01:00',
    endDate: '2026-02-28T16:00:00+01:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
    location: [
      {
        '@type': 'Place',
        name: 'Lagos, Nigeria',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Lagos',
          addressCountry: 'NG',
        },
      },
      {
        '@type': 'VirtualLocation',
        url: `${siteUrl}`,
      },
    ],
    image: [`${siteUrl}/opengraph-image`],
    organizer: {
      '@type': 'Organization',
      name: 'Unleashed Conference',
      url: siteUrl,
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'General Admission',
        description: 'Access to all sessions + Two Masterclasses + Digital Reflection Workbook',
        price: '10000',
        priceCurrency: 'NGN',
        availability: 'https://schema.org/InStock',
        url: `${siteUrl}/purchase/00000000-0000-0000-0001-000000000001`,
        validFrom: '2025-01-01T00:00:00+01:00',
      },
      {
        '@type': 'Offer',
        name: 'Refresh+ Experience (VIP)',
        description:
          'Everything in General Admission + All Masterclasses + Front-row seating + Wellness Goody Bag',
        price: '18000',
        priceCurrency: 'NGN',
        availability: 'https://schema.org/InStock',
        url: `${siteUrl}/purchase/00000000-0000-0000-0001-000000000002`,
        validFrom: '2025-01-01T00:00:00+01:00',
      },
      {
        '@type': 'Offer',
        name: 'Refresh Corporate',
        description: 'Perfect for companies investing in staff wellness and productivity',
        price: '70000',
        priceCurrency: 'NGN',
        availability: 'https://schema.org/InStock',
        url: `${siteUrl}/purchase/00000000-0000-0000-0001-000000000003`,
        validFrom: '2025-01-01T00:00:00+01:00',
      },
      {
        '@type': 'Offer',
        name: 'Refresh Online (Virtual Pass)',
        description: 'Livestream access + 14-day replay',
        price: '6500',
        priceCurrency: 'NGN',
        availability: 'https://schema.org/InStock',
        url: `${siteUrl}/purchase/00000000-0000-0000-0001-000000000004`,
        validFrom: '2025-01-01T00:00:00+01:00',
      },
    ],
    performer: {
      '@type': 'Organization',
      name: 'Industry Leaders & Wellness Experts',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
    />
  );
}

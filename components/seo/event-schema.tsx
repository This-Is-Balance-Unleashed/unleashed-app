export function EventSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://unleashed.conference';

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Hit Refresh Conference - Career and Wellness Summit',
    alternateName: 'Hit Refresh Conference',
    description:
      "Hit Refresh Conference is Lagos' premier career and wellness event. Join industry leaders for a transformative day focused on work-life balance, mental wellness, and sustainable career growth in Lagos, Nigeria.",
    keywords: 'hit refresh conference, events in lagos, wellness events lagos, career summit lagos, wellness conference nigeria',
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
          addressRegion: 'Lagos State',
          addressCountry: 'NG',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '6.5244',
          longitude: '3.3792',
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

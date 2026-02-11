export function LocalBusinessSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://unleashed.conference';

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#organization`,
    name: 'Hit Refresh Conference',
    alternateName: 'Unleashed Conference',
    description: 'Premier career and wellness event organizer in Nigeria, focused on professional development and mental wellness.',
    url: siteUrl,
    logo: `${siteUrl}/minimized_HIt Refresh Logo (Full).png`,
    image: `${siteUrl}/opengraph-image`,
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
    areaServed: {
      '@type': 'City',
      name: 'Lagos',
    },
    knowsAbout: [
      'Career Development',
      'Wellness Events',
      'Professional Development',
      'Mental Wellness',
      'Work-Life Balance',
      'Leadership Training',
    ],
    sameAs: [
      'https://twitter.com/balanceunleashd',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  );
}

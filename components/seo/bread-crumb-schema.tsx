export function BreadcrumbSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://unleashed.conference';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Hit Refresh Conference',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Events in Lagos',
        item: siteUrl,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

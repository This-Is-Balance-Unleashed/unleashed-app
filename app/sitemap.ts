import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://unleashed.conference';

  // Ticket type IDs from seed data
  const ticketTypeIds = [
    '00000000-0000-0000-0001-000000000001', // General Admission
    '00000000-0000-0000-0001-000000000002', // VIP
    '00000000-0000-0000-0001-000000000003', // Corporate
    '00000000-0000-0000-0001-000000000004', // Virtual
    '00000000-0000-0000-0001-000000000005', // Corporate VIP
    '00000000-0000-0000-0001-000000000006', // Group Refresh
  ];

  const ticketPages = ticketTypeIds.map((id) => ({
    url: `${baseUrl}/purchase/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/tickets`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/speakers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/partner`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sponsor`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...ticketPages,
  ];
}

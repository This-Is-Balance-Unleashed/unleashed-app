import { Metadata } from 'next';

const ticketTypesMetadata: Record<string, { name: string; description: string; price: string }> = {
  '00000000-0000-0000-0001-000000000001': {
    name: 'General Admission',
    description: 'Access to all sessions + Two Masterclasses + Digital Reflection Workbook',
    price: '₦10,000',
  },
  '00000000-0000-0000-0001-000000000002': {
    name: 'Refresh+ Experience (VIP)',
    description:
      'Everything in General Admission + All Masterclasses + Front-row seating + Wellness Goody Bag',
    price: '₦18,000',
  },
  '00000000-0000-0000-0001-000000000003': {
    name: 'Corporate Refresh Package (8 Members)',
    description: 'Team wellness package for 8 members. Perfect for companies investing in staff wellness and productivity with group discounts available.',
    price: '₦70,000 per package',
  },
  '00000000-0000-0000-0001-000000000004': {
    name: 'Refresh Online (Virtual Pass)',
    description: 'Livestream access + 14-day replay',
    price: '₦6,500',
  },
  '00000000-0000-0000-0001-000000000005': {
    name: 'Corporate Refresh VIP Package (4 Members)',
    description: 'Premium VIP team package for 4 members. Includes front-row seating, all masterclasses, and exclusive wellness goody bags for your team.',
    price: '₦72,000 per package',
  },
  '00000000-0000-0000-0001-000000000006': {
    name: 'Group Refresh Package (6 Members)',
    description: 'Perfect group package for 6 members. Ideal for friend groups, small teams, or family members attending together.',
    price: '₦54,000 per package',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticketTypeId: string }>;
}): Promise<Metadata> {
  const { ticketTypeId } = await params;
  const ticketInfo = ticketTypesMetadata[ticketTypeId];

  if (!ticketInfo) {
    return {
      title: 'Ticket Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://unleashed.conference';

  return {
    title: `${ticketInfo.name} - ${ticketInfo.price}`,
    description: `${ticketInfo.description}. Get your ticket for Hit Refresh: Career + Wellness Summit 2026 in Lagos, Nigeria.`,
    openGraph: {
      title: `${ticketInfo.name} - Hit Refresh Summit 2026`,
      description: ticketInfo.description,
      type: 'website',
      url: `${siteUrl}/purchase/${ticketTypeId}`,
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: `${ticketInfo.name} - Hit Refresh Summit 2026`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${ticketInfo.name} - Hit Refresh Summit 2026`,
      description: ticketInfo.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function PurchaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";
import { Inter_Tight, Young_Serif, DM_Sans } from "next/font/google";
import localFont from "next/font/local"
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  display: "swap",
  subsets: ["latin"],
});

const youngSerif = Young_Serif({
  weight: "400",
  variable: "--font-young-serif",
  display: "swap",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const meloDrama = localFont({
  src: "./fonts/Melodrama-Variable.ttf",
  display: "swap",
  variable: "--font-melo",
  weight: "200, 400, 600, 900"
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://unleashed.conference';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hit Refresh: Career + Wellness Summit 2026 | Lagos, Nigeria",
    template: "%s | Hit Refresh Summit 2026",
  },
  description: "Join Nigeria's premier career and wellness summit on February 28, 2026. Rooted in purpose, insights from industry leaders, and all-round growth for a sustainable and impactful life. Get your tickets now!",
  keywords: [
    "career summit Nigeria",
    "wellness conference Lagos",
    "professional development",
    "mental wellness",
    "career growth",
    "work-life balance",
    "Hit Refresh Summit",
    "Nigeria conference 2026",
    "leadership development",
    "personal growth",
  ],
  authors: [{ name: "Unleashed Conference" }],
  creator: "Unleashed Conference",
  publisher: "Unleashed Conference",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: "Hit Refresh: Career + Wellness Summit 2026",
    title: "Hit Refresh: Career + Wellness Summit 2026 | Lagos, Nigeria",
    description: "Join Nigeria's premier career and wellness summit on February 28, 2026. Transform your career and well-being with insights from industry leaders.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Hit Refresh: Career + Wellness Summit 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hit Refresh: Career + Wellness Summit 2026",
    description: "Join Nigeria's premier career and wellness summit on February 28, 2026 in Lagos.",
    images: ["/opengraph-image"],
    creator: "@balanceunleashd",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification tokens when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interTight.variable} ${meloDrama.variable} ${youngSerif.variable} ${dmSans.variable} antialiased flex min-h-full flex-col`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

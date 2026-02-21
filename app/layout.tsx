import type { Metadata } from "next";
import { Young_Serif, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://unleashed.conference";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hit Refresh Conference 2026 | Career & Wellness Event in Lagos",
    template: "%s | Hit Refresh Conference",
  },
  description:
    "Hit Refresh Conference - Lagos' premier career and wellness event on February 28, 2026. Join industry leaders for a transformative wellness summit in Lagos, Nigeria. Work smarter, live better. Get tickets now!",
  keywords: [
    "hit refresh conference",
    "events in lagos",
    "events in lagos about wellness",
    "wellness conference Lagos",
    "career summit Lagos Nigeria",
    "wellness events Lagos 2026",
    "professional development Lagos",
    "mental wellness events Nigeria",
    "work-life balance conference",
    "Lagos wellness summit",
    "career growth events Lagos",
    "Hit Refresh Summit",
  ],
  alternates: {
    canonical: "/",
  },
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
    siteName: "Hit Refresh Conference",
    title: "Hit Refresh Conference 2026 | Career & Wellness Event in Nigeria",
    description:
      "Join Hit Refresh Conference - A premier wellness event on February 28, 2026. Transform your career and well-being with industry leaders at this wellness summit in Nigeria.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Hit Refresh Conference - Wellness Event in Nigeria 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hit Refresh Conference | Nigeria Wellness Event 2026",
    description:
      "Hit Refresh Conference - February 28, 2026. Join Nigeria's leading career and wellness event.",
    images: ["/opengraph-image"],
    creator: "@balanceunleashd",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
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
        className={`${youngSerif.variable} ${dmSans.variable} antialiased flex min-h-full flex-col`}
        suppressHydrationWarning
      >
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1960375344901383');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1960375344901383&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}

        {/* TikTok Pixel Code */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('D626BKRC77UECCBSN80G');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
        {/* End TikTok Pixel Code */}

        {children}
      </body>
    </html>
  );
}

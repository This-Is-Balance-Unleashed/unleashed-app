import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hit Refresh: Career + Wellness Summit 2026',
    short_name: 'Hit Refresh 2026',
    description:
      "Join Nigeria's premier career and wellness summit on February 28, 2026. Transform your career and well-being.",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#39B54A',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['events', 'business', 'productivity', 'lifestyle'],
    lang: 'en-NG',
    dir: 'ltr',
  };
}

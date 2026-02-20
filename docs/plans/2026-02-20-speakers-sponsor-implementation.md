# Speakers Page + Sponsor Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `/speakers` page with 10 speaker cards (transparent-bg square photos) and a `SponsorsSection` component on the landing page for mytherapist.ng.

**Architecture:** Both features are static — no API or DB needed. The speakers page is a Server Component with a hardcoded data array. The sponsor section is a new `'use client'` component inserted between `ExperienceSection` and the green wave separator in `app/page.tsx`. All images are local (`/public/speakers/` and `/public/Mytherapist.ngLogos/`).

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, `next/image`, `useScrollAnimation` hook (already in project), `font-melo`/`font-sans` design system.

---

### Task 1: Speakers page layout + metadata

**Files:**
- Create: `app/speakers/layout.tsx`

**Step 1: Create the layout file**

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Speakers | Hit Refresh Conference 2026',
  description:
    'Meet the inspiring speakers at Hit Refresh Conference — Lagos\' premier career and wellness summit on February 28, 2026.',
  openGraph: {
    title: 'Speakers | Hit Refresh Conference 2026',
    description:
      'Meet the inspiring speakers at Hit Refresh Conference — Lagos\' premier career and wellness summit on February 28, 2026.',
    url: 'https://hit-refresh.balanceunleashed.org/speakers',
  },
};

export default function SpeakersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

**Step 2: Verify file exists**

```bash
ls app/speakers/layout.tsx
```

---

### Task 2: Speakers page — data + component

**Files:**
- Create: `app/speakers/page.tsx`

**Notes on speaker data:**
- Sodiq Akinjobi: use `Sodiq Akinjobi 1.png` (better resolution than `Sodiq Akinjobi 2.png`)
- Do2dtun has a two-line title — render both lines
- Victoria Omolayo Abah's image file has a comma in the name: `Victoria Omolayo, Abah.png` — the `src` string must match exactly
- All images are in `/public/speakers/` and served as `/speakers/<filename>.png`
- `next/image` handles spaces in paths fine; URL-encode not needed in the `src` prop

**Step 1: Create the page**

```tsx
import Image from 'next/image';
import { Header } from '@/components/ui/event/header';
import { Footer } from '@/components/ui/event/footer';

const speakers = [
  {
    name: 'Sodiq Akinjobi',
    title: 'Developer Ecosystem Community Manager, Google',
    image: '/speakers/Sodiq Akinjobi 1.png',
  },
  {
    name: 'Emmanuel Faith',
    title: 'Founder, HR Clinic',
    image: '/speakers/Emmanuel Faith.png',
  },
  {
    name: 'Yagazie Eguare',
    title: 'Founder & CEO, GazMadu Ltd',
    image: '/speakers/Yagazie Eguare.png',
  },
  {
    name: 'Tolu Adesina',
    title: 'Founder, Zirro',
    image: '/speakers/Tolu Adesina.png',
  },
  {
    name: 'Eyimisan Abusomwan',
    title: 'CEO, Runner',
    image: '/speakers/Eyimisan Abusomwan.png',
  },
  {
    name: 'AA Presley',
    title: 'Storyteller | Multipotentialite | Media Personality',
    image: '/speakers/AA Presley.png',
  },
  {
    name: 'Funto Adesola',
    title: 'Chief Operations Officer, Ennovate Lab',
    image: '/speakers/Funto Adesola.png',
  },
  {
    name: 'Victoria Omolayo Abah',
    title: 'Head, Building Materials / Operations, Panterra Real Estate Group',
    image: '/speakers/Victoria Omolayo, Abah.png',
  },
  {
    name: 'Amber Gauci-Ward',
    title: 'General Manager, Eha',
    image: '/speakers/Amber Gauci-Ward.png',
  },
  {
    name: 'Do2dtun',
    title: 'D O to the T U N aka Energy gAD',
    titleLine2: 'Hypeman, Broadcaster, Label Director',
    image: '/speakers/Do2dtun.png',
  },
] as const;

// Style constants — defined outside component to prevent recreation per render
const heroGradientStyle = {
  background: 'linear-gradient(to bottom, var(--color-primary-light), #f5f1ed)',
} as const;

const noiseTextureStyle = {
  backgroundImage: 'url(/noise.svg)',
  backgroundSize: 'cover',
} as const;

export default function SpeakersPage() {
  return (
    <main>
      {/* Hero header */}
      <section className="relative overflow-hidden" style={heroGradientStyle}>
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={noiseTextureStyle} />
        <Header />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-melo font-semibold mb-4">
            Meet the Speakers
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-xl mx-auto text-gray-700 font-sans">
            Industry leaders, founders, and creatives sharing their stories at Hit Refresh 2026.
          </p>
        </div>
      </section>

      {/* Speakers grid */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 max-w-6xl mx-auto">
            {speakers.map((speaker) => (
              <div key={speaker.name} className="flex flex-col items-center text-center group">
                {/* Square photo with transparent background */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mb-4 rounded-2xl overflow-hidden bg-primary-light/40 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
                  />
                </div>
                <h2 className="text-lg sm:text-xl font-melo font-semibold text-gray-900 mb-1">
                  {speaker.name}
                </h2>
                <p className="text-sm font-sans text-gray-600 leading-relaxed">
                  {speaker.title}
                </p>
                {'titleLine2' in speaker && speaker.titleLine2 && (
                  <p className="text-sm font-sans text-gray-600 leading-relaxed">
                    {speaker.titleLine2}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
```

**Step 2: Run typecheck**

```bash
bun run typecheck 2>&1 | grep -E "error|speakers"
```

Expected: no errors in `app/speakers/`

**Step 3: Commit**

```bash
git add app/speakers/
git commit -m "feat: add speakers page with 10 speaker cards"
```

---

### Task 3: Add Speakers link to header navigation

**Files:**
- Modify: `components/ui/event/header.tsx:9-14`

**Step 1: Add Speakers to the navigation array**

Current:
```ts
const navigation = [
  // { name: 'Home', href: '/' },
  { name: 'Tickets', href: '/tickets' },
  { name: 'Partner', href: '/partner' },
  // { name: 'Sponsor', href: '/sponsor' },
];
```

Updated:
```ts
const navigation = [
  // { name: 'Home', href: '/' },
  { name: 'Speakers', href: '/speakers' },
  { name: 'Tickets', href: '/tickets' },
  { name: 'Partner', href: '/partner' },
  // { name: 'Sponsor', href: '/sponsor' },
];
```

**Step 2: Commit**

```bash
git add components/ui/event/header.tsx
git commit -m "feat: add Speakers link to header navigation"
```

---

### Task 4: Sponsor section component

**Files:**
- Create: `components/ui/event/sponsors-section.tsx`

**Design notes:**
- Background: primary-light gradient + noise texture (matches hero/footer pattern)
- Use `Mytherapist.ng_logo_dark.png` — the section background is light so the dark logo has contrast
- Logo path: `/Mytherapist.ngLogos/Mytherapist.ng_logo_dark.png`
- Wrap in `useScrollAnimation` (same as `ExperienceSection`, `TargetAudienceSection`)
- Flex-wrap row of sponsor cards so more sponsors can be added later

**Step 1: Create the component**

```tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Style constants — outside component to prevent recreation per render
const sectionGradientStyle = {
  background: 'linear-gradient(to bottom, #f5f1ed, var(--color-primary-light))',
} as const;

const noiseTextureStyle = {
  backgroundImage: 'url(/noise.svg)',
  backgroundSize: 'cover',
} as const;

const sponsors = [
  {
    name: 'MyTherapist.ng',
    badge: 'Official Wellness Partner',
    logo: '/Mytherapist.ngLogos/Mytherapist.ng_logo_dark.png',
    href: 'https://mytherapist.ng',
    logoWidth: 180,
    logoHeight: 60,
  },
] as const;

export function SponsorsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-12 sm:py-16"
      style={sectionGradientStyle}
    >
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={noiseTextureStyle} />

      <div className={`relative z-10 container mx-auto px-4 sm:px-6 scroll-fade-in ${isVisible ? 'visible' : ''}`}>
        {/* Section heading */}
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-widest text-gray-500 mb-2">
            Our Partners
          </p>
          <h2 className="text-2xl sm:text-3xl font-melo font-semibold text-gray-900">
            Proudly Supported By
          </h2>
        </div>

        {/* Sponsor logos row */}
        <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16">
          {sponsors.map((sponsor) => (
            <div key={sponsor.name} className="flex flex-col items-center gap-3">
              {/* Badge chip */}
              <span className="inline-block bg-primary/10 text-primary text-xs font-sans font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                {sponsor.badge}
              </span>
              {/* Logo */}
              <Link
                href={sponsor.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block opacity-90 hover:opacity-100 transition-opacity"
                aria-label={`Visit ${sponsor.name}`}
              >
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={sponsor.logoWidth}
                  height={sponsor.logoHeight}
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Run typecheck**

```bash
bun run typecheck 2>&1 | grep -E "error|sponsors"
```

Expected: no errors

**Step 3: Commit**

```bash
git add components/ui/event/sponsors-section.tsx
git commit -m "feat: add SponsorsSection component for mytherapist.ng"
```

---

### Task 5: Wire SponsorsSection into landing page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Add dynamic import at the top of `app/page.tsx` alongside the other dynamic imports**

Add after the `ExperienceSection` dynamic import:
```tsx
const SponsorsSection = dynamic(
  () => import('@/components/ui/event/sponsors-section').then(m => m.SponsorsSection),
  { ssr: true }
);
```

**Step 2: Insert `<SponsorsSection />` between `<ExperienceSection />` and the green wave separator**

Current:
```tsx
<ExperienceSection />

{/* Green wave separator */}
<div className="relative z-50 -mt-12">
```

Updated:
```tsx
<ExperienceSection />
<SponsorsSection />

{/* Green wave separator */}
<div className="relative z-50 -mt-12">
```

**Step 3: Run typecheck**

```bash
bun run typecheck
```

Expected: no errors

**Step 4: Run lint**

```bash
bun run lint
```

Expected: no new lint errors

**Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat: wire SponsorsSection into landing page"
```

---

### Task 6: Final verification

**Step 1: Check build**

```bash
bun run build 2>&1 | tail -20
```

Expected: build succeeds, no type errors, `/speakers` and `/` both appear in the static output.

**Step 2: Verify image files are present**

```bash
ls public/speakers/*.png | wc -l   # should be 13
ls "public/Mytherapist.ngLogos/"    # should include Mytherapist.ng_logo_dark.png
```

**Step 3: Final commit if any loose files**

```bash
git add docs/plans/
git commit -m "docs: add speakers + sponsor implementation plan"
```

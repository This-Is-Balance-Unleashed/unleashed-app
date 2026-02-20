# Speakers Page + Sponsor Section Design

**Date:** 2026-02-20
**Status:** Approved

---

## 1. Speakers Page (`/speakers`)

### Goal
A dedicated page showcasing the 10 confirmed Hit Refresh Conference speakers, styled consistently with the existing site (primary-light gradient, noise texture, font-melo headings, green/orange palette).

### Data
Static array of 10 speakers hardcoded in the component:

| # | Name | Title |
|---|------|-------|
| 1 | Sodiq Akinjobi | Developer Ecosystem Community Manager, Google |
| 2 | Emmanuel Faith | Founder, HR Clinic |
| 3 | Yagazie Eguare | Founder & CEO, GazMadu Ltd |
| 4 | Tolu Adesina | Founder, Zirro |
| 5 | Eyimisan Abusomwan | CEO, Runner |
| 6 | AA Presley | Storyteller \| Multipotentialite \| Media Personality |
| 7 | Funto Adesola | Chief Operations Officer, Ennovate Lab |
| 8 | Victoria Omolayo Abah | Head, Building Materials/Operations, Panterra Real Estate Group |
| 9 | Amber Gauci-Ward | General Manager, Eha |
| 10 | Do2dtun | D O to the T U N aka Energy gAD / Hypeman, Broadcaster, Label Director |

### Images
- Source: `/public/speakers/*.png` (background-removed, square-cropped PNGs)
- HEIC (Ademiju Fakoya) converted via `sips`, then processed
- Sodiq Akinjobi: use `Sodiq Akinjobi 1.jpg` (better quality)

### Layout
- **Page:** `app/speakers/page.tsx` (Server Component, static)
- **Layout:** `app/speakers/layout.tsx` (metadata: title, description, OG)
- **Grid:** 3 cols desktop → 2 tablet → 1 mobile
- **Card:** Rounded square photo + name (font-melo, bold) + title (font-sans, sm, gray-600)
- **Hero header:** Same primary-light gradient + noise texture as hero section
- **Navigation:** Add `{ name: 'Speakers', href: '/speakers' }` to `header.tsx`

### New Files
- `app/speakers/page.tsx`
- `app/speakers/layout.tsx`

### Modified Files
- `components/ui/event/header.tsx` — add Speakers nav link

---

## 2. Sponsor Section (Landing Page)

### Goal
A `SponsorsSection` component on the landing page giving mytherapist.ng ("Official Wellness Partner") proper real estate. Expandable for future sponsors.

### Logo
- Light logo: `/public/Mytherapist.ngLogos/Mytherapist.ng_Logo_light.png`
- Dark logo: `/public/Mytherapist.ngLogos/Mytherapist.ng_logo_dark.png`
- Use **dark logo** (the section background is light)
- Link to: `https://mytherapist.ng`

### Layout
- **Placement:** Between `ExperienceSection` and the wave separator in `app/page.tsx`
- **Background:** `bg-primary-light` gradient + noise texture (matches hero/footer)
- **Structure:**
  - Section heading: "Our Partners"
  - Sponsor row: badge chip "Official Wellness Partner" + logo image + external link
  - Flex-wrap row so additional sponsors can be added later

### New Files
- `components/ui/event/sponsors-section.tsx`

### Modified Files
- `app/page.tsx` — import and insert SponsorsSection + dynamic import

---

## Implementation Order
1. Process speaker images (done ✓)
2. Build `app/speakers/page.tsx` + `layout.tsx`
3. Add Speakers to `header.tsx` nav
4. Build `components/ui/event/sponsors-section.tsx`
5. Wire `SponsorsSection` into `app/page.tsx`

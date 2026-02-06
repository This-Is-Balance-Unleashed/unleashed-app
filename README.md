# Unleashed App (Hit Refresh Conference)

A Next.js web application for the Hit Refresh Conference - The premier career and wellness event scheduled for February 28, 2026.

## About

This is the official event website for Hit Refresh Conference, featuring:
- Event information and registration
- Ticket purchasing system
- Sponsor and partner pages
- QR code generation for tickets
- Supabase integration for data management
- Meta Pixel tracking for analytics

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Runtime**: Bun (preferred) or Node.js >=20.0.0
- **Styling**: Tailwind CSS 4
- **Database**: Supabase
- **UI Components**: Headless UI
- **Fonts**: Young Serif, DM Sans
- **Features**: QR Code generation, SWR for data fetching

## Getting Started

First, install dependencies:

```bash
bun install
```

Then run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint
- `bun test:webhook` - Test webhook functionality
- `bun webhook:capture` - Capture webhook events

## Project Structure

```
├── app/
│   ├── api/           # API routes
│   ├── partner/       # Partner pages
│   ├── sponsor/       # Sponsor pages
│   ├── tickets/       # Ticket management
│   └── purchase/      # Purchase flow
├── components/        # React components
│   ├── ui/           # UI components
│   └── seo/          # SEO components (schemas)
├── lib/              # Utility functions
└── scripts/          # Helper scripts
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SITE_URL=https://unleashed.conference
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Features

- **Event Landing Page**: Hero section, value propositions, experience showcase
- **Ticketing System**: Secure ticket purchasing with QR code generation
- **Partner/Sponsor Pages**: Dedicated pages for event partners and sponsors
- **SEO Optimization**: Comprehensive schema markup for events, FAQs, and local business
- **Analytics**: Meta Pixel integration for tracking
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## License

Private - All rights reserved

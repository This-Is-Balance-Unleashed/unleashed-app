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

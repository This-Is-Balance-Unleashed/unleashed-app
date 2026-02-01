import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Theme colors matching globals.css
const THEME_COLORS = {
  primary: '#FFA500',      // Orange - oklch(68% 0.18 50)
  secondary: '#39B54A',    // Green - oklch(68% 0.15 155)
  black: '#000000',        // Black
  white: '#FFFFFF',        // White
  background: '#0A0A0A',   // Dark background for contrast
  textMuted: '#A1A1A1',    // Muted text
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Career + Wellness Summit';
    const subtitle = searchParams.get('subtitle') || 'UNLEASHED';
    const date = searchParams.get('date') || '2025';
    const location = searchParams.get('location') || 'HYBRID EVENT';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: THEME_COLORS.background,
            padding: '60px 80px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Left side - Text content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              width: '50%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: THEME_COLORS.primary,
                  marginRight: '12px',
                  display: 'flex',
                }}
              />
              <div
                style={{
                  color: THEME_COLORS.white,
                  fontSize: '20px',
                  fontWeight: '400',
                  letterSpacing: '0.5px',
                  display: 'flex',
                }}
              >
                UNLEASHED.CONFERENCE
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '50px',
              }}
            >
              <div
                style={{
                  fontSize: '72px',
                  fontWeight: '700',
                  color: THEME_COLORS.secondary,
                  lineHeight: '1',
                  marginBottom: '10px',
                  display: 'flex',
                }}
              >
                {subtitle}
              </div>
              <div
                style={{
                  fontSize: '56px',
                  fontWeight: '700',
                  background: `linear-gradient(135deg, ${THEME_COLORS.primary} 0%, ${THEME_COLORS.secondary} 100%)`,
                  backgroundClip: 'text',
                  color: 'transparent',
                  lineHeight: '1.1',
                  display: 'flex',
                }}
              >
                {title}
              </div>
            </div>

            <div
              style={{
                color: THEME_COLORS.textMuted,
                fontSize: '24px',
                fontWeight: '400',
                letterSpacing: '0.5px',
                fontFamily: 'monospace',
                display: 'flex',
              }}
            >
              {date} | {location}
            </div>
          </div>

          {/* Right side - Shader pattern */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              width: '45%',
              height: '100%',
              background: `linear-gradient(135deg, ${THEME_COLORS.primary}19 0%, ${THEME_COLORS.secondary}19 100%)`, // 19 = 10% opacity in hex
            }}
          >
            {/* Generate checkered pattern blocks */}
            {Array.from({ length: 48 }).map((_, index) => {
              const row = Math.floor(index / 6);
              const col = index % 6;
              const isOrange = (row + col) % 3 === 0;
              const isGreen = (row + col) % 3 === 1;
              const isDotted = (row + col) % 2 === 0;

              return (
                <div
                  key={index}
                  style={{
                    width: '16.666%',
                    height: '12.5%',
                    backgroundColor: isOrange
                      ? THEME_COLORS.primary
                      : isGreen
                      ? THEME_COLORS.secondary
                      : THEME_COLORS.white,
                    opacity: isDotted ? 0.9 : 0.3,
                    display: 'flex',
                  }}
                />
              );
            })}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    return new Response('Failed to generate the image', { status: 500, ...e as unknown[] });
  }
}

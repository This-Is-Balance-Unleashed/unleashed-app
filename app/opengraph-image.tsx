import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Career + Wellness Summit - Unleashed';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
          backgroundColor: '#1a1a1a',
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
                backgroundColor: '#7C3AED',
                marginRight: '12px',
              }}
            />
            <div
              style={{
                color: '#fff',
                fontSize: '20px',
                fontWeight: '400',
                letterSpacing: '0.5px',
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
                fontSize: '80px',
                fontWeight: '700',
                color: '#fff',
                lineHeight: '0.9',
                marginBottom: '20px',
              }}
            >
              Career +
            </div>
            <div
              style={{
                fontSize: '80px',
                fontWeight: '700',
                color: '#fff',
                lineHeight: '0.9',
                marginBottom: '20px',
              }}
            >
              Wellness
            </div>
            <div
              style={{
                fontSize: '80px',
                fontWeight: '700',
                background: 'linear-gradient(90deg, #7C3AED 0%, #14B8A6 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                lineHeight: '0.9',
              }}
            >
              Summit
            </div>
          </div>

          <div
            style={{
              color: '#a1a1a1',
              fontSize: '24px',
              fontWeight: '400',
              letterSpacing: '0.5px',
              fontFamily: 'monospace',
            }}
          >
            28th February 2026 | LAGOS, NIGERIA
          </div>
        </div>

        {/* Right side - Shader pattern */}
        <div
          style={{
            display: 'flex',
            width: '45%',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* Create a grid pattern with shader effect */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              width: '100%',
              height: '100%',
              gap: '0',
            }}
          >
            {/* Generate checkered pattern blocks */}
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 6 }).map((_, col) => {
                const index = row * 6 + col;
                const isPurple = (row + col) % 3 === 0;
                const isTeal = (row + col) % 3 === 1;
                const isDotted = (row + col) % 2 === 0;

                return (
                  <div
                    key={`${row}-${col}`}
                    style={{
                      width: '16.666%',
                      height: '12.5%',
                      backgroundColor: isPurple
                        ? '#7C3AED'
                        : isTeal
                        ? '#14B8A6'
                        : '#fff',
                      opacity: isDotted ? 0.9 : 0.3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Add dots for checkered effect */}
                    {isDotted && (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '2px',
                          width: '100%',
                          height: '100%',
                          padding: '4px',
                        }}
                      >
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div
                            key={i}
                            style={{
                              width: '3px',
                              height: '3px',
                              backgroundColor: isPurple
                                ? '#fff'
                                : isTeal
                                ? '#1a1a1a'
                                : '#7C3AED',
                              opacity: Math.random() > 0.5 ? 1 : 0.3,
                              borderRadius: '50%',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Overlay gradient for depth */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(20, 184, 166, 0.3) 100%)',
              mixBlendMode: 'overlay',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

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
          backgroundColor: '#f5f1ed',
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
                backgroundColor: '#FF8E00',
                marginRight: '12px',
                borderRadius: '50%',
              }}
            />
            <div
              style={{
                color: '#1a1a1a',
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
                color: '#1a1a1a',
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
                color: '#1a1a1a',
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
                background: 'linear-gradient(90deg, #FF8E00 0%, #39B54A 100%)',
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
              color: '#6b6b6b',
              fontSize: '24px',
              fontWeight: '400',
              letterSpacing: '0.5px',
              fontFamily: 'monospace',
            }}
          >
            28th February 2026 | LAGOS, NIGERIA
          </div>
        </div>

        {/* Right side - Decorative pattern */}
        <div
          style={{
            display: 'flex',
            width: '45%',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* Checkered pattern with brand colors */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              width: '100%',
              height: '100%',
              gap: '0',
            }}
          >
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 6 }).map((_, col) => {
                const isOrange = (row + col) % 3 === 0;
                const isGreen = (row + col) % 3 === 1;
                const isDotted = (row + col) % 2 === 0;

                return (
                  <div
                    key={`${row}-${col}`}
                    style={{
                      width: '16.666%',
                      height: '12.5%',
                      backgroundColor: isOrange
                        ? '#FF8E00'
                        : isGreen
                        ? '#39B54A'
                        : '#e8e2da',
                      opacity: isDotted ? 0.9 : 0.3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
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
                              backgroundColor: isOrange
                                ? '#fff'
                                : isGreen
                                ? '#f5f1ed'
                                : '#FF8E00',
                              opacity: i % 2 === 0 ? 1 : 0.3,
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
                'linear-gradient(135deg, rgba(255, 142, 0, 0.2) 0%, rgba(57, 181, 74, 0.2) 100%)',
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

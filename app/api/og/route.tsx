import { ImageResponse } from 'next/og';

export const runtime = 'edge';

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
                  display: 'flex',
                }}
              />
              <div
                style={{
                  color: '#fff',
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
                  color: '#fff',
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
                  background: 'linear-gradient(90deg, #7C3AED 0%, #14B8A6 100%)',
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
                color: '#a1a1a1',
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
              background:
                'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)',
            }}
          >
            {/* Generate checkered pattern blocks */}
            {Array.from({ length: 48 }).map((_, index) => {
              const row = Math.floor(index / 6);
              const col = index % 6;
              const isPurple = (row + col) % 3 === 0;
              const isTeal = (row + col) % 3 === 1;
              const isDotted = (row + col) % 2 === 0;

              return (
                <div
                  key={index}
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
    return new Response('Failed to generate the image', { status: 500 });
  }
}

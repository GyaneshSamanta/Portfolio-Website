import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Gyanesh Samanta — Product Manager';
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #15173D 0%, #982598 50%, #15173D 100%)',
          fontFamily: '"Inter", system-ui, sans-serif',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(228, 145, 201, 0.15)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(152, 37, 152, 0.2)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              letterSpacing: '-0.05em',
              lineHeight: 0.9,
              color: '#F1E9E9',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <span>Gyanesh</span>
            <span>Samanta</span>
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: '#E491C9',
              textAlign: 'center',
              display: 'flex',
              marginBottom: 16,
            }}
          >
            Product Manager
          </div>

          <div
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: 'rgba(241, 233, 233, 0.7)',
              textAlign: 'center',
              display: 'flex',
              maxWidth: 500,
            }}
          >
            Data, AI & Consumer Behaviour
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            fontSize: 14,
            color: 'rgba(228, 145, 201, 0.6)',
          }}
        >
          <span>gyane.sh</span>
          <span style={{ color: '#982598' }}>●</span>
          <span>linkedin.com/in/gyanesh-samanta</span>
          <span style={{ color: '#982598' }}>●</span>
          <span>github.com/GyaneshSamanta</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

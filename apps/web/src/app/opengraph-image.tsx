import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'TubePilot AI - YouTube SEO, Audit & AI Growth Suite';
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
          background: 'linear-gradient(135deg, #090A0F 0%, #151824 50%, #000000 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Glow ambient background */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '20%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.25)',
            filter: 'blur(120px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '20%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(147, 51, 234, 0.25)',
            filter: 'blur(120px)',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '9999px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            color: '#FB7185',
            fontSize: 18,
            fontWeight: 700,
            marginBottom: '24px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          YouTube SEO, Audit & AI Growth Platform
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 72,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-2px',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          TubePilot <span style={{ color: '#F43F5E', marginLeft: '16px' }}>AI</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 26,
            color: '#9CA3AF',
            textAlign: 'center',
            maxWidth: '850px',
            lineHeight: 1.4,
            marginBottom: '40px',
          }}
        >
          Autonomous YouTube AI Copilot powered by Multimodal AI Vision, Comment Copilot & Telegram Companion Workflows
        </div>

        {/* Feature Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              padding: '10px 22px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#E5E7EB',
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            📊 Real-Time VPH Velocity
          </div>
          <div
            style={{
              padding: '10px 22px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#E5E7EB',
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            🎯 Thumbnail CTR Predictor
          </div>
          <div
            style={{
              padding: '10px 22px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#E5E7EB',
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            🤖 Multilingual Copilot
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

import { ImageResponse } from 'next/og';

/**
 * Static Open Graph image at /opengraph-image (Next App Router convention).
 * Applies site-wide via the root layout; picked up automatically as
 * og:image / twitter:image thanks to metadataBase in app/layout.tsx.
 *
 * Deliberately self-contained: OG renderers never see the app's CSS, so the
 * brand colors are hardcoded here (dark #0a0a0a canvas, violet accent) - the
 * one place in the app where hex values are acceptable.
 */
export const alt = 'Gremorie - the AI-native design system';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        backgroundImage:
          'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(139, 92, 246, 0.18), transparent 70%)',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Violet keyline chip above the wordmark - quiet brand accent. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 9999,
            backgroundColor: '#8b5cf6',
          }}
        />
        <div
          style={{
            fontSize: 28,
            color: '#a1a1aa',
            letterSpacing: 6,
            textTransform: 'uppercase',
          }}
        >
          Design System
        </div>
      </div>

      <div
        style={{
          fontSize: 160,
          fontWeight: 700,
          color: '#fafafa',
          letterSpacing: -6,
          lineHeight: 1,
        }}
      >
        Gremorie
      </div>

      <div
        style={{
          marginTop: 36,
          fontSize: 38,
          color: '#a1a1aa',
          textAlign: 'center',
        }}
      >
        The production design system for React and Angular
      </div>

      {/* Thin violet baseline anchors the composition. */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 8,
          backgroundColor: '#7c3aed',
        }}
      />
    </div>,
    size,
  );
}

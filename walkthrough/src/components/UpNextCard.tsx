/**
 * UpNextCard — "What's coming next" between sections.
 * Shows for 2.5 seconds between each TitleCard and the next section.
 */
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

interface UpNextCardProps {
  nextTitle: string;
  nextDesc: string;
  nextNumber: string;
}

export const UpNextCard: React.FC<UpNextCardProps> = ({nextTitle, nextDesc, nextNumber}) => {
  const frame = useCurrentFrame();
  const totalFrames = 75; // 2.5s at 30fps

  const opacity = interpolate(
    frame,
    [0, 12, totalFrames - 12, totalFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const y = interpolate(frame, [0, 18], [30, 0], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity,
    }}>
      <div style={{transform: `translateY(${y}px)`, textAlign: 'center', maxWidth: 800}}>
        {/* "UP NEXT" label */}
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#525252',
          letterSpacing: 4,
          textTransform: 'uppercase',
          fontFamily: 'system-ui, sans-serif',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}>
          <span style={{flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)'}} />
          UP NEXT
          <span style={{flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)'}} />
        </div>

        {/* Section number */}
        <div style={{
          fontSize: 13,
          fontWeight: 400,
          color: '#6f6f6f',
          letterSpacing: 2,
          fontFamily: 'system-ui, sans-serif',
          marginBottom: 12,
        }}>
          SECTION {nextNumber}
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 64,
          fontWeight: 700,
          color: '#ffffff',
          margin: 0,
          marginBottom: 16,
          fontFamily: 'system-ui, sans-serif',
          letterSpacing: -1,
        }}>
          {nextTitle}
        </h2>

        {/* Description */}
        <p style={{
          fontSize: 20,
          fontWeight: 300,
          color: '#8d8d8d',
          margin: 0,
          fontFamily: 'system-ui, sans-serif',
          lineHeight: 1.5,
        }}>
          {nextDesc}
        </p>

        {/* Arrow indicator */}
        <div style={{
          marginTop: 40,
          fontSize: 24,
          color: '#0f62fe',
          fontWeight: 300,
        }}>
          ↓
        </div>
      </div>
    </AbsoluteFill>
  );
};

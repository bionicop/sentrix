/**
 * OutroCard — Closing card. Radial burst lines, individually staggered tech pills,
 * pulsing glow, scan line, animated "thank you" counter.
 */
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const OutroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const fadeIn  = interpolate(frame, [0, 18], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], {extrapolateLeft: 'clamp'});
  const opacity = Math.min(fadeIn, fadeOut);

  const sp = (delay: number) =>
    spring({frame: frame - delay, fps, config: {damping: 20, stiffness: 65, mass: 0.6}});

  const s0 = sp(8);
  const s1 = sp(20);
  const s2 = sp(34);

  const tech = ['Go 1.24', 'React 19', 'TypeScript', 'IBM Carbon', 'PostgreSQL', 'Kafka', 'Docker'];

  // Expanding ring
  const ringScale   = interpolate(frame, [0, 100], [0.05, 2.4], {extrapolateRight: 'clamp'});
  const ringOpacity = interpolate(frame, [0, 25, 85, 110], [0, 0.16, 0.05, 0], {extrapolateRight: 'clamp'});
  const ring2Scale   = interpolate(frame, [20, 110], [0.05, 2.0], {extrapolateRight: 'clamp'});
  const ring2Opacity = interpolate(frame, [20, 45, 95, 115], [0, 0.12, 0.04, 0], {extrapolateRight: 'clamp'});

  // Scan line (top → bottom, frames 5-50)
  const scanY  = interpolate(frame, [5, 50], [-10, 1090], {extrapolateRight: 'clamp'});
  const scanOp = interpolate(frame, [5, 10, 46, 50], [0, 1, 1, 0], {extrapolateRight: 'clamp'});

  // Pulsing glow
  const pulse = Math.sin(frame * 0.11) * 0.4 + 0.6;

  // Divider
  const lineWidth = interpolate(frame, [20, 60], [0, 500], {extrapolateRight: 'clamp'});

  // Letter-spacing spring for "Sentrix"
  const s1Raw = spring({frame: frame - 20, fps, config: {damping: 14, stiffness: 80, mass: 0.6}});
  const letterSpacing = interpolate(s1Raw, [0, 1], [16, -3]);

  return (
    <AbsoluteFill style={{
      background: 'radial-gradient(ellipse at 72% 50%, #050d1f 0%, #080808 65%)',
      opacity,
      overflow: 'hidden',
    }}>
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(15,98,254,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15,98,254,0.03) 1px, transparent 1px)',
        backgroundSize: '100px 100px',
      }} />

      {/* Expanding rings — centred right side */}
      <div style={{
        position: 'absolute', right: '22%', top: '50%',
        width: 480, height: 480, borderRadius: '50%',
        border: '1px solid #0f62fe',
        opacity: ringOpacity,
        transform: `translate(50%, -50%) scale(${ringScale})`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: '22%', top: '50%',
        width: 480, height: 480, borderRadius: '50%',
        border: '1px solid #6929c4',
        opacity: ring2Opacity,
        transform: `translate(50%, -50%) scale(${ring2Scale})`,
        pointerEvents: 'none',
      }} />

      {/* Pulsing glow orb */}
      <div style={{
        position: 'absolute', right: '14%', top: '40%',
        width: 700, height: 700, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(15,98,254,${0.06 * pulse}) 0%, transparent 68%)`,
        transform: 'translate(50%, -50%)',
        pointerEvents: 'none',
      }} />

      {/* Scan line */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: scanY, height: 2,
        background: 'linear-gradient(90deg, transparent, rgba(15,98,254,0.7) 50%, transparent)',
        opacity: scanOp, filter: 'blur(1px)',
        pointerEvents: 'none',
      }} />

      {/* Content — right-aligned */}
      <div style={{
        position: 'absolute', right: 150, top: '50%', transform: 'translateY(-50%)',
        textAlign: 'right', zIndex: 1, maxWidth: 780,
      }}>

        {/* End tag */}
        <div style={{
          opacity: s0, transform: `translateY(${(1 - s0) * 16}px)`,
          display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end',
          marginBottom: 20,
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: '#42be65',
            letterSpacing: 3, textTransform: 'uppercase',
            fontFamily: 'system-ui, sans-serif',
          }}>End of Walkthrough</span>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', backgroundColor: '#42be65',
            boxShadow: '0 0 8px #42be65',
            display: 'inline-block',
          }} />
        </div>

        {/* Brand */}
        <h1 style={{
          opacity: s1Raw,
          transform: `translateY(${(1 - s1Raw) * 28}px) scale(${0.96 + s1Raw * 0.04})`,
          fontSize: 120, fontWeight: 800, color: '#ffffff',
          margin: 0, marginBottom: 20, letterSpacing,
          fontFamily: 'system-ui, sans-serif', lineHeight: 0.95,
        }}>
          Sentrix
        </h1>

        {/* Divider */}
        <div style={{
          height: 2, marginBottom: 22, marginLeft: 'auto',
          width: lineWidth,
          background: 'linear-gradient(90deg, transparent, #6929c4, #0f62fe)',
          borderRadius: 1,
        }} />

        {/* Subtitle */}
        <p style={{
          opacity: s2, transform: `translateY(${(1 - s2) * 18}px)`,
          fontSize: 20, fontWeight: 300, color: '#8a8a8a',
          margin: 0, marginBottom: 40,
          fontFamily: 'system-ui, sans-serif', lineHeight: 1.65,
        }}>
          AI-Powered Network Operations Center.<br />
          Built for reliability, observability, and scale.
        </p>

        {/* Tech pills — each individually staggered */}
        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end',
        }}>
          {tech.map((t, i) => {
            const ts = spring({
              frame: frame - (50 + i * 8),
              fps,
              config: {damping: 18, stiffness: 80, mass: 0.5},
            });
            return (
              <div key={i} style={{
                opacity: ts,
                transform: `translateY(${(1 - ts) * 14}px) scale(${0.88 + ts * 0.12})`,
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 3, padding: '7px 16px',
                fontSize: 12, fontWeight: 500, color: '#c0c0c0',
                fontFamily: 'system-ui, sans-serif',
              }}>
                {t}
              </div>
            );
          })}
        </div>
      </div>

      {/* Left-side vertical text */}
      <div style={{
        position: 'absolute', left: 60, top: '50%',
        transform: 'translateY(-50%) rotate(-90deg)',
        opacity: interpolate(s2, [0, 1], [0, 0.14]),
        fontSize: 11, fontWeight: 600, color: '#ffffff',
        letterSpacing: 6, fontFamily: 'system-ui, sans-serif',
        whiteSpace: 'nowrap',
      }}>
        SENTRIX · NETWORK OPS · AI POWERED
      </div>
    </AbsoluteFill>
  );
};

/**
 * IntroCard — Cinematic opener. Expanding rings, scan line, letter-spacing spring,
 * pulsing glow orbs, animated counter badge.
 */
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const IntroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const fadeIn  = interpolate(frame, [0, 18], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], {extrapolateLeft: 'clamp'});
  const opacity = Math.min(fadeIn, fadeOut);

  // Content springs
  const s0 = spring({frame: frame - 8,  fps, config: {damping: 18, stiffness: 65, mass: 0.7}});
  const s1 = spring({frame: frame - 20, fps, config: {damping: 14, stiffness: 80, mass: 0.6}}); // punchy title
  const s2 = spring({frame: frame - 34, fps, config: {damping: 20, stiffness: 60, mass: 0.8}});
  const s3 = spring({frame: frame - 50, fps, config: {damping: 20, stiffness: 60, mass: 0.8}});

  // Expanding rings — 3 rings with phase offsets
  const ring1Scale   = interpolate(frame, [0, 100], [0.1, 2.2], {extrapolateRight: 'clamp'});
  const ring1Opacity = interpolate(frame, [0, 20, 80, 110], [0, 0.18, 0.06, 0], {extrapolateRight: 'clamp'});
  const ring2Scale   = interpolate(frame, [15, 115], [0.1, 2.2], {extrapolateRight: 'clamp'});
  const ring2Opacity = interpolate(frame, [15, 35, 95, 115], [0, 0.14, 0.04, 0], {extrapolateRight: 'clamp'});
  const ring3Scale   = interpolate(frame, [30, 120], [0.1, 2.0], {extrapolateRight: 'clamp'});
  const ring3Opacity = interpolate(frame, [30, 50, 100, 120], [0, 0.10, 0.03, 0], {extrapolateRight: 'clamp'});

  // Scan line sweeps top → bottom once (frames 5–55)
  const scanY   = interpolate(frame, [5, 55], [-10, 1090], {extrapolateRight: 'clamp'});
  const scanOp  = interpolate(frame, [5, 10, 50, 55], [0, 1, 1, 0], {extrapolateRight: 'clamp'});

  // Divider line grows
  const lineWidth = interpolate(frame, [22, 65], [0, 520], {extrapolateRight: 'clamp'});

  // "Sentrix" letter spacing springs from wide → normal
  const letterSpacing = interpolate(s1, [0, 1], [18, -4]);

  // Pulsing glow orb
  const glowPulse = Math.sin(frame * 0.10) * 0.4 + 0.6;

  // Badge counter animates 0 → 22
  const counter = Math.round(interpolate(frame, [50, 90], [0, 22], {extrapolateRight: 'clamp'}));

  return (
    <AbsoluteFill style={{
      background: 'radial-gradient(ellipse at 28% 50%, #050d1f 0%, #080808 65%)',
      opacity,
      overflow: 'hidden',
    }}>
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(15,98,254,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,98,254,0.035) 1px, transparent 1px)',
        backgroundSize: '100px 100px',
      }} />

      {/* Expanding rings (centred left of frame) */}
      {[
        {scale: ring1Scale, op: ring1Opacity},
        {scale: ring2Scale, op: ring2Opacity},
        {scale: ring3Scale, op: ring3Opacity},
      ].map((r, i) => (
        <div key={i} style={{
          position: 'absolute', left: '27%', top: '50%',
          width: 480, height: 480, borderRadius: '50%',
          border: '1px solid #0f62fe',
          opacity: r.op,
          transform: `translate(-50%, -50%) scale(${r.scale})`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Pulsing glow orb */}
      <div style={{
        position: 'absolute', left: '22%', top: '40%',
        width: 700, height: 700, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(15,98,254,${0.06 * glowPulse}) 0%, transparent 68%)`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      {/* Scan line */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: scanY, height: 2,
        background: 'linear-gradient(90deg, transparent 0%, rgba(15,98,254,0.6) 40%, rgba(15,98,254,0.8) 50%, rgba(15,98,254,0.6) 60%, transparent 100%)',
        opacity: scanOp,
        filter: 'blur(1px)',
        pointerEvents: 'none',
      }} />

      {/* Content — left-aligned */}
      <div style={{
        position: 'absolute', left: 160, top: '50%', transform: 'translateY(-50%)',
        zIndex: 1,
      }}>
        {/* Eyebrow */}
        <div style={{
          opacity: s0, transform: `translateY(${(1 - s0) * 18}px)`,
          fontSize: 11, fontWeight: 700, color: '#0f62fe',
          letterSpacing: 3.5, textTransform: 'uppercase',
          fontFamily: 'system-ui, sans-serif', marginBottom: 22,
        }}>
          IBM Carbon · Go · React 19 · TypeScript
        </div>

        {/* Brand — letter-spacing spring + scale overshoot */}
        <h1 style={{
          opacity: s1,
          transform: `translateY(${(1 - s1) * 30}px) scale(${0.96 + s1 * 0.04})`,
          fontSize: 132, fontWeight: 800, color: '#ffffff',
          margin: 0, letterSpacing, fontFamily: 'system-ui, sans-serif', lineHeight: 0.93,
        }}>
          Sentrix
        </h1>

        {/* Divider */}
        <div style={{
          width: lineWidth, height: 2, margin: '26px 0',
          background: 'linear-gradient(90deg, #0f62fe, #6929c4, transparent)',
          borderRadius: 1,
        }} />

        {/* Subtitle */}
        <p style={{
          opacity: s2, transform: `translateY(${(1 - s2) * 18}px)`,
          fontSize: 28, fontWeight: 300, color: '#a0a0a0',
          margin: 0, marginBottom: 44,
          fontFamily: 'system-ui, sans-serif', lineHeight: 1.45,
        }}>
          AI-Powered Network Operations Center
        </p>

        {/* Animated badge */}
        <div style={{
          opacity: s3, transform: `translateY(${(1 - s3) * 14}px)`,
          display: 'inline-flex', alignItems: 'center', gap: 12,
          backgroundColor: 'rgba(15,98,254,0.10)',
          border: '1px solid rgba(15,98,254,0.30)',
          borderRadius: 4, padding: '10px 24px',
          boxShadow: `0 0 24px rgba(15,98,254,${0.12 * glowPulse})`,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', backgroundColor: '#42be65',
            boxShadow: '0 0 8px #42be65',
          }} />
          <span style={{
            fontSize: 14, fontWeight: 600, color: '#d0d0d0',
            fontFamily: 'system-ui, sans-serif', letterSpacing: 0.5,
          }}>
            Feature Walkthrough · {counter} Sections
          </span>
        </div>
      </div>

      {/* Right-side decorative vertical text */}
      <div style={{
        position: 'absolute', right: 60, top: '50%',
        transform: 'translateY(-50%) rotate(90deg)',
        opacity: interpolate(s2, [0, 1], [0, 0.15]),
        fontSize: 11, fontWeight: 600, color: '#ffffff',
        letterSpacing: 6, fontFamily: 'system-ui, sans-serif',
        whiteSpace: 'nowrap',
      }}>
        NETWORK OPERATIONS · AI · OBSERVABILITY
      </div>
    </AbsoluteFill>
  );
};

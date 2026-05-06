/**
 * SectionIntroCard — Cinematic two-column layout. Full-frame, zero whitespace waste.
 * Crazy animations: pulsing glow bar, sweep line, per-metric stagger+scale,
 * drifting watermark, diagonal accent slash, oscillating ring.
 */
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

interface Metric { label: string; value: string; highlight?: boolean; }

interface SectionIntroCardProps {
  number: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  metrics: Metric[];
  sectionIndex: number;
  totalSections: number;
}

const sp = (frame: number, fps: number, delay: number, stiff = 90, damp = 20) =>
  spring({frame: frame - delay, fps, config: {damping: damp, stiffness: stiff, mass: 0.45}});

export const SectionIntroCard: React.FC<SectionIntroCardProps> = ({
  number, title, description, category, categoryColor, metrics, sectionIndex, totalSections,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Global fade
  const fadeIn  = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {extrapolateLeft: 'clamp'});
  const opacity = Math.min(fadeIn, fadeOut);

  // Left col stagger
  const s0 = sp(frame, fps, 3);   // category tag
  const s1 = sp(frame, fps, 8);   // section label
  const s2 = sp(frame, fps, 14, 100, 18);  // title — punchy overshoot
  const s3 = sp(frame, fps, 24);  // description

  // Divider sweep
  const divider = interpolate(frame, [12, 38], [0, 1], {extrapolateRight: 'clamp'});

  // Sweep light — a bright shimmer that travels left→right over the divider
  const sweepX = interpolate(frame, [12, 50], [-200, 1100], {extrapolateRight: 'clamp'});

  // Per-metric card stagger (each comes from below + scales in)
  const m0 = sp(frame, fps, 20, 110, 16);
  const m1 = sp(frame, fps, 27, 110, 16);
  const m2 = sp(frame, fps, 34, 110, 16);
  const m3 = sp(frame, fps, 41, 110, 16);
  const mSprings = [m0, m1, m2, m3];

  // Progress strip
  const s5 = sp(frame, fps, 48);

  // Pulsing glow on accent bar
  const pulse = Math.sin(frame * 0.14) * 0.45 + 0.55;

  // Watermark: slow upward drift + tiny rotation
  const wmDrift = frame * 0.18;
  const wmRot   = frame * 0.015;

  // Expanding ring in the right column background
  const ringScale = interpolate(frame, [0, 120], [0.3, 1.8], {extrapolateRight: 'clamp'});
  const ringOpacity = interpolate(frame, [0, 30, 100, 120], [0, 0.12, 0.07, 0], {extrapolateRight: 'clamp'});

  const pct = Math.round(((sectionIndex + 1) / totalSections) * 100);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(148deg, #080808 0%, #0e1520 50%, #0a0a0a 100%)`,
      opacity,
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden',
    }}>
      {/* Pulsing accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 5,
        backgroundColor: categoryColor,
        boxShadow: `0 0 ${20 + pulse * 40}px ${categoryColor}${Math.round(pulse * 180).toString(16).padStart(2,'0')}`,
      }} />

      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
        pointerEvents: 'none',
      }} />

      {/* Left column radial glow behind text */}
      <div style={{
        position: 'absolute', left: '8%', top: '50%', transform: 'translateY(-50%)',
        width: 700, height: 700, borderRadius: '50%',
        background: `radial-gradient(circle, ${categoryColor}08 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Diagonal slash accent — separates columns with style */}
      <div style={{
        position: 'absolute',
        left: '53%', top: 0, bottom: 0,
        width: 80,
        background: `linear-gradient(90deg, transparent 0%, ${categoryColor}06 40%, transparent 100%)`,
        transform: 'skewX(-3deg)',
        pointerEvents: 'none',
      }} />

      {/* ── LEFT COLUMN (55%) ── */}
      <div style={{
        flex: '0 0 55%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        paddingLeft: 96, paddingRight: 56,
        paddingTop: 56, paddingBottom: 56,
        zIndex: 1, position: 'relative',
      }}>

        {/* Category tag */}
        <div style={{
          opacity: s0, transform: `translateY(${(1 - s0) * 18}px)`,
          display: 'inline-flex', alignItems: 'center', gap: 7, alignSelf: 'flex-start',
          backgroundColor: `${categoryColor}14`,
          border: `1px solid ${categoryColor}35`,
          borderRadius: 3, padding: '5px 13px', marginBottom: 14,
        }}>
          <span style={{width: 5, height: 5, borderRadius: '50%', backgroundColor: categoryColor,
            boxShadow: `0 0 6px ${categoryColor}`}} />
          <span style={{
            fontSize: 10, fontWeight: 700, color: categoryColor,
            letterSpacing: 2.5, textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif',
          }}>{category}</span>
        </div>

        {/* Section number */}
        <div style={{
          opacity: s1 * 0.38, transform: `translateY(${(1 - s1) * 12}px)`,
          fontSize: 11, fontWeight: 500, color: '#5a5a5a',
          letterSpacing: 3.5, fontFamily: 'system-ui, sans-serif', marginBottom: 7,
        }}>
          SECTION {number}
        </div>

        {/* Title — punchy spring overshoot */}
        <h1 style={{
          opacity: s2,
          transform: `translateY(${(1 - s2) * 22}px) scale(${0.97 + s2 * 0.03})`,
          fontSize: 78, fontWeight: 700, color: '#ffffff',
          margin: 0, marginBottom: 18, letterSpacing: -2,
          fontFamily: 'system-ui, sans-serif', lineHeight: 1.03,
        }}>
          {title}
        </h1>

        {/* Divider + sweep shimmer */}
        <div style={{position: 'relative', marginBottom: 18, height: 2}}>
          <div style={{
            width: `${divider * 100}%`, height: '100%',
            backgroundColor: `${categoryColor}40`, borderRadius: 1,
          }} />
          {/* Shimmer sweep */}
          <div style={{
            position: 'absolute', top: -2, left: sweepX,
            width: 120, height: 6,
            background: `linear-gradient(90deg, transparent, ${categoryColor}cc, transparent)`,
            borderRadius: 3,
            filter: 'blur(2px)',
          }} />
        </div>

        {/* Description */}
        <p style={{
          opacity: s3, transform: `translateY(${(1 - s3) * 14}px)`,
          fontSize: 19, fontWeight: 300, color: '#9e9e9e',
          margin: 0, fontFamily: 'system-ui, sans-serif',
          lineHeight: 1.7, maxWidth: 680,
        }}>
          {description}
        </p>
      </div>

      {/* ── RIGHT COLUMN (45%) ── */}
      <div style={{
        flex: '0 0 45%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        paddingRight: 96, paddingLeft: 36,
        paddingTop: 56, paddingBottom: 56,
        zIndex: 1, position: 'relative',
      }}>

        {/* Expanding ring decoration */}
        <div style={{
          position: 'absolute', right: '30%', top: '40%',
          width: 500, height: 500,
          borderRadius: '50%',
          border: `1px solid ${categoryColor}`,
          opacity: ringOpacity,
          transform: `translate(50%, -50%) scale(${ringScale})`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: '30%', top: '40%',
          width: 320, height: 320,
          borderRadius: '50%',
          border: `1px solid ${categoryColor}`,
          opacity: ringOpacity * 1.4,
          transform: `translate(50%, -50%) scale(${ringScale * 0.7})`,
          pointerEvents: 'none',
        }} />

        {/* Watermark number — drifts up slowly */}
        <div style={{
          position: 'absolute', right: 50, top: '50%',
          transform: `translateY(calc(-50% - ${wmDrift}px)) rotate(${wmRot}deg)`,
          fontSize: 260, fontWeight: 900,
          color: 'rgba(255,255,255,0.022)',
          fontFamily: 'system-ui, sans-serif',
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
          opacity: s2,
        }}>
          {number}
        </div>

        {/* Feature bullet list — clean, colorful, no numbers */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          gap: 16, marginBottom: 36, position: 'relative', zIndex: 2,
        }}>
          {metrics.map((m, i) => {
            const ms = mSprings[Math.min(i, 3)];
            const isHL = !!m.highlight;
            return (
              <div key={i} style={{
                opacity: ms,
                transform: `translateX(${(1 - ms) * 24}px)`,
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                {/* Dot indicator */}
                <div style={{
                  width: isHL ? 10 : 6,
                  height: isHL ? 10 : 6,
                  borderRadius: '50%',
                  backgroundColor: isHL ? categoryColor : 'rgba(255,255,255,0.18)',
                  boxShadow: isHL ? `0 0 12px ${categoryColor}` : 'none',
                  flexShrink: 0,
                }} />
                {/* Label */}
                <span style={{
                  fontSize: isHL ? 20 : 16,
                  fontWeight: isHL ? 600 : 300,
                  color: isHL ? '#ffffff' : '#737373',
                  fontFamily: 'system-ui, sans-serif',
                  lineHeight: 1.3,
                  letterSpacing: isHL ? -0.2 : 0,
                  textShadow: isHL ? `0 0 30px ${categoryColor}40` : 'none',
                }}>
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress strip */}
        <div style={{opacity: s5, position: 'relative', zIndex: 2}}>
          <div style={{
            height: 3, borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.07)', marginBottom: 10, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 2,
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${categoryColor}88, ${categoryColor})`,
              boxShadow: `0 0 10px ${categoryColor}70`,
            }} />
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', gap: 4}}>
              {Array.from({length: totalSections}).map((_, i) => (
                <div key={i} style={{
                  width: i === sectionIndex ? 16 : 4, height: 4, borderRadius: 2,
                  backgroundColor: i < sectionIndex
                    ? `${categoryColor}80`
                    : i === sectionIndex
                      ? categoryColor
                      : 'rgba(255,255,255,0.09)',
                  boxShadow: i === sectionIndex ? `0 0 6px ${categoryColor}` : 'none',
                }} />
              ))}
            </div>
            <span style={{
              fontSize: 11, color: '#4a4a4a',
              fontFamily: 'system-ui, sans-serif', letterSpacing: 1,
            }}>
              {sectionIndex + 1} / {totalSections} · {pct}%
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

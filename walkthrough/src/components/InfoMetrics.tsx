import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

interface Metric { label: string; value: string; highlight?: boolean; }

interface InfoMetricsProps {
  metrics: Metric[];
  categoryColor?: string;
  sectionTitle?: string;
  sectionDesc?: string;
}

export const InfoMetrics: React.FC<InfoMetricsProps> = ({
  metrics, categoryColor = '#0f62fe', sectionTitle = '', sectionDesc = '',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const opacity = interpolate(frame, [0, 22], [0, 1], {extrapolateRight: 'clamp'});
  const slideY  = interpolate(frame, [0, 22], [16, 0], {extrapolateRight: 'clamp'});

  const s0 = spring({frame: frame - 4,  fps, config: {damping: 22, stiffness: 80, mass: 0.5}});
  const s1 = spring({frame: frame - 12, fps, config: {damping: 22, stiffness: 80, mass: 0.5}});
  const s2 = spring({frame: frame - 20, fps, config: {damping: 22, stiffness: 80, mass: 0.5}});

  const pulse = Math.sin(frame * 0.09) * 0.3 + 0.7;
  const chips = metrics.slice(0, 3);

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        opacity, transform: `translateY(${slideY}px)`,
      }}>
        {/* Gradient */}
        <div style={{height: 100, background: 'linear-gradient(to bottom, transparent, rgba(4,4,4,0.98))'}} />

        {/* Bar */}
        <div style={{
          backgroundColor: 'rgba(4,4,4,0.99)',
          borderTop: `2px solid ${categoryColor}`,
          padding: '20px 40px 24px',
          display: 'flex', alignItems: 'center', gap: 0,
        }}>
          {/* Left: title + description */}
          <div style={{flex: 1, minWidth: 0}}>
            <div style={{opacity: s0, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6}}>
              <div style={{width: 7, height: 7, borderRadius: '50%', backgroundColor: categoryColor, boxShadow: `0 0 ${6 + pulse * 6}px ${categoryColor}`, flexShrink: 0}} />
              <span style={{fontSize: 16, fontWeight: 700, color: categoryColor, fontFamily: 'system-ui, sans-serif', letterSpacing: 1.5, textTransform: 'uppercase'}}>
                {sectionTitle}
              </span>
            </div>
            <div style={{opacity: s1, transform: `translateX(${(1 - s1) * -8}px)`, fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.68)', fontFamily: 'system-ui, sans-serif', lineHeight: 1.55, letterSpacing: 0.1, maxWidth: 760}}>
              {sectionDesc}
            </div>
          </div>

          {/* Divider */}
          <div style={{width: 1, height: 50, backgroundColor: 'rgba(255,255,255,0.08)', margin: '0 32px', flexShrink: 0}} />

          {/* Chips — horizontal row */}
          <div style={{opacity: s2, transform: `translateX(${(1 - s2) * 10}px)`, display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0}}>
            {chips.map((m, i) => {
              const isHL = !!m.highlight;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  backgroundColor: isHL ? `${categoryColor}18` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isHL ? categoryColor + '45' : 'rgba(255,255,255,0.09)'}`,
                  borderRadius: 5, padding: '8px 16px',
                }}>
                  <div style={{width: 5, height: 5, borderRadius: '50%', backgroundColor: isHL ? categoryColor : 'rgba(255,255,255,0.25)', boxShadow: isHL ? `0 0 6px ${categoryColor}` : 'none', flexShrink: 0}} />
                  <span style={{fontSize: 13, fontWeight: isHL ? 600 : 400, color: isHL ? '#ffffff' : 'rgba(255,255,255,0.50)', fontFamily: 'system-ui, sans-serif', whiteSpace: 'nowrap'}}>
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

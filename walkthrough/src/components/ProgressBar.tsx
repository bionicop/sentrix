import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

interface ProgressBarProps {
  current: number;
  total: number;
  sectionName: string;
  categoryColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({current, total, sectionName, categoryColor = '#0f62fe'}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  const pct = (current / total) * 100;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 48,
        backgroundColor: 'rgba(15,15,15,0.90)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center',
        padding: '0 28px', gap: 16,
        opacity, backdropFilter: 'blur(8px)',
      }}>
        <span style={{fontSize: 15, fontWeight: 700, color: '#ffffff', fontFamily: 'system-ui, sans-serif', letterSpacing: -0.5}}>
          Sentrix
        </span>
        <span style={{width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.15)'}} />
        <span style={{fontSize: 11, fontWeight: 600, color: categoryColor, fontFamily: 'system-ui, sans-serif', letterSpacing: 0.5, textTransform: 'uppercase'}}>
          {sectionName}
        </span>
        <div style={{flex: 1}} />
        <span style={{fontSize: 12, color: '#6f6f6f', fontFamily: 'system-ui, sans-serif'}}>
          <span style={{color: '#a8a8a8', fontWeight: 600}}>{current}</span> / {total}
        </span>
      </div>
      <div style={{position: 'absolute', top: 48, left: 0, right: 0, height: 3, backgroundColor: 'rgba(255,255,255,0.06)', opacity}} />
      <div style={{position: 'absolute', top: 48, left: 0, width: `${pct}%`, height: 3, backgroundColor: categoryColor, boxShadow: `0 0 8px ${categoryColor}80`, opacity}} />
    </AbsoluteFill>
  );
};

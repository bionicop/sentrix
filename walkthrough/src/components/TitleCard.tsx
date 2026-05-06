import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

interface TitleCardProps {
  number: string;
  title: string;
  description: string;
}

export const TitleCard: React.FC<TitleCardProps> = ({number, title, description}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10, 35, 45], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(frame, [0, 15], [50, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: '#1a1a1a', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity, transform: `translateY(${y}px)`, borderLeft: '8px solid #0f62fe'}}>
      <div style={{textAlign: 'center', color: 'white', paddingLeft: 60, paddingRight: 60}}>
        <div style={{fontSize: 36, fontWeight: 300, color: '#8d8d8d', marginBottom: 20, fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: 2}}>{number}</div>
        <h2 style={{fontSize: 72, fontWeight: 700, margin: 0, marginBottom: 20, fontFamily: 'system-ui, -apple-system, sans-serif'}}>{title}</h2>
        <p style={{fontSize: 24, fontWeight: 300, margin: 0, color: '#a8a8a8', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: 800}}>{description}</p>
      </div>
    </AbsoluteFill>
  );
};

/**
 * NavMap — Slim floating sidebar overlay (no hard crop).
 * Semi-transparent so app content bleeds through at the edges.
 */
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

const GROUPS = [
  {label: 'Operations',     color: '#0f62fe', sections: ['Login','Dashboard','Alerts','Alert Details','Tickets','Ticket Details','On-Call','Svc Status']},
  {label: 'Infrastructure', color: '#6929c4', sections: ['Devices','Device Details','Topology','Device Groups']},
  {label: 'Analytics',      color: '#009d9a', sections: ['Trends','Incidents','Post-Mortems','SLA','Reports']},
  {label: 'Configuration',  color: '#f1620a', sections: ['Config','Runbooks']},
  {label: 'Admin',          color: '#da1e28', sections: ['Audit Log','Settings','Profile']},
];

interface NavMapProps { currentSection: string; }

export const NavMap: React.FC<NavMapProps> = ({currentSection}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});

  const activeGroup = GROUPS.find(g => g.sections.includes(currentSection));
  const groupColor = activeGroup?.color ?? '#0f62fe';

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 200,
        background: 'linear-gradient(to right, transparent 0%, rgba(10,10,10,0.92) 18%)',
        borderLeft: '1px solid rgba(255,255,255,0.05)',
        padding: '20px 14px 20px 18px',
        opacity,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        backdropFilter: 'blur(8px)',
      }}>
        {/* Header */}
        <div style={{
          fontSize: 9, fontWeight: 700, color: '#444',
          letterSpacing: 2, textTransform: 'uppercase',
          fontFamily: 'system-ui, sans-serif', marginBottom: 2,
        }}>
          Navigation
        </div>

        {GROUPS.map((group) => (
          <div key={group.label}>
            {/* Group label with color dot */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              marginBottom: 4,
            }}>
              <div style={{
                width: 4, height: 4, borderRadius: '50%',
                backgroundColor: group.color, opacity: 0.7,
              }} />
              <span style={{
                fontSize: 8, fontWeight: 700, color: '#4a4a4a',
                letterSpacing: 1.5, textTransform: 'uppercase',
                fontFamily: 'system-ui, sans-serif',
              }}>
                {group.label}
              </span>
            </div>

            {group.sections.map((sec) => {
              const isActive = currentSection === sec;
              return (
                <div key={sec} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '3px 6px',
                  marginBottom: 1,
                  borderRadius: 2,
                  backgroundColor: isActive ? `${group.color}18` : 'transparent',
                  borderLeft: isActive ? `2px solid ${group.color}` : '2px solid transparent',
                }}>
                  <span style={{
                    fontSize: 11,
                    fontFamily: 'system-ui, sans-serif',
                    color: isActive ? '#ffffff' : '#4a4a4a',
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {sec}
                  </span>
                  {isActive && (
                    <div style={{
                      marginLeft: 'auto', width: 4, height: 4,
                      borderRadius: '50%', backgroundColor: group.color,
                      boxShadow: `0 0 4px ${group.color}`,
                      flexShrink: 0,
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

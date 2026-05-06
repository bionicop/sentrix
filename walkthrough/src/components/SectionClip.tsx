import React from 'react';
import {OffthreadVideo, staticFile, AbsoluteFill} from 'remotion';
import {ProgressBar} from './ProgressBar';
import {InfoMetrics} from './InfoMetrics';

interface Metric {label: string; value: string; highlight?: boolean}

interface SectionClipProps {
  clipPath: string;
  sectionName: string;
  sectionDesc: string;
  shortTitle: string;
  sectionNumber: number;
  totalSections: number;
  metrics: Metric[];
  categoryColor: string;
}

export const SectionClip: React.FC<SectionClipProps> = ({
  clipPath, sectionName, sectionDesc, shortTitle, sectionNumber, totalSections, metrics, categoryColor,
}) => {
  return (
    <AbsoluteFill>
      {/* Full-frame video — nothing cropped */}
      <OffthreadVideo
        src={staticFile(clipPath)}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />

      {/* Top progress bar */}
      <ProgressBar current={sectionNumber} total={totalSections} sectionName={sectionName} categoryColor={categoryColor} />

      {/* Bottom lower-third */}
      <InfoMetrics
        metrics={metrics}
        categoryColor={categoryColor}
        sectionTitle={sectionName}
        sectionDesc={sectionDesc}
      />
    </AbsoluteFill>
  );
};

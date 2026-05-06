import React from 'react';
import {TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {linearTiming} from '@remotion/transitions';
import {IntroCard} from './components/IntroCard';
import {SectionIntroCard} from './components/SectionIntroCard';
import {SectionClip} from './components/SectionClip';
import {OutroCard} from './components/OutroCard';
import {SECTIONS} from './data/sections';

// Slow, cinematic fade — 20 frames (~667ms at 30fps)
const FADE = linearTiming({durationInFrames: 20});
const TOTAL = SECTIONS.length;

// Section intro card duration: 5 seconds = 150 frames
const INTRO_FRAMES = 150;

export const Walkthrough: React.FC = () => {
  return (
    <TransitionSeries>
      {/* ─── INTRO ─── */}
      <TransitionSeries.Sequence durationInFrames={240}>
        <IntroCard />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={FADE} />

      {/* ─── SECTIONS — SectionIntroCard → clip → SectionIntroCard → clip … ─── */}
      {SECTIONS.map((sec, idx) => (
        <React.Fragment key={sec.num}>
          {/* Rich 5-second section introduction — single card, no duplication */}
          <TransitionSeries.Sequence durationInFrames={INTRO_FRAMES}>
            <SectionIntroCard
              number={sec.num}
              title={sec.title}
              description={sec.desc}
              category={sec.category}
              categoryColor={sec.categoryColor}
              metrics={sec.metrics}
              sectionIndex={idx}
              totalSections={TOTAL}
            />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={fade()} timing={FADE} />

          {/* Feature video clip with NavMap / ProgressBar / InfoMetrics overlays */}
          <TransitionSeries.Sequence durationInFrames={sec.clipFrames}>
            <SectionClip
              clipPath={sec.clip}
              sectionName={sec.title}
              sectionDesc={sec.desc}
              shortTitle={sec.shortTitle}
              sectionNumber={idx + 1}
              totalSections={TOTAL}
              metrics={sec.metrics}
              categoryColor={sec.categoryColor}
            />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={fade()} timing={FADE} />
        </React.Fragment>
      ))}

      {/* ─── OUTRO ─── */}
      <TransitionSeries.Sequence durationInFrames={270}>
        <OutroCard />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

import React from 'react';
import {Composition} from 'remotion';
import {Walkthrough} from './Walkthrough';

export const Root: React.FC = () => (
  <Composition
    id="Walkthrough"
    component={Walkthrough}
    durationInFrames={7500}
    fps={30}
    width={1920}
    height={1080}
  />
);

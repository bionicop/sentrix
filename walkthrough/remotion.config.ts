// Remotion 4.0 — video properties are set on <Composition> in Root.tsx
// Only webpack overrides go here
import {Config} from '@remotion/cli/config';

Config.setConcurrency(4);
Config.setVideoImageFormat('jpeg');

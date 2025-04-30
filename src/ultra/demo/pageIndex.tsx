import React from 'react';
import { Camera } from './camera';
import { Colors } from './colors';
import { GhostColor } from './ghostColor';
import { Home } from './home';
import { NodeEffects } from './nodeEffects';
import { Resize } from './resize';
import { SectionBox } from './sectionBox';
import { type Page } from '../../page';

export const gitRoot = 'https://github.com/vimaec/vim-web-demo/src/ultra/demo';

export const pages: Page[] = [
  {
    name: 'Home',
    github: `${gitRoot}/home.tsx`,
    content: () => <Home />,
  },

  {
    name: 'Camera',
    github: `${gitRoot}/camera.tsx`,
    content: () => <Camera />,
  },
  {
    name: 'Colors',
    github: `${gitRoot}/colors.tsx`,
    content: () => <Colors />,
  },
  {
    name: 'Ghost Color',
    github: `${gitRoot}/ghostColor.tsx`,
    content: () => <GhostColor />,
  },
  {
    name: 'Node Effects',
    github: `${gitRoot}/nodeEffects.tsx`,
    content: () => <NodeEffects />,
  },
  {
    name: 'Resize',
    github: `${gitRoot}/resize.tsx`,
    content: () => <Resize />,
  },
  {
    name: 'Section Box',
    github: `${gitRoot}/sectionBox.tsx`,
    content: () => <SectionBox />,
  },
];

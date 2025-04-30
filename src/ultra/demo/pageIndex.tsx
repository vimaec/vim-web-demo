import React from 'react';
import { Camera } from './camera';
import { Colors } from './colors';
import { GhostColor } from './ghostColor';
import { Home } from './home';
import { NodeEffects } from './nodeEffects';
import { Resize } from './resize';
import { SectionBox } from './sectionBox';
import { type Page } from '../../page';
import { gitRoot } from '../../urls';

export const root =  gitRoot + '/ultra/demo'; 

export const pages: Page[] = [
  {
    name: 'Home',
    github: `${root}/home.tsx`,
    content: () => <Home />,
  },

  {
    name: 'Camera',
    github: `${root}/camera.tsx`,
    content: () => <Camera />,
  },
  {
    name: 'Colors',
    github: `${root}/colors.tsx`,
    content: () => <Colors />,
  },
  {
    name: 'Ghost Color',
    github: `${root}/ghostColor.tsx`,
    content: () => <GhostColor />,
  },
  {
    name: 'Node Effects',
    github: `${root}/nodeEffects.tsx`,
    content: () => <NodeEffects />,
  },
  {
    name: 'Resize',
    github: `${root}/resize.tsx`,
    content: () => <Resize />,
  },
  {
    name: 'Section Box',
    github: `${root}/sectionBox.tsx`,
    content: () => <SectionBox />,
  },
];

import React from 'react';

import { Home } from './home';
import { LocalFile } from './localFile';
import { Iframe } from './iframe';
import { Markers } from './markers';
import { Screenshot } from './screenshot';

import {type Page} from "../../page"
import { Camera } from './camera';
import { Coloring } from './coloring';
import { Outlines } from './outlines';
import { Isolation } from './isolation';
import { SectionBox } from './sectionBox';
import { AccessingBim } from './accessingBim';
import { CustomInputs } from './customInputs';
import { CustomContextMenu} from './customContextMenu';
import { CustomControlBar } from './customControlBar';
import { CustomGenericPanel } from './customGenericPanels';
import { CustomBimPanel } from './customBimPanel';
import { gitRoot } from '../../urls';

export const root =  gitRoot + '/webgl/demo';

export const home =   {
  name: 'Home',
  github: `${root}/home.tsx`,
  content: () => <Home />
}

export const pages: Page[] = [
  home,
  {
    name: 'Local File',
    github: `${root}/localFile.tsx`,
    content: () => <LocalFile />,
  },
  {
    name: 'Camera',
    github: `${root}/camera.tsx`,
    content: () => <Camera />,
  },
  {
    name: 'Coloring',
    github: `${root}/coloring.tsx`,
    content: () => <Coloring />,
  },
  {
    name: 'Outlines',
    github: `${root}/outlines.tsx`,
    content: () => <Outlines />,
  },
  {
    name: 'Isolation',
    github: `${root}/isolation.tsx`,
    content: () => <Isolation />,
  },
  {
    name: 'Section Box',
    github: `${root}/sectionBox.tsx`,
    content: () => <SectionBox />,
  },
  {
    name: 'Iframe',
    github: `${root}/iframe.tsx`,
    content: () => <Iframe />,
  },
  {
    name: 'Markers',
    github: `${root}/markers.tsx`,
    content: () => <Markers />,
  },
  {
    name: 'Screenshot',
    github: `${root}/screenshot.tsx`,
    content: () => <Screenshot />,
  },
  {
    name: 'Accessing BIM',
    github: `${root}/accessingBim.tsx`,
    content: () => <AccessingBim />,
  },
  {
    name: 'Custom Inputs',
    github: `${root}/customInputs.tsx`,
    content: () => <CustomInputs />,
  },
  {
    name: 'Custom Context Menu',
    github: `${root}/customContextMenu.tsx`,
    content: () => <CustomContextMenu />,
  },
  {
    name: 'Custom Control Bar',
    github: `${root}/customControlBar.tsx`,
    content: () => <CustomControlBar />,
  },
  {
    name: 'Custom Generic Panels',
    github: `${root}/customGenericPanels.tsx`,
    content: () => <CustomGenericPanel />,
  },
  {
    name: 'Custom Bim Panels',
    github: `${root}/customBimPanel.tsx`,
    content: () => <CustomBimPanel />,
  }
];

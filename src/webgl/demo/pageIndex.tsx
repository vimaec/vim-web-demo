import React from 'react';

import { WebglHome } from './home';
import { WebglLocalFile } from './localFile';
import { WebglIframe } from './iframe';
import { WebglMarkers } from './markers';

import {type Page} from "../../page"
import { Camera } from './camera';
import { Coloring } from './coloring';
import { Outlines } from './outlines';
import { Isolation } from './isolation';
import { SectionBox } from './sectionBox';
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
  content: () => <WebglHome />
}

export const pages: Page[] = [
  home,
  {
    name: 'Local File',
    github: `${root}/localFile.tsx`,
    content: () => <WebglLocalFile />,
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
  /*
  {
    name: 'Plan View',
    github: `${root}/planView.tsx`,
    content: <PlanView />,
  },
  */
  {
    name: 'Iframe',
    github: `${root}/iframe.tsx`,
    content: () => <WebglIframe />,
  },
  {
    name: 'Markers',
    github: `${root}/markers.tsx`,
    content: () => <WebglMarkers />,
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


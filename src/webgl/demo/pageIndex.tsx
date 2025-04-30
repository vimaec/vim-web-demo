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

export const gitRoot = 'https://github.com/vimaec/vim-web-demo/src/pages/webgl/demo';

export const home =   {
  name: 'Home',
  github: `${gitRoot}/00_home.tsx`,
  content: () => <WebglHome />
}

export const pages: Page[] = [
  home,
  {
    name: 'Local File',
    github: `${gitRoot}/localFile.tsx`,
    content: () => <WebglLocalFile />,
  },
  {
    name: 'Camera',
    github: `${gitRoot}/camera.tsx`,
    content: () => <Camera />,
  },
  {
    name: 'Coloring',
    github: `${gitRoot}/coloring.tsx`,
    content: () => <Coloring />,
  },
  {
    name: 'Outlines',
    github: `${gitRoot}/outlines.tsx`,
    content: () => <Outlines />,
  },
  {
    name: 'Isolation',
    github: `${gitRoot}/isolation.tsx`,
    content: () => <Isolation />,
  },
  {
    name: 'Section Box',
    github: `${gitRoot}/sectionBox.tsx`,
    content: () => <SectionBox />,
  },
  /*
  {
    name: 'Plan View',
    github: `${gitRoot}/planView.tsx`,
    content: <PlanView />,
  },
  */
  {
    name: 'Iframe',
    github: `${gitRoot}/iframe.tsx`,
    content: () => <WebglIframe />,
  },
  {
    name: 'Markers',
    github: `${gitRoot}/markers.tsx`,
    content: () => <WebglMarkers />,
  },
  
  {
    name: 'Custom Inputs',
    github: `${gitRoot}/customInputs.tsx`,
    content: () => <CustomInputs />,
  },
  {
    name: 'Custom Context Menu',
    github: `${gitRoot}/customContextMenu.tsx`,
    content: () => <CustomContextMenu />,
  },
  {
    name: 'Custom Control Bar',
    github: `${gitRoot}/customControlBar.tsx`,
    content: () => <CustomControlBar />,
  },
  {
    name: 'Custom Generic Panels',
    github: `${gitRoot}/genericPanels.tsx`,
    content: () => <CustomGenericPanel />,
  },
  {
    name: 'Custom Bim Panels',
    github: `${gitRoot}/genericPanels.tsx`,
    content: () => <CustomBimPanel />,
  }
];


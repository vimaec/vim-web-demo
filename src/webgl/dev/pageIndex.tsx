import React from 'react';
import { WebglAccessToken } from './accessToken';
import { WebglInvalidFile } from './invalidFile';
import { WebglZippedFile } from './zippedFile';
import { WebglUnload } from './unload';
import {type Page} from "../../page"
import { gitRoot } from '../../urls';

export const root =  gitRoot + '/webgl/dev'; 

export const pages: Page[] = [
  {
    name: 'Access Token',
    github: `${root}/01_accessToken.tsx`,
    content: () => <WebglAccessToken />,
  },
  {
    name: 'Zipped File',
    github: `${root}/03_zippedFile.tsx`,
    content: () => <WebglZippedFile />,
  },
  {
    name: 'Invalid File',
    github: `${root}/02_invalidFile.tsx`,
    content: () => <WebglInvalidFile />,
  },
  {
    name: 'Unload',
    github: `${root}/06_unload.tsx`,
    content: () => <WebglUnload />,
  },
]

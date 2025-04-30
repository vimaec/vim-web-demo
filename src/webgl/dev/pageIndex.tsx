import React from 'react';
import { WebglAccessToken } from './accessToken';
import { WebglInvalidFile } from './invalidFile';
import { WebglZippedFile } from './zippedFile';
import { WebglUnload } from './unload';
import {type Page} from "../../page"

export const gitRoot = 'https://github.com/vimaec/vim-web-demo/src/pages/webgl/dev';

export const pages: Page[] = [
  {
    name: 'Access Token',
    github: `${gitRoot}/01_accessToken.tsx`,
    content: () => <WebglAccessToken />,
  },
  {
    name: 'Zipped File',
    github: `${gitRoot}/03_zippedFile.tsx`,
    content: () => <WebglZippedFile />,
  },
  {
    name: 'Invalid File',
    github: `${gitRoot}/02_invalidFile.tsx`,
    content: () => <WebglInvalidFile />,
  },
  {
    name: 'Unload',
    github: `${gitRoot}/06_unload.tsx`,
    content: () => <WebglUnload />,
  },
]

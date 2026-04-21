import React from 'react';
import { AccessToken } from './accessToken';
import { InvalidFile } from './invalidFile';
import { ZippedFile } from './zippedFile';
import { Unload } from './unload';
import {type Page} from "../../page"
import { gitRoot } from '../../urls';

export const root =  gitRoot + '/webgl/dev';

export const pages: Page[] = [
  {
    name: 'Access Token',
    github: `${root}/01_accessToken.tsx`,
    content: () => <AccessToken />,
  },
  {
    name: 'Zipped File',
    github: `${root}/03_zippedFile.tsx`,
    content: () => <ZippedFile />,
  },
  {
    name: 'Invalid File',
    github: `${root}/02_invalidFile.tsx`,
    content: () => <InvalidFile />,
  },
  {
    name: 'Unload',
    github: `${root}/06_unload.tsx`,
    content: () => <Unload />,
  },
]

import React from 'react';
import { AbortError } from './abortError';
import { ConnectionError } from './connectionError';
import { DownloadError } from './downloadError';
import { LoadError } from './loadError';
import { OpenError } from './openError';
import { type Page } from '../../page';
import { AccessToken } from './accessToken';
import { gitRoot } from '../../urls';

export const root =  gitRoot + '/ultra/dev'; 

export const pages: Page[] = [
  {
    name: 'Access Token',
    github: `${root}/accessToken.tsx`,
    content: () => <AccessToken />,
  },
  {
    name: 'Abort Error',
    github: `${root}/abortError.tsx`,
    content: () => <AbortError />,
  },
  {
    name: 'Connection Error',
    github: `${root}/connectionError.tsx`,
    content: () => <ConnectionError />,
  },
  {
    name: 'Download Error',
    github: `${root}/downloadError.tsx`,
    content: () => <DownloadError />,
  },
  {
    name: 'Load Error',
    github: `${root}/loadError.tsx`,
    content: () => <LoadError />,
  },
  {
    name: 'Open Error',
    github: `${root}/openError.tsx`,
    content: () => <OpenError />,
  },
];

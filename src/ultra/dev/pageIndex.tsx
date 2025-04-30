import React from 'react';
import { AbortError } from './abortError';
import { ConnectionError } from './connectionError';
import { DownloadError } from './downloadError';
import { LoadError } from './loadError';
import { OpenError } from './openError';
import { type Page } from '../../page';

export const gitRoot = 'https://github.com/vimaec/vim-web-demo/src/pages/webgl/dev';

export const pages: Page[] = [
  {
    name: 'Abort Error',
    github: `${gitRoot}/abortError.tsx`,
    content: () => <AbortError />,
  },
  {
    name: 'Connection Error',
    github: `${gitRoot}/connectionError.tsx`,
    content: () => <ConnectionError />,
  },
  {
    name: 'Download Error',
    github: `${gitRoot}/downloadError.tsx`,
    content: () => <DownloadError />,
  },
  {
    name: 'Load Error',
    github: `${gitRoot}/loadError.tsx`,
    content: () => <LoadError />,
  },
  {
    name: 'Open Error',
    github: `${gitRoot}/openError.tsx`,
    content: () => <OpenError />,
  },
];

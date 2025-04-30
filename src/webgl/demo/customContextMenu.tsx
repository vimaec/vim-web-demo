import React from 'react';
import { WebglViewerWithResidence } from '../webglUtils'

export function CustomContextMenu () {
  return WebglViewerWithResidence((viewer, vim) =>{
    viewer.contextMenu.customize((menu) =>[
      ...menu, 
      {
        id : 'custom',
        label:'Custom',
        action: () => {vim.getAllElements().forEach((e) => e.outline= true)},
        enabled: true, keyboard: undefined
      }
    ])
  })
}

import React from 'react';
import { WebglViewerWithResidence } from '../webglUtils'
import * as VIM from 'vim-web'

export function CustomControlBar () {
  return WebglViewerWithResidence((viewer, vim) =>{
    viewer.controlBar.customize((bar) => [{
      id:'custom',
      buttons:[{
        id:'custom_button',
        tip:'Custom Button',
        action:() => viewer.core.camera.lerp(1).orbitTowards(new VIM.THREE.Vector3(0, 0, -1)),
        icon:VIM.React.Icons.checkmark
      }]
    }])
  })
}

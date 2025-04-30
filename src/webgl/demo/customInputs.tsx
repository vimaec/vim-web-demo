import { WebglViewerWithResidence } from '../webglUtils'
import * as VIM from 'vim-web'

export function CustomInputs () {
  return WebglViewerWithResidence(async (viewer, vim) =>{

    // Color selected elements red
    viewer.core.selection.onSelectionChanged.subscribe(() => {
      colorSelection(viewer.core, new VIM.THREE.Color(0xff0000))
    })

    // Change color to green on key R press
    viewer.core.inputs.keyboard.registerKeyDown('KeyR','replace', () => {
      colorSelection(viewer.core, new VIM.THREE.Color(0x00ff00))
    })
  })
}

function colorSelection(viewer: VIM.Core.Webgl.Viewer, color: VIM.THREE.Color) {
  viewer.selection.getAll().forEach((e) => {
    e.color = color
  })
}
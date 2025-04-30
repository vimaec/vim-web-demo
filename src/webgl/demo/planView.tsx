import { WebglViewerWithResidence } from '../webglUtils'
import * as VIM from 'vim-web'

export function PlanView () {
  // Selection doesn't work great in orthographic mode right now
  return WebglViewerWithResidence(async (viewer, vim) =>{
    viewer.core.camera.snap().orbitTowards(new VIM.THREE.Vector3(0, 0, -1))
    viewer.core.camera.allowedRotation = new VIM.THREE.Vector2(0, 0)
    viewer.core.camera.orthographic = true
    viewer.core.inputs.pointerActive = VIM.Core.PointerMode.PAN
  })
}
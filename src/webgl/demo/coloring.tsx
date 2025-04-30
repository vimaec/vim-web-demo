import { WebglViewerWithResidence } from '../webglUtils'
import * as VIM from 'vim-web'

export function Coloring () {
  return WebglViewerWithResidence(async (viewer, vim) =>{
    // interpolation colors
    const startColor = new VIM.THREE.Color(0xFF0000)
    const endColor = new VIM.THREE.Color(0x00FF00)

    // Get interpolation range
    const box = await vim.getBoundingBox()
    const height = box.max.y - box.min.y

    const color = new VIM.THREE.Color()
    vim.getAllElements().forEach(async (e,i) => {
      if(!e.hasMesh) return

      // Compute relative z position in the box
      const center = await e.getCenter()
      const value = (center.z - box.min.z) / height

      // Assign interpolated color
      e.color = color.lerpColors(startColor, endColor, value)
    })
  })
}
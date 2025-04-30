import { WebglViewerWithResidence } from '../webglUtils'

export function Isolation () {
  return WebglViewerWithResidence(async (viewer, vim) =>{
    const element = vim.getElementFromIndex(301)

    vim.getAllElements().forEach((e,i) => {
      e.visible = e === element
    })

    // Set the material so hidden elements are rendered in ghost
    vim.scene.material = [viewer.core.materials.simple, viewer.core.materials.ghost] 
  })
}
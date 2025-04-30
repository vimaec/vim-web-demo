import { WebglViewerWithResidence } from '../webglUtils'

export function SectionBox () {
  return WebglViewerWithResidence(async (viewer, vim) =>{
    
    const element = vim.getElementFromIndex(301)
    if(!element) return

    viewer.core.selection.select(element)

    const box = await element.getBoundingBox()
    if (!box) return

    // Enable the section box and make it fit the element
    viewer.sectionBox.enable.set(true)
    viewer.sectionBox.sectionBox.call(box)

  })
}
import { WebglViewerWithResidence } from '../webglUtils'
import * as VIM from 'vim-web'

export function Outlines () {
  return WebglViewerWithResidence(async (viewer, vim) =>{
    
    // Selecting an element will automatically show its outline
    const element = vim.getElementFromIndex(301)
    viewer.core.selection.select(element)
    await new Promise(resolve => setTimeout(resolve, 3000))

    // You can also set element outlines directly
    // This can conflict with the selection outline, so be careful
    vim.getAllElements().forEach((e,i) => {
      e.outline = true
    })
  })
}
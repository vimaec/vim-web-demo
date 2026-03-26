import React, { useEffect, useRef } from 'react'
import { useWebglResidence } from '../webglUtils'
import * as VIM from 'vim-web'

export function Isolation () {
  const div = useRef<HTMLDivElement>(null)
  const [viewer, vim] = useWebglResidence(div)

  useEffect(() => {
    if (!viewer || !vim) return
    const element = vim.getElementFromIndex(301)

    vim.getAllElements().forEach((e) => {
      e.visible = e === element
    })

    // Set the material so hidden elements are rendered in ghost
    vim.scene.material = new VIM.Core.Webgl.MaterialSet(viewer.core.materials.modelOpaqueMaterial, undefined, viewer.core.materials.ghostMaterial)

    // Frame the isolated element so the effect is clearly visible
    if (element) {
      viewer.core.selection.select(element)
      viewer.core.camera.lerp(1).frame(element)
    }
  }, [vim])

  return <div ref={div} className='vc-inset-0 vc-absolute'/>
}

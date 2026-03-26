import React, { useEffect, useRef } from 'react'
import { useWebglResidence } from '../webglUtils'

export function SectionBox () {
  const div = useRef<HTMLDivElement>(null)
  const [viewer, vim] = useWebglResidence(div)

  useEffect(() => {
    if (!viewer || !vim) return
    ;(async () => {
      const element = vim.getElementFromIndex(301)
      if(!element) return

      viewer.core.selection.select(element)

      const box = await element.getBoundingBox()
      if (!box) return

      // Enable the section box and make it fit the element
      viewer.sectionBox.active.set(true)
      viewer.sectionBox.sectionBox.call(box)

      // Frame the section box area so the clipping is clearly visible
      viewer.core.camera.lerp(1).frame(element)
    })()
  }, [vim])

  return <div ref={div} className='vc-inset-0 vc-absolute'/>
}

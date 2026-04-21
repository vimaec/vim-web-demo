import React, { useEffect, useRef } from 'react'
import { useWebglResidence } from '../webglUtils'
import * as VIM from 'vim-web'

export function Coloring () {
  const div = useRef<HTMLDivElement>(null)
  const [viewer, vim] = useWebglResidence(div)

  useEffect(() => {
    if (!vim) return

    // interpolation colors
    const startColor = new VIM.THREE.Color(0xFF0000)
    const endColor = new VIM.THREE.Color(0x00FF00)

    // Get interpolation range
    const box = vim.scene.getBoundingBox()
    if (!box) return
    const height = box.max.y - box.min.y

    const color = new VIM.THREE.Color()
    vim.getAllElements().forEach(async (e) => {
      if(!e.hasMesh) return

      // Compute relative z position in the box
      const center = await e.getCenter()
      if (!center) return
      const value = (center.z - box.min.z) / height

      // Assign interpolated color
      e.color = color.lerpColors(startColor, endColor, value)
    })
  }, [vim])

  return <div ref={div} className='vc-inset-0 vc-absolute'/>
}

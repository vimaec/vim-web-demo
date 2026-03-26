import React, { useEffect, useRef } from 'react'
import { useWebglResidence } from '../webglUtils'

export function Outlines () {
  const div = useRef<HTMLDivElement>(null)
  const [viewer, vim] = useWebglResidence(div)

  useEffect(() => {
    if (!viewer || !vim) return

    // Outline all elements immediately for a clear visual effect
    vim.getAllElements().forEach((e) => {
      e.outline = true
    })

  }, [vim])

  return <div ref={div} className='vc-inset-0 vc-absolute'/>
}

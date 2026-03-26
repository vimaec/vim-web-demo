import React, { useEffect, useRef } from 'react'
import { useWebglResidence } from '../webglUtils'
import * as VIM from 'vim-web'

export function Camera () {
  const div = useRef<HTMLDivElement>(null)
  const [viewer, vim] = useWebglResidence(div)

  useEffect(() => {
    if (!viewer || !vim) return
    ;(async () => {
      await delay(1000)
      const first = vim.getElementFromIndex(301)
      if (!first) return
      viewer.core.selection.select(first)

      viewer.core.camera.lerp(1).frame(first)
      await delay(1000)

      viewer.core.camera.lerp(1).frame('all')
      await delay(1000)

      viewer.core.camera.lerp(1).orbitTowards(new VIM.THREE.Vector3(0, 0, -1))
      await delay(1000)

      viewer.core.camera.lerp(1).zoom(1.5)
      await delay(1000)

      viewer.core.camera.snap().frame('all', viewer.core.camera.defaultForward)
    })()
  }, [vim])

  return <div ref={div} className='vc-inset-0 vc-absolute'/>
}

function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time))
}

import React, { useEffect, useRef } from 'react'
import { useWebglResidence } from '../webglUtils'
import * as VIM from 'vim-web'

export function PlanView () {
  const div = useRef<HTMLDivElement>(null)
  const [viewer] = useWebglResidence(div)

  // Selection doesn't work great in orthographic mode right now
  useEffect(() => {
    if (!viewer) return
    viewer.core.camera.snap().orbitTowards(new VIM.THREE.Vector3(0, 0, -1))
    viewer.core.camera.allowedRotation = new VIM.THREE.Vector2(0, 0)
    viewer.core.camera.orthographic = true
    viewer.core.inputs.pointerActive = VIM.Core.PointerMode.PAN
  }, [viewer])

  return <div ref={div} className='vc-inset-0 vc-absolute'/>
}

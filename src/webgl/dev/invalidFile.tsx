import React, { useEffect, useRef } from 'react'
import { useWebglViewer } from '../webglUtils'
import * as Urls from '../../urls'

export function InvalidFile () {
  const div = useRef<HTMLDivElement>(null)
  const viewer = useWebglViewer(div)

  useEffect(() => {
    if (!viewer) return
    viewer.load({ url: Urls.notAVim })
  }, [viewer])

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}

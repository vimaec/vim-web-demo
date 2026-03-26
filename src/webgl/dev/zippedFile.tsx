import React, { useEffect, useRef } from 'react'
import { useWebglViewer } from '../webglUtils'
import * as Urls from '../../urls'

export function ZippedFile () {
  const div = useRef<HTMLDivElement>(null)
  const viewer = useWebglViewer(div)

  useEffect(() => {
    if (!viewer) return
    viewer.load({ url: Urls.residenceZipped })
  }, [viewer])

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}

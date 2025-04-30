import React, { useRef } from 'react'
import { useWebglViewerWithModel } from '../webglUtils'
import * as Urls from '../../urls'

export function WebglZippedFile () {
  const div = useRef<HTMLDivElement>(null)

  useWebglViewerWithModel(div, Urls.residenceZipped)

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}
